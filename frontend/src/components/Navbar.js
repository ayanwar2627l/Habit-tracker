import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{
       background: "#2dd298ff",
        color:"black", 
        padding: "10px" 
       }}>
      <h2 >Habit Tracker</h2>
      <div>
        <Link to="/" style={{ color: "white", margin: "0 10px" }}>Dashboard</Link>
        <Link to="/login" style={{ color: "white", margin: "0 10px" }}>Login</Link>
        <Link to="/register" style={{ color: "white", margin: "0 10px" }}>Register</Link>
      </div>
    </nav>
  );
}
