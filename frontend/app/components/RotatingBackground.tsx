'use client';

import { useEffect, useState } from 'react';
import NightBackground from './NightBackground';
import FallBackground from './FallBackground';
import SpringBackground from './SpringBackground';

const BACKGROUNDS = ['fall', 'night', 'spring'] as const;
type BackgroundName = (typeof BACKGROUNDS)[number];

// Kept distinct from any auth-related keys on purpose - don't call
// sessionStorage.clear() elsewhere in the app, since that wipes this too.
const STORAGE_KEY = 'stm_last_background';

function pickBackground(): BackgroundName {
  const last = sessionStorage.getItem(STORAGE_KEY) as BackgroundName | null;
  const options = BACKGROUNDS.filter((b) => b !== last);
  const choice = options[Math.floor(Math.random() * options.length)];
  sessionStorage.setItem(STORAGE_KEY, choice);
  return choice;
}

export default function RotatingBackground({ children }: { children: React.ReactNode }) {
  const [bg, setBg] = useState<BackgroundName | null>(null);

  useEffect(() => {
    setBg(pickBackground());
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* background layer: letterboxed so the full 1920x1080 art is always
          visible and never cropped/zoomed, regardless of viewport shape */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 'min(100vw, 177.78vh)', // 177.78vh = 16:9 width for full viewport height
            height: 'min(100vh, 56.25vw)', // 56.25vw = 16:9 height for full viewport width
          }}
        >
          {bg === 'fall' && <FallBackground />}
          {bg === 'night' && <NightBackground />}
          {bg === 'spring' && <SpringBackground />}
        </div>
      </div>

      {/* page content sits on top */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}