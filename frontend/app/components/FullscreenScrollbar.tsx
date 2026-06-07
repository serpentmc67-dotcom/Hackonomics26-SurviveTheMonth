'use client';

import { useEffect } from "react";

export default function FullscreenScrollbar() {
  useEffect(() => {
    const styleId = "fs-scrollbar-override";

    const applyStyles = () => {
      let style = document.getElementById(styleId) as HTMLStyleElement | null;

      if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        document.head.appendChild(style);
      }

      style.textContent = `
        html:fullscreen::-webkit-scrollbar,
        body:fullscreen::-webkit-scrollbar,
        html:-webkit-full-screen::-webkit-scrollbar,
        body:-webkit-full-screen::-webkit-scrollbar {
          width: 8px !important;
        }

        html:fullscreen::-webkit-scrollbar-track,
        body:fullscreen::-webkit-scrollbar-track,
        html:-webkit-full-screen::-webkit-scrollbar-track,
        body:-webkit-full-screen::-webkit-scrollbar-track {
          background: transparent !important;
        }

        html:fullscreen::-webkit-scrollbar-thumb,
        body:fullscreen::-webkit-scrollbar-thumb,
        html:-webkit-full-screen::-webkit-scrollbar-thumb,
        body:-webkit-full-screen::-webkit-scrollbar-thumb {
          background: #ff8c00 !important;
          border-radius: 999px !important;
        }

        html:fullscreen::-webkit-scrollbar-corner,
        body:fullscreen::-webkit-scrollbar-corner,
        html:-webkit-full-screen::-webkit-scrollbar-corner,
        body:-webkit-full-screen::-webkit-scrollbar-corner {
          background: transparent !important;
        }
      `;
    };

    applyStyles();

    document.addEventListener("fullscreenchange", applyStyles);

    return () => {
      document.removeEventListener("fullscreenchange", applyStyles);
    };
  }, []);

  return null;
}