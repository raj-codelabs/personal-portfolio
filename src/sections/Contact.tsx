import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { profileData } from '../data/profile';
import { Mail, GitFork, Linkedin, Copy, Check, ExternalLink } from 'lucide-react';

export const Contact: React.FC = () => {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const isStdout = theme === 'stdout';

  const copyEmail = () => {
    navigator.clipboard.writeText(profileData.contact.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-12 sm:py-16 space-y-8 text-left"
    >
      {/* Section Header */}
      <div className="pb-4 border-b border-inherit">
        <div className="text-xs font-mono text-[var(--text-secondary)] mb-1">
          {isStdout ? '// netcat & correspondence' : 'Section 06 · Direct Correspondence'}
        </div>
        <h2
          id="contact-heading"
          className={`text-2xl sm:text-3xl font-bold tracking-tight ${
            isStdout ? 'font-mono text-[#e6edf3]' : 'font-serif text-[#302d29]'
          }`}
        >
          Get in Touch
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-xl">
          Interested in discussing algorithmic problem solving, open-source projects, or student research collaborations.
        </p>
      </div>

      {/* Contact Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Direct Email Card */}
        <div
          className={`p-6 rounded-md border flex flex-col justify-between ${
            isStdout
              ? 'bg-[#161b22] border-[#30363d]'
              : 'bg-[#ffffff] border-[#e3ded2] shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-inherit text-xs text-[var(--text-secondary)]">
              <Mail className={`w-4 h-4 ${isStdout ? 'text-[#58a6ff]' : 'text-[#0d5c6e]'}`} />
              <span>Direct Email</span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] mb-3">
              Institutional inbox for academic and technical queries:
            </div>
            <div className="font-mono text-xs text-[var(--text-primary)] font-semibold break-all">
              {profileData.contact.email}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 mt-4 border-t border-inherit">
            <a
              href={`mailto:${profileData.contact.email}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                isStdout
                  ? 'bg-[#58a6ff] text-[#0d1117] hover:bg-[#79b8ff]'
                  : 'bg-[#0d5c6e] text-[#ffffff] hover:bg-[#094755]'
              }`}
            >
              <span>Compose Mail</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={copyEmail}
              aria-label="Copy email address to clipboard"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
                isStdout
                  ? 'border-[#30363d] text-[#e6edf3] hover:bg-[#21262d]'
                  : 'border-[#e3ded2] text-[#302d29] hover:bg-[#fbf7ee]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#3fb950]" />
                  <span className="text-[#3fb950]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* GitHub Card */}
        <div
          className={`p-6 rounded-md border flex flex-col justify-between ${
            isStdout
              ? 'bg-[#161b22] border-[#30363d]'
              : 'bg-[#ffffff] border-[#e3ded2] shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-inherit text-xs text-[var(--text-secondary)]">
              <GitFork className={`w-4 h-4 ${isStdout ? 'text-[#58a6ff]' : 'text-[#0d5c6e]'}`} />
              <span>Version Control & Repositories</span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] mb-3">
              Explore commit logs, course assignments, and ongoing experiments:
            </div>
            <div className="font-mono text-xs text-[var(--text-primary)] font-semibold truncate">
              github.com/raj-golder
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-inherit">
            <a
              href={profileData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                isStdout
                  ? 'border-[#30363d] text-[#58a6ff] hover:bg-[#21262d]'
                  : 'border-[#e3ded2] text-[#0d5c6e] hover:bg-[#fbf7ee]'
              }`}
            >
              <span>Visit GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* LinkedIn Card */}
        <div
          className={`p-6 rounded-md border flex flex-col justify-between ${
            isStdout
              ? 'bg-[#161b22] border-[#30363d]'
              : 'bg-[#ffffff] border-[#e3ded2] shadow-xs'
          }`}
        >
          <div>
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-inherit text-xs text-[var(--text-secondary)]">
              <Linkedin className={`w-4 h-4 ${isStdout ? 'text-[#58a6ff]' : 'text-[#0d5c6e]'}`} />
              <span>Professional Network</span>
            </div>
            <div className="text-xs text-[var(--text-secondary)] mb-3">
              Connect for academic internships, hackathons, and cohort discussions:
            </div>
            <div className="font-mono text-xs text-[var(--text-primary)] font-semibold truncate">
              linkedin.com/in/raj-golder
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-inherit">
            <a
              href={profileData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                isStdout
                  ? 'border-[#30363d] text-[#58a6ff] hover:bg-[#21262d]'
                  : 'border-[#e3ded2] text-[#0d5c6e] hover:bg-[#fbf7ee]'
              }`}
            >
              <span>Connect on LinkedIn</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
