'use client';

import Bird from './Bird';

/**
 * Sun in spring.png sits at roughly cx=81%, cy=26% of the 1920x1080 art, radius ~11% width.
 * Two birds cross partially over the sun's disc, and two more are positioned/animated
 * drifting toward the bottom-left, just outside the sun's edge.
 */
export default function SpringBackground() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1920 / 1080',
        overflow: 'hidden',
        backgroundImage: 'url(/backgrounds/spring.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* crossing partially in front of the sun */}
      <Bird left={78} top={19} size={34} color="#4a4a52" opacity={0.85}
        flapDuration={0.55} flapDelay={0}
        flyAnimation="spring-fly-a" flyDuration={3} flyDelay={0} />
      <Bird left={83} top={27} size={26} color="#54545c" opacity={0.8}
        flapDuration={0.5} flapDelay={0.2}
        flyAnimation="spring-fly-b" flyDuration={2.4} flyDelay={0.4} flip />

      {/* drifting toward the bottom-left, just outside the sun */}
      <Bird left={72} top={35} size={24} color="#4a4a52" opacity={0.75}
        flapDuration={0.6} flapDelay={0.1}
        flyAnimation="spring-fly-c" flyDuration={3.4} flyDelay={0.2} />
      <Bird left={68} top={41} size={18} color="#54545c" opacity={0.7}
        flapDuration={0.5} flapDelay={0.35}
        flyAnimation="spring-fly-c" flyDuration={3.4} flyDelay={0.9} flip />

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
        @keyframes spring-fly-a {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 8px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes spring-fly-b {
          0% { transform: translate(0, 0); }
          50% { transform: translate(14px, -10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes spring-fly-c {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-22px, 14px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
}
