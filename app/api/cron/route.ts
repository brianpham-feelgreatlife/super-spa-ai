import { NextResponse } from "next/server";
import { getAllLeads } from "@/lib/sheets";
import { sendAppointmentReminder, sendWeeklyReport } from "@/lib/telegram";

// POST /api/cron — Triggered by a scheduler (YouWare cron or external service)
// Expected: { job: "reminder" | "weekly_report" | "follow_up_check" }
export async function POST(req: Request) {
  // Simple security: check for a cron secret header
  const authHeader = req.headers ? new Headers(req.headers).get("authorization") : null;
  const expectedSecret = `Bearer ${process.env.FPT_AI_WEBHOOK_SECRET}`;
  if (authHeader !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { job } = await req.json();

  if (job === "reminder") {
    // Send reminders for appointments today
    const leads = await getAllLeads();
    const today = new Date().toLocaleDateString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    const todayAppointments = leads.filter(
      (l) =>
        l.appointment_date &&
        l.appointment_date.includes(
          new Date().toISOString().split("T")[0]
        ) &&
        l.status !== "completed"
    );

    let sent = 0;
    for (const appt of todayAppointments) {
      if (appt.appointment_time) {
        await sendAppointmentReminder(
          appt.name,
          appt.service,
          appt.appointment_date!,
          appt.appointment_time!
        );
        sent++;
      }
    }

    return NextResponse.json({
      success: true,
      job: "reminder",
      reminders_sent: sent,
      today,
    });
  }

  if (job === "weekly_report") {
    const leads = await getAllLeads();
    const stats = {
      total: leads.length,
      hot: leads.filter((l) => l.hot_level === "hot").length,
      warm: leads.filter((l) => l.hot_level === "warm").length,
      cold: leads.filter((l) => l.hot_level === "cold").length,
      conversion_rate:
        leads.length > 0
          ? Math.round(
              (leads.filter((l) => l.status === "completed").length /
                leads.length) *
                100
            )
          : 0,
      vs_last_week: 12, // TODO: compare with previous week data
    };

    await sendWeeklyReport(stats);

    return NextResponse.json({
      success: true,
      job: "weekly_report",
      stats,
    });
  }

  if (job === "follow_up_check") {
    // Find leads that need follow-up
    const leads = await getAllLeads();
    const now = Date.now();
    const overdueLeads = leads.filter((l) => {
      if (l.status !== "new") return false;
      // This is a simplified check — in production you'd track created_at
      return l.hot_level === "hot";
    });

    return NextResponse.json({
      success: true,
      job: "follow_up_check",
      overdue_count: overdueLeads.length,
      overdue_leads: overdueLeads.map((l) => ({
        name: l.name,
        phone: l.phone,
        service: l.service,
        score: l.score,
      })),
    });
  }

  return NextResponse.json({ error: "Unknown job" }, { status: 400 });
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    available_jobs: ["reminder", "weekly_report", "follow_up_check"],
    note: "POST with Authorization header and { job: 'job_name' }",
  });
}
