import React, { useState } from 'react';
import { Milestone } from '../types';
import { BookOpen, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

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
      <div className="p-4 rounded-sm border border-[#e3ded2] bg-[#ffffff] flex flex-wrap items-baseline justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#0d5c6e]" aria-hidden="true" />
          <span className="font-serif font-bold text-sm text-[#302d29]">Field Chronicle & Research Logs</span>
        </div>
        <span className="text-[#8d857a] font-mono italic">
          Semester I Observations · B.Tech CSE (AI/ML)
        </span>
      </div>

      {/* Vertical Spine Timeline */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:content-[''] before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-[1.5px] before:bg-[#e3ded2]">
        {milestones.map((m) => {
          const isExpanded = !!expandedIds[m.id];

          return (
            <div key={m.id} className="relative group">
              {/* Ink-colored Node Ring on Spine */}
              <div
                className="absolute -left-6 sm:-left-10 top-1.5 w-4 h-4 rounded-full bg-[#fbf7ee] border-2 border-[#0d5c6e] flex items-center justify-center group-hover:scale-110 transition-transform"
                aria-hidden="true"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#0d5c6e]" />
              </div>

              {/* Entry Card & Marginalia Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Main Card (8 cols on lg) */}
                <div className="lg:col-span-8 p-5 rounded-sm border border-[#e3ded2] bg-[#ffffff] shadow-xs hover:border-[#0d5c6e]/40 transition-colors">
                  {/* Top Bar with Log # and Date */}
                  <div className="flex items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-[#e3ded2] text-xs">
                    <span className="font-mono text-[#8a5a00] font-semibold tracking-wider">
                      {m.logNumber}
                    </span>
                    <div className="flex items-center gap-1.5 text-[#686158]">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{m.date}</span>
                    </div>
                  </div>

                  {/* Title & Toggle Button */}
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#302d29] leading-snug">
                      {m.title}
                    </h3>
                    <button
                      onClick={() => toggleExpand(m.id)}
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${m.logNumber}`}
                      className="p-1 rounded text-[#686158] hover:text-[#0d5c6e] hover:bg-[#fbf7ee] transition-colors cursor-pointer shrink-0"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm font-sans text-[#686158] leading-relaxed mt-2">
                    {m.summary}
                  </p>

                  {/* Expandable Deep Details */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-[#e3ded2] space-y-3 text-xs font-sans">
                      <div>
                        <div className="font-bold text-[#302d29] mb-1">Observation & Context:</div>
                        <p className="text-[#686158] leading-relaxed">
                          {m.details}
                        </p>
                      </div>

                      <div>
                        <div className="font-bold text-[#0d5c6e] mb-1">Field Learnings:</div>
                        <ul className="space-y-1 list-disc list-inside text-[#686158]">
                          {m.learnings.map((learning, idx) => (
                            <li key={idx}>
                              <span className="text-[#302d29]">{learning}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Unboxed tags */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 text-[#8d857a] font-mono text-[11px]">
                        {m.tags.map((tag, idx) => (
                          <React.Fragment key={tag}>
                            {idx > 0 && <span>·</span>}
                            <span>{tag}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Marginalia Annotation Box (4 cols on lg) */}
                <div className="lg:col-span-4 p-4 rounded-sm border-l-2 border-[#8a5a00]/50 bg-[#fbf7ee] text-xs font-serif italic text-[#686158] leading-relaxed">
                  <div className="font-sans font-semibold text-[10px] uppercase tracking-wider text-[#8a5a00] not-italic mb-1">
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
