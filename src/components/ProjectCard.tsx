import React, { useRef } from 'react';
import { Project } from '../types';
import { useTheme } from '../context/ThemeContext';
import { ExternalLink, FolderGit2, BookOpen, ChevronRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onOpenDetails: (project: Project, triggerRef: React.RefObject<HTMLButtonElement | null>) => void;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenDetails, index }) => {
  const { theme } = useTheme();
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const isStdout = theme === 'stdout';

  const handleOpen = () => {
    onOpenDetails(project, triggerButtonRef);
  };

  if (isStdout) {
    // STDOUT: Terminal Console Buffer Card
    return (
      <article
        className="group flex flex-col justify-between p-5 rounded-md border border-[#30363d] bg-[#161b22] hover:border-[#58a6ff]/70 transition-all text-left"
      >
        <div>
          {/* Console Header Bar */}
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#30363d] text-xs font-mono text-[#8b949e]">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-3.5 h-3.5 text-[#58a6ff]" aria-hidden="true" />
              <span className="text-[#e6edf3]">projects/{project.id}</span>
            </div>
            <span className="text-[#3fb950] text-[11px] font-mono">
              [{project.status.toUpperCase()}]
            </span>
          </div>

          {/* Project Title */}
          <h3 className="text-base font-bold font-mono text-[#e6edf3] group-hover:text-[#58a6ff] transition-colors mb-2">
            {project.title}
          </h3>

          {/* Problem & Built Description */}
          <p className="text-xs text-[#8b949e] font-mono leading-relaxed mb-3 line-clamp-3">
            {project.problem}
          </p>

          <p className="text-xs text-[#e6edf3] font-mono leading-relaxed mb-4 line-clamp-2">
            <span className="text-[#3fb950] mr-1">$</span>
            {project.built}
          </p>
        </div>

        <div>
          {/* Tech Stack: Clean Unboxed Text with Typographic Dots */}
          <div className="pt-3 border-t border-[#30363d] mb-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#8b949e] font-mono">
              {project.stack.map((tech, idx) => (
                <React.Fragment key={tech}>
                  {idx > 0 && <span className="text-[#6e7681]" aria-hidden="true">·</span>}
                  <span className="text-[#c9d1d9]">{tech}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 text-xs font-mono pt-1">
            <button
              ref={triggerButtonRef}
              onClick={handleOpen}
              className="inline-flex items-center gap-1.5 text-[#58a6ff] hover:text-[#79b8ff] transition-colors py-1 cursor-pointer font-medium focus-visible:outline-none focus-visible:underline"
            >
              <span>Inspect Dossier</span>
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} repository placeholder`}
              className="text-[#8b949e] hover:text-[#e6edf3] inline-flex items-center gap-1 py-1 transition-colors"
            >
              <span>repo</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </article>
    );
  }

  // MARGIN-NOTES: Archival Field Index Card
  return (
    <article
      className="group relative flex flex-col justify-between p-6 rounded-sm border border-[#e3ded2] bg-[#ffffff] hover:border-[#0d5c6e]/60 transition-all shadow-xs text-left"
    >
      {/* Subtle notebook index indicator */}
      <div className="flex items-baseline justify-between gap-2 pb-3 mb-3 border-b border-[#e3ded2]">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-mono text-[#8a5a00] font-semibold">
            REF #{String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-xs text-[#8d857a] font-serif italic">
            · {project.status}
          </span>
        </div>
        <BookOpen className="w-3.5 h-3.5 text-[#8d857a]" aria-hidden="true" />
      </div>

      <div>
        <h3 className="text-lg font-serif font-bold text-[#302d29] group-hover:text-[#0d5c6e] transition-colors mb-2">
          {project.title}
        </h3>

        <p className="text-xs font-sans text-[#686158] leading-relaxed mb-3">
          {project.problem}
        </p>

        <p className="text-xs font-sans text-[#302d29] leading-relaxed mb-4">
          <span className="font-semibold text-[#0d5c6e]">Focus: </span>
          {project.built}
        </p>
      </div>

      <div>
        {/* Unboxed Tech Stack with Typographic Dots */}
        <div className="pt-3 border-t border-[#e3ded2] mb-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#686158] font-sans">
            {project.stack.map((tech, idx) => (
              <React.Fragment key={tech}>
                {idx > 0 && <span className="text-[#c8c0af]" aria-hidden="true">·</span>}
                <span className="font-medium text-[#302d29]">{tech}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 text-xs font-sans pt-1">
          <button
            ref={triggerButtonRef}
            onClick={handleOpen}
            className="inline-flex items-center gap-1.5 text-[#0d5c6e] hover:text-[#094755] transition-colors py-1 cursor-pointer font-semibold focus-visible:outline-none focus-visible:underline"
          >
            <span>Read Field Note</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} repository placeholder`}
            className="text-[#686158] hover:text-[#0d5c6e] inline-flex items-center gap-1 py-1 transition-colors"
          >
            <span>Code</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
};
