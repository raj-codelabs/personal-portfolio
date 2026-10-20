import { useState, useEffect, useCallback, useRef } from 'react';
import { useReducedMotionGlobal } from './useReducedMotionGlobal';

const INTRO_STORAGE_KEY = 'raj_portfolio_intro_done_v1';

export function useIntroAnimation() {
  const reducedMotion = useReducedMotionGlobal();

  const shouldSkipIntro = useCallback(() => {
    if (reducedMotion) return true;
    if (typeof window === 'undefined') return true;

    // Skipped when the URL has a hash
    if (window.location.hash && window.location.hash.length > 1) return true;

    // Skipped when the page is restored scrolled
    if (window.scrollY > 40) return true;

    // Plays once per session
    try {
      const alreadyPlayed = sessionStorage.getItem(INTRO_STORAGE_KEY);
      if (alreadyPlayed === 'true') return true;
    } catch {
      // Storage restricted, proceed
    }

    return false;
  }, [reducedMotion]);

  const [isIntroComplete, setIsIntroComplete] = useState<boolean>(() => shouldSkipIntro());
  const timerRef = useRef<number | null>(null);

  const completeIntro = useCallback(() => {
    setIsIntroComplete(true);
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
    } catch {
      // Ignore
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (shouldSkipIntro()) {
      setIsIntroComplete(true);
      return;
    }

    // Skippable on any click, key, or scroll
    const handleSkipTrigger = () => {
      completeIntro();
    };

    window.addEventListener('pointerdown', handleSkipTrigger, { once: true });
    window.addEventListener('keydown', handleSkipTrigger, { once: true });
    window.addEventListener('wheel', handleSkipTrigger, { once: true, passive: true });
    window.addEventListener('touchstart', handleSkipTrigger, { once: true, passive: true });

    // Max total 1.1s (Section 3)
    timerRef.current = window.setTimeout(() => {
      completeIntro();
    }, 1100);

    return () => {
      window.removeEventListener('pointerdown', handleSkipTrigger);
      window.removeEventListener('keydown', handleSkipTrigger);
      window.removeEventListener('wheel', handleSkipTrigger);
      window.removeEventListener('touchstart', handleSkipTrigger);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [shouldSkipIntro, completeIntro]);

  return { isIntroComplete, completeIntro, reducedMotion };
}
