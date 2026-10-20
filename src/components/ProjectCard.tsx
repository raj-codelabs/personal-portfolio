import React, { useRef, useState, useEffect } from 'react';
import { Project } from '../types';
import { useTheme } from '../context/ThemeContext';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { spring, distance, stagger } from '../motion/motion-tokens';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

interface ProjectCardProps {
  project: Project;
  onOpenDetails: (project: Project, triggerRef: React.RefObject<HTMLButtonElement | null>) => void;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenDetails, index }) => {
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotionGlobal();
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleOpen = () => {
    onOpenDetails(project, triggerButtonRef);
  };

  const { theme } = useTheme();
  const isStdout = theme === 'stdout';

  // Section 7.1: Spotlight via CSS variables updated in requestAnimationFrame
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (isTouch || reducedMotion) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    window.requestAnimationFrame(() => {
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
  };

  const staggerDelay = Math.min(index * stagger.card, stagger.cap);

  return (
    <motion.article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      data-reveal
      initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
      transition={{ ...spring.settle, delay: staggerDelay }}
      whileHover={
        reducedMotion || isTouch
          ? undefined
          : {
              y: -3,
              transition: spring.snap,
            }
      }
      whileTap={reducedMotion ? undefined : { scale: 0.99 }}
      className={`group relative flex flex-col justify-between p-6 text-left transition-colors duration-200 cursor-default select-none ${
        isStdout
          ? 'rounded-lg border border-[#242e40] bg-[#121722] hover:border-[#00e5c0] hover:shadow-[0_0_16px_rgba(0,229,192,0.2)] font-mono'
          : 'rounded-md border border-[#e2dbce] bg-[#ffffff] shadow-xs hover:border-[#1d4ed8] hover:shadow-md font-serif'
      }`}
      style={
        {
          '--mx': '50%',
          '--my': '50%',
        } as React.CSSProperties
      }
    >
      {/* Subtle radial spotlight (Section 7.1) */}
      {!reducedMotion && !isTouch && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: isStdout
              ? 'radial-gradient(circle 220px at var(--mx) var(--my), rgba(0, 229, 192, 0.07), transparent 80%)'
              : 'radial-gradient(circle 220px at var(--mx) var(--my), rgba(29, 78, 216, 0.05), transparent 80%)',
          }}
          aria-hidden="true"
        />
      )}

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

        {/* Action Triggers with Section 7.2 micro-motion */}
        <div className="flex items-center justify-between gap-3 text-xs pt-1">
          <motion.button
            ref={triggerButtonRef}
            type="button"
            onClick={handleOpen}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            transition={spring.snap}
            className={`group/btn inline-flex items-center gap-1.5 py-1 cursor-pointer font-semibold focus-visible:outline-2 ${
              isStdout
                ? 'text-[#00e5c0] hover:underline font-mono'
                : 'text-[#1d4ed8] hover:text-[#1e40af] underline underline-offset-4 decoration-[#93c5fd] font-serif'
            }`}
          >
            <span>{isStdout ? 'Examine Dossier' : 'Read Study Notes'}</span>
            <ChevronRight
              className="w-3.5 h-3.5 transition-transform duration-150 ease-out group-hover/btn:translate-x-1"
              aria-hidden="true"
            />
          </motion.button>

          <motion.a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} repository source`}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            transition={spring.snap}
            className={`group/link inline-flex items-center gap-1 py-1 transition-colors cursor-pointer ${
              isStdout
                ? 'text-[#64748b] hover:text-[#f1f5f9] font-mono'
                : 'text-[#78716c] hover:text-[#1d4ed8] font-serif'
            }`}
          >
            <span>source</span>
            <ExternalLink
              className="w-3 h-3 transition-transform duration-150 ease-out group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              aria-hidden="true"
            />
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
};
