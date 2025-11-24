import React, { useState } from "react";

export default function HabitForm({ addHabit }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    addHabit(title);
    setTitle("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}
    >
      <input
        type="text"
        placeholder="New habit"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      <button
        type="submit"
        style={{ padding: "10px 20px", border: "none", borderRadius: "5px", backgroundColor: "#4f46e5", color: "white", cursor: "pointer" }}
      >
        Add Habit
      </button>
    </form>
  );
}
