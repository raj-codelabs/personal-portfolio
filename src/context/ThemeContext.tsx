import React, { createContext, useContext, useEffect, useState } from 'react';
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
    // Graceful fallback for restricted/sandboxed storage
    console.warn('localStorage not available:', err);
  }

  // OS preference fallback: dark -> stdout, light -> margin-notes
  if (typeof window !== 'undefined' && window.matchMedia) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return { theme: prefersDark ? 'stdout' : 'margin-notes', isManual: false };
  }

  return { theme: 'stdout', isManual: false };
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeState, setThemeState] = useState<{ theme: Theme; isManual: boolean }>(() => getInitialTheme());

  const currentTheme = themeState.theme;

  // Apply theme to document element
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', currentTheme);
    // Also toggle class for compatibility
    if (currentTheme === 'stdout') {
      root.classList.add('theme-stdout');
      root.classList.remove('theme-margin-notes');
    } else {
      root.classList.add('theme-margin-notes');
      root.classList.remove('theme-stdout');
    }
  }, [currentTheme]);

  // Listen to OS preference changes if user hasn't manually overridden yet
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setThemeState((prev) => {
        if (prev.isManual) return prev; // Preserve user's manual choice
        return {
          theme: e.matches ? 'stdout' : 'margin-notes',
          isManual: false,
        };
      });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // ponytail: View transitions circular reveal runs at 400ms cubic-bezier; falls back to instant switch on reduced-motion or unsupported browsers
  const setTheme = (newTheme: Theme, origin?: TransitionOrigin) => {
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (err) {
      console.warn('Could not persist theme to localStorage:', err);
    }

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced && typeof document !== 'undefined' && 'startViewTransition' in document) {
      try {
        const transition = (document as any).startViewTransition(() => {
          setThemeState({ theme: newTheme, isManual: true });
        });

        const x = origin ? origin.x : window.innerWidth / 2;
        const y = origin ? origin.y : window.innerHeight / 2;
        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        if (transition && typeof transition.ready?.then === 'function') {
          transition.ready.then(() => {
            document.documentElement.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${endRadius}px at ${x}px ${y}px)`,
                ],
              },
              {
                duration: 400,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                pseudoElement: '::view-transition-new(root)',
              }
            );
          });
        }
        return;
      } catch {
        // Fallback if view transition fails
      }
    }

    setThemeState({ theme: newTheme, isManual: true });
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
        isManualOverride: themeState.isManual,
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
