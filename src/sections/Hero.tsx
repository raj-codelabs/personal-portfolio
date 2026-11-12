import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { CommandPrompt } from '../components/CommandPrompt';
import { DeveloperIdCard } from '../components/DeveloperIdCard';
import { SketchReveal } from '../components/SketchReveal';
import { ArrowDown, ExternalLink, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { spring } from '../motion/motion-tokens';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

interface CollapsibleTerminalProps {
  isOpen: boolean;
  reducedMotion: boolean;
}

const CollapsibleTerminal: React.FC<CollapsibleTerminalProps> = ({ isOpen, reducedMotion }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={reducedMotion ? false : { height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
        transition={reducedMotion ? { duration: 0 } : spring.settle}
        className="overflow-hidden pt-2"
      >
        <CommandPrompt />
      </motion.div>
    )}
  </AnimatePresence>
);

export const Hero: React.FC = () => {
  const { theme } = useTheme();
  const { profile } = useCms();
  const [showCli, setShowCli] = useState(false);
  const [cursorBlinking, setCursorBlinking] = useState(true);
  const reducedMotion = useReducedMotionGlobal();
  const isStdout = theme === 'stdout';

  const name = profile?.name || 'Raj Golder';
  const github = profile?.contact?.github || 'https://github.com/raj-codelabs';

  // Blinking cursor stops blinking after ~3s, stays solid
  useEffect(() => {
    if (reducedMotion) {
      setCursorBlinking(false);
      return;
    }
    const timer = setTimeout(() => {
      setCursorBlinking(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      data-enter
      aria-label="Engineering Overview"
      className="relative min-h-[calc(100vh-4rem)] lg:min-h-[820px] flex flex-col justify-center py-8 lg:py-12 space-y-8 text-left scroll-mt-16"
    >
      {/* Anchor for #home navigation compatibility */}
      <div id="home" className="absolute -top-16 pointer-events-none" aria-hidden="true" />

      {/* ========================================================================= */}
      {/* THEME 1: DARK MODE (stdout) — Developer Terminal                          */}
      {/* ========================================================================= */}
      {isStdout ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          {/* Left Column: Terminal Introduction */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            {/* 1. Header category & hard credentials */}
            <div className="space-y-1">
              <div className="text-xs font-mono text-[#6b7586] flex items-center gap-1.5 pb-0.5">
                <span className="text-[var(--accent-primary)] font-bold">$</span>
                <span className="text-[#9aa2b1]">whoami --degree</span>
                <span
                  className={`text-[var(--accent-primary)] ${
                    cursorBlinking && !reducedMotion ? 'animate-pulse motion-reduce:animate-none' : 'opacity-100'
                  }`}
                  aria-hidden="true"
                >
                  ▌
                </span>
              </div>
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--accent-copper)]">
                B.TECH CSE (AI/ML) · MATS UNIVERSITY · CLASS OF 2030
              </div>
            </div>

            {/* 2. Headline: Clear statement of what is sold / engineered */}
            <h1 className="text-[clamp(2.1rem,4.8vw,3.6rem)] font-mono font-bold tracking-tight text-[#f6f5f1] leading-[1.12]">
              <span className="block text-[#f6f5f1]">
                Software Tools &amp;
              </span>
              <span className="block text-[var(--accent-primary)]">
                Applied AI Systems
                <span
                  className={`text-[var(--accent-primary)] ${
                    cursorBlinking && !reducedMotion ? 'animate-pulse motion-reduce:animate-none' : 'opacity-100'
                  }`}
                  aria-hidden="true"
                >
                  _
                </span>
              </span>
            </h1>

            {/* 3. Subhead with Hard Facts */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-[#9aa2b1] font-body leading-relaxed max-w-3xl">
                First-year CSE (AI/ML) undergraduate student. CS50x and CS50P certified. Author of open-source CLI utilities, token-budgeted AI study summarizers, and systems software in C.
              </p>

              {/* Verified baseline fact */}
              <div className="text-xs font-mono text-[#6b7586] flex items-center gap-2 pt-0.5">
                <span className="text-[var(--accent-copper)] font-semibold">Active Work:</span>
                <span className="text-[#cbd5e1]">AI Study Notes Summarizer · C Algorithms · Systems Memory</span>
              </div>

              {/* Maximum two primary hero actions (Verb + Object) with hover step & click press */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#projects"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold font-mono rounded bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-all shadow-xs cursor-pointer hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98]"
                >
                  <span>Explore Projects</span>
                  <ArrowDown
                    className="w-3.5 h-3.5 transition-transform duration-150 ease-out group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>

                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium font-mono rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all cursor-pointer hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98]"
                >
                  <span>View Repositories</span>
                  <ExternalLink
                    className="w-3 h-3 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>

              {/* Terminal prober */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowCli(!showCli)}
                  className="text-xs font-mono text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {showCli ? 'Close command interface ‹' : 'Open keyboard terminal ›'}
                  </span>
                </button>
              </div>

              <CollapsibleTerminal isOpen={showCli} reducedMotion={reducedMotion} />
            </div>
          </div>

          {/* Right Column: ID Card Visual */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center justify-center w-full">
            <DeveloperIdCard />
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* THEME 2: LIGHT MODE (margin-notes) — Engineering Notebook                 */
        /* ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center font-serif">
          {/* Left Column: Notebook Journal Introduction */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="text-xs font-serif uppercase tracking-wider text-[#c25e38] font-bold">
              B.TECH CSE (AI/ML) · MATS UNIVERSITY · CLASS OF 2030
            </div>

            <h1 className="text-[clamp(2.4rem,5.2vw,4.1rem)] font-serif font-normal tracking-tight text-[#1c1917] leading-[1.12]">
              <span className="block">
                Software Tools &amp;
              </span>
              <span className="block text-[#1d4ed8]">
                Applied AI Systems.
              </span>
            </h1>

            <div className="space-y-4">
              <p className="text-base sm:text-lg text-[#44403c] font-serif leading-relaxed max-w-3xl">
                First-year CSE (AI/ML) undergraduate student. CS50x and CS50P certified. Author of open-source CLI utilities, token-budgeted AI study summarizers, and systems software in C.
              </p>

              <div className="text-sm font-handwriting text-[#78716c]">
                <span className="text-[#1d4ed8] font-bold">Active Work: </span>
                AI Study Notes Summarizer · C Algorithms · Systems Memory
              </div>

              {/* Two hero actions (Verb + Object) */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-sm font-serif">
                <a
                  href="#projects"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#1d4ed8] text-white hover:bg-[#1e40af] transition-all cursor-pointer hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98]"
                >
                  <span>Explore Projects</span>
                  <span className="transition-transform duration-150 ease-out group-hover:translate-y-0.5">↓</span>
                </a>

                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded border border-[#e0d9cd] bg-[#ffffff] text-[#1c1917] hover:border-[#1d4ed8] hover:text-[#1d4ed8] transition-all cursor-pointer hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98]"
                >
                  <span>View Repositories</span>
                  <span className="transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowCli(!showCli)}
                  className="text-xs font-serif text-[#1d4ed8] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>
                    {showCli ? 'Close command interface ‹' : 'Open keyboard terminal ›'}
                  </span>
                </button>
              </div>

              <CollapsibleTerminal isOpen={showCli} reducedMotion={reducedMotion} />
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center justify-center w-full">
            <SketchReveal />
          </div>
        </div>
      )}
    </section>
  );
};
