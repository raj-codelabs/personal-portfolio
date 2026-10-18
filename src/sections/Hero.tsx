import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { CommandPrompt } from '../components/CommandPrompt';
import { DeveloperIdCard } from '../components/DeveloperIdCard';
import { SketchReveal } from '../components/SketchReveal';
import { ArrowDown, ExternalLink, Terminal } from 'lucide-react';

export const Hero: React.FC = () => {
  const { theme } = useTheme();
  const { profile } = useCms();
  const [showCli, setShowCli] = useState(false);

  const isStdout = theme === 'stdout';

  const name = profile?.name || 'Raj Golder';
  const github = profile?.contact?.github || 'https://github.com/raj-codelabs';

  return (
    <section
      id="home"
      aria-label="Engineering Introduction"
      className="py-10 sm:py-16 space-y-10 text-left scroll-mt-16"
    >
      {/* ========================================================================= */}
      {/* THEME 1: DARK MODE (stdout) — Developer Terminal                          */}
      {/* ========================================================================= */}
      {isStdout ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Terminal Introduction */}
          <div className="lg:col-span-7 space-y-5">
            {/* Eyebrow */}
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#e27d60]">
              B.TECH CSE (AI/ML) · MATS UNIVERSITY · CLASS OF 2030
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-mono font-bold tracking-tight text-[#f1f5f9] leading-[1.15]">
              I build small, useful tools in Python<span className="text-[#00e5c0] animate-pulse">_</span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-[#94a3b8] font-body leading-relaxed max-w-2xl">
              First-year CSE (AI/ML) student at MATS University. CS50x and CS50P completed. Currently building AI tools for studying.
            </p>

            {/* NOW status line */}
            <div className="text-xs font-mono text-[#64748b] flex items-center gap-2 pt-1">
              <span className="text-[#00e5c0] font-bold">NOW:</span>
              <span className="text-[#94a3b8]">AI Study Notes Summarizer · C · DSA basics</span>
            </div>

            {/* Action Triggers: Primary & Secondary */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold font-mono rounded bg-[#00e5c0] text-[#0b0e14] hover:bg-[#33ebd0] transition-colors shadow-xs"
              >
                <span>See my work</span>
                <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
              </a>

              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium font-mono rounded border border-[#242e40] bg-[#121722] text-[#f1f5f9] hover:border-[#00e5c0] hover:text-[#00e5c0] transition-colors"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>

            {/* Demoted prober: small quiet text link */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowCli(!showCli)}
                className="text-xs font-mono text-[#00e5c0] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {showCli ? 'Hide terminal ‹' : 'Try the terminal › (Quick keyboard-driven portfolio navigation)'}
                </span>
              </button>
            </div>

            {/* Collapsible Interactive Terminal Prober */}
            {showCli && (
              <div className="space-y-2 pt-2">
                <CommandPrompt />
              </div>
            )}
          </div>

          {/* Right Column: Interactive Developer ID Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-start w-full">
            <DeveloperIdCard />
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* THEME 2: WHITE MODE (margin-notes) — Physical Engineering Notebook        */
        /* ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start font-serif">
          {/* Left Column: Notebook Journal Introduction */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow */}
            <div className="text-xs font-serif uppercase tracking-wider text-[#c25e38] font-bold">
              B.TECH CSE (AI/ML) · MATS UNIVERSITY · CLASS OF 2030
            </div>

            {/* Classical Serif Journal Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-[#1c1917] leading-[1.12]">
              I build small, useful tools in Python.
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg text-[#44403c] font-serif leading-relaxed max-w-2xl">
              First-year CSE (AI/ML) student at MATS University. CS50x and CS50P completed. Currently building AI tools for studying.
            </p>

            {/* NOW status line */}
            <div className="text-sm font-handwriting text-[#78716c]">
              <span className="text-[#1d4ed8] font-bold">Now: </span>
              AI Study Notes Summarizer · C · DSA basics
            </div>

            {/* Action Triggers */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm font-serif">
              <a
                href="#projects"
                className="text-[#1d4ed8] hover:text-[#1e40af] font-medium underline underline-offset-4 decoration-[#93c5fd] hover:decoration-[#1d4ed8] transition-colors"
              >
                See my work ↓
              </a>

              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#44403c] hover:text-[#1c1917] underline underline-offset-4 decoration-[#c2b8a3] hover:decoration-[#44403c] transition-colors"
              >
                GitHub ↗
              </a>
            </div>

            {/* Demoted prober */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowCli(!showCli)}
                className="text-xs font-serif text-[#1d4ed8] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>
                  {showCli ? 'Hide terminal ‹' : 'Try the terminal › (Quick keyboard-driven portfolio navigation)'}
                </span>
              </button>
            </div>

            {/* Collapsible Interactive Terminal Prober */}
            {showCli && (
              <div className="space-y-2 pt-2">
                <CommandPrompt />
              </div>
            )}
          </div>

          {/* Right Column: Sketch Drawn Directly into Open Paper Margin */}
          <div className="lg:col-span-5 flex flex-col items-center justify-start w-full">
            <SketchReveal />
          </div>
        </div>
      )}
    </section>
  );
};
