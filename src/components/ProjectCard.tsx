import React, { useRef } from 'react';
import { Project } from '../types';
import { useTheme } from '../context/ThemeContext';
import { ExternalLink, ChevronRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onOpenDetails: (project: Project, triggerRef: React.RefObject<HTMLButtonElement | null>) => void;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenDetails, index }) => {
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();
  const isStdout = theme === 'stdout';

  const handleOpen = () => {
    onOpenDetails(project, triggerButtonRef);
  };

  return (
    <article
      className={`group relative flex flex-col justify-between p-6 text-left transition-transform transition-color transition-opacity duration-200 select-none hover:-translate-y-[2px] ${
        isStdout
          ? 'rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)] font-mono'
          : 'rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs hover:border-[var(--accent-primary)] hover:shadow-md font-serif'
      }`}
    >
      <div>
        {/* Header: Clean Editorial Index & Status */}
        {isStdout ? (
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <span className="text-[var(--accent-copper)] font-semibold">0{index + 1}</span>
              <span className="text-[var(--text-muted)]" aria-hidden="true">·</span>
              <span className="text-[var(--text-primary)] font-medium truncate">{project.id}</span>
            </div>
            <span className="text-[var(--accent-primary)] text-xs font-mono capitalize">
              {project.status}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5 font-handwriting text-base text-[var(--accent-primary)]">
              <span>Project 0{index + 1}</span>
              <span className="text-[var(--border-strong)]" aria-hidden="true">·</span>
              <span className="font-serif italic text-xs text-[var(--text-muted)]">{project.id}</span>
            </div>
            <span className="font-serif italic text-xs text-[var(--accent-copper)] font-medium capitalize">
              {project.status}
            </span>
          </div>
        )}

        {/* Project Title */}
        <h3
          className={`mb-2 font-bold transition-colors ${
            isStdout
              ? 'text-lg font-mono text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]'
              : 'text-xl font-serif text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]'
          }`}
        >
          {project.title}
        </h3>

        {/* Subtitle / Exploration Thesis */}
        <p
          className={`mb-2 ${
            isStdout
              ? 'text-xs text-[#e27d60] font-mono'
              : 'text-sm text-[#1d4ed8] font-handwriting'
          }`}
        >
          {project.subtitle}
        </p>

        {/* Problem Statement */}
        <p
          className={`leading-relaxed mb-3 line-clamp-3 ${
            isStdout
              ? 'text-xs text-[#94a3b8] font-mono'
              : 'text-sm text-[#44403c] font-serif'
          }`}
        >
          {project.problem}
        </p>

        {/* Architectural Focus */}
        <p
          className={`leading-relaxed mb-4 line-clamp-2 ${
            isStdout
              ? 'text-xs text-[#f1f5f9] font-mono'
              : 'text-xs text-[#1c1917] font-serif'
          }`}
        >
          {isStdout ? (
            <span className="text-[var(--accent-primary)] mr-1.5 font-bold">›</span>
          ) : (
            <span className="text-[var(--accent-primary)] font-bold mr-1.5">§</span>
          )}
          {project.built}
        </p>
      </div>

      <div>
        {/* Tech Stack */}
        <div
          className={`pt-3 mb-4 border-t ${
            isStdout ? 'border-[#242e40]' : 'border-[#e2dbce]'
          }`}
        >
          <div
            className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs ${
              isStdout ? 'text-[#94a3b8] font-mono' : 'text-[#78716c] font-serif'
            }`}
          >
            {project.stack.map((tech, idx) => (
              <React.Fragment key={tech}>
                {idx > 0 && <span className="opacity-40" aria-hidden="true">·</span>}
                <span className={isStdout ? 'text-[#f1f5f9]' : 'text-[#1c1917]'}>{tech}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Action Triggers: Verb + Object, Step on hover, press on click */}
        <div className="flex items-center justify-between gap-3 text-xs pt-1">
          <button
            ref={triggerButtonRef}
            type="button"
            onClick={handleOpen}
            className={`group/btn inline-flex items-center gap-1.5 py-1 cursor-pointer font-semibold focus-visible:outline-2 transition-transform transition-color transition-opacity hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] ${
              isStdout
                ? 'text-[var(--accent-primary)] hover:underline font-mono'
                : 'text-[#1d4ed8] hover:text-[#1e40af] underline underline-offset-4 decoration-[#93c5fd] font-serif'
            }`}
          >
            <span>{isStdout ? 'Examine Dossier' : 'Inspect Notes'}</span>
            <ChevronRight
              className="w-3.5 h-3.5 transition-transform duration-150 ease-out group-hover/btn:translate-x-1"
              aria-hidden="true"
            />
          </button>

          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} repository source`}
            className={`group/link inline-flex items-center gap-1 py-1 transition-transform transition-color transition-opacity cursor-pointer hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] ${
              isStdout
                ? 'text-[#64748b] hover:text-[#f1f5f9] font-mono'
                : 'text-[#78716c] hover:text-[#1d4ed8] font-serif'
            }`}
          >
            <span>View Source</span>
            <ExternalLink
              className="w-3 h-3 transition-transform duration-150 ease-out group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </article>
  );
};
