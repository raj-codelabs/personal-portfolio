import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import { projectsData } from '../data/projects';
import { ProjectDialog } from '../components/ProjectDialog';
import { useTheme } from '../context/ThemeContext';
import { ExternalLink, Terminal, ChevronRight, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { spring, distance } from '../motion/motion-tokens';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

export const Projects: React.FC = () => {
  const { theme } = useTheme();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const isStdout = theme === 'stdout';

  const reducedMotion = useReducedMotionGlobal();
  const [isTouch, setIsTouch] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Primary featured project is the AI Study Notes Summarizer
  const summarizer = projectsData[0];

  const handleOpenCaseStudy = () => {
    setSelectedProject(summarizer);
  };

  // Section 7.1: Featured project card pointer parallax on the preview (up to 4px opposite pointer)
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (isTouch || reducedMotion) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;
    setParallax({
      x: -normX * 4,
      y: -normY * 4,
    });
  };

  const handlePointerLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-12 sm:py-16 space-y-8 text-left scroll-mt-16"
    >
      {/* Section Header with Section 5 reveals (50ms stagger) */}
      <div className="pb-4 relative">
        <motion.div
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={spring.settle}
        >
          {isStdout ? (
            <div className="text-xs font-mono text-[#00e5c0] mb-1">
              FEATURED CASE STUDY
            </div>
          ) : (
            <div className="text-sm font-handwriting text-[#1d4ed8] font-bold mb-1">
              Featured Case Study
            </div>
          )}
        </motion.div>

        <motion.h2
          id="projects-heading"
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={{ ...spring.settle, delay: 0.05 }}
          className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${
            isStdout ? 'font-mono' : 'font-serif'
          }`}
        >
          Projects
        </motion.h2>

        <motion.p
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={{ ...spring.settle, delay: 0.1 }}
          className="text-sm sm:text-base text-[var(--text-secondary)] font-body mt-1 max-w-xl"
        >
          Practical tools and software applications built step by step to solve real everyday problems.
        </motion.p>

        {/* Section hairline rule: scaleX 0 to 1, origin left, soft spring (Section 5) */}
        <motion.div
          data-reveal
          initial={reducedMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={spring.soft}
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--border-subtle)] origin-left"
          aria-hidden="true"
        />
      </div>

      {/* Featured Full-Width Case Study Card (Section 7.1) */}
      <motion.article
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        data-reveal
        initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
        transition={spring.settle}
        whileHover={
          reducedMotion || isTouch
            ? undefined
            : {
                y: -2,
                transition: spring.snap,
              }
        }
        whileTap={reducedMotion ? undefined : { scale: 0.99 }}
        className={`rounded-xl border p-6 sm:p-8 transition-colors ${
          isStdout
            ? 'border-[#242e40] bg-[#121722] hover:border-[#00e5c0] hover:shadow-[0_0_16px_rgba(0,229,192,0.2)] font-mono text-[#94a3b8]'
            : 'border-[#e2dbce] bg-[#ffffff] hover:border-[#1d4ed8] hover:shadow-md font-serif text-[#44403c]'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Text & Details (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Badge & Stack */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`px-2.5 py-0.5 rounded font-semibold text-[11px] ${
                  isStdout
                    ? 'bg-[#00e5c0]/15 text-[#00e5c0] border border-[#00e5c0]/40 font-mono'
                    : 'bg-[#1d4ed8]/10 text-[#1d4ed8] border border-[#1d4ed8]/30 font-serif'
                }`}
              >
                Open source
              </span>
              <span className="text-[var(--border-subtle)]" aria-hidden="true">·</span>
              <div className="flex flex-wrap items-center gap-x-2 text-xs font-mono text-[var(--text-secondary)]">
                <span>Python</span>
                <span className="opacity-40">·</span>
                <span>LLM API</span>
                <span className="opacity-40">·</span>
                <span className="text-[var(--text-primary)] font-medium">CLI (Rich / Argparse)</span>
              </div>
            </div>

            {/* Title */}
            <h3
              className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${
                isStdout ? 'font-mono' : 'font-serif'
              }`}
            >
              {summarizer.title}
            </h3>

            {/* What it does */}
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-body">
              A command-line tool built with Python that ingests lecture notes, formats prompts for structured extraction, and prints concise review points and key terms directly to the terminal.
            </p>

            {/* Result / Concrete takeaway */}
            <div
              className={`p-3.5 rounded border text-xs sm:text-sm ${
                isStdout
                  ? 'border-[#242e40] bg-[#0d121c] text-[#f1f5f9]'
                  : 'border-[#e2dbce] bg-[#faf8f5] text-[#1c1917]'
              }`}
            >
              <span className="font-bold text-[var(--accent-primary)] mr-1">Result:</span>
              <span className="text-[var(--text-secondary)] font-body">
                Streamlined lecture review workflows and established solid habits around token budget management and command-line parsing.
              </span>
            </div>

            {/* Action Buttons with Section 7.2 micro-motion */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <motion.button
                ref={triggerRef}
                type="button"
                onClick={handleOpenCaseStudy}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                transition={spring.snap}
                className={`group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-bold transition-all cursor-pointer shadow-xs focus-visible:outline-2 ${
                  isStdout
                    ? 'bg-[#00e5c0] text-[#0b0e14] hover:bg-[#33ebd0] font-mono'
                    : 'bg-[#1d4ed8] text-white hover:bg-[#1e40af] font-serif'
                }`}
              >
                <span>Case study</span>
                <ChevronRight className="w-4 h-4 transition-transform duration-150 ease-out group-hover/btn:translate-x-1" />
              </motion.button>

              <motion.a
                href="https://github.com/raj-codelabs"
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
                <span>GitHub ↗</span>
                <ExternalLink className="w-3.5 h-3.5 transition-transform duration-150 ease-out group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </motion.a>
            </div>
          </div>

          {/* Right Column: Code Excerpt & Terminal Preview with clip-path mask reveal (Section 5) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pb-1">
              <div className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>summarizer.py</span>
              </div>
              <span className="text-[11px] text-[#00e5c0]">CLI Extraction</span>
            </div>

            {/* Featured screenshot / code clip-path reveal (Section 5: clip-path inset(6% round 8px) to inset(0) + fade, soft) */}
            <motion.pre
              data-reveal
              initial={
                reducedMotion
                  ? false
                  : {
                      clipPath: 'inset(6% round 8px)',
                      opacity: 0,
                    }
              }
              whileInView={{
                clipPath: 'inset(0% round 8px)',
                opacity: 1,
              }}
              viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
              transition={spring.soft}
              className={`p-4 rounded-lg border overflow-x-auto text-xs font-mono leading-relaxed ${
                isStdout
                  ? 'border-[#242e40] bg-[#0b0e14] text-[#f1f5f9]'
                  : 'border-[#e2dbce] bg-[#fbf9f6] text-[#1c1917]'
              }`}
            >
{`# AI Study Notes Summarizer - core extraction utility
def extract_study_takeaways(notes_text: str, max_points: int = 5) -> list[str]:
    """Splits raw lecture notes into concise review points."""
    if not notes_text.strip():
        return []
    
    # Split into clean, non-empty sentences
    import re
    sentences = [s.strip() for s in re.split(r'[.?!]\\s+', notes_text) if s.strip()]
    
    # Rank sentences by informational length and keyword density
    ranked = sorted(sentences, key=len, reverse=True)
    return ranked[:max_points]`}
            </motion.pre>

            <div
              className={`p-3 rounded border text-xs font-mono space-y-1 ${
                isStdout
                  ? 'border-[#242e40] bg-[#0d121c] text-[#94a3b8]'
                  : 'border-[#e2dbce] bg-[#faf8f5] text-[#686158]'
              }`}
            >
              <div className="text-[11px] font-bold text-[var(--accent-primary)] flex items-center gap-1">
                <Terminal className="w-3 h-3" />
                <span>$ python summarizer.py --input notes.md</span>
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] pl-2">
                ✓ Extracted 4 key definitions and 5 bullet takeaways in 0.4s
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      {/* Ideas single text line */}
      <div className="pt-2 text-xs sm:text-sm text-[var(--text-muted)] font-mono">
        <span className="font-bold text-[var(--text-secondary)]">Next:</span>{' '}
        <span>PrereqOS (prerequisite graph for learning topics) · Book Recommendation Engine (planned)</span>
      </div>

      {/* Case Study Modal Dialog with Fluid AnimatePresence */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDialog
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            triggerRef={triggerRef}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
