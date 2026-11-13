import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Theme } from '../types';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

interface ThemeTransitionOverlayProps {
  animating: boolean;
  targetTheme: Theme | null;
  origin?: { x: number; y: number };
  onComplete: () => void;
}

/**
 * Unified Theme Transition Overlay
 * - Single, elegant radial wipe transition shared symmetrically between dark and light modes
 * - Originates directly from the toggle button coordinates (cx, cy)
 * - 340ms smooth circular expansion with luminous leading-edge accent ring
 * - Pure GPU-composited clip-path & motion animation (zero canvas crash risks)
 */
export const ThemeTransitionOverlay: React.FC<ThemeTransitionOverlayProps> = ({
  animating,
  targetTheme,
  origin,
  onComplete,
}) => {
  const reducedMotion = useReducedMotionGlobal();
  const [phase, setPhase] = useState<'idle' | 'active'>('idle');

  // Viewport dimensions & toggle button origin
  const { cx, cy, maxRadius } = useMemo(() => {
    if (typeof window === 'undefined') {
      return { cx: 500, cy: 300, maxRadius: 1000 };
    }
    const defaultX = window.innerWidth * 0.85;
    const defaultY = 32;
    const x = origin?.x ?? defaultX;
    const y = origin?.y ?? defaultY;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    return { cx: x, cy: y, maxRadius: radius + 40 };
  }, [origin]);

  useEffect(() => {
    if (animating && targetTheme && !reducedMotion) {
      setPhase('active');
    } else if (animating && reducedMotion) {
      onComplete();
    }
  }, [animating, targetTheme, reducedMotion, onComplete]);

  const handleAnimationComplete = () => {
    setPhase('idle');
    onComplete();
  };

  if (!animating || reducedMotion || phase === 'idle' || !targetTheme) {
    return null;
  }

  const isToDark = targetTheme === 'stdout';
  const targetBg = isToDark ? '#11151c' : '#f6f5f1';
  const targetGridDot = isToDark ? '#273142' : '#d6cec2';
  const targetAccent = isToDark ? '#3b82f6' : '#1d4ed8';

  return (
    <div
      className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Symmetrical expanding circular radial wipe */}
      <motion.div
        initial={{
          clipPath: `circle(0px at ${cx}px ${cy}px)`,
          opacity: 1,
        }}
        animate={{
          clipPath: `circle(${maxRadius}px at ${cx}px ${cy}px)`,
          opacity: 1,
        }}
        transition={{
          duration: 0.34,
          ease: [0.22, 1, 0.36, 1],
        }}
        onAnimationComplete={handleAnimationComplete}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: targetBg,
          backgroundImage: `radial-gradient(${targetGridDot} 0.75px, transparent 0.75px)`,
          backgroundSize: '24px 24px',
        }}
      >
        {/* Leading-edge glowing accent pulse */}
        <motion.div
          initial={{
            scale: 0,
            opacity: 0.85,
          }}
          animate={{
            scale: (maxRadius * 2) / 100,
            opacity: [0.85, 0.45, 0],
          }}
          transition={{
            duration: 0.34,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            position: 'absolute',
            left: cx - 50,
            top: cy - 50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: `3px solid ${targetAccent}`,
            boxShadow: `0 0 28px ${targetAccent}80`,
            pointerEvents: 'none',
          }}
        />
      </motion.div>
    </div>
  );
};
