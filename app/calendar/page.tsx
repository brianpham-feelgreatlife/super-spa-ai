"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Appointment {
  id: string;
  name: string;
  service: string;
  date: string;
  time: string;
  hot_level: "hot" | "warm" | "cold";
}

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads?filter=all&limit=50");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      
      // Filter leads that have an appointment date
      const fetchedAppointments = (data.leads || [])
        .filter((l: any) => l.appointment_date)
        .map((l: any) => ({
          id: l.session_id,
          name: l.name,
          service: l.service,
          date: l.appointment_date,
          time: l.appointment_time || "--:--",
          hot_level: l.hot_level,
        }));
        
      setAppointments(fetchedAppointments);
    } catch (err) {
      console.error("Calendar fetch error:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const currentDate = new Date();
  const currentDay = currentDate.getDate();

  return (
    <div className="min-h-screen bg-spa-linen pb-24">
      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-4 max-w-md mx-auto">
        <p className="section-label">LỊCH TRÌNH</p>
        <h1 className="font-serif text-2xl font-bold">Lịch Hẹn Spa</h1>
      </div>

      {/* ── Weekly Calendar Strip ── */}
      <div className="px-6 mb-6 max-w-md mx-auto">
        <div className="spa-card p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-sm">Tháng 4, 2026</h3>
            <button className="text-spa-sage text-xs font-bold">Hôm nay</button>
          </div>
          <div className="flex justify-between">
            {[...Array(7)].map((_, i) => {
              const day = currentDay - (currentDate.getDay() - i);
              const isActive = day === currentDay;
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-1 p-2 rounded-2xl min-w-[40px] transition-all ${
                    isActive ? "bg-spa-sage text-white shadow-spa-float" : ""
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold opacity-70">
                    {days[i]}
                  </span>
                  <span className="text-sm font-bold">{day}</span>
                  {isActive && <div className="w-1 h-1 rounded-full bg-white mt-1" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Appointments List ── */}
      <div className="px-6 max-w-md mx-auto space-y-4">
        <h2 className="section-label">HẸN HÔM NAY</h2>
        
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12">
            <div className="thinking-dot" />
            <div className="thinking-dot" />
            <div className="thinking-dot" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="spa-card p-8 text-center">
            <p className="text-spa-on-surface-variant">Không có lịch hẹn nào</p>
          </div>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="spa-card p-4 flex gap-4 animate-slide-up">
              <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-spa-surface-highest flex-shrink-0">
                <span className="text-xs font-bold text-spa-sage">{apt.time}</span>
                <div className="w-8 h-0.5 bg-spa-sage/20 my-1" />
                <span className="text-[10px] font-medium text-spa-on-surface-variant">AM</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">{apt.name}</h3>
                  <div className={`w-2 h-2 rounded-full ${
                    apt.hot_level === 'hot' ? 'bg-spa-blush' : 
                    apt.hot_level === 'warm' ? 'bg-spa-lavender' : 'bg-spa-sage'
                  }`} />
                </div>
                <p className="text-xs text-spa-on-surface-variant mb-2 truncate">
                  {apt.service}
                </p>
                <div className="flex gap-2">
                  <button className="btn-secondary text-[10px] px-3 py-1 flex-1">
                    Chi tiết
                  </button>
                  <button className="btn-primary text-[10px] px-3 py-1 flex-1">
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Upcoming Section ── */}
      <div className="px-6 mt-8 max-w-md mx-auto pb-8">
        <h2 className="section-label mb-4">SẮP TỚI</h2>
        <div className="spa-card p-4 bg-spa-sage-container/30 border border-spa-sage/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-spa-sage flex items-center justify-center text-white">
              📅
            </div>
            <div>
              <p className="text-xs font-bold text-spa-sage">3 Lịch hẹn ngày mai</p>
              <p className="text-[10px] text-spa-on-surface-variant">Click để xem chi tiết lịch trình</p>
            </div>
            <span className="ml-auto text-spa-sage">→</span>
          </div>
        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card rounded-none border-t-0 rounded-t-3xl">
        <div className="max-w-md mx-auto flex justify-around py-3 px-4">
          {[
            { icon: "🏠", label: "Trang chủ", href: "/" },
            { icon: "📅", label: "Lịch hẹn", href: "/calendar", active: true },
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

