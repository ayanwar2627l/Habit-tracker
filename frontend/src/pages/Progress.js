import React, { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import api from "../api";

// Custom dark tooltip for recharts
function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      padding: "10px 14px",
      fontSize: "0.82rem",
    }}>
      <p style={{ color: "var(--text-secondary)", marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
}

export default function Progress() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/habits")
      .then((res) => setHabits(res.data))
      .catch((err) => {
        if (err.response?.status === 401) window.location.href = "/login";
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner" />
        <span>Loading progress…</span>
      </div>
    );
  }

  // Build per-habit bar chart data
  const barData = habits.map((h) => ({
    name: h.title.length > 16 ? h.title.slice(0, 16) + "…" : h.title,
    "Completion %": h.progress || 0,
  }));

  // Build a 7-day area chart showing how many habits were done per day
  const today = new Date();
  const areaData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dStr = d.toDateString();
    const label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

    const done = habits.filter((h) =>
      h.dates?.some((entry) => new Date(entry.date).toDateString() === dStr && entry.completed)
    ).length;

    const rate = habits.length === 0 ? 0 : Math.round((done / habits.length) * 100);

    return { day: label, "Done %": rate, habits: done };
  });

  return (
    <div className="page-container">
      <h1 className="page-title">Your Progress</h1>
      <p className="page-subtitle">Visualising your habit journey over the past week</p>

      {habits.length === 0 ? (
        <div className="glass-card empty-state">
          <div className="empty-icon">📈</div>
          <p>Every small step counts! Start your habit journey to see your progress bloom. 🌸✨</p>
        </div>
      ) : (
        <>
          {/* Area chart — daily completion rate */}
          <div className="glass-card" style={{ padding: "24px 20px", marginBottom: 24 }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 20, color: "var(--text-secondary)" }}>
              📅 Daily Completion Rate (Last 7 Days)
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<DarkTooltip />} />
                <Area type="monotone" dataKey="Done %" stroke="#7c3aed" strokeWidth={2.5} fill="url(#areaGrad)" dot={{ fill: "#7c3aed", r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart — per habit overall progress */}
          <div className="glass-card" style={{ padding: "24px 20px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 20, color: "var(--text-secondary)" }}>
              🏷 Per-Habit Overall Completion
            </h2>
            {/* Standalone SVG defs so #barGrad is available to recharts */}
            <svg width="0" height="0" style={{ position: "absolute" }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<DarkTooltip />} />
                <Legend wrapperStyle={{ color: "var(--text-secondary)", fontSize: 12 }} />
                <Bar dataKey="Completion %" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
