"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Notification {
  id: string;
  type: "lead" | "ai" | "reminder" | "system";
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setNotifications(MOCK_NOTIFICATIONS);
      setLoading(false);
    }, 600);
  }, []);

  const getTypeStyles = (type: Notification["type"]) => {
    switch (type) {
      case "lead":
        return { icon: "👤", bg: "bg-spa-blush-container", text: "text-spa-blush" };
      case "ai":
        return { icon: "🤖", bg: "bg-spa-sage-container", text: "text-spa-sage" };
      case "reminder":
        return { icon: "⏰", bg: "bg-spa-lavender-container", text: "text-spa-lavender" };
      default:
        return { icon: "⚙️", bg: "bg-spa-surface-highest", text: "text-spa-on-surface-variant" };
    }
  };

  return (
    <div className="min-h-screen bg-spa-linen pb-24">
      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-4 max-w-md mx-auto flex items-center justify-between">
        <div>
          <p className="section-label">CẬP NHẬT</p>
          <h1 className="font-serif text-2xl font-bold">Thông Báo</h1>
        </div>
        <button className="text-xs text-spa-sage font-semibold">Đánh dấu đã đọc</button>
      </div>

      {/* ── Notifications List ── */}
      <div className="px-6 max-w-md mx-auto space-y-3">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12">
            <div className="thinking-dot" />
            <div className="thinking-dot" />
            <div className="thinking-dot" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="spa-card p-8 text-center">
            <p className="text-spa-on-surface-variant">Không có thông báo mới</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const styles = getTypeStyles(notif.type);
            return (
              <div
                key={notif.id}
                className={`spa-card p-4 flex gap-4 transition-all duration-300 ${
                  !notif.isRead ? "border-l-4 border-spa-sage bg-white" : "opacity-80"
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl ${styles.bg} flex items-center justify-center text-xl flex-shrink-0`}>
                  {styles.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm text-spa-on-surface truncate">
                      {notif.title}
                    </h3>
                    <span className="text-[10px] text-spa-outline whitespace-nowrap ml-2">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-xs text-spa-on-surface-variant leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Load More ── */}
      {!loading && notifications.length > 0 && (
        <div className="px-6 py-6 text-center max-w-md mx-auto">
          <button className="btn-secondary w-full py-3 text-xs">
            Xem thông báo cũ hơn
          </button>
        </div>
      )}

      {/* ── Bottom Nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card rounded-none border-t-0 rounded-t-3xl">
        <div className="max-w-md mx-auto flex justify-around py-3 px-4">
          {[
            { icon: "🏠", label: "Trang chủ", href: "/" },
            { icon: "📅", label: "Lịch hẹn", href: "/calendar" },
            { icon: "📊", label: "Dashboard", href: "/dashboard" },
            { icon: "🔔", label: "Thông báo", href: "/notifications", active: true },
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

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "lead",
    title: "Lead mới từ FPT.AI",
    message: "Khách hàng Nguyễn Thị Lan vừa gửi thông tin quan tâm đến Facial Treatment.",
    time: "2 phút trước",
    isRead: false,
  },
  {
    id: "n2",
    type: "ai",
    title: "DeepSeek Phân tích xong",
    message: "Lead 'Nguyễn Thị Lan' được xếp hạng HOT (92 điểm). Hãy gọi ngay!",
    time: "1 phút trước",
    isRead: false,
  },
  {
    id: "n3",
    type: "reminder",
    title: "Nhắc hẹn ngày mai",
    message: "Đã gửi tin nhắn nhắc hẹn tự động cho 3 khách hàng ngày 23/04.",
    time: "1 giờ trước",
    isRead: true,
  },
  {
    id: "n4",
    type: "system",
    title: "Đồng bộ Google Sheets",
    message: "Đã cập nhật thành công 5 lead mới vào trang quản trị CRM.",
    time: "3 giờ trước",
    isRead: true,
  },
];
