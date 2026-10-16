import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { Milestone } from '../types';
import { milestonesData } from '../data/journey';
import { StdoutJourney } from '../themes/StdoutJourney';
import { MarginNotesJourney } from '../themes/MarginNotesJourney';
import { GitBranch, ListFilter } from 'lucide-react';

export const Journey: React.FC = () => {
  const { theme } = useTheme();
  const { milestones: cmsMilestones } = useCms();
  // Allow toggling between Graph view and Field Notes view regardless of theme
  const [viewMode, setViewMode] = useState<'graph' | 'notes'>('graph');

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
      className="py-12 sm:py-16 space-y-8 text-left"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-primary)] mb-1">
            <GitBranch className="w-3.5 h-3.5" aria-hidden="true" />
            <span>02 // TOPOLOGICAL MILESTONES & CURRICULUM DAG</span>
          </div>
          <h2
            id="journey-heading"
            className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[var(--text-primary)]"
          >
            Developmental Journey
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-body mt-1 max-w-xl">
            Chronological commit DAG documenting systems programming in C, mathematical derivations, heap allocator design, and reverse-mode autodiff.
          </p>
        </div>

        {/* View Switcher: Graph vs Notes */}
        <div className="flex items-center gap-1 p-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-mono shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode('graph')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              viewMode === 'graph'
                ? 'bg-[var(--accent-primary)] text-[#0b0e14] font-bold shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Topology DAG
          </button>
          <button
            onClick={() => setViewMode('notes')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              viewMode === 'notes'
                ? 'bg-[var(--accent-primary)] text-[#0b0e14] font-bold shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Field Notes
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      {viewMode === 'graph' ? (
        <StdoutJourney milestones={activeMilestones} />
      ) : (
        <MarginNotesJourney milestones={activeMilestones} />
      )}
    </section>
  );
};
