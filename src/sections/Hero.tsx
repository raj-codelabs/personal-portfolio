import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { CommandPrompt } from '../components/CommandPrompt';
import { DeveloperIdCard } from '../components/DeveloperIdCard';
import { SketchReveal } from '../components/SketchReveal';
import { ArrowDown, ExternalLink, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { spring, distance } from '../motion/motion-tokens';
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

  // ponytail: Direct entrance animations with staggered delay; reduced motion disables all movement
  const getRevealProps = (delay: number) => {
    if (reducedMotion) {
      return {
        initial: false,
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      };
    }
    return {
      initial: { opacity: 0, y: distance.reveal },
      animate: { opacity: 1, y: 0 },
      transition: { ...spring.settle, delay },
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
              <div className="text-xs font-mono text-[#6b7586] flex items-center gap-1.5 pb-0.5">
                <span className="text-[var(--accent-primary)] font-bold">$</span>
                <span className="text-[#9aa2b1]">whoami</span>
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
                B.TECH CSE (AI/ML) · CLASS OF 2030
              </div>
            </motion.div>

            {/* 2. H1 lines rise 12px + fade, 60ms stagger */}
            <h1 className="text-[clamp(2.1rem,5vw,3.75rem)] font-mono font-bold tracking-tight text-[#f6f5f1] leading-[1.12]">
              <motion.span
                className="block text-[#f6f5f1]"
                {...getRevealProps(0.15)}
              >
                I build small,
              </motion.span>
              <motion.span
                className="block text-[#cbd5e1]"
                {...getRevealProps(0.21)}
              >
                useful tools in
              </motion.span>
              <motion.span
                className="block text-[var(--accent-primary)]"
                {...getRevealProps(0.27)}
              >
                Python
                <span
                  className={`text-[var(--accent-primary)] ${
                    cursorBlinking && !reducedMotion ? 'animate-pulse motion-reduce:animate-none' : 'opacity-100'
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
              <p className="text-base sm:text-lg text-[#9aa2b1] font-body leading-relaxed max-w-2xl">
                First-year CSE (AI/ML) student studying at MATS University. CS50x and CS50P completed. Currently building AI tools for studying.
              </p>

              {/* NOW status line */}
              <div className="text-xs font-mono text-[#6b7586] flex items-center gap-2 pt-1">
                <span className="text-[var(--accent-primary)] font-bold">NOW:</span>
                <span className="text-[#9aa2b1]">AI Study Notes Summarizer · C · DSA basics</span>
              </div>

              {/* Action Triggers with hover nudges and active press */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <motion.a
                  href="#projects"
                  whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                  transition={spring.snap}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold font-mono rounded bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors shadow-xs cursor-pointer"
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
                  className="group inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium font-mono rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
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
                  className="text-xs font-mono text-[var(--accent-primary)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {showCli ? 'Hide terminal ‹' : 'Try the terminal › (Quick keyboard-driven portfolio navigation)'}
                  </span>
                </button>
              </div>

              {/* Collapsible Interactive Terminal Prober with Smooth Height Bridge */}
              <CollapsibleTerminal isOpen={showCli} reducedMotion={reducedMotion} />
            </motion.div>
          </div>

          {/* Badge: Scale-in */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reducedMotion ? { duration: 0 } : { ...spring.soft, delay: 0.2 }}
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

            {/* 2. H1 lines rise 12px + fade, 60ms stagger (Fluid Clamp Typography) */}
            <h1 className="text-[clamp(2.4rem,5.5vw,4.25rem)] font-serif font-normal tracking-tight text-[#1c1917] leading-[1.12]">
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

              {/* Collapsible Interactive Terminal Prober with Smooth Height Bridge */}
              <CollapsibleTerminal isOpen={showCli} reducedMotion={reducedMotion} />
            </motion.div>
          </div>

          {/* Portrait draw-in */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="lg:col-span-5 flex flex-col items-center justify-start w-full"
          >
            <SketchReveal />
          </motion.div>
        </div>
      )}
    </section>
  );
};
