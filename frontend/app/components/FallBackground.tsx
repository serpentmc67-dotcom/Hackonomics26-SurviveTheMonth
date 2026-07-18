'use client';

import Bird from './Bird';

/**
 * Birds sit in the open sky to the right of the building, at various depths.
 * A semi-transparent orange gradient sits ABOVE the birds (but the birds are
 * still above the flat background image), so the birds read as slightly
 * hazy/backlit silhouettes rather than crisp shapes cutting through the fog -
 * matching "everything orangy" morning-fog look of the fall art.
 */
export default function FallBackground() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1920 / 1080',
        overflow: 'hidden',
        backgroundImage: 'url(/backgrounds/fall.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* birds layer */}
      <Bird left={38} top={14} size={40} color="#7a4a2d" opacity={0.75}
        flapDuration={0.55} flapDelay={0}
        flyAnimation="fall-fly-a" flyDuration={3.2} flyDelay={0} />
      <Bird left={47} top={22} size={30} color="#8a5636" opacity={0.65}
        flapDuration={0.5} flapDelay={0.15}
        flyAnimation="fall-fly-b" flyDuration={2.6} flyDelay={0.3} flip />
      <Bird left={58} top={10} size={26} color="#7a4a2d" opacity={0.6}
        flapDuration={0.6} flapDelay={0.3}
        flyAnimation="fall-fly-c" flyDuration={3.6} flyDelay={0.6} />
      <Bird left={30} top={30} size={22} color="#8a5636" opacity={0.55}
        flapDuration={0.45} flapDelay={0.1}
        flyAnimation="fall-fly-a" flyDuration={3.2} flyDelay={1.1} flip />

      {/* orange haze, sits above the birds so they read as soft silhouettes */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(255,183,110,0.28) 0%, rgba(255,163,90,0.16) 40%, rgba(255,163,90,0.05) 70%, rgba(255,163,90,0) 100%)',
          pointerEvents: 'none',
        }}
      />

      <style jsx global>{`
        @keyframes bird-flap-left {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-38deg); }
        }
        @keyframes bird-flap-right {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(38deg); }
        }
      `}</style>

      <style jsx>{`
        @keyframes fall-fly-a {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-24px, 10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes fall-fly-b {
          0% { transform: translate(0, 0); }
          50% { transform: translate(18px, -8px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes fall-fly-c {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-16px, -12px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
}
