import React, { useState } from "react";

const CATEGORIES = ["General", "Fitness", "Learning", "Mindfulness", "Health"];

export default function HabitForm({ addHabit, onClose }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    await addHabit(title.trim(), category, Number(timerMinutes));
    setLoading(false);

    // Reset fields but stay open (user might want to add more habits)
    setTitle("");
    setCategory("General");
    setTimerMinutes(0);
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="input-group">
        <label htmlFor="habit-title">Habit Name</label>
        <input
          id="habit-title"
          className="form-input"
          type="text"
          placeholder="e.g. Read for 20 minutes"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="habit-category">Category</label>
        <select
          id="habit-category"
          className="form-input form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="habit-timer">
          Focus Timer (minutes) <span style={{ color: "var(--text-muted)" }}>— optional</span>
        </label>
        <input
          id="habit-timer"
          className="form-input"
          type="number"
          min="0"
          max="180"
          placeholder="0 = no timer"
          value={timerMinutes}
          onChange={(e) => setTimerMinutes(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
        {onClose && (
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding…" : "✚ Add Habit"}
        </button>
      </div>
    </form>
  );
}
