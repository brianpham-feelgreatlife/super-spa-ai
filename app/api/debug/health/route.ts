import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { google } from "googleapis";

export async function GET() {
  const status: any = {
    timestamp: new Date().toISOString(),
    services: {
      deepseek: "pending",
      google_sheets: "pending",
      supabase_db: "pending",
      supabase_storage: "pending",
      telegram: "pending",
    },
    env_vars: {
      deepseek_key: !!process.env.DEEPSEEK_API_KEY,
      google_creds: !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
      supabase_url: !!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL),
      telegram_token: !!process.env.TELEGRAM_SPA_BOT_TOKEN,
    }
  };

  // 1. Check Supabase DB
  try {
    const { data, error } = await supabase.from("leads").select("count").limit(1);
    status.services.supabase_db = error ? `Error: ${error.message}` : "OK";
  } catch (e: any) {
    status.services.supabase_db = `Failed: ${e.message}`;
  }

  // 2. Check Supabase Storage
  try {
    const { data, error } = await supabase.storage.listBuckets();
    status.services.supabase_storage = error ? `Error: ${error.message}` : "OK";
  } catch (e: any) {
    status.services.supabase_storage = `Failed: ${e.message}`;
  }

  // 3. Check Google Sheets
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON || "{}"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    await sheets.spreadsheets.get({ spreadsheetId: process.env.GOOGLE_SHEETS_ID });
    status.services.google_sheets = "OK";
  } catch (e: any) {
    status.services.google_sheets = `Failed: ${e.message}`;
  }

  // 4. Check DeepSeek (Quick ping to base URL)
  try {
    const response = await fetch(process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com", {
      method: "HEAD",
    });
    status.services.deepseek = response.ok ? "OK (Ping)" : `Status: ${response.status}`;
  } catch (e: any) {
    status.services.deepseek = `Failed: ${e.message}`;
  }

  // 5. Check Telegram
  try {
    const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_SPA_BOT_TOKEN}/getMe`);
    const data = await response.json();
    status.services.telegram = data.ok ? `OK (@${data.result.username})` : "Error: Invalid Token";
  } catch (e: any) {
    status.services.telegram = `Failed: ${e.message}`;
  }

  return NextResponse.json(status);
}
