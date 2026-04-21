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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-spa-blush-container mb-6 animate-fade-in shadow-sm border border-spa-blush/10">
          <span className="text-sm">✨</span>
          <span className="text-xs font-semibold text-spa-blush">
            Hơn 1,200 khách hàng đã tin tưởng
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-spa-on-surface mb-4 leading-tight tracking-tight animate-slide-up">
          Spa Thông Minh
          <br />
          <span
            className="inline-block mt-1"
            style={{
              background: "linear-gradient(135deg, #4b6559, #735959)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Dân Đầu Công Nghệ AI
          </span>
        </h1>

        <p className="text-spa-on-surface-variant text-base leading-relaxed mb-8 px-4">
          Cá nhân hóa liệu trình bằng AI DeepSeek. Đặt lịch nhanh chóng, 
          phục vụ tận tâm 24/7 qua trợ lý ảo thông minh.
        </p>

        {/* Primary CTA */}
        <div className="space-y-4 px-2">
          <button className="btn-primary w-full py-4 text-base shadow-spa-float active:scale-[0.98] transition-transform">
            <span>🌿</span>
            Nhận Tư Vấn Liệu Trình Ngay
          </button>
          <div className="flex items-center justify-center gap-4 text-[10px] text-spa-on-surface-variant font-medium uppercase tracking-wider">
            <span className="flex items-center gap-1">✅ Phản hồi &lt; 1p</span>
            <span className="flex items-center gap-1">✅ Tư vấn miễn phí</span>
          </div>
        </div>
      </section>

      {/* ── Trust Bar & Urgency ── */}
      <section className="px-6 max-w-md mx-auto">
        <div className="spa-card p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-spa-blush/5 rounded-full -mr-12 -mt-12" />
          <p className="section-label text-center mb-4">CÔNG NGHỆ HIỆN ĐẠI</p>
          <div className="flex justify-around items-center flex-wrap gap-4">
            {[
              { icon: "🧠", label: "DeepSeek V3" },
              { icon: "⚡", label: "FPT.AI Chat" },
              { icon: "📱", label: "Realtime Alert" },
              { icon: "💎", label: "Premium Care" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <span className="text-xl">{item.icon}</span>
                </div>
                <span className="text-[9px] font-bold text-spa-on-surface tracking-tighter">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Section ── */}
      <section className="px-6 py-12 max-w-md mx-auto">
        <p className="section-label mb-2 text-spa-sage">LỰA CHỌN PHỔ BIẾN</p>
        <h2 className="font-serif text-2xl font-bold mb-6">
          Dịch Vụ Được Yêu Thích
        </h2>
        <div className="space-y-4">
          {[
            {
              icon: "✨",
              name: "Facial Treatment Premium",
              desc: "Chăm sóc da mặt chuyên sâu với công nghệ Châu Âu",
              price: "890.000đ",
              hot: true,
            },
            {
              icon: "💆",
              name: "Body Massage Thư Giãn",
              desc: "Massage toàn thân 90 phút với tinh dầu thiên nhiên",
              price: "650.000đ",
              hot: false,
            },
          ].map((service) => (
            <div key={service.name} className="spa-card p-4 flex items-start gap-4 hover:bg-spa-surface-high transition-colors cursor-pointer group">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-2xl flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                {service.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm text-spa-on-surface">{service.name}</h3>
                  {service.hot && <span className="badge-hot text-[9px] px-1.5 py-0.5">HOT</span>}
                </div>
                <p className="text-[11px] text-spa-on-surface-variant leading-relaxed mb-2">
                  {service.desc}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-spa-sage font-bold text-sm">
                    {service.price}
                  </p>
                  <button className="text-[10px] font-bold text-spa-blush underline">Chi tiết</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials (Social Proof) ── */}
      <section className="px-6 py-8 max-w-md mx-auto">
        <div className="bg-spa-sage/5 rounded-[2rem] p-6 border border-spa-sage/10">
          <p className="section-label mb-4 text-center">KHÁCH HÀNG NÓI GÌ</p>
          <div className="text-center">
            <div className="flex justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => <span key={i} className="text-xs text-spa-blush">⭐</span>)}
            </div>
            <p className="italic text-spa-on-surface-variant text-sm mb-4">
              "Lần đầu tiên trải nghiệm đặt lịch qua AI, nhanh đến không ngờ! Nhân viên tư vấn đúng nhu cầu mình cần."
            </p>
            <p className="font-bold text-xs text-spa-sage">— Chị Thu Hà, Quận 1</p>
          </div>
        </div>
      </section>

      {/* ── AI Workflow Section ── */}
      <section className="px-6 py-8 max-w-md mx-auto">
        <div className="glass-card p-6 border-spa-sage/20">
          <p className="section-label mb-2 text-spa-sage">CÔNG NGHỆ VẬN HÀNH</p>
          <h2 className="font-serif text-xl font-bold mb-5">
            Hệ Thống Tự Động Hóa
          </h2>
          <div className="space-y-5">
            {[
              { step: "1", title: "Kết nối", text: "Trò chuyện trực tiếp với AI 24/7" },
              { step: "2", title: "Phân tích", text: "DeepSeek chấm điểm & gợi ý liệu trình" },
              { step: "3", title: "Phục vụ", text: "Chủ spa nhận thông báo & phục vụ ngay" },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-6 h-6 rounded-lg bg-spa-sage text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-spa-on-surface mb-0.5">{item.title}</h4>
                  <p className="text-[11px] text-spa-on-surface-variant">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA & Scarcity ── */}
      <section className="px-6 py-12 pb-32 max-w-md mx-auto text-center">
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold mb-3 text-spa-on-surface">
            Trải Nghiệm Ngay
          </h2>
          <p className="text-spa-on-surface-variant text-sm mb-6">
            Chỉ còn <span className="text-spa-blush font-bold">3 suất ưu đãi</span> giảm 20% trong ngày hôm nay.
          </p>
        </div>
        <button className="btn-primary w-full py-4 text-base shadow-spa-float animate-pulse">
          <span>🌿</span>
          Đăng Ký Nhận Ưu Đãi
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
