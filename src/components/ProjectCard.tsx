import React, { useRef } from 'react';
import { Project } from '../types';
import { useTheme } from '../context/ThemeContext';
import { ExternalLink, FolderGit2, ChevronRight, Layers } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onOpenDetails: (project: Project, triggerRef: React.RefObject<HTMLButtonElement | null>) => void;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenDetails, index }) => {
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    onOpenDetails(project, triggerButtonRef);
  };

  return (
    <article
      style={{ animationDelay: `${index * 40}ms` }}
      className="group relative flex flex-col justify-between p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--accent-primary)]/80 transition-[border-color,box-shadow] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-xs [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-md text-left motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 duration-200"
    >
      <div>
        {/* Technical Register Header */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent-copper)] font-bold">
              SYS-0{index + 1}
            </span>
            <span className="text-[var(--text-muted)]" aria-hidden="true">/</span>
            <span className="text-[var(--text-primary)] font-semibold truncate">
              {project.id}
            </span>
          </div>
          <span className="text-[var(--accent-primary)] text-[11px] font-mono font-semibold">
            [{project.status.toUpperCase()}]
          </span>
        </div>

        {/* Project Title */}
        <h3 className="text-lg font-bold font-display text-[var(--text-primary)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-[var(--accent-primary)] transition-colors mb-2">
          {project.title}
        </h3>

        {/* Subtitle / Exploration Thesis */}
        <p className="text-xs text-[var(--accent-copper)] font-mono mb-2">
          {project.subtitle}
        </p>

        {/* Problem Statement */}
        <p className="text-xs text-[var(--text-secondary)] font-body leading-relaxed mb-3 line-clamp-3">
          {project.problem}
        </p>

        {/* Architectural Focus */}
        <p className="text-xs text-[var(--text-primary)] font-mono leading-relaxed mb-4 line-clamp-2">
          <span className="text-[var(--accent-primary)] mr-1.5 font-bold">›</span>
          {project.built}
        </p>
      </div>

      <div>
        {/* Tech Stack: Clean Unboxed Text with Typographic Dots */}
        <div className="pt-3 border-t border-[var(--border-subtle)] mb-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-secondary)] font-mono">
            {project.stack.map((tech, idx) => (
              <React.Fragment key={tech}>
                {idx > 0 && <span className="text-[var(--text-muted)]" aria-hidden="true">·</span>}
                <span className="text-[var(--text-primary)] font-medium">{tech}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center justify-between gap-3 text-xs font-mono pt-1">
          <button
            ref={triggerButtonRef}
            onClick={handleOpen}
            className="inline-flex items-center gap-1.5 text-[var(--accent-primary)] hover:underline active:scale-[0.97] transition-all duration-140 ease-[cubic-bezier(0.23,1,0.32,1)] py-1 cursor-pointer font-semibold focus-visible:outline-none"
          >
            <span>Examine Dossier</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} repository source`}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 py-1 transition-colors"
          >
            <span>source</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
};
