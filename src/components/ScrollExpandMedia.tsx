/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Project } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Terminal, Code2, ChevronRight, ExternalLink, Sparkles, Layers } from 'lucide-react';
import { spring } from '../motion/motion-tokens';

interface ScrollExpandMediaProps {
  project: Project;
  onOpenCaseStudy: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export const ScrollExpandMedia: React.FC<ScrollExpandMediaProps> = ({
  project,
  onOpenCaseStudy,
  triggerRef,
}) => {
  const { theme } = useTheme();
  const isStdout = theme === 'stdout';
  const reducedMotion = useReducedMotionGlobal();
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position through the kinetic expansion stage
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 24,
    mass: 0.4,
  });

  // Kinetic interpolation transforms
  const scale = useTransform(smoothProgress, [0, 1], [0.92, 1]);
  const borderRadius = useTransform(smoothProgress, [0, 1], ['24px', '12px']);
  const blurValue = useTransform(smoothProgress, [0, 0.8], ['12px', '0px']);
  const opacity = useTransform(smoothProgress, [0, 0.3, 1], [0.6, 0.9, 1]);

  return (
    <div
      ref={containerRef}
      className="relative w-full py-4 sm:py-6"
    >
      <motion.article
        style={{
          scale: reducedMotion ? 1 : scale,
          borderRadius: reducedMotion ? '12px' : borderRadius,
          opacity: reducedMotion ? 1 : opacity,
        }}
        className={`relative overflow-hidden border p-6 sm:p-8 transition-colors ${
          isStdout
            ? 'border-[#242e40] bg-[#121722] hover:border-[#00e5c0] shadow-[0_0_24px_rgba(0,229,192,0.12)] font-mono text-[#94a3b8]'
            : 'border-[#e2dbce] bg-[#ffffff] hover:border-[#1d4ed8] shadow-md font-serif text-[#44403c]'
        }`}
      >
        {/* Kinetic Header Perimeter */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded font-semibold text-[11px] uppercase tracking-wider ${
                isStdout
                  ? 'bg-[#00e5c0]/15 text-[#00e5c0] border border-[#00e5c0]/40 font-mono'
                  : 'bg-[#1d4ed8]/10 text-[#1d4ed8] border border-[#1d4ed8]/30 font-serif'
              }`}
            >
              [KINETIC EXPAND STAGE]
            </span>
            <span className="text-[var(--border-subtle)]">·</span>
            <span className="font-mono text-[var(--text-secondary)]">Python CLI Specimen</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dual-Layer Unblur Stage // 120 FPS</span>
          </div>
        </div>

        {/* Content & Code Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
          {/* Left Column: Project Overview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]">
              <span>Python 3.12</span>
              <span>·</span>
              <span>LLM Token Pipeline</span>
              <span>·</span>
              <span className="text-[var(--accent-primary)] font-bold">CLI (Rich / Argparse)</span>
            </div>

            <h3
              className={`text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] ${
                isStdout ? 'font-mono' : 'font-serif'
              }`}
            >
              {project.title}
            </h3>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-body">
              {project.subtitle || project.built}
            </p>

            <div
              className={`p-4 rounded border text-xs sm:text-sm space-y-1.5 ${
                isStdout
                  ? 'border-[#242e40] bg-[#0d121c] text-[#f1f5f9]'
                  : 'border-[#e2dbce] bg-[#faf8f5] text-[#1c1917]'
              }`}
            >
              <div className="font-bold text-[var(--accent-primary)] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Core Architectural Principle:</span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed font-body">
                First-principles study notes summarization focused on zero-bloat CLI parsing, structured prompt budgeting, and clean ANSI ANSI-colored terminal review decks.
              </p>
            </div>

            {/* Action Triggers */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <motion.button
                ref={triggerRef}
                type="button"
                onClick={onOpenCaseStudy}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                transition={spring.snap}
                className={`group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-bold transition-all cursor-pointer shadow-xs focus-visible:outline-2 ${
                  isStdout
                    ? 'bg-[#00e5c0] text-[#0b0e14] hover:bg-[#33ebd0] font-mono'
                    : 'bg-[#1d4ed8] text-white hover:bg-[#1e40af] font-serif'
                }`}
              >
                <span>Interactive Inspect</span>
                <ChevronRight className="w-4 h-4 transition-transform duration-150 ease-out group-hover/btn:translate-x-1" />
              </motion.button>

              <motion.a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                transition={spring.snap}
                className={`group/link inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-medium border transition-colors cursor-pointer ${
                  isStdout
                    ? 'border-[#242e40] bg-[#0d121c] text-[#f1f5f9] hover:border-[#00e5c0] hover:text-[#00e5c0] font-mono'
                    : 'border-[#e2dbce] bg-[#ffffff] text-[#1c1917] hover:border-[#1d4ed8] hover:text-[#1d4ed8] font-serif'
                }`}
              >
                <span>GitHub Repository</span>
                <ExternalLink className="w-3.5 h-3.5 transition-transform duration-150 ease-out group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </motion.a>
            </div>
          </div>

          {/* Right Column: Dual-Layer Kinetic Unblur Code Specimen */}
          <div className="lg:col-span-5 space-y-3 relative">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pb-1">
              <div className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>summarizer.py [MAIN ENTRY]</span>
              </div>
              <span className="text-[11px] text-[#00e5c0]">UNBLUR: RESOLVED</span>
            </div>

            {/* Kinetic Code Specimen Stage */}
            <motion.div
              style={{
                filter: reducedMotion ? 'none' : blurValue,
              }}
              className="relative rounded-lg border overflow-hidden"
            >
              <pre
                className={`p-4 text-xs font-mono leading-relaxed overflow-x-auto ${
                  isStdout
                    ? 'border-[#242e40] bg-[#0b0e14] text-[#f1f5f9]'
                    : 'border-[#e2dbce] bg-[#fbf9f6] text-[#1c1917]'
                }`}
              >
{`def extract_study_takeaways(notes_text: str, max_points: int = 5) -> list[str]:
    """Splits raw lecture notes into concise review points."""
    if not notes_text.strip():
        return []
    
    # Clean non-empty sentence partitioning
    sentences = [s.strip() for s in re.split(r'[.?!]\\s+', notes_text) if s.strip()]
    
    # Rank by density and conceptual weighting
    ranked = sorted(sentences, key=len, reverse=True)
    return ranked[:max_points]`}
              </pre>
            </motion.div>

            {/* Live CLI Execution Bar */}
            <div
              className={`p-3 rounded border text-xs font-mono space-y-1 ${
                isStdout
                  ? 'border-[#242e40] bg-[#0d121c] text-[#94a3b8]'
                  : 'border-[#e2dbce] bg-[#faf8f5] text-[#686158]'
              }`}
            >
              <div className="text-[11px] font-bold text-[var(--accent-primary)] flex items-center gap-1">
                <Terminal className="w-3 h-3" />
                <span>$ python summarizer.py --input lecture-04.md --format table</span>
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] pl-2">
                ✓ Parsed 1,840 tokens → Emitted 5 key concepts with zero dropped context
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
};
