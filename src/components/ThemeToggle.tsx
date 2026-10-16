import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Layers, Compass } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  const isStdout = theme === 'stdout';
  const actionLabel = isStdout
    ? 'Switch to Titanium Blueprint mode'
    : 'Switch to Silicon Lithography mode';

  return (
    <button
      onClick={toggleTheme}
      aria-label={actionLabel}
      title={actionLabel}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] [@media(hover:hover)_and_(pointer:fine)]:active:scale-[0.97] transition-[transform,border-color,color] duration-140 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer whitespace-nowrap shrink-0 shadow-xs ${className}`}
    >
      {isStdout ? (
        <>
          <Layers className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
          <span>Silicon Litho</span>
          <span className="text-[var(--text-muted)]" aria-hidden="true">/</span>
          <span className="text-[var(--text-muted)]">Blueprint</span>
        </>
      ) : (
        <>
          <Compass className="w-3.5 h-3.5 text-[var(--accent-primary)]" aria-hidden="true" />
          <span>Blueprint</span>
          <span className="text-[var(--text-muted)]" aria-hidden="true">/</span>
          <span className="text-[var(--text-muted)]">Litho</span>
        </>
      )}
    </button>
  );
};
