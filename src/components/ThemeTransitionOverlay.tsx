import React from 'react';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

/**
 * Simplified theme transition.
 * 
 * The CSS `body` transition (index.css:125-128) already provides an
 * 180ms background-color / color cross-fade when the `data-theme`
 * attribute changes. This component simply respects `prefers-reduced-motion`
 * and renders nothing — the CSS handles the rest.
 *
 * Keep-alive: if you later want a modest canvas effect, replace the
 * body with a simple fading rectangle anchored to the toggle button,
 * but the default behavior is zero-overhead.
 */
export const ThemeTransitionOverlay: React.FC = () => {
  const reducedMotion = useReducedMotionGlobal();

  // Under reduced motion: render nothing — the CSS transition
  // (background-color 180ms, color 180ms) is still applied by the
  // html/body rules, but there is no extra canvas animation.
  if (reducedMotion) {
    return null;
  }

  // For non-reduced-motion we could add a subtle effect later,
  // but for now we render nothing — the 180ms CSS cross-fade
  // on html/body is sufficient.
  return null;
};