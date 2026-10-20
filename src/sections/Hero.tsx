import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { CommandPrompt } from '../components/CommandPrompt';
import { DeveloperIdCard } from '../components/DeveloperIdCard';
import { SketchReveal } from '../components/SketchReveal';
import { ArrowDown, ExternalLink, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import { spring, distance } from '../motion/motion-tokens';
import { useIntroAnimation } from '../motion/useIntroAnimation';

export const Hero: React.FC = () => {
  const { theme } = useTheme();
  const { profile } = useCms();
  const [showCli, setShowCli] = useState(false);
  const [cursorBlinking, setCursorBlinking] = useState(true);
  const [typedWhoami, setTypedWhoami] = useState('whoami');

  const { isIntroComplete, reducedMotion } = useIntroAnimation();
  const isStdout = theme === 'stdout';

  const name = profile?.name || 'Raj Golder';
  const github = profile?.contact?.github || 'https://github.com/raj-codelabs';

  // Section 3.1: Terminal whoami typing sequence (0–280ms, ~40ms/char)
  useEffect(() => {
    if (isIntroComplete || reducedMotion) {
      setTypedWhoami('whoami');
      return;
    }

    const text = 'whoami';
    let idx = 0;
    setTypedWhoami('');

    const interval = setInterval(() => {
      idx++;
      setTypedWhoami(text.slice(0, idx));
      if (idx >= text.length) {
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [isIntroComplete, reducedMotion]);

  // Section 3.1: Blinking cursor stops blinking after ~3s, stays solid
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
            {/* 1. 0ms: Eyebrow fades in & header whoami command */}
            <motion.div
              initial={isIntroComplete || reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="space-y-1"
            >
              <div className="text-xs font-mono text-[#64748b] flex items-center gap-1.5 pb-0.5">
                <span className="text-[#00e5c0] font-bold">$</span>
                <span className="text-[#94a3b8]">{typedWhoami}</span>
                <span
                  className={`text-[#00e5c0] ${
                    cursorBlinking && !reducedMotion ? 'animate-pulse' : 'opacity-100'
                  }`}
                  aria-hidden="true"
                >
                  ▌
                </span>
              </div>
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#e27d60]">
                B.TECH CSE (AI/ML) · CLASS OF 2030
              </div>
            </motion.div>

            {/* 3. 150ms: H1 lines rise 12px + fade, 60ms stagger (Text in DOM from first paint) */}
            <h1 className="text-3xl sm:text-5xl font-mono font-bold tracking-tight text-[#f1f5f9] leading-[1.15]">
              <motion.span
                className="block"
                initial={isIntroComplete || reducedMotion ? false : { opacity: 0, y: distance.reveal }}
                animate={{ opacity: 1, y: 0 }}
                transition={isIntroComplete || reducedMotion ? { duration: 0 } : { ...spring.settle, delay: 0.15 }}
              >
                I build small,
              </motion.span>
              <motion.span
                className="block"
                initial={isIntroComplete || reducedMotion ? false : { opacity: 0, y: distance.reveal }}
                animate={{ opacity: 1, y: 0 }}
                transition={isIntroComplete || reducedMotion ? { duration: 0 } : { ...spring.settle, delay: 0.21 }}
              >
                useful tools in
              </motion.span>
              <motion.span
                className="block"
                initial={isIntroComplete || reducedMotion ? false : { opacity: 0, y: distance.reveal }}
                animate={{ opacity: 1, y: 0 }}
                transition={isIntroComplete || reducedMotion ? { duration: 0 } : { ...spring.settle, delay: 0.27 }}
              >
                Python
                <span
                  className={`text-[#00e5c0] ${
                    cursorBlinking && !reducedMotion ? 'animate-pulse' : 'opacity-100'
                  }`}
                  aria-hidden="true"
                >
                  _
                </span>
              </motion.span>
            </h1>

            {/* 4. 450ms: Subhead, NOW status, CTAs fade/rise (settle) */}
            <motion.div
              initial={isIntroComplete || reducedMotion ? false : { opacity: 0, y: distance.reveal }}
              animate={{ opacity: 1, y: 0 }}
              transition={isIntroComplete || reducedMotion ? { duration: 0 } : { ...spring.settle, delay: 0.45 }}
              className="space-y-4"
            >
              <p className="text-base sm:text-lg text-[#94a3b8] font-body leading-relaxed max-w-2xl">
                First-year CSE (AI/ML) student studying at MATS University. CS50x and CS50P completed. Currently building AI tools for studying.
              </p>

              {/* NOW status line */}
              <div className="text-xs font-mono text-[#64748b] flex items-center gap-2 pt-1">
                <span className="text-[#00e5c0] font-bold">NOW:</span>
                <span className="text-[#94a3b8]">AI Study Notes Summarizer · C · DSA basics</span>
              </div>

              {/* Action Triggers with hover nudges and active press (Section 7.2) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <motion.a
                  href="#projects"
                  whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                  transition={spring.snap}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold font-mono rounded bg-[#00e5c0] text-[#0b0e14] hover:bg-[#33ebd0] transition-colors shadow-xs cursor-pointer"
                >
                  <span>See my work</span>
                  <ArrowDown
                    className="w-3.5 h-3.5 transition-transform duration-150 ease-out group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                </motion.a>

                <motion.a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                  transition={spring.snap}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium font-mono rounded border border-[#242e40] bg-[#121722] text-[#f1f5f9] hover:border-[#00e5c0] hover:text-[#00e5c0] transition-colors cursor-pointer"
                >
                  <span>GitHub</span>
                  <ExternalLink
                    className="w-3 h-3 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </motion.a>
              </div>

              {/* Demoted prober */}
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
            </motion.div>
          </div>

          {/* 5. 550ms: Badge scales 0.96 to 1 + fades (soft spring, Section 3.1) */}
          <motion.div
            initial={isIntroComplete || reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={isIntroComplete || reducedMotion ? { duration: 0 } : { ...spring.soft, delay: 0.55 }}
            className="lg:col-span-5 flex flex-col items-center justify-start w-full"
          >
            <DeveloperIdCard />
          </motion.div>
        </div>
      ) : (
        /* ========================================================================= */
        /* THEME 2: WHITE MODE (margin-notes) — Physical Engineering Notebook        */
        /* ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start font-serif">
          {/* Left Column: Notebook Journal Introduction */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. 0ms: Script eyebrow fades in */}
            <motion.div
              initial={isIntroComplete || reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-xs font-serif uppercase tracking-wider text-[#c25e38] font-bold"
            >
              B.TECH CSE (AI/ML) · CLASS OF 2030
            </motion.div>

            {/* 2. 100ms: H1 lines rise 12px + fade, 60ms stagger */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-[#1c1917] leading-[1.12]">
              <motion.span
                className="block"
                initial={isIntroComplete || reducedMotion ? false : { opacity: 0, y: distance.reveal }}
                animate={{ opacity: 1, y: 0 }}
                transition={isIntroComplete || reducedMotion ? { duration: 0 } : { ...spring.settle, delay: 0.1 }}
              >
                I build small,
              </motion.span>
              <motion.span
                className="block"
                initial={isIntroComplete || reducedMotion ? false : { opacity: 0, y: distance.reveal }}
                animate={{ opacity: 1, y: 0 }}
                transition={isIntroComplete || reducedMotion ? { duration: 0 } : { ...spring.settle, delay: 0.16 }}
              >
                useful tools in
              </motion.span>
              <motion.span
                className="block"
                initial={isIntroComplete || reducedMotion ? false : { opacity: 0, y: distance.reveal }}
                animate={{ opacity: 1, y: 0 }}
                transition={isIntroComplete || reducedMotion ? { duration: 0 } : { ...spring.settle, delay: 0.22 }}
              >
                Python.
              </motion.span>
            </h1>

            {/* 4. 500ms: Subhead, CTAs fade/rise */}
            <motion.div
              initial={isIntroComplete || reducedMotion ? false : { opacity: 0, y: distance.reveal }}
              animate={{ opacity: 1, y: 0 }}
              transition={isIntroComplete || reducedMotion ? { duration: 0 } : { ...spring.settle, delay: 0.5 }}
              className="space-y-4"
            >
              <p className="text-base sm:text-lg text-[#44403c] font-serif leading-relaxed max-w-2xl">
                First-year CSE (AI/ML) student studying at MATS University. CS50x and CS50P completed. Currently building AI tools for studying.
              </p>

              {/* NOW status line */}
              <div className="text-sm font-handwriting text-[#78716c]">
                <span className="text-[#1d4ed8] font-bold">Now: </span>
                AI Study Notes Summarizer · C · DSA basics
              </div>

              {/* Action Triggers with hover nudges and active press (Section 7.2) */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-sm font-serif">
                <motion.a
                  href="#projects"
                  whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                  transition={spring.snap}
                  className="group text-[#1d4ed8] hover:text-[#1e40af] font-medium underline underline-offset-4 decoration-[#93c5fd] hover:decoration-[#1d4ed8] transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>See my work</span>
                  <span className="transition-transform duration-150 ease-out group-hover:translate-y-0.5">↓</span>
                </motion.a>

                <motion.a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                  transition={spring.snap}
                  className="group text-[#44403c] hover:text-[#1c1917] underline underline-offset-4 decoration-[#c2b8a3] hover:decoration-[#44403c] transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>GitHub</span>
                  <span className="transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                </motion.a>
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
            </motion.div>
          </div>

          {/* 3. 150ms: Portrait draw-in: fade from graphite layer over 600ms (Section 3.2) */}
          <motion.div
            initial={isIntroComplete || reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={isIntroComplete || reducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-5 flex flex-col items-center justify-start w-full"
          >
            <SketchReveal />
          </motion.div>
        </div>
      )}
    </section>
  );
};
