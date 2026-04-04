import React, { useState, useEffect, useCallback } from "react";
import api from "../api";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Fetch notes:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    try {
      const res = await api.post("/notes", { title, content });
      setNotes([res.data, ...notes]);
      setTitle("");
      setContent("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Add note:", err.message);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete note:", err.message);
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      <div className="notes-container">
        <h1 className="page-title">Digital Notebook 📓</h1>
        <p className="page-subtitle">Sketch your future plans and deep-work thoughts</p>

        <div className="notebook-paper">
          {/* Spiral binder on the left */}
          <div className="notebook-spiral">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="spiral-ring"></div>
            ))}
          </div>

          {showSuccess && (
            <div className="memory-saved-badge">
              Memory Committed! ✨💖
            </div>
          )}

          <div className="notebook-content">
            <form onSubmit={handleAddNote} style={{ marginBottom: 40 }}>
              <input 
                className="notebook-input" 
                placeholder="PROMPT: What's the next big move?" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                style={{ fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: 32 }}
              />
              <textarea 
                className="notebook-textarea" 
                placeholder="Log your detailed plans here... 
Type on any line you like!
The lines are your guide. ✨"
                rows="8"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                spellCheck="false"
              />
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, marginTop: 12 }}>
                <button type="submit" className="btn btn-primary" style={{ clipPath: "none", borderRadius: 4 }}>
                  Commit to Memory
                </button>
              </div>
            </form>

            <div className="notes-list">
              {notes.length === 0 ? (
                <div className="empty-state" style={{ padding: "40px 0" }}>
                  <div className="empty-icon" style={{ opacity: 0.3 }}>🖊️</div>
                  <p>Your future is a blank canvas, let's paint it with big dreams! 🎨✨</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note._id} className="note-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <h3 style={{ margin: 0, fontSize: "1rem", color: "var(--accent-light)", fontWeight: 700 }}>{note.title}</h3>
                      <button 
                        className="btn btn-ghost" 
                        style={{ padding: "4px 8px", fontSize: "0.6rem", border: "none" }}
                        onClick={() => handleDeleteNote(note._id)}
                      >
                        [ DELETE ]
                      </button>
                    </div>
                    <p style={{ marginTop: 8, fontSize: "0.9rem", color: "var(--text-secondary)", whiteSpace: "pre-wrap", opacity: 0.8 }}>
                      {note.content}
                    </p>
                    <div style={{ marginTop: 8, fontSize: "0.65rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                      LOGGED: {new Date(note.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
