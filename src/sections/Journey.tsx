import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { Milestone } from '../types';
import { milestonesData } from '../data/journey';
import { StdoutJourney } from '../themes/StdoutJourney';
import { MarginNotesJourney } from '../themes/MarginNotesJourney';
import { motion } from 'motion/react';
import { spring, distance } from '../motion/motion-tokens';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

export const Journey: React.FC = () => {
  const { theme } = useTheme();
  const { milestones: cmsMilestones } = useCms();
  const reducedMotion = useReducedMotionGlobal();
  const isStdout = theme === 'stdout';

  const activeMilestones: Milestone[] =
    cmsMilestones && cmsMilestones.length > 0
      ? cmsMilestones.map((m) => ({
          id: m.id,
          logNumber: m.logNumber,
          commitHash: m.commitHash,
          branch: (m.branch as any) || 'main',
          branchLabel: m.branchLabel,
          date: m.date,
          title: m.title,
          summary: m.summary,
          details: m.details,
          learnings: m.learnings,
          marginAnnotation: m.marginAnnotation,
          tags: m.tags,
        }))
      : milestonesData;

  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
      className="py-12 sm:py-16 space-y-8 text-left scroll-mt-16"
    >
      {/* Section Header with Section 5 reveals */}
      <div className="relative pb-4">
        <motion.div
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={spring.settle}
        >
          {isStdout ? (
            <div className="text-xs font-mono text-[#00e5c0] mb-1 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00e5c0]" />
              TIMELINE · ACADEMIC &amp; SOFTWARE MILESTONES
            </div>
          ) : (
            <div className="text-sm font-handwriting text-[#1d4ed8] font-bold mb-1">
              Field Chronicle &amp; Coursework Notes
            </div>
          )}
        </motion.div>

        <motion.h2
          id="journey-heading"
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={{ ...spring.settle, delay: 0.05 }}
          className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${
            isStdout ? 'font-mono' : 'font-serif'
          }`}
        >
          Timeline
        </motion.h2>

        <motion.p
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={{ ...spring.settle, delay: 0.1 }}
          className="text-sm sm:text-base text-[var(--text-secondary)] font-body mt-1 max-w-xl"
        >
          {isStdout
            ? 'Chronological milestones tracking foundational coursework, CS50x and CS50P completion, and practical builds.'
            : 'Chronological notebook entries documenting foundational computer science studies, coding observations, and key takeaways.'}
        </motion.p>

        {/* Section hairline rule: scaleX 0 to 1, origin left, soft spring (Section 5) */}
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

      {/* Render Theme-Specific View */}
      {isStdout ? (
        <StdoutJourney milestones={activeMilestones} />
      ) : (
        <MarginNotesJourney milestones={activeMilestones} />
      )}
    </section>
  );
};
