'use client';
import { useEffect } from "react";

export default function FullscreenScrollbar() {
  useEffect(() => {
    const styleId = "fs-scrollbar-override";

    const inject = () => {
      document.getElementById(styleId)?.remove();
      if (!document.fullscreenElement) return;

      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        ::-webkit-scrollbar { width: 8px !important; }
        ::-webkit-scrollbar-track { background: transparent !important; }
        ::-webkit-scrollbar-thumb { background: #ff8c00 !important; border-radius: 999px !important; }
        ::-webkit-scrollbar-thumb:hover { background: #ffa333 !important; }
        ::-webkit-scrollbar-button { display: none !important; }
        ::-webkit-scrollbar-corner { background: transparent !important; }
        * { scrollbar-width: thin !important; scrollbar-color: #ff8c00 transparent !important; }
      `;
      document.fullscreenElement.appendChild(style);
    };

    const cleanup = () => document.getElementById(styleId)?.remove();

    const handler = () => {
      if (document.fullscreenElement) inject();
      else cleanup();
    };

    document.addEventListener("fullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      cleanup();
    };
  }, []);

  return null;
}