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

  const isStdout = theme === 'stdout';

  // Keyboard Escape listener and focus management
  useEffect(() => {
    if (!project) return;

    // Save previous active element to restore focus on close
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;

    // Focus close button initially
    closeButtonRef.current?.focus();

    // Prevent body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Simple focus trap
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
      // Return focus to trigger or previous element
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs transition-opacity"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border shadow-xl p-6 sm:p-8 transition-colors ${
          isStdout
            ? 'bg-[#161b22] border-[#30363d] text-[#e6edf3]'
            : 'bg-[#ffffff] border-[#e3ded2] text-[#302d29]'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-inherit">
          <div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-1">
              <span>{project.status}</span>
              <span aria-hidden="true">·</span>
              <span>Engineering Dossier</span>
            </div>
            <h2
              id="dialog-title"
              className={`text-xl sm:text-2xl font-bold tracking-tight ${
                isStdout ? 'font-mono text-[#58a6ff]' : 'font-serif text-[#0d5c6e]'
              }`}
            >
              {project.title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close project dialog"
            className={`p-1.5 rounded border transition-colors cursor-pointer ${
              isStdout
                ? 'border-[#30363d] text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]'
                : 'border-[#e3ded2] text-[#686158] hover:text-[#302d29] hover:bg-[#fbf7ee]'
            }`}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-6 pt-4 text-sm leading-relaxed" id="dialog-description">
          {/* Subtitle / Kicker */}
          <p className="text-base font-medium text-[var(--text-secondary)] italic">
            {project.subtitle}
          </p>

          {/* Problem & Motivation */}
          <div>
            <h3 className={`text-xs uppercase tracking-wider font-semibold mb-2 ${
              isStdout ? 'text-[#3fb950] font-mono' : 'text-[#8a5a00] font-sans'
            }`}>
              Problem & Exploration Scope
            </h3>
            <p className="text-[var(--text-primary)]">
              {project.problem}
            </p>
          </div>

          {/* What Was Built */}
          <div>
            <h3 className={`text-xs uppercase tracking-wider font-semibold mb-2 ${
              isStdout ? 'text-[#3fb950] font-mono' : 'text-[#8a5a00] font-sans'
            }`}>
              Implementation & Approach
            </h3>
            <p className="text-[var(--text-primary)]">
              {project.built}
            </p>
          </div>

          {/* Architecture */}
          <div>
            <h3 className={`text-xs uppercase tracking-wider font-semibold mb-2 ${
              isStdout ? 'text-[#58a6ff] font-mono' : 'text-[#0d5c6e] font-sans'
            }`}>
              Internal Architecture & Data Structures
            </h3>
            <div className={`p-3 rounded border text-xs font-mono leading-relaxed ${
              isStdout ? 'bg-[#0d1117] border-[#30363d] text-[#e6edf3]' : 'bg-[#fbf7ee] border-[#e3ded2] text-[#302d29]'
            }`}>
              {project.architecture}
            </div>
          </div>

          {/* Lessons Learned */}
          <div>
            <h3 className={`text-xs uppercase tracking-wider font-semibold mb-2 ${
              isStdout ? 'text-[#3fb950] font-mono' : 'text-[#8a5a00] font-sans'
            }`}>
              Engineering Takeaways & Lessons
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-xs text-[var(--text-secondary)]">
              {project.lessonsLearned.map((lesson, idx) => (
                <li key={idx}>
                  <span className="text-[var(--text-primary)]">{lesson}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack - Zero Pill Discipline */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)] mb-2">
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
          <div className="pt-4 border-t border-inherit flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[var(--text-muted)] italic">
              * Illustrative repository placeholder
            </span>
            <div className="flex items-center gap-3">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
                  isStdout
                    ? 'border-[#30363d] text-[#58a6ff] hover:bg-[#21262d]'
                    : 'border-[#e3ded2] text-[#0d5c6e] hover:bg-[#fbf7ee]'
                }`}
              >
                <GitFork className="w-3.5 h-3.5" aria-hidden="true" />
                <span>View Repository</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
              <button
                onClick={onClose}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                  isStdout
                    ? 'bg-[#21262d] text-[#e6edf3] hover:bg-[#30363d]'
                    : 'bg-[#f4efe2] text-[#302d29] hover:bg-[#e3ded2]'
                }`}
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
