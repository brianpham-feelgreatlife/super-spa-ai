import TelegramBot from "node-telegram-bot-api";

// Hot Lead Alert Bot
const hotLeadBot = new TelegramBot(
  process.env.TELEGRAM_HOT_LEAD_BOT_TOKEN || "placeholder",
  { polling: false }
);

// Spa Assistant Bot (internal)
const spaBot = new TelegramBot(
  process.env.TELEGRAM_SPA_BOT_TOKEN || "placeholder",
  { polling: false }
);

const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

export interface TelegramLeadAlert {
  name: string;
  phone: string;
  service: string;
  appointment_date?: string;
  appointment_time?: string;
  hot_level: string;
  score: number;
  ai_summary: string;
  next_action: string;
}

const HOT_LEVEL_EMOJI = {
  hot: "🔥",
  warm: "☀️",
  cold: "❄️",
};

const HOT_LEVEL_VI = {
  hot: "TIỀM NĂNG CAO",
  warm: "TRUNG BÌNH",
  cold: "THẤP",
};

export async function sendHotLeadAlert(lead: TelegramLeadAlert): Promise<void> {
  if (!CHAT_ID || process.env.TELEGRAM_HOT_LEAD_BOT_TOKEN === "placeholder") {
    console.log("[Telegram] Skipped - no token configured");
    return;
  }

  const emoji = HOT_LEVEL_EMOJI[lead.hot_level as keyof typeof HOT_LEVEL_EMOJI] || "📌";
  const levelVi = HOT_LEVEL_VI[lead.hot_level as keyof typeof HOT_LEVEL_VI] || lead.hot_level;

  const appointmentLine =
    lead.appointment_date
      ? `📅 *Lịch hẹn:* ${lead.appointment_date}${lead.appointment_time ? " lúc " + lead.appointment_time : ""}`
      : `📅 *Lịch hẹn:* Chưa có`;

  const message = `
${emoji} *LEAD ${levelVi}!*
━━━━━━━━━━━━━━━
👤 *Khách:* ${lead.name}
📞 *SĐT:* ${lead.phone}
💆 *Dịch vụ:* ${lead.service}
${appointmentLine}

🤖 *AI Score:* ${lead.score}/100
📝 *AI nhận xét:* ${lead.ai_summary}

✅ *Hành động gợi ý:* ${lead.next_action}
━━━━━━━━━━━━━━━
_Được phân tích bởi DeepSeek AI - Super SPA_
`.trim();

  await hotLeadBot.sendMessage(CHAT_ID, message, {
    parse_mode: "Markdown",
  });
}

export async function sendAppointmentReminder(
  customerName: string,
  service: string,
  appointmentDate: string,
  appointmentTime: string
): Promise<void> {
  if (!CHAT_ID || process.env.TELEGRAM_SPA_BOT_TOKEN === "placeholder") {
    console.log("[Telegram] Reminder skipped - no token configured");
    return;
  }

  const message = `
⏰ *NHẮC HẸN*
━━━━━━━━━━━━━━━
👤 Khách: *${customerName}*
💆 Dịch vụ: *${service}*
📅 Ngày: *${appointmentDate}*
🕐 Giờ: *${appointmentTime}*
━━━━━━━━━━━━━━━
_Vui lòng xác nhận và chuẩn bị phòng trước 30 phút_
`.trim();

  await spaBot.sendMessage(CHAT_ID, message, { parse_mode: "Markdown" });
}

export async function sendWeeklyReport(stats: {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  conversion_rate: number;
  vs_last_week: number;
}): Promise<void> {
  if (!CHAT_ID || process.env.TELEGRAM_SPA_BOT_TOKEN === "placeholder") return;

  const trend = stats.vs_last_week >= 0 ? `📈 +${stats.vs_last_week}%` : `📉 ${stats.vs_last_week}%`;

  const message = `
📊 *BÁO CÁO TUẦN - SUPER SPA AI*
━━━━━━━━━━━━━━━
📌 Tổng leads: *${stats.total}*
🔥 Hot: *${stats.hot}*
☀️ Warm: *${stats.warm}*
❄️ Cold: *${stats.cold}*

💰 Tỷ lệ chuyển đổi: *${stats.conversion_rate}%*
${trend} so với tuần trước
━━━━━━━━━━━━━━━
_DeepSeek AI · Super SPA Co-Pilot_
`.trim();

  await spaBot.sendMessage(CHAT_ID, message, { parse_mode: "Markdown" });
}
