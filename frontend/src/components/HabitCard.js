import React, { useState } from "react";
import WeeklyTracker from "./WeeklyTracker";

const CATEGORY_BADGE = {
  fitness:     "badge badge-fitness",
  learning:    "badge badge-learning",
  mindfulness: "badge badge-mindfulness",
  health:      "badge badge-health",
  general:     "badge badge-general",
};

function getCategoryClass(cat) {
  return CATEGORY_BADGE[(cat || "general").toLowerCase()] || "badge badge-general";
}

function isTodayDone(dates) {
  const todayStr = new Date().toDateString();
  return dates?.some((d) => new Date(d.date).toDateString() === todayStr && d.completed);
}

export default function HabitCard({ habit, toggleHabit, deleteHabit, onTimerClick }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const todayDone = isTodayDone(habit.dates);

  const handleDelete = () => {
    if (confirmDelete) {
      deleteHabit(habit._id);
    } else {
      setConfirmDelete(true);
      // Auto-reset the confirm state after 3 seconds
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="glass-card habit-card" style={{ textAlign: "center" }}>
      {/* Top row: checkbox, title, category badge */}
      <div className="habit-card-header" style={{ justifyContent: "center" }}>
        <button
          className={`habit-checkbox ${todayDone ? "checked" : ""}`}
          onClick={() => toggleHabit(habit)}
          aria-label={todayDone ? "Mark habit as not completed for today" : "Mark habit as completed for today"}
          aria-checked={todayDone}
          role="checkbox"
        />

        <div style={{ flex: "0 1 auto", minWidth: 0 }}>
          <div
            className="habit-title"
            style={{ 
              textDecoration: todayDone ? "line-through" : "none", 
              color: todayDone ? "var(--text-muted)" : "var(--text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {habit.title}
          </div>
        </div>

        <span className={getCategoryClass(habit.category)} aria-label={`Category: ${habit.category || "General"}`}>
          {habit.category || "General"}
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-wrap" style={{ marginTop: 12 }} aria-hidden="true">
        <div className="progress-bar-fill" style={{ width: `${habit.progress || 0}%` }} />
      </div>
      <span className="sr-only">Overall progress: {habit.progress || 0}%</span>

      {/* 7-day tracker */}
      <WeeklyTracker dates={habit.dates} />

      {/* Action row */}
      <div className="habit-actions">
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", flex: 1 }}>
          {habit.progress || 0}% overall
        </span>

        {habit.timerMinutes > 0 && (
          <button
            className="btn btn-ghost"
            style={{ padding: "5px 12px", fontSize: "0.8rem" }}
            onClick={() => onTimerClick(habit)}
            aria-label={`Start ${habit.timerMinutes} minute focus timer for ${habit.title}`}
          >
            <span aria-hidden="true">⏱</span> {habit.timerMinutes}m
          </button>
        )}

        <button
          className={`btn ${confirmDelete ? "btn-danger" : "btn-ghost"}`}
          style={{ padding: "5px 12px", fontSize: "0.8rem" }}
          onClick={handleDelete}
          aria-label={confirmDelete ? "Confirm deletion of habit" : "Delete habit"}
        >
          <span aria-hidden="true">{confirmDelete ? "Confirm?" : "🗑"}</span>
          {!confirmDelete && <span className="sr-only">Delete Habit</span>}
        </button>
      </div>
    </div>
  );
}
