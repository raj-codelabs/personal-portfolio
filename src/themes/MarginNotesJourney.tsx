import React, { useState } from 'react';
import { Milestone } from '../types';
import { BookOpen, Calendar, ChevronDown } from 'lucide-react';

interface MarginNotesJourneyProps {
  milestones: Milestone[];
}

export const MarginNotesJourney: React.FC<MarginNotesJourneyProps> = ({ milestones }) => {
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

  return (
    <div className="space-y-6 text-left">
      {/* Archival Chapter Heading */}
      <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-wrap items-baseline justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[var(--accent-primary)]" aria-hidden="true" />
          <span className="font-display font-bold text-sm text-[var(--text-primary)]">
            Chronological Research Log & Field Invariants
          </span>
        </div>
        <span className="text-[var(--text-muted)] font-mono">
          Semester I Observations · B.Tech CSE (AI/ML)
        </span>
      </div>

      {/* Vertical Spine Timeline */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:content-[''] before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-[1.5px] before:bg-[var(--border-subtle)]">
        {milestones.map((m) => {
          const isExpanded = !!expandedIds[m.id];

          return (
            <div key={m.id} className="relative group">
              {/* Node Ring on Spine */}
              <div
                className="absolute -left-6 sm:-left-10 top-1.5 w-4 h-4 rounded-full bg-[var(--bg-page)] border-2 border-[var(--accent-primary)] flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                aria-hidden="true"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
              </div>

              {/* Entry Card & Marginalia Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Main Card (8 cols on lg) */}
                <div className="lg:col-span-8 p-5 sm:p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs hover:border-[var(--accent-primary)]/40 transition-colors">
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
                    <button
                      onClick={() => toggleExpand(m.id)}
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${m.logNumber}`}
                      className="p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer shrink-0"
                    >
                      <ChevronDown
                        className={`w-4 h-4 origin-center transition-transform duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
                          isExpanded ? 'rotate-180' : 'rotate-0'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm font-body text-[var(--text-secondary)] leading-relaxed mt-2">
                    {m.summary}
                  </p>

                  {/* Expandable Deep Details using CSS Grid Template Rows */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:duration-0 ${
                      isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={`mt-4 pt-3 border-t border-[var(--border-subtle)] space-y-3 text-xs font-body transition-opacity duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                          isExpanded ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-[var(--text-primary)] mb-1">Observation & Context:</div>
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
                </div>

                {/* Marginalia Annotation Box (4 cols on lg) */}
                <div className="lg:col-span-4 p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-elevated)] text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
                  <div className="font-mono font-semibold text-[10px] uppercase tracking-wider text-[var(--accent-copper)] mb-1">
                    Margin Note
                  </div>
                  <p>
                    {m.marginAnnotation || 'Documented engineering milestone and curriculum progression.'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
