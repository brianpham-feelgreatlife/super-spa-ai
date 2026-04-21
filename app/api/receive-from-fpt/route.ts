import { NextRequest, NextResponse } from "next/server";
import { analyzeLeadWithDeepSeek, type LeadData } from "@/lib/deepseek";
import { appendLeadToSheet, type LeadRow } from "@/lib/sheets";
import { sendHotLeadAlert } from "@/lib/telegram";

// FPT.AI JSON API Card payload schema
interface FPTPayload {
  source: string;
  session_id: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  service: string;
  appointment_date?: string;
  appointment_time?: string;
  conversation_summary?: string;
  timestamp?: string;
}

export async function POST(req: NextRequest) {
  try {
    // Security check — optional webhook secret
    const secret = req.headers.get("x-webhook-secret");
    if (
      process.env.FPT_AI_WEBHOOK_SECRET &&
      secret !== process.env.FPT_AI_WEBHOOK_SECRET
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: FPTPayload = await req.json();

    // Validate required fields
    if (!body.customer?.name || !body.customer?.phone) {
      return NextResponse.json(
        { error: "Missing required fields: customer.name, customer.phone" },
        { status: 400 }
      );
    }

    console.log(`[Webhook] Received lead from FPT.AI: ${body.customer.name} - ${body.customer.phone}`);

    // Step 1: Build lead data for AI analysis
    const leadData: LeadData = {
      name: body.customer.name,
      phone: body.customer.phone,
      email: body.customer.email,
      service: body.service || "Chưa xác định",
      appointment_date: body.appointment_date,
      appointment_time: body.appointment_time,
      conversation_summary: body.conversation_summary,
      source: body.source,
    };

    // Step 2: Run DeepSeek AI analysis
    let aiResult;
    try {
      aiResult = await analyzeLeadWithDeepSeek(leadData);
      console.log(`[AI] Analysis complete: ${aiResult.hot_level} (${aiResult.score}/100)`);
    } catch (aiError) {
      console.error("[AI] DeepSeek analysis failed:", aiError);
      // Fallback result
      aiResult = {
        hot_level: "warm" as const,
        score: 50,
        reasons: ["Không thể phân tích tự động — vui lòng kiểm tra thủ công"],
        suggested_next_action: "Liên hệ trực tiếp để đánh giá",
        appointment_recommendation: "Chưa xác định",
        summary_vi: `Khách hàng ${body.customer.name} quan tâm đến ${body.service}`,
        follow_up_hours: 24,
      };
    }

    // Step 3: Write to Google Sheets
    const leadRow: LeadRow = {
      session_id: body.session_id || `manual-${Date.now()}`,
      name: body.customer.name,
      phone: body.customer.phone,
      email: body.customer.email,
      service: body.service || "Chưa xác định",
      appointment_date: body.appointment_date,
      appointment_time: body.appointment_time,
      hot_level: aiResult.hot_level,
      score: aiResult.score,
      ai_reasons: aiResult.reasons,
      next_action: aiResult.suggested_next_action,
      summary: aiResult.summary_vi,
      status: "new",
      source: body.source || "fpt_ai_chat",
      follow_up_hours: aiResult.follow_up_hours,
    };

    try {
      await appendLeadToSheet(leadRow);
      console.log("[Sheets] Lead saved to Google Sheets");
    } catch (sheetsError) {
      console.error("[Sheets] Failed to save:", sheetsError);
      // Continue even if sheets fails
    }

    // Step 4: Send Telegram notification for hot leads
    if (aiResult.hot_level === "hot" || aiResult.score >= 70) {
      try {
        await sendHotLeadAlert({
          name: body.customer.name,
          phone: body.customer.phone,
          service: body.service || "Chưa xác định",
          appointment_date: body.appointment_date,
          appointment_time: body.appointment_time,
          hot_level: aiResult.hot_level,
          score: aiResult.score,
          ai_summary: aiResult.summary_vi,
          next_action: aiResult.suggested_next_action,
        });
        console.log("[Telegram] Hot lead alert sent");
      } catch (tgError) {
        console.error("[Telegram] Failed to send alert:", tgError);
      }
    }

    // Step 5: Return response to FPT.AI
    const responseMessage =
      aiResult.hot_level === "hot"
        ? `Cảm ơn ${body.customer.name}! Chúng tôi đã ghi nhận thông tin và sẽ liên hệ với bạn sớm nhất. ${body.appointment_date ? `Lịch hẹn ngày ${body.appointment_date} đã được xác nhận.` : "Nhân viên sẽ tư vấn lịch phù hợp cho bạn."}`
        : `Cảm ơn bạn đã quan tâm! Chúng tôi đã nhận thông tin và sẽ liên hệ trong ${aiResult.follow_up_hours} giờ tới để tư vấn chi tiết hơn.`;

    return NextResponse.json({
      success: true,
      message: responseMessage,
      lead_score: aiResult.score,
      hot_level: aiResult.hot_level,
      next_action: aiResult.suggested_next_action,
    });
  } catch (error) {
    console.error("[Webhook] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: "online",
    endpoint: "/api/receive-from-fpt",
    description: "FPT.AI Webhook Receiver for Super SPA AI",
    timestamp: new Date().toISOString(),
  });
}
