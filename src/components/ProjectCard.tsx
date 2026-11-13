import React, { useRef } from 'react';
import { Project } from '../types';
import { ExternalLink, ChevronRight } from 'lucide-react';

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
    <article className="group relative flex flex-col justify-between p-6 text-left transition-all duration-200 select-none hover:-translate-y-[2px] rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] shadow-xs hover:shadow-[var(--shadow-soft)]">
      <div>
        {/* Header: Clean Technical Index & Status Badge */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent-copper)] font-semibold">0{index + 1}</span>
            <span className="text-[var(--text-muted)]" aria-hidden="true">·</span>
            <span className="text-[var(--text-primary)] font-medium truncate">{project.id}</span>
          </div>
          <span className="text-[var(--accent-primary)] text-xs font-mono font-medium capitalize">
            {project.status}
          </span>
        </div>

        {/* Project Title */}
        <h3 className="mb-2 text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
          {project.title}
        </h3>

        {/* Subtitle / Exploration Thesis */}
        <p className="mb-2 text-xs font-mono text-[var(--accent-copper)]">
          {project.subtitle}
        </p>

        {/* Problem Statement */}
        <p className="leading-relaxed mb-3 text-xs text-[var(--text-secondary)] line-clamp-3">
          {project.problem}
        </p>

        {/* Architectural Focus */}
        <p className="leading-relaxed mb-4 text-xs text-[var(--text-primary)] line-clamp-2">
          <span className="text-[var(--accent-primary)] mr-1.5 font-bold" aria-hidden="true">›</span>
          {project.built}
        </p>
      </div>

      <div>
        {/* Tech Stack */}
        <div className="pt-3 mb-4 border-t border-[var(--border-subtle)]">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-[var(--text-muted)]">
            {project.stack.map((tech, idx) => (
              <React.Fragment key={tech}>
                {idx > 0 && <span className="opacity-40" aria-hidden="true">·</span>}
                <span className="text-[var(--text-primary)] font-medium">{tech}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center justify-between gap-3 text-xs pt-1">
          <button
            ref={triggerButtonRef}
            type="button"
            onClick={handleOpen}
            className="group/btn inline-flex items-center gap-1.5 py-1 cursor-pointer font-semibold font-mono text-[var(--accent-primary)] hover:underline focus-visible:outline-2 transition-all hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98]"
          >
            <span>Examine Dossier</span>
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
            className="group/link inline-flex items-center gap-1 py-1 font-mono text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-all cursor-pointer hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98]"
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
