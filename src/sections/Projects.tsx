import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import { projectsData } from '../data/projects';
import { ProjectDialog } from '../components/ProjectDialog';
import { useTheme } from '../context/ThemeContext';
import { ExternalLink, Terminal, ChevronRight, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { spring, distance } from '../motion/motion-tokens';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

import { ScrollExpandMedia } from '../components/ScrollExpandMedia';
import { WorksWheel3D } from '../components/WorksWheel3D';
import { ProjectCard } from '../components/ProjectCard';
import { LayoutGrid, Layers } from 'lucide-react';

export const Projects: React.FC = () => {
  const { theme } = useTheme();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'wheel'>('grid');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isStdout = theme === 'stdout';
  const reducedMotion = useReducedMotionGlobal();

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
      {/* Section Header with Section 5 reveals (50ms stagger) */}
      <div className="pb-4 relative">
        <motion.div
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={spring.settle}
        >
          {isStdout ? (
            <div className="text-xs font-mono text-[#00e5c0] mb-1">
              FEATURED CASE STUDY &amp; BUILDS
            </div>
          ) : (
            <div className="text-sm font-handwriting text-[#1d4ed8] font-bold mb-1">
              Featured Case Study &amp; Builds
            </div>
          )}
        </motion.div>

        <motion.h2
          id="projects-heading"
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={{ ...spring.settle, delay: 0.05 }}
          className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${
            isStdout ? 'font-mono' : 'font-serif'
          }`}
        >
          Projects
        </motion.h2>

        <motion.p
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={{ ...spring.settle, delay: 0.1 }}
          className="text-sm sm:text-base text-[var(--text-secondary)] font-body mt-1 max-w-xl"
        >
          Practical software applications built with Python and C, engineered with clean command-line interfaces and token pipelines.
        </motion.p>

        {/* Section hairline rule: scaleX 0 to 1, origin left, soft spring */}
        <motion.div
          data-reveal
          initial={reducedMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={spring.soft}
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--border-subtle)] origin-left"
          aria-hidden="true"
        />
      </div>

      {/* 1. ScrollExpandMedia Kinetic Canvas Stage */}
      <ScrollExpandMedia
        project={summarizer}
        onOpenCaseStudy={() => handleOpenCaseStudy(summarizer)}
        triggerRef={triggerRef}
      />

      {/* 2. All Builds Header & View Controls */}
      <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-3">
        <div>
          <h3 className={`text-lg font-bold text-[var(--text-primary)] ${isStdout ? 'font-mono' : 'font-serif'}`}>
            {isStdout ? 'DIRECTORY // ALL_BUILDS' : 'All Projects & Prototypes'}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-body mt-0.5">
            Compare project scopes, architectural designs, and source repositories.
          </p>
        </div>

        {/* View mode toggle in stdout mode */}
        {isStdout && (
          <div className="flex items-center gap-1 border border-[#242e40] rounded p-1 bg-[#0d121c] text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#1a2332] text-[#00e5c0] font-semibold'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
              aria-pressed={viewMode === 'grid'}
            >
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Grid View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('wheel')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'wheel'
                  ? 'bg-[#1a2332] text-[#00e5c0] font-semibold'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
              aria-pressed={viewMode === 'wheel'}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              <span>3D Reel</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Render either 3D Wheel or Clean Project Cards Grid */}
      {isStdout && viewMode === 'wheel' ? (
        <div className="pt-2">
          <WorksWheel3D
            projects={projectsData}
            onSelectProject={(proj) => handleOpenCaseStudy(proj)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
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
      )}

      {/* Ideas single text line */}
      <div className="pt-2 text-xs sm:text-sm text-[var(--text-muted)] font-mono">
        <span className="font-bold text-[var(--text-secondary)]">Next:</span>{' '}
        <span>PrereqOS (prerequisite graph for learning topics) · Book Recommendation Engine (planned)</span>
      </div>

      {/* Case Study Modal Dialog with Fluid AnimatePresence */}
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
