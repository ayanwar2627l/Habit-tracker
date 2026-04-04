import React from "react";
import { Link, useLocation } from "react-router-dom";

// Helper to grab the user's name from localStorage
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export default function Navbar() {
  const location = useLocation();
  const user = getUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-logo" style={{ textDecoration: "none" }}>
          ⚡ HabitTrace
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard" className={isActive("/dashboard") || isActive("/")}>
            Dashboard
          </Link>
          <Link to="/progress" className={isActive("/progress")}>
            Progress
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "8px", paddingLeft: "8px", borderLeft: "1px solid var(--border)" }}>
            {/* Notebook icon button */}
            <Link 
              to="/notes" 
              className={`notif-btn ${isActive("/notes") === "nav-link active" ? "enabled" : "disabled"}`}
              title="Notebook (Future Tasks)"
              aria-label="Notebook"
              style={{ fontSize: "1.2rem", textDecoration: "none" }}
            >
              📓
            </Link>

            {user && (
              <button 
                onClick={handleLogout} 
                className="notif-btn disabled" 
                title="Logout"
                aria-label="Logout"
                style={{ fontSize: "1.1rem" }}
              >
                ⏻
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
