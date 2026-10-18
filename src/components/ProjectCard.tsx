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

  const { theme } = useTheme();
  const isStdout = theme === 'stdout';

  return (
    <article
      style={{ animationDelay: `${index * 40}ms` }}
      className={`group relative flex flex-col justify-between p-6 transition-all duration-200 text-left motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 ${
        isStdout
          ? 'rounded-lg border border-[#242e40] bg-[#121722] hover:border-[#00e5c0]/80 shadow-xs hover:shadow-md font-mono'
          : 'rounded-md border border-[#e2dbce] bg-[#ffffff] shadow-xs hover:border-[#1d4ed8]/60 hover:shadow-sm font-serif'
      }`}
    >
      <div>
        {/* Header: Terminal Register vs Notebook Entry */}
        {isStdout ? (
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#242e40] text-xs font-mono text-[#94a3b8]">
            <div className="flex items-center gap-2">
              <span className="text-[#e27d60] font-bold">SYS-0{index + 1}</span>
              <span className="text-[#64748b]" aria-hidden="true">/</span>
              <span className="text-[#f1f5f9] font-semibold truncate">{project.id}</span>
            </div>
            <span className="text-[#00e5c0] text-[11px] font-mono font-semibold">
              [{project.status.toUpperCase()}]
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-[#e2dbce] text-xs text-[#78716c]">
            <div className="flex items-center gap-1.5 font-handwriting text-base text-[#1d4ed8]">
              <span>Notebook Entry #{index + 1}</span>
              <span className="text-[#c2b8a3]">·</span>
              <span className="font-serif italic text-xs text-[#78716c]">{project.id}</span>
            </div>
            <span className="font-serif italic text-xs text-[#c25e38]">
              {project.status}
            </span>
          </div>
        )}

        {/* Project Title */}
        <h3
          className={`mb-2 font-bold transition-colors ${
            isStdout
              ? 'text-lg font-mono text-[#f1f5f9] group-hover:text-[#00e5c0]'
              : 'text-xl font-serif text-[#1c1917] group-hover:text-[#1d4ed8]'
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
            <span className="text-[#00e5c0] mr-1.5 font-bold">›</span>
          ) : (
            <span className="text-[#1d4ed8] font-bold mr-1.5">§</span>
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

        {/* Action Triggers */}
        <div className="flex items-center justify-between gap-3 text-xs pt-1">
          <button
            ref={triggerButtonRef}
            onClick={handleOpen}
            className={`inline-flex items-center gap-1.5 active:scale-[0.97] transition-all py-1 cursor-pointer font-semibold focus-visible:outline-none ${
              isStdout
                ? 'text-[#00e5c0] hover:underline font-mono'
                : 'text-[#1d4ed8] hover:text-[#1e40af] underline underline-offset-4 decoration-[#93c5fd] font-serif'
            }`}
          >
            <span>{isStdout ? 'Examine Dossier' : 'Read Study Notes'}</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} repository source`}
            className={`inline-flex items-center gap-1 py-1 transition-colors ${
              isStdout
                ? 'text-[#64748b] hover:text-[#f1f5f9] font-mono'
                : 'text-[#78716c] hover:text-[#1d4ed8] font-serif'
            }`}
          >
            <span>source</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
};
