"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [leadCount] = useState(23);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-spa-linen overflow-x-hidden">
      {/* ── Floating Header ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? "glass-card m-3 rounded-3xl" : "bg-transparent"
        }`}
      >
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-spa-sage text-2xl">🌿</span>
            <span className="font-serif font-bold text-spa-on-surface">
              Super SPA AI
            </span>
          </div>
          <Link
            href="/dashboard"
            className="btn-secondary text-xs px-4 py-2"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="pt-28 pb-16 px-6 max-w-md mx-auto text-center">
        {/* Social Proof Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-spa-blush-container mb-6 animate-fade-in">
          <span className="text-sm">🔥</span>
          <span className="text-xs font-semibold text-spa-blush">
            {leadCount} khách đặt lịch tuần này
          </span>
          <span className="badge-hot text-[10px] px-2 py-0.5">HOT</span>
        </div>

        <h1 className="font-serif text-4xl font-bold text-spa-on-surface mb-4 leading-tight tracking-tight animate-slide-up">
          Spa Thông Minh
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #4b6559, #735959)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Dẫn Đầu Thị Trường
          </span>
        </h1>

        <p className="text-spa-on-surface-variant text-base leading-relaxed mb-8">
          Kết hợp AI DeepSeek + FPT.AI để tự động phân tích khách hàng,
          quản lý lịch hẹn, và gửi thông báo real-time.
        </p>

        {/* Primary CTA */}
        <div className="space-y-3">
          <button className="btn-primary w-full py-4 text-base">
            <span>💬</span>
            Nhận Tư Vấn Miễn Phí Ngay
          </button>
          <p className="text-xs text-spa-on-surface-variant">
            AI phân tích & kết nối bạn trong 30 giây
          </p>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="px-6 max-w-md mx-auto">
        <div className="spa-card p-4">
          <p className="section-label text-center mb-3">Được hỗ trợ bởi</p>
          <div className="flex justify-around items-center flex-wrap gap-3">
            {[
              { icon: "🤖", label: "DeepSeek AI" },
              { icon: "📊", label: "CRM Tự Động" },
              { icon: "📱", label: "Telegram Alerts" },
              { icon: "⚡", label: "FPT.AI Chat" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-semibold text-spa-on-surface-variant">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Section ── */}
      <section className="px-6 py-12 max-w-md mx-auto">
        <p className="section-label mb-2">DỊCH VỤ NỔI BẬT</p>
        <h2 className="font-serif text-2xl font-bold mb-6">
          Trải Nghiệm Đỉnh Cao
        </h2>
        <div className="space-y-3">
          {[
            {
              icon: "✨",
              name: "Facial Treatment Premium",
              desc: "Chăm sóc da mặt chuyên sâu với công nghệ Châu Âu",
              price: "từ 890.000đ",
              hot: true,
            },
            {
              icon: "💆",
              name: "Body Massage Thư Giãn",
              desc: "Massage toàn thân 90 phút với tinh dầu thiên nhiên",
              price: "từ 650.000đ",
              hot: false,
            },
            {
              icon: "🌹",
              name: "Detox & Slimming",
              desc: "Giảm mỡ bụng, detox cơ thể với công nghệ hiện đại",
              price: "từ 1.200.000đ",
              hot: true,
            },
          ].map((service) => (
            <div key={service.name} className="spa-card p-4 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-spa-sage-container flex items-center justify-center text-2xl flex-shrink-0">
                {service.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{service.name}</h3>
                  {service.hot && <span className="badge-hot">HOT</span>}
                </div>
                <p className="text-xs text-spa-on-surface-variant mb-2">
                  {service.desc}
                </p>
                <p className="text-spa-sage font-semibold text-sm">
                  {service.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI Workflow Section ── */}
      <section className="px-6 py-8 max-w-md mx-auto">
        <div className="glass-card p-6">
          <p className="section-label mb-2">QUITRÌNH AI</p>
          <h2 className="font-serif text-xl font-bold mb-4">
            Tự Động Hóa 100%
          </h2>
          <div className="space-y-4">
            {[
              { step: "1", text: "Khách nhắn tin qua FPT.AI Chat Widget" },
              {
                step: "2",
                text: "DeepSeek AI phân tích & chấm điểm hot/warm/cold",
              },
              { step: "3", text: "Tự động ghi vào Google Sheets CRM" },
              { step: "4", text: "Alert Telegram ngay cho chủ spa" },
              { step: "5", text: "Nhắc hẹn tự động trước 1 ngày" },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-spa-sage flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {item.step}
                </div>
                <p className="text-sm text-spa-on-surface-variant">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="px-6 py-12 pb-24 max-w-md mx-auto text-center">
        <h2 className="font-serif text-2xl font-bold mb-3">
          Sẵn Sàng Bắt Đầu?
        </h2>
        <p className="text-spa-on-surface-variant text-sm mb-6">
          Để lại thông tin, AI sẽ tư vấn dịch vụ phù hợp nhất với bạn
        </p>
        <button className="btn-primary w-full py-4 text-base">
          <span>🌿</span>
          Đặt Lịch Ngay Hôm Nay
        </button>
      </section>

      {/* ── Floating Chat Button (FPT.AI Placeholder) ── */}
      <div className="chat-fab group">
        <div className="text-spa-sage text-2xl">💬</div>
        {/* Pulsing ring */}
        <div
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-spa-blush-container"
          style={{ animation: "pulse-ring 2s infinite" }}
        />
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 glass-card px-3 py-2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Tư vấn ngay với AI
        </div>
      </div>

      {/* ── Bottom Navigation ── */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card rounded-none border-t-0 rounded-t-3xl">
        <div className="max-w-md mx-auto flex justify-around py-3 px-4">
          {[
            { icon: "🏠", label: "Trang chủ", href: "/", active: true },
            { icon: "📅", label: "Lịch hẹn", href: "/calendar" },
            { icon: "📊", label: "Dashboard", href: "/dashboard" },
            { icon: "🔔", label: "Thông báo", href: "/notifications" },
            { icon: "⚙️", label: "Cài đặt", href: "/settings" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-tab ${item.active ? "active" : ""}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
