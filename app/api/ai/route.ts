import { NextRequest, NextResponse } from "next/server";
import { analyzeLeadWithDeepSeek, generateContentSuggestion } from "@/lib/deepseek";

// POST /api/ai/analyze — Phân tích lead thủ công
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "analyze_lead") {
      const result = await analyzeLeadWithDeepSeek(body.lead);
      return NextResponse.json({ success: true, result });
    }

    if (action === "generate_content") {
      const { service, platform } = body;
      const content = await generateContentSuggestion(service, platform);
      return NextResponse.json({ success: true, content });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("[POST /api/ai]", error);
    return NextResponse.json(
      { error: "AI analysis failed", details: String(error) },
      { status: 500 }
    );
  }
}

// GET /api/ai/analyze — Status check
export async function GET() {
  return NextResponse.json({
    status: "active",
    model: "deepseek-reasoner",
    endpoint: "https://api.deepseek.com",
    capabilities: ["lead_analysis", "content_generation"],
    timestamp: new Date().toISOString(),
  });
}
