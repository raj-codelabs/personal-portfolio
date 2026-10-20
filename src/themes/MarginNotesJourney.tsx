import React, { useState, useRef } from 'react';
import { Milestone } from '../types';
import { BookOpen, Calendar, ChevronDown } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { spring, distance } from '../motion/motion-tokens';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

interface MarginNotesJourneyProps {
  milestones: Milestone[];
}

export const MarginNotesJourney: React.FC<MarginNotesJourneyProps> = ({ milestones }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotionGlobal();

  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    [milestones[0]?.id]: true,
    [milestones[milestones.length - 1]?.id]: true,
  });

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Section 6: Vertical line draws with scroll scrubbed to position, smoothed with settle spring
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end 70%'],
  });

  const smoothScaleY = useSpring(scrollYProgress, spring.settle);

  return (
    <div ref={containerRef} className="space-y-6 text-left">
      {/* Archival Chapter Heading */}
      <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-wrap items-baseline justify-between gap-3 text-xs shadow-xs font-serif">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
          <span className="font-serif font-bold text-sm text-[var(--text-primary)]">
            Chronological Learning Log &amp; Milestones
          </span>
        </div>
        <span className="text-[var(--text-muted)] font-serif italic text-xs">
          First Year Studies · B.Tech CSE (AI/ML) · Class of 2030
        </span>
      </div>

      {/* Vertical Spine Timeline */}
      <div className="relative pl-6 sm:pl-10 space-y-8">
        {/* Background track line */}
        <div
          className="absolute left-3 sm:left-5 top-4 bottom-4 w-[1.5px] bg-[var(--border-subtle)]"
          aria-hidden="true"
        />

        {/* Dynamic scrubbed spine line (Section 6) */}
        <motion.div
          style={{
            scaleY: reducedMotion ? 1 : smoothScaleY,
          }}
          className="absolute left-3 sm:left-5 top-4 bottom-4 w-[1.5px] bg-[var(--accent-primary)] origin-top pointer-events-none"
          aria-hidden="true"
        />

        {milestones.map((m) => {
          const isExpanded = !!expandedIds[m.id];

          return (
            <div key={m.id} className="relative group">
              {/* Node Ring on Spine (Section 6: scales 0.6 to 1 with settle, emits one soft ping ring) */}
              <motion.div
                initial={reducedMotion ? false : { scale: 0.6 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={spring.settle}
                className="absolute -left-6 sm:-left-10 top-1.5 w-4 h-4 rounded-full bg-[var(--bg-page)] border-2 border-[var(--accent-primary)] flex items-center justify-center z-10"
                aria-hidden="true"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />

                {/* Soft ping ring: scale 1 to 1.8, opacity 0.4 to 0, ~500ms, once */}
                {!reducedMotion && (
                  <motion.span
                    initial={{ scale: 1, opacity: 0.4 }}
                    whileInView={{ scale: 1.8, opacity: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full border border-[var(--accent-primary)] pointer-events-none"
                  />
                )}
              </motion.div>

              {/* Entry Card & Marginalia Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Main Card (Section 6: rise 12px + fade) */}
                <motion.div
                  data-reveal
                  initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
                  transition={spring.settle}
                  className="lg:col-span-8 p-5 sm:p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs hover:border-[var(--accent-primary)]/40 transition-colors"
                >
                  {/* Top Bar with Log # and Date */}
                  <div className="flex items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-[var(--border-subtle)] text-xs">
                    <span className="font-mono text-[var(--accent-copper)] font-semibold tracking-wider">
                      {m.logNumber}
                    </span>
                    <div className="flex items-center gap-1.5 text-[var(--text-secondary)] font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{m.date}</span>
                    </div>
                  </div>

                  {/* Title & Toggle Button */}
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base sm:text-lg font-display font-bold text-[var(--text-primary)] leading-snug">
                      {m.title}
                    </h3>
                    <motion.button
                      type="button"
                      onClick={() => toggleExpand(m.id)}
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${m.logNumber}`}
                      whileTap={reducedMotion ? undefined : { scale: 0.96 }}
                      className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer shrink-0 focus-visible:outline-2"
                    >
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={spring.snap}
                      >
                        <ChevronDown className="w-4 h-4" aria-hidden="true" />
                      </motion.div>
                    </motion.button>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm font-body text-[var(--text-secondary)] leading-relaxed mt-2">
                    {m.summary}
                  </p>

                  {/* Expandable Deep Details using CSS Grid Template Rows (Section 6) */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-250 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:duration-0 ${
                      isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={`mt-4 pt-3 border-t border-[var(--border-subtle)] space-y-3 text-xs font-body transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                          isExpanded ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-[var(--text-primary)] mb-1">Observation &amp; Context:</div>
                          <p className="text-[var(--text-secondary)] leading-relaxed">
                            {m.details}
                          </p>
                        </div>

                        <div>
                          <div className="font-bold text-[var(--accent-primary)] mb-1">Field Learnings:</div>
                          <ul className="space-y-1 list-disc list-inside text-[var(--text-secondary)]">
                            {m.learnings.map((learning, idx) => (
                              <li key={idx}>
                                <span className="text-[var(--text-primary)]">{learning}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Unboxed tags */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 text-[var(--text-muted)] font-mono text-[11px]">
                          {m.tags.map((tag, idx) => (
                            <React.Fragment key={tag}>
                              {idx > 0 && <span>·</span>}
                              <span>{tag}</span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Notebook margin notes (Section 6: fade in 100ms after their card, sliding x from -8px to 0) */}
                <motion.div
                  data-reveal
                  initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { ...spring.settle, delay: 0.1 }
                  }
                  className="lg:col-span-4 p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-xs font-mono text-[var(--text-secondary)] leading-relaxed"
                >
                  <div className="font-mono font-semibold text-[10px] uppercase tracking-wider text-[var(--accent-copper)] mb-1">
                    Margin Note
                  </div>
                  <p>
                    {m.marginAnnotation || 'Documented engineering milestone and curriculum progression.'}
                  </p>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
