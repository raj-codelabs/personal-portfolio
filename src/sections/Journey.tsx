import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { SectionHeader } from '../components/ui/SectionHeader';
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
      <SectionHeader
        kicker={isStdout ? 'TIMELINE · ACADEMIC & SOFTWARE MILESTONES' : 'Field Chronicle & Coursework Notes'}
        title="Engineering Chronicle & Milestones"
        description={isStdout
          ? 'Chronological milestones tracking foundational coursework, CS50x and CS50P completion, and practical builds.'
          : 'Chronological notebook entries documenting foundational computer science studies, coding observations, and key takeaways.'}
      />

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