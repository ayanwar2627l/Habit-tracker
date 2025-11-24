import React, { useEffect, useState } from "react";
import api from "../api";
import HabitForm from "../components/HabitForm";
import HabitCard from "../components/HabitCard";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const user = JSON.parse(localStorage.getItem("user"));

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    try {
      const res = await api.get("/habits");
      setHabits(res.data);
    } catch (err) {
      console.error("Fetch habits error:", err.response?.data || err.message);
      if (err.response?.status === 401) window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const addHabit = async (title) => {
    try {
      const res = await api.post("/habits", { title });
      setHabits((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Add habit error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Could not add habit");
    }
  };

  const toggleHabit = async (habit) => {
    try {
      const res = await api.put(`/habits/${habit._id}/toggle`);
      setHabits((prev) => prev.map((h) => (h._id === habit._id ? res.data : h)));
    } catch (err) {
      console.error("Toggle error:", err.response?.data || err.message);
      alert("Could not toggle habit");
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      await api.delete(`/habits/${habitId}`);
      setHabits((prev) => prev.filter((h) => h._id !== habitId));
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Could not delete habit");
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(habits);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setHabits(items);
  };

  if (loading)
    return (
      <div style={{ padding: 40, textAlign: "center", fontSize: 18 }}>
        Loading habits...
      </div>
    );

  //  PLACE THE NAVBAR + DASHBOARD RETURN INSIDE THE FUNCTION
  return (
    
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#bddf4fbb", minHeight: "100vh" }}>
      

      <div style={{ padding: "40px 20px", maxWidth: 800, margin: "0 auto" }}>
        <h1
            style={{
              textAlign: "center",
              fontSize: "32px",
              fontWeight: 700,
              marginBottom: "8px",
              color: "#0d3b66",
            }}
          >
          Hi, {user?.name || "User"} 👋
      </h1>
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



  <a href="/about" style={{ textDecoration: "none" }}>
    <button
      style={{
        padding: "8px 14px",
        borderRadius: 6,
        border: "none",
        background: "#6c757d",
        color: "white",
      }}
    >
      About
    </button>
  </a>
</div>
        <h1 style={{ textAlign: "center", marginBottom: 30, color: "#84169fff" }}>
          TRACK YOUR HABBIT HERE
        </h1>

        <div
          style={{
            background: "#1d9b9fff",
            padding: 20,
            borderRadius: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            marginBottom: 30,
            border: "1px solid #e0e0e0",
          }}
        >
          <HabitForm addHabit={addHabit} />
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="habits">
            {(provided) => (
              <ul
                style={{ listStyle: "none", padding: 0 }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {habits.map((habit, index) => (
                  <Draggable key={habit._id} draggableId={habit._id} index={index}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: "none",
                          marginBottom: 12,
                          borderRadius: 8,
                          background: snapshot.isDragging ? "#e3f2fd" : "#ffffff",
                          transition: "all 0.2s ease",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <HabitCard habit={habit} toggleHabit={toggleHabit} deleteHabit={deleteHabit} />
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
