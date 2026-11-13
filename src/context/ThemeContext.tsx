import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Theme } from '../types';
import { ThemeTransitionOverlay } from '../components/ThemeTransitionOverlay';

export interface TransitionOrigin {
  x: number;
  y: number;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (origin?: TransitionOrigin) => void;
  setTheme: (theme: Theme, origin?: TransitionOrigin) => void;
  isManualOverride: boolean;
}

const STORAGE_KEY = 'portfolio-preferred-theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): { theme: Theme; isManual: boolean } {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'stdout' || saved === 'margin-notes') {
      return { theme: saved, isManual: true };
    }
  } catch (err) {
    console.warn('localStorage not available:', err);
  }

  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return { theme: prefersDark ? 'stdout' : 'margin-notes', isManual: false };
  }

  return { theme: 'stdout', isManual: false };
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeState, setThemeState] = useState<{ theme: Theme; isManual: boolean }>(() => getInitialTheme());
  const [transitionState, setTransitionState] = useState<{
    animating: boolean;
    targetTheme: Theme | null;
    origin?: TransitionOrigin;
  }>({ animating: false, targetTheme: null });

  const isTransitioningRef = useRef(false);
  const swapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentTheme = themeState.theme;

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'stdout') {
      root.classList.add('theme-stdout');
      root.classList.remove('theme-margin-notes');
    } else {
      root.classList.add('theme-margin-notes');
      root.classList.remove('theme-stdout');
    }
  }, [currentTheme]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setThemeState((prev) => {
        if (prev.isManual) return prev;
        return {
          theme: e.matches ? 'stdout' : 'margin-notes',
          isManual: false,
        };
      });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = (newTheme: Theme, origin?: TransitionOrigin) => {
    // Debounce & collision prevention: ignore rapid clicks while animating
    if (isTransitioningRef.current || transitionState.animating) return;
    if (newTheme === currentTheme) return;

    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (err) {
      console.warn('Could not persist theme to localStorage:', err);
    }

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setThemeState({ theme: newTheme, isManual: true });
      return;
    }

    isTransitioningRef.current = true;

    let resolvedOrigin = origin;
    if (!resolvedOrigin && typeof document !== 'undefined') {
      const btn = document.querySelector(
        'button[aria-label*="Switch to"], button[aria-label*="theme"], button[title*="theme"]'
      );
      if (btn) {
        const rect = btn.getBoundingClientRect();
        resolvedOrigin = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }
    }

    setTransitionState({
      animating: true,
      targetTheme: newTheme,
      origin: resolvedOrigin,
    });

    if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
    // Swap underlying DOM theme midway (160ms) through the 340ms radial wipe
    swapTimerRef.current = setTimeout(() => {
      setThemeState({ theme: newTheme, isManual: true });
    }, 160);
  };

  const handleAnimationComplete = useCallback(() => {
    isTransitioningRef.current = false;
    if (swapTimerRef.current) {
      clearTimeout(swapTimerRef.current);
      swapTimerRef.current = null;
    }
    setTransitionState({ animating: false, targetTheme: null, origin: undefined });
  }, []);

  const toggleTheme = (origin?: TransitionOrigin) => {
    const nextTheme: Theme = currentTheme === 'stdout' ? 'margin-notes' : 'stdout';
    setTheme(nextTheme, origin);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        toggleTheme,
        setTheme,
        isManualOverride: themeState.isManual,
      }}
    >
      {children}
      <ThemeTransitionOverlay
        animating={transitionState.animating}
        targetTheme={transitionState.targetTheme}
        origin={transitionState.origin}
        onComplete={handleAnimationComplete}
      />
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
