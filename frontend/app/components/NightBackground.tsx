'use client';

type WindowBox = {
  left: number; // % of container width
  top: number; // % of container height
  width: number; // % of container width
  height: number; // % of container height
  delay: number; // seconds into the 10s loop when this box starts flashing
};

// Positions are mapped from the actual window panes in /public/backgrounds/night.png
// (1920x1080 source). Group A (top floor, left + right) flashes together with
// almost no delay between them. Group B (2nd + 3rd floor, left) flashes with a
// ~1.3s gap between each other, later in the loop.
const WINDOWS: WindowBox[] = [
  { left: 10.16, top: 23.6, width: 4.7, height: 8.3, delay: 0 },     // Group A - box 1
  { left: 29.27, top: 23.6, width: 4.7, height: 8.3, delay: 0.15 }, // Group A - box 2
  { left: 9.64, top: 39.35, width: 4.7, height: 8.3, delay: 4.5 },  // Group B - box 3
  { left: 10.16, top: 52.3, width: 4.7, height: 8.3, delay: 5.9 },  // Group B - box 4
];

const LOOP_SECONDS = 10;

export default function NightBackground() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1920 / 1080',
        overflow: 'hidden',
        backgroundImage: 'url(/backgrounds/night.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {WINDOWS.map((w, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${w.left}%`,
            top: `${w.top}%`,
            width: `${w.width}%`,
            height: `${w.height}%`,
            background: '#fff4c2',
            borderRadius: '2px',
            opacity: 0,
            animation: `neon-flash ${LOOP_SECONDS}s ease-in-out ${w.delay}s infinite`,
          }}
        />
      ))}

      <style jsx>{`
        /* Timeline within the 10s loop: ~0.2s ramp up, holds bright for ~2s,
           then fades out over ~1.3s, then stays dark until it comes back around. */
        @keyframes neon-flash {
          0% { opacity: 0; box-shadow: none; }
          2% {
            opacity: 0.95;
            box-shadow:
              0 0 6px 2px rgba(255, 244, 194, 0.9),
              0 0 22px 10px rgba(255, 210, 120, 0.55),
              0 0 48px 22px rgba(255, 180, 90, 0.3);
          }
          22% {
            opacity: 0.95;
            box-shadow:
              0 0 6px 2px rgba(255, 244, 194, 0.9),
              0 0 22px 10px rgba(255, 210, 120, 0.55),
              0 0 48px 22px rgba(255, 180, 90, 0.3);
          }
          35% { opacity: 0; box-shadow: none; }
          100% { opacity: 0; box-shadow: none; }
        }
      `}</style>
    </div>
  );
}
