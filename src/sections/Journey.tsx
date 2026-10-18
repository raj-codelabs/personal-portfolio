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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
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
          <h2
            id="journey-heading"
            className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${
              isStdout ? 'font-mono' : 'font-serif'
            }`}
          >
            Timeline
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] font-body mt-1 max-w-xl">
            {isStdout
              ? 'Chronological milestones tracking MATS University coursework, CS50x and CS50P completion, and practical builds.'
              : 'Chronological notebook entries documenting foundational computer science studies, coding observations, and key takeaways.'}
          </p>
        </div>
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
