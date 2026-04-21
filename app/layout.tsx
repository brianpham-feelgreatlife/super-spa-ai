import type { Metadata } from "next";
import { Noto_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700"],
  variable: "--font-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Super SPA AI — Spa Management Co-Pilot",
  description:
    "Hệ thống quản lý spa thông minh: AI phân tích lead, CRM tự động, nhắc lịch hẹn qua Telegram. Powered by DeepSeek AI.",
  keywords: "spa, AI, CRM, lead management, FPT.AI, DeepSeek, Vietnam",
  openGraph: {
    title: "Super SPA AI — Spa Management Co-Pilot",
    description: "Hệ thống quản lý spa thông minh với AI tại TP.HCM",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${notoSerif.variable} ${plusJakarta.variable}`}>
      <body className="bg-spa-linen font-sans text-spa-on-surface antialiased">
        {children}
        
        {/* ── FPT.AI Chatbot Integration ── */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            let liveChatBaseUrl   = document.location.protocol + '//' + 'livechat.fpt.ai/v36/src'
            let LiveChatSocketUrl = 'livechat.fpt.ai:443'
            let FptAppCode        = 'a478bf691d3f3c3a724ad5e93a2e9b61'
            let FptAppName        = 'Trợ Lý Spa AI'
            
            let CustomStyles = {
              headerBackground: 'linear-gradient(135deg, #4b6559 0%, #3f584d 100%)',
              headerTextColor: '#ffffff',
              headerText: 'Trợ Lý Spa AI',
              primaryColor: '#4b6559',
              secondaryColor: '#f5f4ed',
              primaryTextColor: '#ffffff',
              secondaryTextColor: '#31332e',
              buttonColor: '#4b6559',
              buttonTextColor: '#ffffff',
              avatarBot: 'https://chatbot-tools.fpt.ai/livechat-builder/img/bot.png',
              sendMessagePlaceholder: 'Nhập tin nhắn tại đây...',
              floatButtonLogo: 'https://chatbot-tools.fpt.ai/livechat-builder/img/Icon-fpt-ai.png',
              floatButtonTooltip: 'Tôi có thể giúp gì cho bạn?',
              floatButtonTooltipEnable: true,
              customerWelcomeText: 'Vui lòng nhập tên của bạn',
              customerButtonText: 'Bắt đầu',
              prefixOptions: ["Anh","Chị"]
            }

            let FptLiveChatConfigs = {
              appName: FptAppName,
              appCode: FptAppCode,
              themes : '',
              styles : CustomStyles
            }

            let FptLiveChatScript  = document.createElement('script')
            FptLiveChatScript.id   = 'fpt_ai_livechat_script'
            FptLiveChatScript.src  = liveChatBaseUrl + '/static/fptai-livechat.js'
            document.body.appendChild(FptLiveChatScript)

            let FptLiveChatStyles  = document.createElement('link')
            FptLiveChatStyles.id   = 'fpt_ai_livechat_style'
            FptLiveChatStyles.rel  = 'stylesheet'
            FptLiveChatStyles.href = liveChatBaseUrl + '/static/fptai-livechat.css'
            document.body.appendChild(FptLiveChatStyles)

            FptLiveChatScript.onload = function () {
              fpt_ai_render_chatbox(FptLiveChatConfigs, liveChatBaseUrl, LiveChatSocketUrl)
            }
          })();
        `}} />
      </body>
    </html>
  );
}
