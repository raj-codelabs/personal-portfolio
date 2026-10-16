import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Terminal, BookOpen } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  const isStdout = theme === 'stdout';
  const targetThemeName = isStdout ? 'margin-notes' : 'stdout';
  const actionLabel = isStdout
    ? 'Switch to Editorial Notebook mode (margin-notes)'
    : 'Switch to Developer Terminal mode (stdout)';

  return (
    <button
      onClick={toggleTheme}
      aria-label={actionLabel}
      title={actionLabel}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
        isStdout
          ? 'border-[#30363d] bg-[#161b22] text-[#e6edf3] hover:border-[#58a6ff] hover:text-[#58a6ff]'
          : 'border-[#e3ded2] bg-[#ffffff] text-[#302d29] hover:border-[#0d5c6e] hover:text-[#0d5c6e] shadow-xs'
      } ${className}`}
    >
      {isStdout ? (
        <>
          <Terminal className="w-3.5 h-3.5 text-[#58a6ff]" aria-hidden="true" />
          <span className="font-mono">stdout</span>
          <span className="text-[#8b949e]" aria-hidden="true">→</span>
          <span className="text-[#8b949e]">notebook</span>
        </>
      ) : (
        <>
          <BookOpen className="w-3.5 h-3.5 text-[#0d5c6e]" aria-hidden="true" />
          <span className="font-serif italic font-semibold">margin-notes</span>
          <span className="text-[#8d857a]" aria-hidden="true">→</span>
          <span className="font-mono text-xs text-[#686158]">stdout</span>
        </>
      )}
    </button>
  );
};
