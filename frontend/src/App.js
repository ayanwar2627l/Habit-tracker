import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";
import Notes from "./pages/Notes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  return (
    <Router>
      {isLoggedIn && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/progress"  element={<ProtectedRoute><Progress /></ProtectedRoute>} />
        <Route path="/notes"     element={<ProtectedRoute><Notes /></ProtectedRoute>} />

        {/* Default: redirect to dashboard or login */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
