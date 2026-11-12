import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface SectionHeaderProps {
  kicker: string;
  title: string;
  description: string;
  theme?: 'stdout' | 'margin-notes';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  kicker,
  title,
  description,
  theme: themeProp,
}) => {
  const { theme } = useTheme();
  const isStdout = themeProp ?? theme === 'stdout';

  return (
    <div className="relative pb-4">
      <div>
        <div className={isStdout ? 'text-xs font-mono text-[var(--accent-copper)] font-semibold mb-1' : 'text-sm font-handwriting text-[var(--accent-copper)] font-bold mb-1'}>
          {kicker}
        </div>

        <h2
          className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${isStdout ? 'font-mono' : 'font-serif'}`}
        >
          {title}
        </h2>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-body mt-1">
          {description}
        </p>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--border-subtle)] origin-left"
        aria-hidden="true"
      />
    </div>
  );
};