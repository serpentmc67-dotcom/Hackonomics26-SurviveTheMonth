'use client';

import { useEffect, useState } from 'react';
import NightBackground from './NightBackground';
import FallBackground from './FallBackground';
import SpringBackground from './SpringBackground';

const BACKGROUNDS = ['fall', 'night', 'spring'] as const;
type BackgroundName = (typeof BACKGROUNDS)[number];

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
      {/* background layer: image + birds/lights, always behind everything else */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        {bg === 'fall' && <FallBackground />}
        {bg === 'night' && <NightBackground />}
        {bg === 'spring' && <SpringBackground />}
      </div>

      {/* page content sits on top */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}