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
        ::-webkit-scrollbar { width: 8px !important; }
        ::-webkit-scrollbar-track { background: transparent !important; }
        ::-webkit-scrollbar-thumb { background: #ff8c00 !important; border-radius: 999px !important; }
        ::-webkit-scrollbar-thumb:hover { background: #ffa333 !important; }
        ::-webkit-scrollbar-button { display: none !important; }
        ::-webkit-scrollbar-corner { background: transparent !important; }
        * { scrollbar-width: thin !important; scrollbar-color: #ff8c00 transparent !important; }
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