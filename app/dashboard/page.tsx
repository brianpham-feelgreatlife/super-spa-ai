"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Lead {
  session_id: string;
  name: string;
  phone: string;
  service: string;
  appointment_date?: string;
  hot_level: string;
  score: number;
  ai_reasons: string[];
  next_action: string;
  summary: string;
  status: string;
}

interface Stats {
  total: number;
  hot: number;
  warm: number;
  cold: number;
  avg_score: number;
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<"active" | "idle">("active");
  const [expandedLead, setExpandedLead] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/leads?filter=${filter}&limit=20`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }
      const data = await res.json();
      setLeads(data.leads || []);
      setStats(data.stats || null);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Không thể kết nối đến máy chủ");
      setLeads([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const hotLevelConfig = {
    hot: { badge: "badge-hot", emoji: "🔥", label: "HOT" },
    warm: { badge: "badge-warm", emoji: "☀️", label: "WARM" },
    cold: { badge: "badge-cold", emoji: "❄️", label: "COLD" },
  };

  return (
    <div className="min-h-screen bg-spa-linen pb-24">
      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="section-label">LEAD ORACLE</p>
            <h1 className="font-serif text-2xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="pulse-dot"
              style={aiStatus === "active" ? {} : { background: "#b2b2ab" }}
            />
            <span className="text-xs text-spa-on-surface-variant">
              DeepSeek {aiStatus === "active" ? "đang theo dõi" : "offline"}
            </span>
          </div>
        </div>

        {/* Sync status */}
        <div className="flex items-center gap-2 text-xs text-spa-on-surface-variant">
          <span>📊 Google Sheets</span>
          <span className="text-spa-sage font-medium">✓ Đồng bộ 5 phút trước</span>
          <button
            onClick={fetchLeads}
            className="ml-auto btn-secondary text-xs px-3 py-1"
          >
            Làm mới
          </button>
        </div>
      </div>

      {/* ── KPI Stats ── */}
      {stats && (
        <div className="px-6 mb-4 max-w-md mx-auto">
          <div className="grid grid-cols-4 gap-2">
            <div
              onClick={() => setFilter("hot")}
              className={`spa-card p-3 text-center cursor-pointer transition-all ${filter === "hot" ? "ring-2 ring-spa-blush" : ""}`}
            >
              <div className="text-lg">🔥</div>
              <div className="font-bold text-lg text-spa-blush">{stats.hot}</div>
              <div className="text-[10px] text-spa-on-surface-variant">Hot</div>
            </div>
            <div
              onClick={() => setFilter("warm")}
              className={`spa-card p-3 text-center cursor-pointer transition-all ${filter === "warm" ? "ring-2 ring-spa-lavender" : ""}`}
            >
              <div className="text-lg">☀️</div>
              <div className="font-bold text-lg text-spa-lavender">{stats.warm}</div>
              <div className="text-[10px] text-spa-on-surface-variant">Warm</div>
            </div>
            <div
              onClick={() => setFilter("cold")}
              className={`spa-card p-3 text-center cursor-pointer transition-all ${filter === "cold" ? "ring-2 ring-spa-sage" : ""}`}
            >
              <div className="text-lg">❄️</div>
              <div className="font-bold text-lg text-spa-sage">{stats.cold}</div>
              <div className="text-[10px] text-spa-on-surface-variant">Cold</div>
            </div>
            <div
              onClick={() => setFilter("all")}
              className={`spa-card p-3 text-center cursor-pointer transition-all ${filter === "all" ? "ring-2 ring-spa-sage" : ""}`}
            >
              <div className="text-lg">📈</div>
              <div className="font-bold text-lg text-spa-on-surface">{stats.avg_score}</div>
              <div className="text-[10px] text-spa-on-surface-variant">Avg</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Filter Tabs ── */}
      <div className="px-6 mb-4 max-w-md mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["all", "hot", "warm", "cold"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-spa-sage text-white"
                  : "bg-spa-surface-highest text-spa-on-surface-variant"
              }`}
            >
              {f === "all" ? "Tất cả" : f === "hot" ? "🔥 Hot" : f === "warm" ? "☀️ Warm" : "❄️ Cold"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Leads List ── */}
      <div className="px-6 max-w-md mx-auto space-y-3">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12">
            <div className="thinking-dot" />
            <div className="thinking-dot" />
            <div className="thinking-dot" />
          </div>
        ) : error ? (
          <div className="spa-card p-8 text-center border-2 border-spa-error/20">
            <p className="text-4xl mb-2">⚠️</p>
            <p className="text-spa-error font-semibold mb-1">Lỗi kết nối</p>
            <p className="text-xs text-spa-on-surface-variant mb-4">{error}</p>
            <button onClick={fetchLeads} className="btn-secondary text-[10px] px-4 py-2">
              Thử lại
            </button>
          </div>
        ) : leads.length === 0 ? (
          <div className="spa-card p-12 text-center border-dashed border-2 border-spa-sage/20 bg-transparent shadow-none animate-fade-in">
            <div className="w-20 h-20 bg-spa-sage/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl animate-bounce">🌱</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-spa-on-surface mb-2">Đang chờ khách đầu tiên</h3>
            <p className="text-xs text-spa-on-surface-variant max-w-[200px] mx-auto leading-relaxed">
              Hệ thống AI đã sẵn sàng 24/7. Các tin nhắn từ FPT.AI sẽ xuất hiện tại đây ngay lập tức.
            </p>
          </div>
        ) : (
          leads.map((lead) => {
            const config =
              hotLevelConfig[lead.hot_level as keyof typeof hotLevelConfig] ||
              hotLevelConfig.cold;
            const isExpanded = expandedLead === lead.session_id;

            return (
              <div
                key={lead.session_id}
                className="spa-card p-4 animate-slide-up"
              >
                <div
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() =>
                    setExpandedLead(isExpanded ? null : lead.session_id)
                  }
                >
                  {/* Score Ring */}
                  <div className="relative flex-shrink-0">
                    <svg width="48" height="48" viewBox="0 0 48 48">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="#efeee7"
                        strokeWidth="4"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke={
                          lead.hot_level === "hot"
                            ? "#735959"
                            : lead.hot_level === "warm"
                            ? "#645b75"
                            : "#4b6559"
                        }
                        strokeWidth="4"
                        strokeDasharray={`${(lead.score / 100) * 125.6} 125.6`}
                        strokeLinecap="round"
                        transform="rotate(-90 24 24)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-spa-on-surface">
                        {lead.score}
                      </span>
                    </div>
                  </div>

                  {/* Lead Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm truncate">{lead.name}</h3>
                      <span className={config.badge}>
                        {config.emoji} {config.label}
                      </span>
                    </div>
                    <p className="text-xs text-spa-on-surface-variant mb-1">
                      📞 {lead.phone}
                    </p>
                    <p className="text-xs text-spa-on-surface-variant truncate">
                      💆 {lead.service}
                    </p>
                    {lead.appointment_date && (
                      <p className="text-xs text-spa-sage mt-1">
                        📅 {lead.appointment_date}
                      </p>
                    )}
                  </div>

                  {/* Expand Arrow */}
                  <span
                    className={`text-spa-outline transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </div>

                {/* ── Expanded AI Analysis ── */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-spa-surface-high space-y-3 animate-fade-in">
                    {/* AI Summary */}
                    <div className="bg-spa-surface-container rounded-2xl p-3">
                      <p className="section-label mb-1">AI NHẬN XÉT</p>
                      <p className="text-xs text-spa-on-surface">{lead.summary}</p>
                    </div>

                    {/* Reasons */}
                    {lead.ai_reasons.length > 0 && (
                      <div>
                        <p className="section-label mb-2">LÝ DO PHÂN TÍCH</p>
                        <ul className="space-y-1">
                          {lead.ai_reasons.map((r, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <span className="text-spa-sage mt-0.5">✓</span>
                              <span className="text-spa-on-surface-variant">{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Next Action */}
                    <div className="bg-spa-sage-container rounded-2xl p-3 flex items-center gap-2">
                      <span className="text-lg">✅</span>
                      <div>
                        <p className="section-label text-[10px]">HÀNH ĐỘNG TIẾP THEO</p>
                        <p className="text-xs font-semibold text-spa-sage-dim">
                          {lead.next_action}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <a
                        href={`tel:${lead.phone}`}
                        className="btn-primary flex-1 py-2 text-xs"
                      >
                        📞 Gọi ngay
                      </a>
                      <button className="btn-secondary flex-1 py-2 text-xs">
                        📝 Ghi chú
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Bottom Nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 glass-card rounded-none rounded-t-3xl">
        <div className="max-w-md mx-auto flex justify-around py-3 px-4">
          {[
            { icon: "🏠", label: "Trang chủ", href: "/" },
            { icon: "📅", label: "Lịch hẹn", href: "/calendar" },
            { icon: "📊", label: "Dashboard", href: "/dashboard", active: true },
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

