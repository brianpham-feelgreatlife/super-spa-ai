import { NextRequest, NextResponse } from "next/server";
import { getAllLeads, updateLeadStatus } from "@/lib/sheets";

// GET /api/leads — Lấy tất cả leads từ Google Sheets
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // hot, warm, cold, all
    const limit = parseInt(searchParams.get("limit") || "50");

    let leads = await getAllLeads();

    // Filter by hot level
    if (filter && filter !== "all") {
      leads = leads.filter((l) => l.hot_level === filter);
    }

    // Sort by score descending, limit
    leads = leads
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // Compute stats
    const stats = {
      total: leads.length,
      hot: leads.filter((l) => l.hot_level === "hot").length,
      warm: leads.filter((l) => l.hot_level === "warm").length,
      cold: leads.filter((l) => l.hot_level === "cold").length,
      avg_score:
        leads.length > 0
          ? Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length)
          : 0,
    };

    return NextResponse.json({ leads, stats });
  } catch (error) {
    console.error("[GET /api/leads]", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

// PATCH /api/leads — Cập nhật trạng thái lead
export async function PATCH(req: NextRequest) {
  try {
    const { session_id, status } = await req.json();

    if (!session_id || !status) {
      return NextResponse.json(
        { error: "Missing session_id or status" },
        { status: 400 }
      );
    }

    await updateLeadStatus(session_id, status);

    return NextResponse.json({ success: true, message: "Lead status updated" });
  } catch (error) {
    console.error("[PATCH /api/leads]", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}
