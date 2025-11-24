import React from "react";

export default function About() {
  return (
    <div style={{ padding: 40, fontFamily: "Inter", maxWidth: 600, margin: "0 auto" }}>
      <div
  style={{
    display: "flex",
    gap: 12,
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 10,
  }}
>
  <a href="/progress" style={{ textDecoration: "none" }}>
    <button
      style={{
        padding: "8px 14px",
        borderRadius: 6,
        border: "none",
        background: "#0d6efd",
        color: "white",
      }}
    >
      View Progress
    </button>
  </a>



  <a href="/dashboard" style={{ textDecoration: "none" }}>
    <button
      style={{
        padding: "8px 14px",
        borderRadius: 6,
        border: "none",
        background: "#2fa8a2ff",
        color: "white",
      }}
    >
      Dashboard
    </button>
  </a>
</div>
      
      <h1> About Habit Tracker</h1>
      <p>
        This Habit Tracker helps you build consistency by tracking your habits daily.
        It allows you to create habits, mark them as completed, and see progress.
      </p>

      <p>Features:</p>
      <ul>
        <li>Add daily habits</li>
        <li>Mark habits as completed</li>
        <li>Drag & reorder habits</li>
        <li>Track progress</li>
      </ul>
    </div>
  );
}
