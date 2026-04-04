import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "../api";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Timer({ habit, onClose }) {
  const totalSeconds = (habit.timerMinutes || 25) * 60;

  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [musicFileName, setMusicFileName] = useState("");
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Clean up interval and audio on unmount
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleFinish = useCallback(async () => {
    setRunning(false);
    setDone(true);
    
    // Stop music
    if (audioRef.current) {
      audioRef.current.pause();
    }

    playChime();
    
    // Optional: add a small visual celebration alert
    setTimeout(() => {
      alert(`⏱ Time's up for: ${habit.title}! Great job.`);
    }, 100);
  }, [habit.title]);

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.5);
        osc.start(ctx.currentTime + i * 0.2);
        osc.stop(ctx.currentTime + i * 0.2 + 0.5);
      });
    } catch {
      // AudioContext not available — silently skip
    }
  };

  const handleMusicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMusicFileName(file.name);
      const url = URL.createObjectURL(file);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(url);
      audioRef.current.loop = true;
    }
  };

  const start = () => {
    if (done) return;
    setRunning(true);

    if (audioRef.current) {
      audioRef.current.play().catch(err => console.error("Audio playback failed:", err));
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setDone(true);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setDone(false);
    setSecondsLeft(totalSeconds);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onClose();
  };

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  const progress = secondsLeft / totalSeconds;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="timer-panel">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Focus Timer
          </div>
          <div style={{ fontWeight: 700, fontSize: "1rem" }}>{habit.title}</div>
        </div>
        <button className="close-btn" onClick={handleClose}>✕</button>
      </div>

      <div className="timer-ring-container">
        <div style={{ position: "relative", width: 140, height: 140 }}>
          <svg width="140" height="140" className="timer-ring">
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <circle className="timer-ring-bg" cx="70" cy="70" r={RADIUS} />
            <circle
              className="timer-ring-progress"
              cx="70" cy="70" r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
            />
          </svg>

          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            {done ? (
              <div className="celebration" style={{ fontSize: "2rem" }} aria-label="Timer Finished">🎉</div>
            ) : (
              <div className="timer-text" aria-live="polite" aria-atomic="true">
                <span className="sr-only">Time remaining: </span>
                {minutes}:{seconds}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Music Selector - shown before starting or while running */}
      {!done && (
        <div className="music-selector">
          <div className="music-label">
            <span>🎵 Practice Music</span>
            {running && musicFileName && (
              <div className="music-playing-indicator">
                <div className="music-bar"></div>
                <div className="music-bar"></div>
                <div className="music-bar"></div>
              </div>
            )}
          </div>
          <div className="music-input-wrapper">
            <input 
              type="file" 
              accept="audio/*" 
              className="music-input" 
              onChange={handleMusicChange} 
              disabled={running}
            />
            <div className="music-file-display">
              <span>{musicFileName || "Select from local device..."}</span>
              <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>{running ? "Playing..." : "Browse"}</span>
            </div>
          </div>
        </div>
      )}

      {done && (
        <p style={{ textAlign: "center", color: "var(--success-light)", fontWeight: 600, marginBottom: 12 }}>
          Time's up! Great work 🎉
        </p>
      )}

      <div className="timer-controls">
        {!running && !done && (
          <button className="btn btn-primary" onClick={start}>▶ Start</button>
        )}
        {running && (
          <button className="btn btn-ghost" onClick={pause}>⏸ Pause</button>
        )}
        <button className="btn btn-ghost" onClick={reset}>↺ Reset</button>
        <button className="btn btn-ghost" onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}
