import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'copper' | 'success';
  className?: string;
  children: React.ReactNode;
}

const baseClasses = 'inline-flex items-center gap-1 rounded';

const variantClasses = {
  primary: 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)]',
  secondary: 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)]',
  copper: 'bg-[var(--accent-copper)] text-white',
  success: 'bg-[var(--accent-success)] text-white',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', className, children }) => {
  const { theme } = useTheme();
  const isStdout = theme === 'stdout';

  // Adjust copper for light theme if needed
  const adjustedVariant =
    variant === 'copper' && !isStdout
      ? 'bg-[#b87333] text-white'
      : variantClasses[variant];

  return (
    <span className={`${baseClasses} ${adjustedVariant} ${className}`}>
      {children}
    </span>
  );
};