import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { profileData } from '../data/profile';
import { GitFork, Linkedin, Mail, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();
  const isStdout = theme === 'stdout';

  return (
    <footer
      className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-page)] py-10 transition-colors text-xs font-mono text-[var(--text-secondary)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-sm text-[var(--text-primary)]">
              <Cpu className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
              <span>{profileData.name} · Systems & ML Portfolio</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-body mt-1">
              B.Tech CSE (AI/ML) · First-principles engineering from silicon boundaries to neural weights.
            </p>
          </div>

          {/* Footer Navigation Links */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <a
              href={profileData.contact.github}
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
              href={profileData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="hover:text-[var(--accent-primary)] transition-colors flex items-center gap-1.5"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            <span className="text-[var(--border-subtle)]" aria-hidden="true">·</span>
            <a
              href={`mailto:${profileData.contact.email}`}
              aria-label="Email"
              className="hover:text-[var(--accent-primary)] transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Dynamic Year & Active Mode Indicator */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
          <div>
            © {currentYear} {profileData.name}. All project architectures and invariant diagrams documented for academic review.
          </div>
          <div>
            Active Palette: <span className="text-[var(--accent-primary)] font-semibold">{isStdout ? 'Silicon Lithography' : 'Titanium Blueprint'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
