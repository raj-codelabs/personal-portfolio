import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface CardProps {
  className?: string;
  theme?: 'stdout' | 'margin-notes';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, theme: themeProp, children }) => {
  const { theme } = useTheme();
  const isStdout = themeProp ?? theme === 'stdout';

  return (
    <div
      className={`p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] ${className}`}
      style={{
        // Ensure the correct theme-specific radius is applied
        borderRadius: isStdout ? 'lg' : 'md',
      }}
    >
      {children}
    </div>
  );
};