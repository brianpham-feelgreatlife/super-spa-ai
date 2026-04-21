"use client";

import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [webhookUrl] = useState("https://super-spa-ai.youware.app/api/receive-from-fpt");
  const [isCopied, setIsCopied] = useState(false);

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-spa-linen pb-24">
      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-4 max-w-md mx-auto">
        <p className="section-label">HỆ THỐNG</p>
        <h1 className="font-serif text-2xl font-bold">Cài đặt</h1>
      </div>

      {/* ── Connection Status ── */}
      <div className="px-6 mb-6 max-w-md mx-auto">
        <div className="spa-card p-6">
          <h2 className="section-label mb-4">TRẠNG THÁI KẾT NỐI</h2>
          <div className="space-y-4">
            {[
              { label: "DeepSeek AI", status: "Online", color: "bg-spa-sage" },
              { label: "Google Sheets CRM", status: "Connected", color: "bg-spa-sage" },
              { label: "Telegram Bot", status: "Active", color: "bg-spa-sage" },
              { label: "FPT.AI Webhook", status: "Waiting", color: "bg-spa-blush" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm font-medium text-spa-on-surface">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-xs text-spa-on-surface-variant">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Webhook Config ── */}
      <div className="px-6 mb-6 max-w-md mx-auto">
        <div className="spa-card p-6">
          <h2 className="section-label mb-2">FPT.AI WEBHOOK URL</h2>
          <p className="text-[10px] text-spa-on-surface-variant mb-4">
            Copy URL này dán vào mục "JSON API" trong kịch bản FPT.AI
          </p>
          <div className="flex gap-2">
            <div className="flex-1 bg-spa-surface-highest rounded-xl px-3 py-2 text-[10px] font-mono text-spa-sage truncate flex items-center">
              {webhookUrl}
            </div>
            <button
              onClick={copyWebhook}
              className="btn-primary px-4 py-2 text-[10px] whitespace-nowrap"
            >
              {isCopied ? "Đã copy!" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* ── General Settings ── */}
      <div className="px-6 mb-6 max-w-md mx-auto">
        <div className="spa-card p-6 space-y-6">
          <div>
            <h2 className="section-label mb-3">TÀI KHOẢN</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-spa-sage-container flex items-center justify-center text-xl">
                👤
              </div>
              <div>
                <p className="text-sm font-bold">Brian Pham</p>
                <p className="text-xs text-spa-on-surface-variant">Admin - Super SPA</p>
              </div>
              <button className="ml-auto text-xs text-spa-sage font-semibold">Sửa</button>
            </div>
          </div>

          <div className="pt-4 border-t border-spa-surface-high">
            <h2 className="section-label mb-3">THÔNG BÁO</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs">Thông báo Telegram</span>
                <div className="w-10 h-5 bg-spa-sage rounded-full relative p-1 cursor-pointer">
                  <div className="w-3 h-3 bg-white rounded-full absolute right-1" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs">AI Tự động phân tích</span>
                <div className="w-10 h-5 bg-spa-sage rounded-full relative p-1 cursor-pointer">
                  <div className="w-3 h-3 bg-white rounded-full absolute right-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Logout ── */}
      <div className="px-6 pb-12 max-w-md mx-auto text-center">
        <button className="text-spa-error text-xs font-bold px-6 py-2 border border-spa-error/20 rounded-full">
          Đăng xuất hệ thống
        </button>
      </div>

      {/* ── Bottom Nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card rounded-none border-t-0 rounded-t-3xl">
        <div className="max-w-md mx-auto flex justify-around py-3 px-4">
          {[
            { icon: "🏠", label: "Trang chủ", href: "/" },
            { icon: "📅", label: "Lịch hẹn", href: "/calendar" },
            { icon: "📊", label: "Dashboard", href: "/dashboard" },
            { icon: "🔔", label: "Thông báo", href: "/notifications" },
            { icon: "⚙️", label: "Cài đặt", href: "/settings", active: true },
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
