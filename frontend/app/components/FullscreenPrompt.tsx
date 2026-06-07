'use client';
import { useEffect, useState } from "react";

export default function FullscreenPrompt() {
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [retracting, setRetracting] = useState(false);

  useEffect(() => {
    const check = () => {
      const full = !!document.fullscreenElement;
      setIsFullscreen(full);
      if (!full) setRetracting(false); // reset so button slides back in
    };
    setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", check);
    return () => document.removeEventListener("fullscreenchange", check);
  }, []);

  const goFullscreen = () => {
    setRetracting(true);
    setTimeout(() => {
      document.getElementById("fullscreen-root")?.requestFullscreen?.();
    }, 400); // slight delay so retract animation plays first
  };

  if (isFullscreen && !retracting) return null;

  return (
    <>
      <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow:
              0 0 12px 4px rgba(255,140,0,0.5),
              0 0 35px 12px rgba(255,100,0,0.2),
              0 0 60px 20px rgba(255,80,0,0.08);
          }
          50% {
            box-shadow:
              0 0 20px 8px rgba(255,160,0,0.8),
              0 0 55px 20px rgba(255,100,0,0.35),
              0 0 90px 35px rgba(255,80,0,0.15);
          }
        }
        @keyframes popPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.07); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-50%) translateX(-40px); }
          to { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
        @keyframes retract {
          from { opacity: 1; transform: translateY(-50%) translateX(0); }
          to { opacity: 0; transform: translateY(-50%) translateX(-60px); }
        }
        .fs-pill {
          animation:
            fadeSlideIn 0.7s cubic-bezier(0.22,1,0.36,1) forwards,
            pulseGlow 2.5s ease-in-out 0.7s infinite;
        }
        .fs-pill-retract {
          animation: retract 0.4s cubic-bezier(0.4,0,1,1) forwards !important;
        }
        .fs-pop { animation: popPulse 2s ease-in-out infinite; }
      `}</style>

      {/* Button — vertically centered, this is the priority */}
      <div
        className={`fs-pill${retracting ? " fs-pill-retract" : ""}`}
        style={{
          position: "fixed",
          left: "0",
          top: "50%",
          zIndex: 99998,
          cursor: "pointer",
          background: "linear-gradient(165deg, #ff9a2e 0%, #ff6500 55%, #e04d00 100%)",
          borderRadius: "0 18px 18px 0",
          width: "52px",
          padding: "18px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "14px",
          border: "1px solid rgba(255,180,80,0.25)",
          borderLeft: "none",
        }}
        onClick={goFullscreen}
      >
        <div className="fs-pop">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.92)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </div>

        <div
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            color: "white",
            fontSize: "0.6rem",
            fontWeight: "800",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: "system-ui, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          Go Fullscreen
        </div>
      </div>

    </>
  );
}