import OpenAI from "openai";

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
});

export interface LeadData {
  name: string;
  phone: string;
  email?: string;
  service: string;
  appointment_date?: string;
  appointment_time?: string;
  conversation_summary?: string;
  source?: string;
}

export interface AIAnalysisResult {
  hot_level: "hot" | "warm" | "cold";
  score: number; // 0-100
  reasons: string[];
  suggested_next_action: string;
  appointment_recommendation: string;
  summary_vi: string;
  follow_up_hours: number; // when to follow up
}

const SYSTEM_PROMPT = `Bạn là chuyên gia phân tích lead spa cao cấp tại TP.HCM với hơn 10 năm kinh nghiệm trong ngành làm đẹp.

Nhiệm vụ của bạn: Phân tích thông tin khách hàng tiềm năng và đánh giá mức độ sẵn sàng mua dịch vụ spa.

Tiêu chí đánh giá:
- HOT (score 70-100): Đã hỏi giá, có lịch cụ thể, dịch vụ rõ ràng, có nhu cầu ngay
- WARM (score 40-69): Quan tâm nhưng chưa quyết định, cần thêm thông tin hoặc thuyết phục
- COLD (score 0-39): Chỉ tìm hiểu chung, chưa có nhu cầu rõ ràng

QUAN TRỌNG: Luôn trả về JSON hợp lệ theo đúng schema sau, không thêm text nào khác.`;

const USER_PROMPT_TEMPLATE = (lead: LeadData) => `
Phân tích lead spa sau:

Thông tin khách hàng:
- Tên: ${lead.name}
- SĐT: ${lead.phone}
- Email: ${lead.email || "Không có"}
- Dịch vụ quan tâm: ${lead.service}
- Ngày hẹn mong muốn: ${lead.appointment_date || "Chưa có"}
- Giờ hẹn: ${lead.appointment_time || "Chưa có"}
- Tóm tắt hội thoại: ${lead.conversation_summary || "Không có"}

Trả về JSON theo đúng format:
{
  "hot_level": "hot" | "warm" | "cold",
  "score": <số nguyên 0-100>,
  "reasons": ["lý do 1", "lý do 2", "lý do 3"],
  "suggested_next_action": "<hành động cụ thể bằng tiếng Việt>",
  "appointment_recommendation": "<gợi ý lịch hẹn hoặc 'Chưa phù hợp'>",
  "summary_vi": "<tóm tắt 1-2 câu về khách hàng>",
  "follow_up_hours": <số giờ nên follow up: 2, 4, 24 hoặc 48>
}`;

export async function analyzeLeadWithDeepSeek(
  lead: LeadData
): Promise<AIAnalysisResult> {
  const completion = await deepseek.chat.completions.create({
    model: "deepseek-reasoner",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: USER_PROMPT_TEMPLATE(lead) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 1000,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("DeepSeek returned empty response");

  const result = JSON.parse(content) as AIAnalysisResult;
  return result;
}

export async function generateContentSuggestion(
  service: string,
  platform: string
): Promise<string> {
  const completion = await deepseek.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content:
          "Bạn là chuyên gia content marketing spa cao cấp tại TP.HCM. Viết content ngắn gọn, thu hút, chuyên nghiệp.",
      },
      {
        role: "user",
        content: `Viết 1 caption ${platform} ngắn (150-200 ký tự) cho dịch vụ "${service}" của spa cao cấp. 
        Tone: Sang trọng, ấm áp, gần gũi. Kết thúc bằng CTA nhẹ nhàng. Trả về chỉ caption, không giải thích.`,
      },
    ],
    temperature: 0.8,
    max_tokens: 300,
  });

  return completion.choices[0]?.message?.content || "";
}

export { deepseek };
