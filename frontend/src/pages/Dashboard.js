import React, { useEffect, useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import api from "../api";
import HabitCard from "../components/HabitCard";
import HabitForm from "../components/HabitForm";
import StatsBar from "../components/StatsBar";
import Timer from "../components/Timer";

function getUser() {
  try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
}

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTimer, setActiveTimer] = useState(null); // habit being timed
  const user = getUser();

  const fetchHabits = useCallback(async () => {
    try {
      const res = await api.get("/habits");
      setHabits(res.data);
    } catch (err) {
      console.error("Fetch habits:", err.response?.data || err.message);
      if (err.response?.status === 401) window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const addHabit = async (title, category, timerMinutes) => {
    try {
      const res = await api.post("/habits", { title, category, timerMinutes });
      setHabits((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Add habit:", err.response?.data || err.message);
    }
  };

  const toggleHabit = async (habit) => {
    try {
      const res = await api.put(`/habits/${habit._id}/toggle`);
      setHabits((prev) => prev.map((h) => (h._id === habit._id ? res.data : h)));
    } catch (err) {
      console.error("Toggle habit:", err.response?.data || err.message);
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      await api.delete(`/habits/${habitId}`);
      setHabits((prev) => prev.filter((h) => h._id !== habitId));
      if (activeTimer?._id === habitId) setActiveTimer(null);
    } catch (err) {
      console.error("Delete habit:", err.response?.data || err.message);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = [...habits];
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setHabits(items);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner" />
        <span>Loading your habits…</span>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="dashboard-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div style={{ flex: 1, minWidth: "100%", textAlign: "center", marginBottom: 8 }}>
          <h1 className="page-title">
            Hey, {user?.name || "there"} 👋
          </h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            ✚ New Habit
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsBar habits={habits} />

      {/* Habit list */}
      {habits.length === 0 ? (
        <div className="glass-card empty-state">
          <div className="empty-icon">🌱</div>
          <p>Your journey of a thousand miles begins with a single habit! 🌈✨</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ marginTop: 12 }}>
            Plant Your First Habit
          </button>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="habit-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {habits.map((habit, index) => (
                  <Draggable key={habit._id} draggableId={habit._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          opacity: snapshot.isDragging ? 0.85 : 1,
                          ...provided.draggableProps.style,
                        }}
                      >
                        <HabitCard
                          habit={habit}
                          toggleHabit={toggleHabit}
                          deleteHabit={deleteHabit}
                          onTimerClick={(h) => setActiveTimer(h)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Add Habit Modal */}
      {showForm && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowForm(false)}>
          <div className="glass-card modal-card">
            <div className="modal-header">
              <h2 className="modal-title">New Habit</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <HabitForm addHabit={addHabit} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Timer slide-up panel */}
      {activeTimer && (
        <Timer habit={activeTimer} onClose={() => setActiveTimer(null)} />
      )}
    </div>
  );
}
