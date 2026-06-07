'use client';
import { useEffect } from "react";

export default function FullscreenScrollbar() {
  useEffect(() => {
    const styleId = "fullscreen-scrollbar-style";

    const inject = () => {
      document.getElementById(styleId)?.remove();

      if (!document.fullscreenElement) return;

      // Inject into <head> so it applies to everything inside fullscreen
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        ::-webkit-scrollbar { width: 8px !important; }
        ::-webkit-scrollbar-track { background: transparent !important; margin: 6px 0 !important; }
        ::-webkit-scrollbar-thumb { background: #ff8c00 !important; border-radius: 999px !important; border: none !important; }
        ::-webkit-scrollbar-thumb:hover { background: #ffa333 !important; }
        ::-webkit-scrollbar-button { display: none !important; width: 0 !important; height: 0 !important; }
        ::-webkit-scrollbar-corner { background: transparent !important; }
        * { scrollbar-width: thin !important; scrollbar-color: #ff8c00 transparent !important; }
      `;
      document.head.appendChild(style);
    };

    const cleanup = () => {
      document.getElementById(styleId)?.remove();
    };

    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) inject();
      else cleanup();
    });

    return () => {
      cleanup();
    };
  }, []);

  return null;
}