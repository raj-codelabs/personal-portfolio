import React, { useEffect, useRef } from 'react';
import { Project } from '../types';
import { useTheme } from '../context/ThemeContext';
import { X, ExternalLink, GitFork, ArrowLeft, Terminal, CheckCircle2 } from 'lucide-react';

interface ProjectDialogProps {
  project: Project | null;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export const ProjectDialog: React.FC<ProjectDialogProps> = ({ project, onClose, triggerRef }) => {
  const { theme } = useTheme();
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

  if (!project) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs transition-opacity"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border p-6 sm:p-8 shadow-2xl transition-all ${
          isStdout
            ? 'border-[#242e40] bg-[#121722] text-[#f1f5f9] font-mono'
            : 'border-[#e2dbce] bg-[#ffffff] text-[#1c1917] font-serif shadow-xl'
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

        {/* Content Body */}
        <div className="space-y-6 pt-4 text-sm font-body leading-relaxed" id="dialog-description">
          {/* Problem (2 lines) */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--accent-primary)] mb-1.5">
              Problem
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {project.problem}
            </p>
          </div>

          {/* How It Works (Stack + 3-step flow) */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--accent-primary)] mb-1.5">
              How It Works &amp; Pipeline Architecture
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="text-[var(--accent-primary)] font-bold">1. Ingestion:</span>
                  <span className="text-[var(--text-secondary)]">Reads markdown or plain text study notes via CLI argument flags, scrubbing blank lines and noisy header tags.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[var(--accent-primary)] font-bold">2. Chunking &amp; Prompting:</span>
                  <span className="text-[var(--text-secondary)]">Partitions text into bounded token segments and applies structured prompt templates to extract key terms and concise summary points.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[var(--accent-primary)] font-bold">3. Terminal Formatting:</span>
                  <span className="text-[var(--text-secondary)]">Emits structured ANSI markdown and tables directly in the user's terminal using the Rich library.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Code Excerpt */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--accent-primary)] mb-1.5">
              Code Excerpt: <span className="text-[var(--text-secondary)] font-normal">summarizer.py</span>
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

          {/* What I Learned / What I'd Improve Next */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--accent-primary)] mb-1.5">
              What I Learned &amp; Next Improvements
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
                <span>Next improvement: Add local caching for processed notes to prevent redundant API token calls.</span>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--text-muted)] mb-1.5">
              Technology Stack
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
        </div>
      </div>
    </div>
  );
};
