import React, { useEffect, useRef } from "react";

// Animates a number from 0 to the target value over ~800ms
function useCountUp(target) {
  const ref = useRef(null);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const step = Math.ceil(target / (duration / 16));

    const tick = () => {
      start = Math.min(start + step, target);
      if (ref.current) ref.current.textContent = start;
      if (start < target) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target]);

  return ref;
}

function StatCard({ icon, value, label }) {
  const numRef = useCountUp(value);

  return (
    <div className="glass-card stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value" ref={numRef}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function StatsBar({ habits }) {
  const todayStr = new Date().toDateString();

  const total = habits.length;

  const todayDone = habits.filter((h) =>
    h.dates?.some((d) => new Date(d.date).toDateString() === todayStr && d.completed)
  ).length;

  const completionRate = total === 0 ? 0 : Math.round((todayDone / total) * 100);

  // Simple streak: consecutive days where at least one habit was completed
  const longestStreak = habits.reduce((max, h) => {
    let streak = 0;
    let best = 0;
    const sorted = [...(h.dates || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

    sorted.forEach((entry) => {
      if (entry.completed) {
        streak++;
        best = Math.max(best, streak);
      } else {
        streak = 0;
      }
    });

    return Math.max(max, best);
  }, 0);

  return (
    <div className="stats-grid">
      <StatCard icon="🎯" value={total} label="Total Habits" />
      <StatCard icon="✅" value={completionRate} label="Today's Rate %" />
      <StatCard icon="🔥" value={longestStreak} label="Best Streak" />
    </div>
  );
}
