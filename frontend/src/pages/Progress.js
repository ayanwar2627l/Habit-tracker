// src/pages/Progress.js
import React, { useEffect, useState } from "react";
import api from "../api";

export default function Progress() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxStreak, setMaxStreak] = useState(0);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await api.get("/habits");
        setHabits(res.data);

        // ✅ Corrected Streak Calculation
        let max = 0;
        res.data.forEach((habit) => {
          let streak = 0;
          let tempMax = 0;

          const sortedEntries = habit.dates.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );

          for (let i = 0; i < sortedEntries.length; i++) {
            if (sortedEntries[i].completed) streak++;
            else streak = 0;
            if (streak > tempMax) tempMax = streak;
          }

          if (tempMax > max) max = tempMax;
        });

        setMaxStreak(max);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading progress...</div>;

  return (
    <div style={{ padding: 40, fontFamily: "'Inter', sans-serif" }}>

      {/* buttons for nav */}
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          marginBottom: 20,
          marginTop: 10,
        }}
      >
        <a href="/about" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "8px 14px",
              borderRadius: 6,
              border: "none",
              background: "#047043ff",
              color: "white",
            }}
          >
            About
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

      <h2 style={{ textAlign: "center", marginBottom: 20, color: "#1976d2" }}>
        Your Progress
      </h2>

      <h3 style={{ textAlign: "center", marginBottom: 20 }}>
        Max Streak Achieved: <strong>{maxStreak}</strong> days 🔥
      </h3>

      {habits.map((habit) => {
        const completedCount = habit.dates.filter((d) => d.completed).length;
        const totalCount = habit.dates.length || 1;

        //calculating progress
        const progress = Math.round((completedCount / totalCount) * 100);

        return (
          <div
            key={habit._id}
            style={{
              marginBottom: 20,
              padding: 20,
              borderRadius: 10,
              background: "#e0f7fa",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h4 style={{ marginBottom: 10, fontWeight: "bold" }}>
              {habit.title}
            </h4>

            {/* ✅ Added Days Completed */}
            <p style={{ marginBottom: 8 }}>
              Days Completed: <strong>{completedCount}</strong>
            </p>

            <div
              style={{
                height: 20,
                width: "100%",
                background: "#ccc",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  background: "#1976d2",
                  height: "100%",
                }}
              ></div>
            </div>
            <p style={{ marginTop: 5 }}>{progress}% completed</p>
          </div>
        );
      })}
    </div>
  );
}
