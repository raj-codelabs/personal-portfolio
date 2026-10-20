import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { GitFork, Linkedin, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { theme } = useTheme();
  const { profile } = useCms();
  const isStdout = theme === 'stdout';

  const name = profile?.name || 'Raj Golder';
  const github = 'https://github.com/raj-codelabs';
  const linkedin = 'https://linkedin.com/in/rajgolder';

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenAdmin) {
      onOpenAdmin();
    } else {
      window.location.hash = '#admin';
    }
  };

  return (
    <footer
      className={`w-full border-t border-[var(--border-subtle)] bg-[var(--bg-page)] py-8 transition-colors text-xs text-[var(--text-secondary)] ${
        isStdout ? 'font-mono' : 'font-serif'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        {/* Left: Name & Year */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-[var(--text-primary)]">{name}</span>
          <span className="text-[var(--border-subtle)]" aria-hidden="true">·</span>
          <span>© 2026</span>
        </div>

        {/* Right: Links, Theme Switcher & Admin Access */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="hover:text-[var(--accent-primary)] transition-colors flex items-center gap-1.5"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          <span className="text-[var(--border-subtle)]" aria-hidden="true">·</span>

          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="hover:text-[var(--accent-primary)] transition-colors flex items-center gap-1.5"
          >
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </a>

          <span className="text-[var(--border-subtle)]" aria-hidden="true">·</span>

          {/* Admin Login Access */}
          <button
            type="button"
            onClick={handleAdminClick}
            title="Admin Login & CMS Dashboard"
            aria-label="Admin Login"
            className="hover:text-[var(--accent-primary)] transition-colors inline-flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <Lock className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Admin Login</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
