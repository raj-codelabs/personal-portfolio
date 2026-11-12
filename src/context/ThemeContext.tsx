import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Theme } from '../types';

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

  const isManualOverride = themeState.isManual;

  const isTransitioningRef = useRef(false);

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
      // Only auto-switch if the user hasn't manually set a theme
      if (isManualOverride) return;
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
  }, [isManualOverride]);

  const setTheme = (newTheme: Theme, origin?: TransitionOrigin) => {
    // Debounce & collision prevention: ignore rapid clicks while transitioning
    if (isTransitioningRef.current) return;
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

    // Swap underlying DOM theme immediately — CSS (index.css:125‑128)
    // provides an 180ms background-color / color cross-fade.
    setThemeState({ theme: newTheme, isManual: true });

    // Allow the next theme click after the CSS transition finishes.
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 200);
  };

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
        isManualOverride,
      }}
    >
      {children}
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