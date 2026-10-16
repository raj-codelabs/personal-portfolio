import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { profileData } from '../data/profile';
import { CommandPrompt } from '../components/CommandPrompt';
import { Terminal, ArrowDown, ExternalLink, GitFork, Mail, BookOpen } from 'lucide-react';

export const Hero: React.FC = () => {
  const { theme } = useTheme();
  const isStdout = theme === 'stdout';

  if (isStdout) {
    // STDOUT: Terminal Experience
    return (
      <section
        id="home"
        aria-label="Terminal Hero Introduction"
        className="py-10 sm:py-16 space-y-8"
      >
        {/* Terminal Chrome Window */}
        <div className="rounded-lg border border-[#30363d] bg-[#161b22] shadow-xl overflow-hidden text-left">
          {/* Restrained Window Chrome */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] bg-[#0d1117]/80">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" aria-hidden="true" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" aria-hidden="true" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" aria-hidden="true" />
              <span className="text-xs font-mono text-[#8b949e] ml-2">
                bash - portfolio_init.sh
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#3fb950] border border-[#30363d] px-2 py-0.5 rounded">
              PORTFOLIO STATUS: AVAILABLE
            </span>
          </div>

          {/* Terminal Body */}
          <div className="p-6 sm:p-8 space-y-6 font-mono">
            {/* Command Line Prompt */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#8b949e]">
                <span className="text-[#3fb950] font-bold">raj@dev</span>
                <span>:</span>
                <span className="text-[#58a6ff]">~</span>
                <span>$ ./introduce_engineer.py</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#e6edf3]">
                {profileData.name}
              </h1>
              <p className="text-sm sm:text-base text-[#58a6ff]">
                {profileData.title} · {profileData.semester}
              </p>
            </div>

            {/* Concise professional introduction */}
            <div className="p-4 rounded border border-[#30363d] bg-[#0d1117] text-xs sm:text-sm text-[#c9d1d9] leading-relaxed max-w-3xl">
              <span className="text-[#8b949e] block text-xs uppercase tracking-wider mb-1">
                // System Output
              </span>
              {profileData.shortBio}
            </div>

            {/* Current Focus Areas */}
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-[#8b949e]">
                Current Core Exploration:
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#c9d1d9]">
                {profileData.currentInterests.map((interest, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#58a6ff]">›</span>
                    <span>{interest}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary & Secondary Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded bg-[#58a6ff] text-[#0d1117] hover:bg-[#79b8ff] transition-colors"
              >
                <span>View Projects</span>
                <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded border border-[#30363d] bg-[#21262d] text-[#e6edf3] hover:border-[#58a6ff] hover:text-[#58a6ff] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Contact Details</span>
              </a>

              <a
                href={profileData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-[#8b949e] hover:text-[#e6edf3] transition-colors ml-auto"
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>GitHub Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Command Prompt */}
        <CommandPrompt />
      </section>
    );
  }

  // MARGIN-NOTES: Refined Asymmetric Editorial Notebook Hero
  return (
    <section
      id="home"
      aria-label="Editorial Introduction"
      className="py-12 sm:py-20 border-b border-[#e3ded2] text-left"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Editorial Display Typography & Philosophy (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-3 text-xs font-mono text-[#8a5a00] font-semibold tracking-wider">
            <span>FIELD DISPATCH · SEMESTER 01</span>
            <span aria-hidden="true">·</span>
            <span>B.TECH CSE (AI/ML)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#302d29] tracking-tight leading-tight">
            {profileData.name}
          </h1>

          <p className="text-base sm:text-lg font-serif italic text-[#0d5c6e]">
            {profileData.subtitle}
          </p>

          <p className="text-sm sm:text-base font-sans text-[#686158] leading-relaxed max-w-2xl">
            {profileData.shortBio}
          </p>

          {/* Engineering Philosophy Box */}
          <div className="p-5 rounded-sm border-l-2 border-[#0d5c6e] bg-[#ffffff] shadow-xs">
            <span className="text-[11px] font-mono text-[#8a5a00] uppercase tracking-wider block mb-1">
              Guiding Engineering Principle
            </span>
            <blockquote className="font-serif italic text-sm text-[#302d29] leading-relaxed">
              "{profileData.philosophy}"
            </blockquote>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-sans font-semibold rounded-sm bg-[#0d5c6e] text-[#ffffff] hover:bg-[#094755] transition-colors shadow-xs"
            >
              <span>Explore Projects</span>
              <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-sans font-medium rounded-sm border border-[#e3ded2] bg-[#ffffff] text-[#302d29] hover:border-[#0d5c6e] hover:text-[#0d5c6e] transition-colors"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Correspondence</span>
            </a>
          </div>
        </div>

        {/* Right Column: Research Focus & Academic Field Metadata (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-sm border border-[#e3ded2] bg-[#ffffff] shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#e3ded2]">
            <span className="font-serif font-bold text-sm text-[#302d29]">Field Dossier</span>
            <BookOpen className="w-4 h-4 text-[#8a5a00]" aria-hidden="true" />
          </div>

          {/* Metadata items */}
          <div className="space-y-4 text-xs font-sans">
            <div>
              <span className="text-[#8d857a] uppercase tracking-wider text-[10px] block font-semibold mb-1">
                Academic Program
              </span>
              <div className="font-medium text-[#302d29]">{profileData.department}</div>
              <div className="text-[#686158]">{profileData.institutionNote}</div>
            </div>

            <div>
              <span className="text-[#8d857a] uppercase tracking-wider text-[10px] block font-semibold mb-1">
                Investigation Areas
              </span>
              <ul className="space-y-1.5 text-[#686158]">
                {profileData.currentInterests.map((interest, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#0d5c6e] font-serif">§</span>
                    <span>{interest}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-[#e3ded2]">
              <span className="text-[#8d857a] uppercase tracking-wider text-[10px] block font-semibold mb-1">
                Status & Availability
              </span>
              <div className="text-[#1f6b45] font-mono font-medium">
                {profileData.contact.statusLabel}
              </div>
              <div className="text-[11px] text-[#686158] mt-0.5">
                {profileData.contact.location}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
