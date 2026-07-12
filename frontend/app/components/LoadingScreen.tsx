"use client";

import { useEffect, useState } from "react";
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["700"],
});

const messages = [
  "Initializing Simulation...",
  "Generating Economy...",
  "Preparing Financial Markets...",
  "Calculating Starting Budget...",
  "Loading Player Profile...",
  "Synchronizing Save Data...",
  "Launching Simulation..."
];

export default function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity:0;
          }
          to {
            opacity:1;
          }
        }

        @keyframes barMove {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(320%);
          }
        }

        @keyframes pulse {
          0%,100% {
            opacity:0.75;
          }
          50% {
            opacity:1;
          }
        }

        @keyframes glow {
          0%,100% {
            text-shadow:0 0 18px rgba(255,140,0,.35);
          }
          50% {
            text-shadow:0 0 40px rgba(255,140,0,.8);
          }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#050505",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          animation: "fadeIn .4s ease",
          zIndex: 999999,
        }}
      >
        <div
          style={{
            width: "min(500px,90vw)",
            textAlign: "center",
          }}
        >
          <h1
            className={fredoka.className}
            style={{
              fontSize: "clamp(2.8rem,7vw,4.6rem)",
              color: "#ff8c00",
              letterSpacing: ".15em",
              marginBottom: ".5rem",
              animation: "glow 2.5s ease infinite",
            }}
          >
            SURVIVE
            <br />
            THE MONTH
          </h1>

          <div
            style={{
              color: "#8b8b8b",
              fontSize: ".95rem",
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: "2.4rem",
            }}
          >
            {messages[messageIndex]}
          </div>

          <div
            style={{
              width: "100%",
              height: "10px",
              background: "#1b1b1b",
              borderRadius: "999px",
              overflow: "hidden",
              border: "1px solid rgba(255,140,0,.2)",
            }}
          >
            <div
              style={{
                width: "30%",
                height: "100%",
                borderRadius: "999px",
                background:
                  "linear-gradient(90deg,#ff8c00,#ffb347,#ff8c00)",
                animation: "barMove 1.2s linear infinite",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "1.2rem",
              color: "#666",
              fontSize: ".85rem",
              animation: "pulse 1.8s infinite",
            }}
          >
            Please wait...
          </div>
        </div>
      </div>
    </>
  );
}