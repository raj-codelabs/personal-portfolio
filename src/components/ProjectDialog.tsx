import React, { useEffect, useRef } from 'react';
import { Project } from '../types';
import { useTheme } from '../context/ThemeContext';
import { X, ExternalLink, GitFork, ArrowLeft } from 'lucide-react';

interface ProjectDialogProps {
  project: Project | null;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export const ProjectDialog: React.FC<ProjectDialogProps> = ({ project, onClose, triggerRef }) => {
  const { theme } = useTheme();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs transition-opacity duration-180 ease-[cubic-bezier(0.23,1,0.32,1)]"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xl p-6 sm:p-8 origin-center transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-reduce:animate-in motion-reduce:fade-in"
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] mb-1">
              <span className="text-[var(--accent-primary)] font-semibold">[{project.status.toUpperCase()}]</span>
              <span aria-hidden="true">·</span>
              <span>Engineering Dossier</span>
            </div>
            <h2
              id="dialog-title"
              className="text-xl sm:text-2xl font-bold font-display tracking-tight text-[var(--text-primary)]"
            >
              {project.title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close project dialog"
            className="p-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-6 pt-4 text-sm font-body leading-relaxed" id="dialog-description">
          {/* Subtitle */}
          <p className="text-sm sm:text-base font-medium text-[var(--accent-copper)] font-mono">
            {project.subtitle}
          </p>

          {/* Problem & Motivation */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--text-muted)] mb-2">
              Problem & Exploration Scope
            </h3>
            <p className="text-[var(--text-secondary)]">
              {project.problem}
            </p>
          </div>

          {/* What Was Built */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--text-muted)] mb-2">
              Implementation & Approach
            </h3>
            <p className="text-[var(--text-primary)]">
              {project.built}
            </p>
          </div>

          {/* Architecture & Invariants */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--accent-primary)] mb-2">
              Internal Architecture & Data Structures
            </h3>
            <div className="p-3.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-page)] text-xs font-mono leading-relaxed text-[var(--text-primary)]">
              {project.architecture}
            </div>
          </div>

          {/* Lessons Learned */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--text-muted)] mb-2">
              Engineering Takeaways & Invariants
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-xs font-body text-[var(--text-secondary)]">
              {project.lessonsLearned.map((lesson, idx) => (
                <li key={idx}>
                  <span className="text-[var(--text-primary)]">{lesson}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack: Clean Unboxed Text with Typographic Separators */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--text-muted)] mb-2">
              Technology Stack
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-secondary)] font-mono">
              {project.stack.map((tech, idx) => (
                <React.Fragment key={tech}>
                  {idx > 0 && <span className="text-[var(--text-muted)]" aria-hidden="true">·</span>}
                  <span className="text-[var(--text-primary)] font-medium">{tech}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* External Links */}
          <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[var(--text-muted)] font-mono">
              * Independent first-principles implementation
            </span>
            <div className="flex items-center gap-3">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors"
              >
                <GitFork className="w-3.5 h-3.5" aria-hidden="true" />
                <span>View Repository</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors cursor-pointer"
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
