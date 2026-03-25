"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/metrics", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load metrics");
        const json = await res.json();
        if (active) setData(json);
      } catch (e) {
        console.error(e);
        if (active) setError(e.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  if (loading) return <div className="container-max py-12">Loading admin metrics…</div>;
  if (error) return <div className="container-max py-12 text-red-700">{error}</div>;
  if (!data) return null;

  const {
    overallScore, // 0..100
    weeklyTrend,  // [{w,label,value}]
    breakdown,    // {stress,mood,sleep,anxiety}
    atRisk,       // [{name, risk, reason}]
    screenings,   // {completed, pending}
    activity,     // [{type, label, timeAgo}]
  } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-[1fr] gap-6">
        {/* Overall wellbeing donut */}
        <div className="card p-6 md:col-span-2 hover-card">
          <h2 className="text-lg font-semibold">Overall wellbeing</h2>
          <div className="mt-6 flex items-center gap-6">
            <Donut value={overallScore} size={120} stroke={14} gradient stops={[{ offset: 0, color: "var(--accent)" }, { offset: 100, color: "var(--brand-strong)" }]} />
            <div>
              <div className="text-4xl font-semibold">{overallScore}%</div>
              <div className="text-sm text-gray-600 mt-1">School-wide average</div>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: "var(--accent)" }} />
                <span className="text-gray-700">Last 4 weeks trending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly trend sparkline */}
        <div className="card p-6 md:col-span-4 hover-card subtle-grid">
          <h2 className="text-lg font-semibold">Weekly stress trend</h2>
          <div className="mt-4">
            <Sparkline data={weeklyTrend} height={110} color="var(--brand-strong)" />
          </div>
          <div className="mt-3 flex gap-4 text-sm text-gray-600 overflow-x-auto">
            {weeklyTrend.map((p) => (
              <div key={p.w} className="flex items-center gap-2 min-w-max">
                <span className="inline-flex items-center justify-center rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700">{p.label}</span>
                <span className="text-gray-700 font-medium">{p.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metric breakdown bars */}
        <div className="card p-6 md:col-span-3 hover-card">
          <h2 className="text-lg font-semibold">Key indicators</h2>
          <div className="mt-4 space-y-4">
            <Bar label="Stress" value={breakdown.stress} color="var(--accent-2)" />
            <Bar label="Mood" value={breakdown.mood} color="var(--accent)" />
            <Bar label="Sleep quality" value={breakdown.sleep} color="var(--brand)" />
            <Bar label="Anxiety" value={breakdown.anxiety} color="#f6c1b9" />
          </div>
        </div>

        {/* Screenings status donut */}
        <div className="card p-6 md:col-span-3 hover-card">
          <h2 className="text-lg font-semibold">Screening completion</h2>
          <div className="mt-6 flex items-center gap-6">
            <Donut value={percent(screenings.completed, screenings.completed + screenings.pending)} size={120} stroke={14} gradient stops={[{ offset: 0, color: "var(--brand)" }, { offset: 100, color: "var(--brand-strong)" }]} />
            <div>
              <div className="text-3xl font-semibold text-gray-800">{screenings.completed}/{screenings.completed + screenings.pending}</div>
              <div className="text-sm text-gray-600 mt-1">Students completed screening</div>
              <Link href="/screening" className="btn btn-ghost mt-3">View details</Link>
            </div>
          </div>
        </div>

        {/* At-risk students */}
        <div className="card p-6 md:col-span-3 hover-card">
          <h2 className="text-lg font-semibold">At-risk students</h2>
          <ul className="mt-4 space-y-3">
            {atRisk.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <RiskBadge level={s.risk} />
                <div>
                  <div className="font-medium text-gray-800">{s.name}</div>
                  <div className="text-sm text-gray-600">{s.reason}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent activity */}
        <div className="card p-6 md:col-span-3 hover-card">
          <h2 className="text-lg font-semibold">Recent activity</h2>
          <ul className="mt-4 divide-y divide-gray-100">
            {activity.map((a, i) => (
              <li key={i} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md" style={{ background: a.type === "screening" ? "var(--accent)" : a.type === "chat" ? "#f7d9c4" : "#e6cdb5" }} />
                  <div>
                    <div className="text-sm font-medium text-gray-800">{a.label}</div>
                    <div className="text-xs text-gray-600">{a.timeAgo}</div>
                  </div>
                </div>
                <button className="btn btn-ghost text-sm">View</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function percent(a, b) { return b === 0 ? 0 : Math.round((a / b) * 100); }

function Donut({ value = 0, size = 120, stroke = 12, gradient = false, stops = [] }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const id = gradient ? `grad-${Math.random().toString(36).slice(2)}` : null;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gradient && (
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
            {stops.map((s, i) => (
              <stop key={i} offset={`${s.offset}%`} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>
      )}
      <circle cx={size/2} cy={size/2} r={r} stroke="#eee" strokeWidth={stroke} fill="none" />
      <circle
        cx={size/2}
        cy={size/2}
        r={r}
        stroke={gradient ? `url(#${id})` : "var(--brand)"}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
    </svg>
  );
}

function Sparkline({ data = [], width = 600, height = 100, color = "#8884d8" }) {
  const pad = 8;
  const w = width;
  const h = height;
  const xs = data.map((_, i) => i);
  const ys = data.map(d => d.value);
  const max = Math.max(...ys, 100);
  const min = Math.min(...ys, 0);
  const scaleX = (i) => pad + (i / (xs.length - 1 || 1)) * (w - pad*2);
  const scaleY = (v) => pad + (1 - (v - min) / (max - min || 1)) * (h - pad*2);
  const path = xs.map((i, idx) => `${idx === 0 ? "M" : "L"}${scaleX(i)},${scaleY(ys[idx])}`).join(" ");
  const area = `${path} L ${scaleX(xs[xs.length-1]||0)},${h-pad} L ${scaleX(0)},${h-pad} Z`;
  return (
    <svg className="w-full" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={area} fill="rgba(217,180,145,0.20)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

function Bar({ label, value, color }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-800">{value}%</span>
      </div>
      <div className="mt-2 h-3 rounded-full bg-gray-100">
        <div className="h-3 rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function RiskBadge({ level }) {
  const map = {
    high: { bg: "#fee2e2", dot: "#ef4444", label: "High" },
    medium: { bg: "#fef3c7", dot: "#f59e0b", label: "Medium" },
    low: { bg: "#dcfce7", dot: "#22c55e", label: "Low" },
  };
  const m = map[level] || map.low;
  return (
    <span className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs" style={{ background: m.bg }}>
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: m.dot }} />
      <span className="text-gray-800">{m.label} risk</span>
    </span>
  );
}
