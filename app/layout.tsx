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
      </body>
    </html>
  );
}
