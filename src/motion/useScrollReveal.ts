import { useEffect, useRef, useState } from 'react';
import { useReducedMotionGlobal } from './useReducedMotionGlobal';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

/**
 * Scroll reveal hook adhering strictly to Section 1 & Section 5:
 * - IntersectionObserver with threshold ~0.2 and rootMargin "0px 0px -10% 0px"
 * - Reveals once per element, never re-triggers on scroll up
 * - Respects central prefers-reduced-motion gate
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) {
  const { threshold = 0.2, rootMargin = '0px 0px -10% 0px', delay = 0 } = options;
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotionGlobal();
  const [isRevealed, setIsRevealed] = useState<boolean>(() => reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setIsRevealed(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // Check if already in viewport on mount
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsRevealed(true);
            }, delay);
          } else {
            setIsRevealed(true);
          }
          observer.unobserve(element);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, delay, reducedMotion]);

  return { ref, isRevealed, reducedMotion };
}
