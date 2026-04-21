import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID!;

function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

// Schema columns: A=Timestamp B=SessionID C=Tên D=SĐT E=Email F=Dịch vụ
// G=Ngày hẹn H=Giờ hẹn I=HotLevel J=Score K=Lý do AI L=NextAction
// M=Tóm tắt N=Trạng thái O=Nguồn P=FollowUpHours

export interface LeadRow {
  session_id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  appointment_date?: string;
  appointment_time?: string;
  hot_level: string;
  score: number;
  ai_reasons: string[];
  next_action: string;
  summary: string;
  status: "new" | "contacted" | "confirmed" | "completed" | "lost";
  source?: string;
  follow_up_hours: number;
}

export async function appendLeadToSheet(lead: LeadRow): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const timestamp = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });

  const values = [
    [
      timestamp,
      lead.session_id,
      lead.name,
      lead.phone,
      lead.email || "",
      lead.service,
      lead.appointment_date || "",
      lead.appointment_time || "",
      lead.hot_level.toUpperCase(),
      lead.score,
      lead.ai_reasons.join("; "),
      lead.next_action,
      lead.summary,
      lead.status,
      lead.source || "fpt_ai_chat",
      lead.follow_up_hours,
    ],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "CRM!A:P",
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });
}

export async function getAllLeads(): Promise<LeadRow[]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "CRM!A2:P1000", // Skip header row
  });

  const rows = res.data.values || [];
  return rows.map((row) => ({
    session_id: row[1] || "",
    name: row[2] || "",
    phone: row[3] || "",
    email: row[4] || "",
    service: row[5] || "",
    appointment_date: row[6] || "",
    appointment_time: row[7] || "",
    hot_level: (row[8] || "cold").toLowerCase(),
    score: parseInt(row[9]) || 0,
    ai_reasons: (row[10] || "").split("; ").filter(Boolean),
    next_action: row[11] || "",
    summary: row[12] || "",
    status: (row[13] || "new") as LeadRow["status"],
    source: row[14] || "",
    follow_up_hours: parseInt(row[15]) || 24,
  }));
}

export async function updateLeadStatus(
  sessionId: string,
  newStatus: LeadRow["status"]
): Promise<void> {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  // Find the row with matching session_id
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "CRM!B:B",
  });

  const rows = res.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === sessionId);

  if (rowIndex === -1) return; // Session not found

  const sheetRow = rowIndex + 2; // +2 because 1-indexed and we skip header
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `CRM!N${sheetRow}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[newStatus]] },
  });
}
