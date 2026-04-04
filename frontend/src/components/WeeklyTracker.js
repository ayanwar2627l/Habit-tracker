import React from "react";

// Shows the last 7 days as a mini heatmap row for a single habit
export default function WeeklyTracker({ dates }) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  // Build slots for the past 7 days including today
  const slots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dStr = d.toDateString();
    const isToday = i === 6;

    const match = dates?.find((entry) => new Date(entry.date).toDateString() === dStr);
    const completed = match?.completed === true;

    return {
      label: days[d.getDay()],
      completed,
      isToday,
    };
  });

  return (
    <div className="weekly-tracker">
      {slots.map((slot, idx) => (
        <div key={idx} className="day-cell">
          <span className="day-label">{slot.label}</span>
          <div
            className={[
              "day-dot",
              slot.completed ? "completed" : "",
              slot.isToday ? "today" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            title={slot.isToday ? "Today" : slot.label}
          />
        </div>
      ))}
    </div>
  );
}
