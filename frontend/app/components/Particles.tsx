'use client';
import { useEffect } from "react";

export default function Particles() {
  useEffect(() => {
    const container = document.getElementById("particles-container");
    if (!container) return;

    // Clear any existing particles (e.g. on hot reload)
    container.innerHTML = "";

    for (let i = 0; i < 25; i++) {
      const p = document.createElement("div");
      const size = 6 + Math.random() * 14;
      const color = Math.random() > 0.5 ? "#ff9a42" : "#ff6b00";

      p.style.cssText = `
        position: absolute;
        border-radius: 50%;
        opacity: 0;
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        background: ${color};
        box-shadow: 0 0 ${size * 2}px ${size}px ${color}88;
        animation: particleFloat ${3 + Math.random() * 4}s ${Math.random() * 5}s linear  infinite;
        pointer-events: none;
      `;
      container.appendChild(p);
    }
  }, []);

  return (
    <>
      <style>{`
        @keyframes particleFloat {
          0%   { opacity: 0;    transform: translateY(110vh) scale(0.5); }
          15%  { opacity: 0.6; }
          85%  { opacity: 0.35; }
          100% { opacity: 0;    transform: translateY(-20vh) scale(1.3); }
        }
      `}</style>

      <div
        id="particles-container"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      />
    </>
  );
}