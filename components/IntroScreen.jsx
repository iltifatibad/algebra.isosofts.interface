import React, { useState, useEffect } from "react";

const MODULES = [
  { icon: "fa-shield-halved",   label: "H&S" },
  { icon: "fa-leaf",            label: "ENV" },
  { icon: "fa-scale-balanced",  label: "LEG" },
  { icon: "fa-chart-line",      label: "KPI" },
  { icon: "fa-file-lines",      label: "DOC" },
  { icon: "fa-rotate",          label: "MOC" },
  { icon: "fa-magnifying-glass",label: "AUD" },
  { icon: "fa-circle-check",    label: "ACT" },
];

const ISO_BADGES = ["ISO 9001", "ISO 14001", "ISO 45001"];

export default function IntroScreen({ onDone }) {
  // phase: "enter" → "show" → "exit"
  const [phase, setPhase] = useState("enter");
  const [barWidth, setBarWidth] = useState(0);
  const [badgeVisible, setBadgeVisible] = useState([false, false, false]);
  const [modulesVisible, setModulesVisible] = useState(false);

  useEffect(() => {
    // Stagger badge reveal
    ISO_BADGES.forEach((_, i) => {
      setTimeout(() => {
        setBadgeVisible(prev => { const n = [...prev]; n[i] = true; return n; });
      }, 400 + i * 180);
    });

    // Modules row
    setTimeout(() => setModulesVisible(true), 900);

    // Progress bar
    setTimeout(() => setBarWidth(100), 200);

    // Transition to exit
    setTimeout(() => setPhase("exit"), 2600);

    // Unmount
    setTimeout(() => onDone(), 3100);
  }, [onDone]);

  return (
    <div
      style={{
        position:        "fixed",
        inset:           0,
        zIndex:          9999,
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "center",
        justifyContent:  "center",
        background:      "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
        transition:      "opacity 0.5s ease-out, transform 0.5s ease-out",
        opacity:         phase === "exit" ? 0 : 1,
        transform:       phase === "exit" ? "scale(1.04)" : "scale(1)",
        pointerEvents:   phase === "exit" ? "none" : "all",
        overflow:        "hidden",
      }}
    >
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(59,130,246,0.08) 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }} />

      {/* Glow orbs */}
      <div style={{ position:"absolute", top:"20%", left:"15%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"20%", right:"15%", width:250, height:250, borderRadius:"50%", background:"radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents:"none" }} />

      {/* Main content */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:0, animation: "introFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>

        {/* Logo mark */}
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20,
          boxShadow: "0 0 0 1px rgba(99,102,241,0.4), 0 0 40px rgba(59,130,246,0.3)",
          animation: "introLogoSpin 0.8s cubic-bezier(0.16,1,0.3,1) both",
        }}>
          <i className="fas fa-circle-nodes" style={{ fontSize: 32, color: "#fff" }} />
        </div>

        {/* Brand name */}
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <h1 style={{
            fontSize: 48, fontWeight: 800, margin: 0, letterSpacing: "-1px",
            background: "linear-gradient(90deg, #60a5fa, #a5b4fc, #60a5fa)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            animation: "introShimmer 2s linear infinite",
          }}>
            Algebra
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 15, color: "rgba(148,163,184,0.9)", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 500 }}>
            ISOSofts Platform
          </p>
        </div>

        {/* Tagline */}
        <p style={{ margin: "16px 0 0", fontSize: 13, color: "rgba(100,116,139,0.8)", letterSpacing: "0.05em", textAlign: "center" }}>
          Integrated QHSE Management System
        </p>

        {/* ISO badges */}
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          {ISO_BADGES.map((b, i) => (
            <span key={b} style={{
              padding: "4px 12px", borderRadius: 999,
              border: "1px solid rgba(59,130,246,0.4)",
              color: "#93c5fd", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
              background: "rgba(59,130,246,0.08)",
              transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)",
              opacity: badgeVisible[i] ? 1 : 0,
              transform: badgeVisible[i] ? "translateY(0)" : "translateY(8px)",
            }}>
              {b}
            </span>
          ))}
        </div>

        {/* Module icons row */}
        <div style={{
          display: "flex", gap: 12, marginTop: 30,
          transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
          opacity: modulesVisible ? 1 : 0,
          transform: modulesVisible ? "translateY(0)" : "translateY(12px)",
        }}>
          {MODULES.map((m, i) => (
            <div key={m.label} title={m.label} style={{
              width: 38, height: 38, borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(59,130,246,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: 2,
              transition: `opacity 0.3s ease ${i * 50}ms, transform 0.3s cubic-bezier(0.16,1,0.3,1) ${i * 50}ms`,
              opacity: modulesVisible ? 1 : 0,
              transform: modulesVisible ? "scale(1)" : "scale(0.8)",
            }}>
              <i className={`fas ${m.icon}`} style={{ fontSize: 13, color: "#60a5fa" }} />
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ width: 240, marginTop: 36, height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2,
            background: "linear-gradient(90deg, #3b82f6, #6366f1)",
            width: `${barWidth}%`,
            transition: `width ${2400}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            boxShadow: "0 0 8px rgba(99,102,241,0.6)",
          }} />
        </div>

        {/* Loading text */}
        <p style={{ margin: "12px 0 0", fontSize: 11, color: "rgba(100,116,139,0.6)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Loading your workspace
        </p>
      </div>

      <style>{`
        @keyframes introFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes introLogoSpin {
          from { opacity: 0; transform: rotate(-15deg) scale(0.7); }
          to   { opacity: 1; transform: rotate(0deg) scale(1); }
        }
        @keyframes introShimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
