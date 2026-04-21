import { NextRequest, NextResponse } from "next/server";
import { analyzeLeadWithDeepSeek } from "@/lib/deepseek";
import { appendLeadToSheet } from "@/lib/sheets";
import { sendHotLeadAlert } from "@/lib/telegram";
import { saveLeadToSupabase } from "@/lib/supabase";

const WEBHOOK_SECRET = "antigravity_spa_secret_2024";

export async function POST(req: NextRequest) {
  try {
    // 1. Kiểm tra Secret Key từ Header
    const secret = req.headers.get("x-webhook-secret");
    if (secret !== WEBHOOK_SECRET) {
      console.warn("[Security] Unauthorized webhook access attempt");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Nhận dữ liệu từ FPT.AI
    const body = await req.json();
    console.log("[Webhook] Received data from FPT.AI:", body);

    // Chuẩn hóa dữ liệu đầu vào (hỗ trợ các biến từ FPT.AI)
    const customerName = body.customer_name || body.name || "Khách hàng";
    const customerPhone = body.customer_phone || body.phone || "";
    const sessionId = body.session_id || "no_session";
    const serviceRequested = body.service || body.service_name || "Chưa xác định";

    if (!customerPhone) {
      console.error("[Webhook] Error: Missing customer phone");
      return NextResponse.json({ error: "Missing phone number" }, { status: 400 });
    }

    // 3. Sử dụng AI DeepSeek để phân tích chuyên sâu
    let aiResult;
    try {
      aiResult = await analyzeLeadWithDeepSeek({
        name: customerName,
        phone: customerPhone,
        service: serviceRequested,
        conversation_summary: body.conversation_summary || "Khách hàng để lại thông tin qua Chatbot",
        source: "FPT.AI Webchat"
      });
    } catch (aiError) {
      console.error("[AI] DeepSeek Error:", aiError);
      // Fallback nếu AI lỗi
      aiResult = {
        hot_level: "warm" as const,
        score: 50,
        summary_vi: "Đang chờ AI phân tích chi tiết...",
        suggested_next_action: "Gọi điện tư vấn trực tiếp",
        reasons: ["AI tạm thời không phản hồi"],
        follow_up_hours: 2,
        appointment_recommendation: "Cần gọi lại xác nhận"
      };
    }

    // 4. Lưu Lead vào Google Sheets CRM
    try {
      await appendLeadToSheet({
        timestamp: new Date().toLocaleString("vi-VN"),
        session_id: sessionId,
        name: customerName,
        phone: customerPhone,
        service: serviceRequested,
        hot_level: aiResult.hot_level,
        score: aiResult.score,
        summary: aiResult.summary_vi,
        next_action: aiResult.suggested_next_action,
      });
      console.log("[Sheets] Lead saved successfully");
    } catch (sheetError) {
      console.error("[Sheets] Google Sheets Error:", sheetError);
    }

    // 5. Lưu Lead vào Supabase (Persistence)
    try {
      await saveLeadToSupabase({
        session_id: sessionId,
        name: customerName,
        phone: customerPhone,
        service: serviceRequested,
        hot_level: aiResult.hot_level,
        score: aiResult.score,
        ai_reasons: JSON.stringify(aiResult.reasons),
        next_action: aiResult.suggested_next_action,
        summary: aiResult.summary_vi,
        status: "new",
        source: "FPT.AI Webchat",
      });
      console.log("[Supabase] Lead saved successfully");
    } catch (dbError) {
      console.error("[Supabase] Database Error:", dbError);
    }

    // 6. Gửi thông báo Telegram cho chủ Spa
    try {
      await sendHotLeadAlert({
        name: customerName,
        phone: customerPhone,
        service: serviceRequested,
        hot_level: aiResult.hot_level,
        score: aiResult.score,
        ai_summary: aiResult.summary_vi,
        next_action: aiResult.suggested_next_action,
      });
      console.log("[Telegram] Alert sent successfully");
    } catch (tgError) {
      console.error("[Telegram] Notification Error:", tgError);
    }

    // 7. Trả phản hồi về cho FPT.AI (Hiển thị lại trong Chatbot)
    const responseMessage = aiResult.hot_level === "hot"
      ? `Cảm ơn ${customerName}! Trợ lý AI đã nhận diện nhu cầu của bạn về dịch vụ ${serviceRequested}. Chuyên viên sẽ gọi ngay cho bạn qua số ${customerPhone} trong ít phút tới.`
      : `Cảm ơn bạn! Chúng tôi đã nhận được thông tin tư vấn ${serviceRequested} và sẽ liên hệ sớm nhất.`;

    return NextResponse.json({
      status: "success",
      messages: [
        {
          type: "text",
          content: responseMessage
        }
      ],
      set_variables: {
        lead_score: aiResult.score,
        is_hot: aiResult.hot_level === "hot"
      }
    });

  } catch (error) {
    console.error("[Webhook] Global System Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
