import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { profileData } from '../data/profile';
import { Terminal, BookOpen, GitFork, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();
  const isStdout = theme === 'stdout';

  return (
    <footer
      className={`w-full border-t py-10 transition-colors text-xs ${
        isStdout
          ? 'bg-[#0d1117] border-[#30363d] text-[#8b949e] font-mono'
          : 'bg-[#fbf7ee] border-[#e3ded2] text-[#686158] font-sans'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
              {isStdout ? (
                <>
                  <Terminal className="w-4 h-4 text-[#58a6ff]" aria-hidden="true" />
                  <span>{profileData.name} · Engineering Portfolio</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 text-[#0d5c6e]" aria-hidden="true" />
                  <span className="font-serif italic font-bold">{profileData.name} · Archival Field Notes</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] mt-1">
              B.Tech CSE (AI/ML) · Hand-crafted with React, TypeScript & Tailwind CSS.
            </p>
          </div>

          {/* Footer Navigation Links */}
          <div className="flex items-center gap-4 text-xs">
            <a
              href={profileData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
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
              className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            <span className="text-[var(--border-subtle)]" aria-hidden="true">·</span>
            <a
              href={`mailto:${profileData.contact.email}`}
              aria-label="Email"
              className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Dynamic Year & Restrained Closing Statement */}
        <div className="pt-4 border-t border-inherit flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
          <div>
            © {currentYear} {profileData.name}. All project concepts and notes for academic presentation.
          </div>
          <div>
            Dual Theme: <span className="font-bold">{isStdout ? 'stdout (Terminal)' : 'margin-notes (Notebook)'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
