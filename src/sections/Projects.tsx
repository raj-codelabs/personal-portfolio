import React, { useState, useRef } from 'react';
import { Project } from '../types';
import { projectsData } from '../data/projects';
import { ProjectDialog } from '../components/ProjectDialog';
import { useTheme } from '../context/ThemeContext';
import { AnimatePresence } from 'motion/react';
import { ScrollExpandMedia } from '../components/ScrollExpandMedia';
import { ProjectCard } from '../components/ProjectCard';

export const Projects: React.FC = () => {
  const { theme } = useTheme();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isStdout = theme === 'stdout';

  // Primary featured project is the AI Study Notes Summarizer
  const summarizer = projectsData[0];

  const handleOpenCaseStudy = (proj?: Project) => {
    setSelectedProject(proj || summarizer);
  };

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-12 sm:py-16 space-y-10 text-left scroll-mt-16"
    >
      {/* Section Header */}
      <div className="pb-4 relative">
        <div>
          {isStdout ? (
            <div className="text-xs font-mono text-[var(--accent-copper)] font-semibold mb-1">
              FEATURED APPLICATION &amp; BUILDS
            </div>
          ) : (
            <div className="text-sm font-handwriting text-[#1d4ed8] font-bold mb-1">
              Featured Application &amp; Builds
            </div>
          )}
        </div>

        <h2
          id="projects-heading"
          className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${
            isStdout ? 'font-mono' : 'font-serif'
          }`}
        >
          Engineered Systems &amp; Projects
        </h2>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-body mt-1 max-w-xl">
          Practical software applications built with Python and C, engineered with clean interfaces and strict token pipelines.
        </p>

        {/* Section hairline rule */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--border-subtle)] origin-left"
          aria-hidden="true"
        />
      </div>

      {/* 1. Live Software Application Frame */}
      <ScrollExpandMedia
        project={summarizer}
        onOpenCaseStudy={() => handleOpenCaseStudy(summarizer)}
        triggerRef={triggerRef}
      />

      {/* 2. All Builds Header */}
      <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-3">
        <div>
          <h3 className={`text-lg font-bold text-[var(--text-primary)] ${isStdout ? 'font-mono' : 'font-serif'}`}>
            {isStdout ? 'All Systems & Utility Repositories' : 'All Systems & Prototypes'}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-body mt-0.5">
            Architecture reviews, memory constraints, and open source code repositories.
          </p>
        </div>
      </div>

      {/* 3. Clean Responsive Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 pt-2">
        {projectsData.map((project, idx) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={idx}
            onOpenDetails={(p, ref) => {
              if (ref?.current) triggerRef.current = ref.current;
              handleOpenCaseStudy(p);
            }}
          />
        ))}
      </div>

      {/* Next roadmap line */}
      <div className="pt-2 text-xs sm:text-sm text-[var(--text-muted)] font-mono">
        <span className="font-bold text-[var(--text-secondary)]">Planned:</span>{' '}
        <span>PrereqOS (computational prerequisite DAG for learning topics) · Book Recommendation Engine</span>
      </div>

      {/* Case Study Modal Dialog */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDialog
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            triggerRef={triggerRef}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
