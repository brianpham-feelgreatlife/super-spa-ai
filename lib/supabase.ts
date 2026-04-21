import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveLeadToSupabase(leadData: any) {
  try {
    const { data, error } = await supabase
      .from("leads")
      .upsert([
        {
          session_id: leadData.session_id,
          name: leadData.name,
          phone: leadData.phone,
          email: leadData.email,
          service: leadData.service,
          appointment_date: leadData.appointment_date,
          appointment_time: leadData.appointment_time,
          hot_level: leadData.hot_level,
          score: leadData.score,
          ai_reasons: leadData.ai_reasons,
          next_action: leadData.next_action,
          summary: leadData.summary,
          status: leadData.status || "new",
          source: leadData.source || "fpt_ai",
          created_at: new Date().toISOString(),
        },
      ], { onConflict: 'session_id' });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Supabase Save Error:", error);
    return null;
  }
}
