import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { Milestone } from '../types';
import { milestonesData } from '../data/journey';
import { StdoutJourney } from '../themes/StdoutJourney';
import { MarginNotesJourney } from '../themes/MarginNotesJourney';

export const Journey: React.FC = () => {
  const { theme } = useTheme();
  const { milestones: cmsMilestones } = useCms();
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
      {/* Section Header */}
      <div className="relative pb-4">
        <div>
          {isStdout ? (
            <div className="text-xs font-mono text-[var(--accent-copper)] mb-1 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-copper)]" />
              TIMELINE · ACADEMIC &amp; SOFTWARE MILESTONES
            </div>
          ) : (
            <div className="text-sm font-serif italic text-[var(--accent-copper)] font-semibold mb-1">
              Field Chronicle &amp; Coursework Notes
            </div>
          )}
        </div>

        <h2
          id="journey-heading"
          className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${
            isStdout ? 'font-mono' : 'font-serif'
          }`}
        >
          Engineering Chronicle &amp; Milestones
        </h2>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-body mt-1 max-w-xl">
          {isStdout
            ? 'Chronological milestones tracking foundational coursework, CS50x and CS50P completion, and practical builds.'
            : 'Chronological notebook entries documenting foundational computer science studies, coding observations, and key takeaways.'}
        </p>

        {/* Section hairline rule */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--border-subtle)] origin-left"
          aria-hidden="true"
        />
      </div>

      {/* Single-pass timeline with clean milestone register */}
      <div className="pt-2">
        {isStdout ? (
          <StdoutJourney milestones={activeMilestones} />
        ) : (
          <MarginNotesJourney milestones={activeMilestones} />
        )}
      </div>
    </section>
  );
};
