'use client';

type BirdProps = {
  /** left position, in % of parent container */
  left: number;
  /** top position, in % of parent container */
  top: number;
  /** overall size of the bird in px (viewBox scales to this) */
  size?: number;
  /** silhouette color */
  color?: string;
  /** opacity of the whole bird (useful for depth / haze) */
  opacity?: number;
  /** seconds for one full wing flap cycle */
  flapDuration?: number;
  /** delay before this bird's flap starts, so birds don't flap in sync */
  flapDelay?: number;
  /** name of the "fly" keyframe this bird should use for its drift/path motion */
  flyAnimation: string;
  /** seconds for one full path loop */
  flyDuration?: number;
  /** delay before this bird's path motion starts */
  flyDelay?: number;
  /** flip horizontally (bird faces left instead of right) */
  flip?: boolean;
};

/**
 * A single flat-silhouette bird, styled after a simple two-stroke "M/W" wing shape.
 * The wings are two separate paths that rotate around the shoulder point to
 * simulate a flap. The bird itself also drifts along a small looping path
 * (passed in as `flyAnimation`, defined as a CSS keyframe by the parent) so
 * multiple birds can share a background without importing extra CSS files.
 */
export default function Bird({
  left,
  top,
  size = 46,
  color = '#3b2b2b',
  opacity = 0.85,
  flapDuration = 0.7,
  flapDelay = 0,
  flyAnimation,
  flyDuration = 6,
  flyDelay = 0,
  flip = false,
}: BirdProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${left}%`,
        top: `${top}%`,
        width: size,
        height: size,
        transform: flip ? 'scaleX(-1)' : undefined,
        animation: `${flyAnimation} ${flyDuration}s ease-in-out ${flyDelay}s infinite`,
        willChange: 'transform',
      }}
    >
      <svg
        viewBox="0 0 100 60"
        width={size}
        height={size * 0.6}
        style={{ overflow: 'visible', display: 'block', opacity }}
      >
        {/* body */}
        <ellipse cx="50" cy="32" rx="7" ry="4" fill={color} />

        {/* left wing: pivots around the shoulder (50,30) */}
        <g style={{
          transformOrigin: '50px 30px',
          animation: `bird-flap-left ${flapDuration}s ease-in-out ${flapDelay}s infinite`,
        }}>
          <path
            d="M50,30 C38,26 20,20 4,26 C20,32 36,34 50,32 Z"
            fill={color}
          />
        </g>

        {/* right wing: mirrored pivot */}
        <g style={{
          transformOrigin: '50px 30px',
          animation: `bird-flap-right ${flapDuration}s ease-in-out ${flapDelay}s infinite`,
        }}>
          <path
            d="M50,30 C62,26 80,20 96,26 C80,32 64,34 50,32 Z"
            fill={color}
          />
        </g>
      </svg>
    </div>
  );
}
