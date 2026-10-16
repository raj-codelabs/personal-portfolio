import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { GitFork, Linkedin, Mail, Cpu, ShieldCheck, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { theme } = useTheme();
  const { profile, siteSettings } = useCms();
  const { isAuthenticated } = useAdminAuth();
  const currentYear = new Date().getFullYear();
  const isStdout = theme === 'stdout';

  const name = profile?.name || 'Raj Golder';
  const email = profile?.contact?.email || 'raj.golder.cse@university.edu';
  const github = profile?.contact?.github || 'https://github.com/raj-golder';
  const linkedin = profile?.contact?.linkedin || 'https://linkedin.com/in/raj-golder';
  const footerNote = siteSettings?.footerNote || 'All project architectures and invariant diagrams documented for academic review.';

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
      className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-page)] py-10 transition-colors text-xs font-mono text-[var(--text-secondary)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-sm text-[var(--text-primary)]">
              <Cpu className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
              <span>{name} · Systems & ML Portfolio</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-body mt-1">
              {profile?.title || 'B.Tech CSE (AI/ML) · First-principles engineering from silicon boundaries to neural weights.'}
            </p>
          </div>

          {/* Footer Navigation Links */}
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
            <a
              href={`mailto:${email}`}
              aria-label="Email"
              className="hover:text-[var(--accent-primary)] transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Dynamic Year, Active Mode Indicator & Discreet Admin Link */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-[var(--text-muted)]">
          <div>
            © {currentYear} {name}. {footerNote}
          </div>

          <div className="flex items-center gap-3">
            <span>
              Active Palette: <span className="text-[var(--accent-primary)] font-semibold">{isStdout ? 'Silicon Lithography' : 'Titanium Blueprint'}</span>
            </span>

            <span className="text-[var(--border-subtle)]" aria-hidden="true">·</span>

            {/* Discreet Admin / Sign In link */}
            <button
              onClick={handleAdminClick}
              className="inline-flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer opacity-70 hover:opacity-100"
              title="Administrator Management Console"
            >
              <Lock className="w-3 h-3" />
              <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Sign In'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
