# Super SPA AI — Web App Setup Guide

## 🚀 Bước 1: Cài đặt Node.js

Nếu chưa có Node.js, tải và cài tại:
👉 https://nodejs.org/en/download (chọn LTS version)

Sau khi cài xong, mở PowerShell và verify:
```powershell
node --version  # phải thấy v20.x.x hoặc cao hơn
npm --version   # phải thấy 10.x.x
```

---

## 🔧 Bước 2: Cài đặt Dependencies

Mở PowerShell trong thư mục project:
```powershell
cd "C:\Users\Antigravity Folder (Brian Pham)\My Antigravity - Project\SPA - Super - Assistance - Bot"
npm install
```

Đợi khoảng 2-3 phút để npm tải tất cả packages.

---

## ⚙️ Bước 3: Cấu hình Environment Variables

Mở file `.env.local` và điền vào:

### ✅ Đã có sẵn:
```
DEEPSEEK_API_KEY=sk-c12601c3401940d0a59ee67e17ad104d
```

### ❓ Cần bổ sung:

**Google Sheets:**
1. Vào Google Cloud Console → tạo Service Account
2. Tải file JSON credentials
3. Copy toàn bộ nội dung JSON vào `GOOGLE_SERVICE_ACCOUNT_JSON`
4. Share Google Sheets với email của service account

**Telegram Bots:**
1. Nhắn tin @BotFather trên Telegram
2. Tạo bot mới (`/newbot`)
3. Copy token vào `TELEGRAM_HOT_LEAD_BOT_TOKEN`
4. Lấy chat ID: nhắn tin bot rồi vào `https://api.telegram.org/bot{TOKEN}/getUpdates`

---

## 🏃 Bước 4: Chạy Local

```powershell
npm run dev
```

Mở trình duyệt: http://localhost:3000

---

## 🌐 Bước 5: Deploy lên YouWare

1. Push code lên GitHub:
```powershell
git init
git add .
git commit -m "Super SPA AI v1.0 - Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/super-spa-ai.git
git push -u origin main
```

2. Vào YouWare dashboard → Import GitHub repo
3. Set environment variables (copy từ `.env.local`)
4. Click Deploy

---

## 🤖 Cấu hình FPT.AI Webhook

Sau khi deploy, cập nhật JSON API Card trong FPT.AI:

**URL:** `https://your-app.youware.app/api/receive-from-fpt`  
**Method:** POST  
**Body:**
```json
{
  "source": "fpt_ai_chat",
  "session_id": "{{session_id}}",
  "customer": {
    "name": "{{customer_name}}",
    "phone": "{{customer_phone}}",
    "email": "{{customer_email}}"
  },
  "service": "{{service_interest}}",
  "appointment_date": "{{appointment_date}}",
  "appointment_time": "{{appointment_time}}",
  "conversation_summary": "{{conversation_summary}}",
  "timestamp": "{{current_time}}"
}
```

---

## 📱 Cấu hình Cron Jobs (YouWare)

Trong YouWare, thêm scheduled tasks:

| Job | Cron Expression | Description |
|-----|----------------|-------------|
| Nhắc hẹn sáng | `0 9 * * *` | POST /api/cron `{"job":"reminder"}` |
| Báo cáo tuần | `0 10 * * 1` | POST /api/cron `{"job":"weekly_report"}` |
| Check follow-up | `0 */4 * * *` | POST /api/cron `{"job":"follow_up_check"}` |

**Authorization header:** `Bearer YOUR_FPT_AI_WEBHOOK_SECRET`

---

## 📂 Cấu trúc Project

```
SPA - Super - Assistance - Bot/
├── app/
│   ├── page.tsx                    ← Landing Page
│   ├── dashboard/page.tsx          ← Lead Oracle Dashboard
│   ├── calendar/page.tsx           ← Lịch hẹn (TODO)
│   ├── notifications/page.tsx      ← Thông báo (TODO)
│   ├── settings/page.tsx           ← Cài đặt (TODO)
│   └── api/
│       ├── receive-from-fpt/       ← 🔑 Main webhook từ FPT.AI
│       ├── leads/                  ← CRUD leads
│       ├── ai/                     ← DeepSeek analysis
│       └── cron/                   ← Scheduled jobs
├── lib/
│   ├── deepseek.ts                 ← AI Brain
│   ├── sheets.ts                   ← Google Sheets CRM
│   └── telegram.ts                 ← Telegram Bots
├── .env.local                      ← API Keys (ĐỪNG COMMIT)
└── tailwind.config.js              ← Design System tokens
```

---

## ❓ Troubleshooting

**"Module not found" errors:** Chạy `npm install` lại

**Google Sheets API 403:** Kiểm tra service account có quyền edit Sheets chưa

**Telegram không nhận được:** Kiểm tra CHAT_ID — dùng `getUpdates` API để lấy đúng ID

**DeepSeek timeout:** Model `deepseek-reasoner` tốn 10-30s — bình thường, không timeout webhook trong 30s
