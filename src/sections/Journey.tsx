import React from 'react';
import { useCms } from '../context/CmsContext';
import { Milestone } from '../types';
import { milestonesData } from '../data/journey';
import { StdoutJourney } from '../themes/StdoutJourney';

export const Journey: React.FC = () => {
  const { milestones: cmsMilestones } = useCms();

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
        <div className="text-xs font-mono text-[var(--accent-copper)] mb-1 uppercase tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-copper)]" />
          TIMELINE · ACADEMIC &amp; SOFTWARE MILESTONES
        </div>

        <h2
          id="journey-heading"
          className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] font-display"
        >
          Engineering Chronicle &amp; Milestones
        </h2>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-body mt-1 max-w-xl">
          Chronological milestones tracking foundational coursework, CS50x and CS50P completion, and practical builds.
        </p>

        {/* Section hairline rule */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--border-subtle)] origin-left"
          aria-hidden="true"
        />
      </div>

      {/* Single-pass unified timeline with clean milestone register */}
      <div className="pt-2">
        <StdoutJourney milestones={activeMilestones} />
      </div>
    </section>
  );
};
