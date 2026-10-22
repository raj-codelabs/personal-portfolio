/**
 * fluid-physics.ts
 *
 * Mathematical formulations translated from Apple WWDC "Designing Fluid Interfaces" (2018)
 * and "Principles of Great Design" (2026) for the web platform.
 */

export interface AppleSpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
  type: 'spring';
}

/**
 * Converts Apple's designer-friendly parameters (Response, Damping Ratio)
 * to physical spring coefficients (mass=1, stiffness, damping) used by Motion / Framer Motion.
 *
 * @param response How quickly value reaches target in seconds (T0). Lower = snappier.
 * @param dampingRatio Overshoot control (zeta). 1.0 = critically damped (no bounce). < 1.0 = bouncier.
 */
export function appleSpring(response: number = 0.4, dampingRatio: number = 1.0): AppleSpringConfig {
  const mass = 1;
  const omega = (2 * Math.PI) / Math.max(0.01, response); // natural angular frequency
  const stiffness = omega * omega * mass;
  const damping = 2 * dampingRatio * Math.sqrt(stiffness * mass);

  return {
    type: 'spring',
    stiffness: Math.round(stiffness * 100) / 100,
    damping: Math.round(damping * 100) / 100,
    mass,
  };
}

/**
 * Canonical presets shipped by Apple in iOS / iPadOS:
 */
export const appleSprings = {
  // Move / reposition (e.g. PiP, sheets settling) -> Damping 1.0, Response 0.4
  reposition: appleSpring(0.4, 1.0),

  // Drawer / bottom sheet snapping -> Damping 0.8, Response 0.3
  sheet: appleSpring(0.3, 0.8),

  // Rotation / flip -> Damping 0.8, Response 0.4
  rotation: appleSpring(0.4, 0.8),

  // Snappy control / button press -> Damping 1.0, Response 0.22
  press: appleSpring(0.22, 1.0),

  // Gentle fade / reveal -> Damping 1.0, Response 0.5
  reveal: appleSpring(0.5, 1.0),
} as const;

/**
 * Exponential decay momentum projection from Apple's WWDC 2018 sample code.
 * Calculates where an element will naturally come to rest given its release velocity.
 *
 * @param initialVelocity Velocity at gesture release in px/s
 * @param currentPosition Current coordinate on release
 * @param decelerationRate Rate of decay (0.998 for standard iOS scroll, 0.99 for snappier)
 * @returns Projected resting point in pixels
 */
export function projectMomentum(
  initialVelocity: number,
  currentPosition: number = 0,
  decelerationRate: number = 0.998
): number {
  const projectedOffset = ((initialVelocity / 1000) * decelerationRate) / (1 - decelerationRate);
  return currentPosition + projectedOffset;
}

/**
 * Asymptotic rubber-banding boundary resistance function.
 * Used for soft edges so hard stops never feel frozen.
 *
 * @param overshoot Distance dragged past the edge in pixels
 * @param dimension Total width/height of the container in pixels
 * @param constant Resistance factor (Apple default = 0.55)
 */
export function rubberband(overshoot: number, dimension: number, constant: number = 0.55): number {
  if (dimension <= 0) return 0;
  const absOver = Math.abs(overshoot);
  const damped = (absOver * dimension * constant) / (dimension + constant * absOver);
  return overshoot < 0 ? -damped : damped;
}

/**
 * Velocity Tracker helper: Maintains a short sliding window of pointer positions
 * and timestamps to yield clean, noise-filtered release velocity in px/s.
 */
export class VelocityTracker {
  private history: Array<{ x: number; y: number; time: number }> = [];
  private maxHistoryMs = 120; // 120ms sliding window

  addPoint(x: number, y: number): void {
    const now = performance.now();
    this.history.push({ x, y, time: now });

    // Prune history older than window
    while (this.history.length > 0 && now - this.history[0].time > this.maxHistoryMs) {
      this.history.shift();
    }
  }

  getVelocity(): { vx: number; vy: number } {
    if (this.history.length < 2) {
      return { vx: 0, vy: 0 };
    }

    const first = this.history[0];
    const last = this.history[this.history.length - 1];
    const dt = (last.time - first.time) / 1000; // in seconds

    if (dt <= 0.001) return { vx: 0, vy: 0 };

    return {
      vx: (last.x - first.x) / dt,
      vy: (last.y - first.y) / dt,
    };
  }

  reset(): void {
    this.history = [];
  }
}
