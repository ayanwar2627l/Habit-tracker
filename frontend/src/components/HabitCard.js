// src/components/HabitCard.js
import React from "react";

export default function HabitCard({ habit, toggleHabit, deleteHabit }) {

  // Determine if habit is completed today
  const todayEntry = habit.dates?.find(
    (d) => new Date(d.date).toDateString() === new Date().toDateString()
  );
  const completedToday = !!todayEntry?.completed;

  // Calculate Progress (% Completed)
  // const totalDays = habit.dates?.length || 0;
  // const completedDays = habit.dates?.filter((d) => d.completed).length || 0;
  // const progress = totalDays === 0 ? 0 : Math.round((completedDays / totalDays) * 100);

  // Calculate Streak 
  // function calculateStreak() {
  //   if (!habit.dates || habit.dates.length === 0) return 0;

  //   const sorted = [...habit.dates].sort((a, b) => new Date(b.date) - new Date(a.date));
  //   let streak = 0;
  //   let previous = new Date();

  //   for (let i of sorted) {
  //     const entryDate = new Date(i.date);
  //     const difference = (previous - entryDate) / (1000 * 60 * 60 * 24);

  //     if (i.completed && difference <= 1.3) {
  //       streak++;
  //       previous = entryDate;
  //     } else break;
  //   }

  //   return streak;
  // }

  // const streak = calculateStreak();

  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "14px 16px",
        borderRadius: 10,
        marginBottom: 12,
        background: "#ffffff",
        border: "1px solid #ddd",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >

      {/* Habit Title + Streak */}
      <div style={{ flex: 1, textAlign: "left" }}>
        <span
          style={{
            textDecoration: completedToday ? "line-through" : "none",
            fontSize: 18,
            fontWeight: 600,
            color: "#111",
          }}
        >
          {habit.title}
        </span>

        {/* <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>
           Streak: {streak} days
        </div> */}

        {/* Progress Bar */}
        {/* <div style={{ marginTop: 8 }}> */}
          {/* <div style={{ background: "#eee", width: "100%", height: 8, borderRadius: 5 }}> */}
            {/* <div
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: 5,
                background: "#3b82f6",
                transition: "0.4s",
              }}
            ></div> */}
          {/* </div> */}
          {/* <span style={{ fontSize: 12, color: "#333" }}>{progress}% completed</span> */}
        {/* </div> */}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
        <button
          onClick={() => toggleHabit(habit)}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "none",
            backgroundColor: completedToday ? "#f59e0b" : "#10b981",
            color: "white",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          {completedToday ? "Undo" : "Complete"}
        </button>

        <button
          onClick={() => {
            if (window.confirm(`Delete habit "${habit.title}"?`))
              deleteHabit(habit._id);
          }}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "none",
            backgroundColor: "#ef4444",
            color: "white",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
  
}
