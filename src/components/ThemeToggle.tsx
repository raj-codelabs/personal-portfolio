import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Terminal, BookOpen } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  const isStdout = theme === 'stdout';
  const actionLabel = isStdout
    ? 'Switch to Notebook theme'
    : 'Switch to Terminal theme';

  return (
    <button
      onClick={toggleTheme}
      aria-label={actionLabel}
      title={actionLabel}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-xs ${className}`}
    >
      {isStdout ? (
        <>
          <Terminal className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
          <span>Terminal</span>
          <span className="text-[var(--text-muted)]" aria-hidden="true">/</span>
          <span className="text-[var(--text-muted)]">Notebook</span>
        </>
      ) : (
        <>
          <BookOpen className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
          <span>Notebook</span>
          <span className="text-[var(--text-muted)]" aria-hidden="true">/</span>
          <span className="text-[var(--text-muted)]">Terminal</span>
        </>
      )}
    </button>
  );
};
