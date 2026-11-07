import React, { useEffect, useRef, useState } from 'react';
import { Project } from '../types';
import { useTheme } from '../context/ThemeContext';
import { X, ExternalLink, GitFork, ArrowLeft, Terminal, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { appleSprings } from '../motion/fluid-physics';
import { spring } from '../motion/motion-tokens';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

interface ProjectDialogProps {
  project: Project | null;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export const ProjectDialog: React.FC<ProjectDialogProps> = ({ project, onClose, triggerRef }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'cli' | 'engineering' | 'code'>('pipeline');
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isStdout = theme === 'stdout';

  // Keyboard Escape listener and focus management
  useEffect(() => {
    if (!project) return;

    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (triggerRef?.current) {
        triggerRef.current.focus();
      } else if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [project, onClose, triggerRef]);

  const reducedMotion = useReducedMotionGlobal();

  if (!project) return null;

  return (
    <motion.div
      role="presentation"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md"
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        onClick={(e) => e.stopPropagation()}
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
        transition={reducedMotion ? { duration: 0.14 } : appleSprings.reposition}
        style={{ transformOrigin: 'center center' }}
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border p-6 sm:p-8 shadow-2xl ${
          isStdout
            ? 'border-[#242e40] bg-[#121722]/95 border-t-white/15 text-[#f1f5f9] font-mono'
            : 'border-[#e2dbce] bg-[#ffffff]/95 border-t-white/60 text-[#1c1917] font-serif shadow-xl'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-1">
              <span className="text-[var(--accent-primary)] font-semibold uppercase">
                [{project.status}]
              </span>
              <span aria-hidden="true">·</span>
              <span>Case study</span>
            </div>
            <h2
              id="dialog-title"
              className="text-2xl font-bold tracking-tight text-[var(--text-primary)]"
            >
              {project.title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close case study dialog"
            className="p-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Interactive Tabbed Inspection Controls */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-[var(--border-subtle)] overflow-x-auto text-xs font-mono">
          {[
            { id: 'pipeline', label: '1. Pipeline & Flow' },
            { id: 'cli', label: '2. CLI Arguments' },
            { id: 'engineering', label: '3. Architecture & Trade-Offs' },
            { id: 'code', label: '4. Source Excerpt' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? isStdout
                    ? 'bg-[#00e5c0] text-[#0b0e14] font-bold'
                    : 'bg-[#1d4ed8] text-white font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body with Fluid Tab Crossfade */}
        <div className="pt-4 text-sm font-body leading-relaxed min-h-[300px]" id="dialog-description">
          <AnimatePresence mode="wait" initial={false}>
            {/* TAB 1: PIPELINE & FLOW */}
            {activeTab === 'pipeline' && (
              <motion.div
                key="pipeline"
                initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -4 }}
                transition={reducedMotion ? { duration: 0 } : spring.snap}
                className="space-y-4"
              >
              <div>
                <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--accent-primary)] mb-1.5">
                  Core Problem
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {project.problem}
                </p>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--accent-primary)] mb-1.5">
                  3-Stage Ingestion &amp; Generation Flow
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--accent-primary)] font-bold">1. Input Stream:</span>
                      <span className="text-[var(--text-secondary)]">Ingests markdown, text, or lecture transcripts from files or stdin pipe (`cat notes.md | python summarizer.py`).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--accent-primary)] font-bold">2. Chunking &amp; Prompt Budget:</span>
                      <span className="text-[var(--text-secondary)]">Divides lecture text into token-bounded sections, enforcing tight budget limits to prevent token waste and hallucinations.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[var(--accent-primary)] font-bold">3. ANSI Rich Terminal Output:</span>
                      <span className="text-[var(--text-secondary)]">Formats key concepts, exam flashcards, and definitions into colored ANSI tables ready for terminal study.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--text-muted)] mb-1.5">
                  Stack
                </h3>
                <div className="flex flex-wrap items-center gap-x-2 text-xs font-mono text-[var(--text-secondary)]">
                  {project.stack.map((tech, idx) => (
                    <React.Fragment key={tech}>
                      {idx > 0 && <span className="opacity-40">·</span>}
                      <span className="text-[var(--text-primary)] font-medium">{tech}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: CLI SPEC & FLAGS */}
          {activeTab === 'cli' && (
            <motion.div
              key="cli"
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -4 }}
              transition={reducedMotion ? { duration: 0 } : spring.snap}
              className="space-y-4"
            >
              <div>
                <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--accent-primary)] mb-1.5">
                  Command-Line Arguments Specification
                </h3>
                <div className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] space-y-3 font-mono text-xs">
                  <div className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-2">
                    <span className="text-[var(--accent-primary)] font-bold">--input, -i &lt;file&gt;</span>
                    <span className="text-[var(--text-secondary)]">Path to lecture markdown or raw notes</span>
                  </div>
                  <div className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-2">
                    <span className="text-[var(--accent-primary)] font-bold">--max-points, -n &lt;int&gt;</span>
                    <span className="text-[var(--text-secondary)]">Maximum bullet takeaways (default: 5)</span>
                  </div>
                  <div className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-2">
                    <span className="text-[var(--accent-primary)] font-bold">--format &lt;table|bullets|json&gt;</span>
                    <span className="text-[var(--text-secondary)]">Terminal presentation renderer</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-[var(--accent-primary)] font-bold">--quiet, -q</span>
                    <span className="text-[var(--text-secondary)]">Suppress progress spin and telemetry metrics</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--accent-primary)] mb-1.5">
                  Example Invocation
                </h3>
                <pre
                  className={`p-3 rounded border font-mono text-xs ${
                    isStdout
                      ? 'border-[#242e40] bg-[#0b0e14] text-[#00e5c0]'
                      : 'border-[#e2dbce] bg-[#fbf9f6] text-[#1d4ed8]'
                  }`}
                >
                  $ python summarizer.py -i cs50-lecture-03.md -n 4 --format table
                </pre>
              </div>
            </motion.div>
          )}

          {/* TAB 3: ARCHITECTURE & TRADE-OFFS */}
          {activeTab === 'engineering' && (
            <motion.div
              key="engineering"
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -4 }}
              transition={reducedMotion ? { duration: 0 } : spring.snap}
              className="space-y-4"
            >
              <div>
                <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--accent-primary)] mb-1.5">
                  Languages: Python vs C Invariants
                </h3>
                <div className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs font-mono space-y-2">
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    <span className="text-[var(--text-primary)] font-bold">Why Python for this project:</span> Python offers expressive string slicing, `argparse`, and rapid API ergonomics needed to quickly test token prompts and text extraction heuristics.
                  </p>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    <span className="text-[var(--text-primary)] font-bold">Contrast with CS50x in C:</span> In C, string manipulation requires explicit `malloc`/`free` memory lifecycles, bounds checking, and pointer arithmetic. Building in both languages builds intuition for where high-level developer velocity matters versus where low-level memory efficiency is vital.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--accent-primary)] mb-1.5">
                  Key Learnings &amp; Future Iterations
                </h3>
                <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                  {project.lessonsLearned.map((lesson, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                      <span>{lesson}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                    <span>Future upgrade: Offline SQLite caching of hashed note digests to prevent redundant calls.</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* TAB 4: SOURCE EXCERPT */}
          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -4 }}
              transition={reducedMotion ? { duration: 0 } : spring.snap}
              className="space-y-4"
            >
              <div>
                <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--accent-primary)] mb-1.5">
                  Source: <span className="text-[var(--text-secondary)] font-normal">summarizer.py</span>
                </h3>
                <pre
                  className={`p-4 rounded-lg border overflow-x-auto text-xs font-mono leading-relaxed ${
                    isStdout
                      ? 'border-[#242e40] bg-[#0b0e14] text-[#f1f5f9]'
                      : 'border-[#e2dbce] bg-[#fbf9f6] text-[#1c1917]'
                  }`}
                >
{`def extract_study_takeaways(notes_text: str, max_points: int = 5) -> list[str]:
    """Splits raw lecture notes into concise review points."""
    if not notes_text.strip():
        return []
    
    # Split into clean, non-empty sentences
    import re
    sentences = [s.strip() for s in re.split(r'[.?!]\\s+', notes_text) if s.strip()]
    
    # Rank sentences by informational length and keyword density
    ranked = sorted(sentences, key=len, reverse=True)
    return ranked[:max_points]`}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

          {/* Action Links */}
          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Public GitHub repository
            </span>
            <div className="flex items-center gap-3">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-colors"
              >
                <GitFork className="w-3.5 h-3.5" aria-hidden="true" />
                <span>GitHub ↗</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Close</span>
              </button>
            </div>
          </div>
      </motion.div>
    </motion.div>
  );
};
