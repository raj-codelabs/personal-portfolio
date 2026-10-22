import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { CommandPrompt } from '../components/CommandPrompt';
import { DeveloperIdCard } from '../components/DeveloperIdCard';
import { SketchReveal } from '../components/SketchReveal';
import { ArrowDown, ExternalLink, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import { spring, distance } from '../motion/motion-tokens';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

export const Hero: React.FC = () => {
  const { theme } = useTheme();
  const { profile } = useCms();
  const [showCli, setShowCli] = useState(false);
  const [cursorBlinking, setCursorBlinking] = useState(true);
  const reducedMotion = useReducedMotionGlobal();
  const isStdout = theme === 'stdout';

  const name = profile?.name || 'Raj Golder';
  const github = profile?.contact?.github || 'https://github.com/raj-codelabs';

  // Section 1.8: Check whether cover was skipped on initial load (same session, hash, etc.)
  const [coverSkippedOnLoad] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    if (window.location.hash && window.location.hash.length > 1) return true;
    if (document.documentElement.classList.contains('skip-cover')) return true;
    try {
      return sessionStorage.getItem('coverSeen') === '1';
    } catch {
      return false;
    }
  });

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

  // Section 1.8: Entrance animation props
  // If cover skipped on load -> runs on load with delays (max 1.1s)
  // If cover exists -> runs once when hero enters viewport (standard reveal)
  const getRevealProps = (delayOnLoad: number) => {
    if (reducedMotion) {
      return {
        initial: false,
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      };
    }

    if (coverSkippedOnLoad) {
      return {
        initial: { opacity: 0, y: distance.reveal },
        animate: { opacity: 1, y: 0 },
        transition: { ...spring.settle, delay: delayOnLoad },
      };
    }

    return {
      initial: { opacity: 0, y: distance.reveal },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.15, margin: '0px 0px -10% 0px' },
      transition: { ...spring.settle, delay: Math.min(delayOnLoad * 0.5, 0.2) },
    };
  };

  return (
    <section
      id="hero"
      aria-label="Engineering Introduction"
      className="relative py-10 sm:py-16 space-y-10 text-left scroll-mt-16"
    >
      {/* Anchor for #home navigation compatibility */}
      <div id="home" className="absolute -top-16 pointer-events-none" aria-hidden="true" />

      {/* ========================================================================= */}
      {/* THEME 1: DARK MODE (stdout) — Developer Terminal                          */}
      {/* ========================================================================= */}
      {isStdout ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Terminal Introduction */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Static whoami subtitle (Section 1.8: Terminal header subtitle whoami is static) */}
            <motion.div
              {...getRevealProps(0.0)}
              className="space-y-1"
            >
              <div className="text-xs font-mono text-[#64748b] flex items-center gap-1.5 pb-0.5">
                <span className="text-[#00e5c0] font-bold">$</span>
                <span className="text-[#94a3b8]">whoami</span>
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

            {/* 2. H1 lines rise 12px + fade, 60ms stagger (Text in DOM from first paint) */}
            <h1 className="text-3xl sm:text-5xl font-mono font-bold tracking-tight text-[#f1f5f9] leading-[1.15]">
              <motion.span
                className="block"
                {...getRevealProps(0.15)}
              >
                I build small,
              </motion.span>
              <motion.span
                className="block"
                {...getRevealProps(0.21)}
              >
                useful tools in
              </motion.span>
              <motion.span
                className="block"
                {...getRevealProps(0.27)}
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

            {/* 3. Subhead, NOW status, CTAs fade/rise (settle) */}
            <motion.div
              {...getRevealProps(0.45)}
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

          {/* Badge: Scale-in starts on hero enter or on load (Section 1.8 & 3.1) */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={
              reducedMotion
                ? { opacity: 1, scale: 1 }
                : coverSkippedOnLoad
                ? { opacity: 1, scale: 1 }
                : undefined
            }
            whileInView={
              !reducedMotion && !coverSkippedOnLoad
                ? { opacity: 1, scale: 1 }
                : undefined
            }
            viewport={{ once: true, amount: 0.2 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : coverSkippedOnLoad
                ? { ...spring.soft, delay: 0.55 }
                : spring.soft
            }
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
            {/* 1. Script eyebrow fades in */}
            <motion.div
              {...getRevealProps(0.0)}
              className="text-xs font-serif uppercase tracking-wider text-[#c25e38] font-bold"
            >
              B.TECH CSE (AI/ML) · CLASS OF 2030
            </motion.div>

            {/* 2. H1 lines rise 12px + fade, 60ms stagger */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-[#1c1917] leading-[1.12]">
              <motion.span
                className="block"
                {...getRevealProps(0.1)}
              >
                I build small,
              </motion.span>
              <motion.span
                className="block"
                {...getRevealProps(0.16)}
              >
                useful tools in
              </motion.span>
              <motion.span
                className="block"
                {...getRevealProps(0.22)}
              >
                Python.
              </motion.span>
            </h1>

            {/* 3. Subhead, CTAs fade/rise */}
            <motion.div
              {...getRevealProps(0.5)}
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

          {/* Portrait draw-in: Starts on hero enter or on load (Section 1.8 & 3.2) */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={
              reducedMotion
                ? { opacity: 1 }
                : coverSkippedOnLoad
                ? { opacity: 1 }
                : undefined
            }
            whileInView={
              !reducedMotion && !coverSkippedOnLoad
                ? { opacity: 1 }
                : undefined
            }
            viewport={{ once: true, amount: 0.2 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : coverSkippedOnLoad
                ? { duration: 0.6, delay: 0.15, ease: 'easeOut' }
                : { duration: 0.6, ease: 'easeOut' }
            }
            className="lg:col-span-5 flex flex-col items-center justify-start w-full"
          >
            <SketchReveal />
          </motion.div>
        </div>
      )}
    </section>
  );
};
