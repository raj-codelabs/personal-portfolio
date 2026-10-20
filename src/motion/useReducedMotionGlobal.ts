import { useState, useEffect } from 'react';

function checkPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Central prefers-reduced-motion gate for the entire portfolio.
 * Adheres strictly to Section 1 & Section 8:
 * - One central gate, avoiding scattered per-component media query checks.
 * - Under reduced motion: no translate/scale/draw, no intro, no tilt, no parallax, no blinking.
 */
export function useReducedMotionGlobal(): boolean {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => checkPrefersReducedMotion());

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

export function isReducedMotionActive(): boolean {
  return checkPrefersReducedMotion();
}
