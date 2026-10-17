import React, { useState } from 'react';
import { Project } from '../types';
import { useCms } from '../context/CmsContext';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectDialog } from '../components/ProjectDialog';
import { useTheme } from '../context/ThemeContext';
import { FolderGit2, Layers } from 'lucide-react';

export const Projects: React.FC = () => {
  const { theme } = useTheme();
  const { projects: cmsProjects } = useCms();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [triggerRef, setTriggerRef] = useState<React.RefObject<HTMLButtonElement | null> | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<'all' | 'systems' | 'ai-ml'>('all');

  const handleOpenDetails = (project: Project, ref: React.RefObject<HTMLButtonElement | null>) => {
    setSelectedProject(project);
    setTriggerRef(ref);
  };

  // Convert CMS projects to public Project interface
  const publicProjects: Project[] = (cmsProjects && cmsProjects.length > 0 ? cmsProjects : []).map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    problem: p.problem,
    built: p.built,
    architecture: p.architecture,
    lessonsLearned: p.lessonsLearned,
    stack: p.stack,
    status: p.status as 'completed' | 'active' | 'archived',
    repoUrl: p.repoUrl,
    demoUrl: p.demoUrl,
    coverImage: p.coverImage,
    screenshots: p.screenshots,
    imageAlt: p.imageAlt,
    isFeatured: p.isFeatured,
    isPublished: p.isPublished,
    displayOrder: p.displayOrder,
    startDate: p.startDate,
    completionDate: p.completionDate,
    keyTakeaway: p.problem,
  }));

  const filteredProjects = publicProjects.filter((p) => {
    if (activeFilter === 'systems') {
      return p.stack.some((s) => ['C (C11)', 'POSIX APIs', 'Linux Terminal', 'Regular Expressions', 'C'].includes(s));
    }
    if (activeFilter === 'ai-ml') {
      return p.stack.some((s) => ['Python', 'NumPy', 'PyTorch', 'Math / Calculus', 'Calculus'].includes(s));
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] mb-1">
            <FolderGit2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>01 // REPOSITORIES & INVARIANT DOSSIERS</span>
          </div>
          <h2
            id="projects-heading"
            className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[var(--text-primary)]"
          >
            Built Systems & Blueprints
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-body mt-1 max-w-xl">
            First-principles implementations written to expose and master the mechanics beneath higher-level frameworks.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-mono self-start sm:self-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[var(--accent-primary)] text-[#0b0e14] font-bold shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            All Repos ({publicProjects.length})
          </button>
          <button
            onClick={() => setActiveFilter('systems')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeFilter === 'systems'
                ? 'bg-[var(--accent-primary)] text-[#0b0e14] font-bold shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Systems / C
          </button>
          <button
            onClick={() => setActiveFilter('ai-ml')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              activeFilter === 'ai-ml'
                ? 'bg-[var(--accent-primary)] text-[#0b0e14] font-bold shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            ML / Autograd
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={idx}
            onOpenDetails={handleOpenDetails}
          />
        ))}
      </div>

      {/* Project Details Modal */}
      <ProjectDialog
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        triggerRef={triggerRef}
      />
    </section>
  );
};
