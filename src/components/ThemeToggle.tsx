import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Terminal, BookOpen, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { spring } from '../motion/motion-tokens';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const reducedMotion = useReducedMotionGlobal();

  const isStdout = theme === 'stdout';
  const actionLabel = isStdout
    ? 'Switch to Notebook theme (Light Mode)'
    : 'Switch to Terminal theme (Dark Mode)';

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      aria-label={actionLabel}
      title={actionLabel}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      transition={spring.snap}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-xs focus-visible:outline-2 ${className}`}
    >
      <div className="relative w-3.5 h-3.5 flex items-center justify-center shrink-0">
        <AnimatePresence mode="wait" initial={false}>
          {isStdout ? (
            <motion.div
              key="stdout-icon"
              initial={reducedMotion ? false : { scale: 0.7, opacity: 0, rotate: -25 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={reducedMotion ? undefined : { scale: 0.7, opacity: 0, rotate: 25 }}
              transition={spring.snap}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
            </motion.div>
          ) : (
            <motion.div
              key="notes-icon"
              initial={reducedMotion ? false : { scale: 0.7, opacity: 0, rotate: 25 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={reducedMotion ? undefined : { scale: 0.7, opacity: 0, rotate: -25 }}
              transition={spring.snap}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <span className="font-semibold">{isStdout ? 'Dark' : 'Light'}</span>
      <span className="text-[var(--text-muted)]" aria-hidden="true">/</span>
      <span className="text-[var(--text-muted)] font-normal">{isStdout ? 'Notebook' : 'Terminal'}</span>
    </motion.button>
  );
};
