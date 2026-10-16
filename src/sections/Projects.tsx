import React, { useState } from 'react';
import { Project } from '../types';
import { projectsData } from '../data/projects';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectDialog } from '../components/ProjectDialog';
import { useTheme } from '../context/ThemeContext';
import { FolderGit2, BookOpen, Layers } from 'lucide-react';

export const Projects: React.FC = () => {
  const { theme } = useTheme();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [triggerRef, setTriggerRef] = useState<React.RefObject<HTMLButtonElement | null> | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<'all' | 'systems' | 'ai-ml'>('all');

  const isStdout = theme === 'stdout';

  const handleOpenDetails = (project: Project, ref: React.RefObject<HTMLButtonElement | null>) => {
    setSelectedProject(project);
    setTriggerRef(ref);
  };

  const filteredProjects = projectsData.filter((p) => {
    if (activeFilter === 'systems') {
      return p.stack.some((s) => ['C (C11)', 'POSIX APIs', 'Linux Terminal', 'Regular Expressions'].includes(s));
    }
    if (activeFilter === 'ai-ml') {
      return p.stack.some((s) => ['Python', 'NumPy', 'PyTorch', 'Math / Calculus'].includes(s));
    }
    return true;
  });

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-12 sm:py-16 space-y-8 text-left"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-inherit">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] mb-1">
            {isStdout ? (
              <>
                <FolderGit2 className="w-3.5 h-3.5 text-[#58a6ff]" />
                <span>ls -la ~/projects/</span>
              </>
            ) : (
              <>
                <BookOpen className="w-3.5 h-3.5 text-[#0d5c6e]" />
                <span className="font-serif italic text-[#8a5a00]">Section 02 · Index of Inventions</span>
              </>
            )}
          </div>
          <h2
            id="projects-heading"
            className={`text-2xl sm:text-3xl font-bold tracking-tight ${
              isStdout ? 'font-mono text-[#e6edf3]' : 'font-serif text-[#302d29]'
            }`}
          >
            Engineering Projects
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-xl">
            Selected implementations focusing on algorithmic mechanics, systems programming in C, and scratch deep learning models.
          </p>
        </div>

        {/* Filter Controls (Permitted interactive segmented controls with functional click handlers) */}
        <div
          role="tablist"
          aria-label="Filter projects by domain"
          className={`flex items-center gap-1 p-1 rounded border text-xs font-medium self-start sm:self-auto ${
            isStdout ? 'bg-[#161b22] border-[#30363d]' : 'bg-[#ffffff] border-[#e3ded2] shadow-xs'
          }`}
        >
          <button
            role="tab"
            aria-selected={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? isStdout
                  ? 'bg-[#21262d] text-[#58a6ff] font-bold'
                  : 'bg-[#fbf7ee] text-[#0d5c6e] font-bold border border-[#e3ded2]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            All ({projectsData.length})
          </button>
          <button
            role="tab"
            aria-selected={activeFilter === 'ai-ml'}
            onClick={() => setActiveFilter('ai-ml')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeFilter === 'ai-ml'
                ? isStdout
                  ? 'bg-[#21262d] text-[#58a6ff] font-bold'
                  : 'bg-[#fbf7ee] text-[#0d5c6e] font-bold border border-[#e3ded2]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            AI / ML
          </button>
          <button
            role="tab"
            aria-selected={activeFilter === 'systems'}
            onClick={() => setActiveFilter('systems')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeFilter === 'systems'
                ? isStdout
                  ? 'bg-[#21262d] text-[#58a6ff] font-bold'
                  : 'bg-[#fbf7ee] text-[#0d5c6e] font-bold border border-[#e3ded2]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Systems & C
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={idx}
            onOpenDetails={handleOpenDetails}
          />
        ))}
      </div>

      {/* Modal Dialog */}
      <ProjectDialog
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        triggerRef={triggerRef}
      />
    </section>
  );
};
