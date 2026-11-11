import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { GitFork, Linkedin, Lock, ShieldCheck } from 'lucide-react';

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Main Footer Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* Left: Name & Status */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[var(--text-primary)]">{name}</span>
            <span className="text-[var(--border-subtle)]" aria-hidden="true">·</span>
            <span>B.Tech CSE (AI/ML) · MATS University</span>
          </div>

          {/* Right: Verified Links */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="hover:text-[var(--accent-primary)] transition-all flex items-center gap-1.5 hover:-translate-y-[1px]"
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
              className="hover:text-[var(--accent-primary)] transition-all flex items-center gap-1.5 hover:-translate-y-[1px]"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>

            <span className="text-[var(--border-subtle)]" aria-hidden="true">·</span>

            <button
              type="button"
              onClick={handleAdminClick}
              title="Admin Login & CMS Dashboard"
              aria-label="Admin Portal"
              className="hover:text-[var(--accent-primary)] transition-all inline-flex items-center gap-1.5 cursor-pointer font-medium hover:-translate-y-[1px]"
            >
              <Lock className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>

        {/* Rule 1: Licence credits go in one footer line */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-copper)]" />
            <span>© 2026 Raj Golder. Open-source tooling and font assets licensed under Apache 2.0, MIT, and SIL Open Font License.</span>
          </div>
          <div>District: Raipur, India · contact@rajgolder.example</div>
        </div>
      </div>
    </footer>
  );
};
