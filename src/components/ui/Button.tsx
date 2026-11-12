import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  type?: 'button' | 'submit';
}

const baseClasses = 'inline-flex items-center gap-1.5 rounded cursor-pointer';

const variantClasses = {
  primary:
    'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)]',
  secondary:
    'bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]',
  ghost:
    'border-transparent text-[var(--text-primary)] hover:bg-[var(--bg-page)]',
  danger:
    'bg-[var(--accent-success)] text-white hover:bg-[var(--accent-success)]/90',
};

const sizeClasses = {
  sm: 'text-xs py-1.5 px-3',
  md: 'text-sm py-2 px-4',
  lg: 'text-base py-3 px-6',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled,
  className,
  children,
  type = 'button',
}) => {
  const { theme } = useTheme();
  const isStdout = theme === 'stdout';

  // Adjust variant colors for stdout theme
  const adjustedVariant = isStdout && variant === 'primary'
    ? 'bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)]'
    : variantClasses[variant];

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${adjustedVariant} ${sizeClasses[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {children}
    </button>
  );
};