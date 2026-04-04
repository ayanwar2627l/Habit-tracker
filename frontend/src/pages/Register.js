import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function PasswordStrength({ password }) {
  if (!password) return null;

  const requirements = [
    { label: "8+ characters 📏", test: password.length >= 8 },
    { label: "One capital letter 🔠", test: /[A-Z]/.test(password) },
    { label: "One number 🔢", test: /[0-9]/.test(password) },
  ];

  const strength = requirements.filter(r => r.test).length;
  const colors = ["#ef4444", "#fbbf24", "#10b981"];
  const labels = ["Keep going! 💪", "Getting there! ✨", "Perfect! 🌟"];

  return (
    <div style={{ marginTop: 12, padding: "12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid var(--border)" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            flex: 1, height: 6, borderRadius: 3,
            background: i < strength ? colors[strength - 1] : "rgba(255,255,255,0.1)",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            boxShadow: i < strength ? `0 0 10px ${colors[strength - 1]}44` : "none"
          }} />
        ))}
      </div>
      
      <div style={{ fontSize: "0.8rem", fontWeight: 600, color: colors[strength - 1] || "var(--text-muted)", marginBottom: 8 }}>
        {labels[strength - 1] || "Start typing... ⌨️"}
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        {requirements.map((req, i) => (
          <li key={i} style={{ 
            fontSize: "0.75rem", 
            display: "flex", 
            alignItems: "center", 
            gap: 6,
            color: req.test ? "var(--success-light)" : "var(--text-muted)",
            opacity: req.test ? 1 : 0.6,
            transition: "all 0.3s ease"
          }}>
            <span style={{ fontSize: "0.9rem" }}>{req.test ? "✅" : "⭕"}</span>
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Register() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/users/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Start building better habits today</p>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: "0.875rem",
            color: "var(--danger)",
            marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              className="form-input"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              className="form-input"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <PasswordStrength password={password} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: "center", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent-light)", textDecoration: "none", fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
