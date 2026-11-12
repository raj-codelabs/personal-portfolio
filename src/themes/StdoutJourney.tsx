import React, { useState } from 'react';
import { Milestone } from '../types';
import { Milestone as MilestoneIcon, ChevronDown, ChevronUp, BookOpen, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { spring, distance } from '../motion/motion-tokens';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

interface StdoutJourneyProps {
  milestones: Milestone[];
}

export const StdoutJourney: React.FC<StdoutJourneyProps> = ({ milestones }) => {
  const reducedMotion = useReducedMotionGlobal();
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(
    milestones[milestones.length - 1]?.id || milestones[0]?.id
  );
  const [showAllDetails, setShowAllDetails] = useState<boolean>(true);

  const selectedMilestone = milestones.find((m) => m.id === selectedMilestoneId) || milestones[0];

  // Map branches to distinct horizontal lane offsets in SVG
  const laneMap: Record<string, number> = {
    'main': 60,
    'foundations': 60,
    'python': 160,
    'projects': 260,
  };

  const laneColors: Record<string, string> = {
    'main': '#3b82f6',       // signal cobalt (academics)
    'foundations': '#3b82f6',  // signal cobalt
    'python': '#5da399',       // verdigris patina (python track)
    'projects': '#b87333',     // oxidized copper (practical builds)
  };

  const branchDisplayMap: Record<string, string> = {
    'academics': 'Academics',
    'foundations': 'Foundations',
    'python': 'Python Track',
    'python-track': 'Python Track',
    'software': 'Software',
    'projects': 'Projects',
    'main': 'Academics',
  };

  // Node vertical spacing
  const stepY = 80;
  const startY = 50;
  const svgHeight = milestones.length * stepY + 30;

  return (
    <div className="space-y-6 text-left font-mono">
      {/* Informative Header */}
      <div className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-mono text-[var(--text-secondary)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MilestoneIcon className="w-4 h-4 text-[var(--accent-copper)]" aria-hidden="true" />
          <span className="text-[var(--text-primary)] font-bold">Chronological Learning Milestones</span>
        </div>
        <div className="text-[11px] text-[var(--text-muted)]">
          Foundational coursework &amp; verified self-directed builds
        </div>
      </div>

      {/* Main Container: SVG DAG + Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        {/* Left Column: Interactive Milestone Graph & Node List */}
        <div className="lg:col-span-7 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)]">
            <span>Milestone Track</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Academics
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#5da399]" /> Python
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#b87333]" /> Projects
              </span>
            </div>
          </div>

          <div className="relative overflow-x-auto">
            {/* SVG Learning Track with enlarged width to eliminate dead space */}
            <div className="min-w-[340px]">
              <svg
                width="100%"
                height={svgHeight}
                viewBox={`0 0 320 ${svgHeight}`}
                className="overflow-visible"
                aria-label="Directed graph representing student learning milestones"
                role="img"
              >
                {/* Connecting branch paths */}
                {milestones.map((m, idx) => {
                  if (idx === 0) return null;
                  const prev = milestones[idx - 1];
                  const x1 = laneMap[prev.branch] || 60;
                  const y1 = startY + (idx - 1) * stepY;
                  const x2 = laneMap[m.branch] || 60;
                  const y2 = startY + idx * stepY;
                  const strokeColor = laneColors[m.branch] || '#3b82f6';

                  const pathData =
                    x1 === x2
                      ? `M ${x1} ${y1} L ${x2} ${y2}`
                      : `M ${x1} ${y1} C ${x1} ${y1 + stepY * 0.5}, ${x2} ${y2 - stepY * 0.5}, ${x2} ${y2}`;

                  return (
                    <path
                      key={`path-${m.id}`}
                      d={pathData}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2.5"
                      strokeOpacity="0.75"
                    />
                  );
                })}

                {/* Nodes with Title + Date Labels (Phase 3.1) */}
                {milestones.map((m, idx) => {
                  const x = laneMap[m.branch] || 60;
                  const y = startY + idx * stepY;
                  const isSelected = m.id === selectedMilestoneId;
                  const color = laneColors[m.branch] || '#3b82f6';
                  const shortName = m.branch === 'projects' ? 'Projects' : m.branch === 'python' ? 'CS50P' : idx === 1 ? 'CS50x' : 'Academics';

                  return (
                    <g
                      key={`node-${m.id}`}
                      onClick={() => setSelectedMilestoneId(m.id)}
                      className="cursor-pointer"
                      tabIndex={0}
                      role="button"
                      aria-label={`Milestone: ${m.title}, Date: ${m.date}`}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 8 : 6}
                        fill={isSelected ? '#0b0e14' : color}
                        stroke={color}
                        strokeWidth={isSelected ? 3 : 2}
                      />
                      <text
                        x={x + 14}
                        y={y + 4}
                        fill={isSelected ? '#3b82f6' : '#8b949e'}
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                      >
                        {m.logNumber || `0${idx + 1}`} · {shortName} · {m.date}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Milestone Row Interactive Items aligned with graph */}
              <div className="mt-4 space-y-2">
                {milestones.map((m, idx) => {
                  const isSelected = m.id === selectedMilestoneId;
                  const branchColor = laneColors[m.branch] || '#3b82f6';
                  const displayBranch = branchDisplayMap[m.branch.toLowerCase()] || branchDisplayMap[(m.branchLabel || '').toLowerCase()] || m.branch;

                  return (
                    <motion.button
                      key={m.id}
                      onClick={() => setSelectedMilestoneId(m.id)}
                      whileTap={reducedMotion ? undefined : { scale: 0.99 }}
                      transition={spring.snap}
                      className={`w-full text-left p-3 rounded border cursor-pointer flex items-center justify-between gap-3 hover:-translate-y-[1px] active:translate-y-[1px] transition-transform transition-color transition-opacity ${
                        isSelected
                          ? 'border-[#3b82f6] bg-[#1a2332] text-[#f1f5f9]'
                          : 'border-[#242e40] bg-[#0d121c] text-[#8b949e] hover:border-[#384660] hover:text-[#f1f5f9]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: branchColor }}
                          aria-hidden="true"
                        />
                        <span className="text-[#3b82f6] font-bold shrink-0">{m.logNumber || `0${idx + 1}`}</span>
                        <span className="truncate">{m.title}</span>
                      </div>
                      <span className="text-[11px] text-[#64748b] shrink-0">{displayBranch} · {m.date}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Milestone Details Inspector */}
        <div className="lg:col-span-5 rounded-md border border-[#242e40] bg-[#121722] p-5 font-mono text-xs text-[#f1f5f9] sticky top-20">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#242e40]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#3b82f6]" aria-hidden="true" />
              <span className="font-bold text-[#3b82f6]">Milestone #{selectedMilestone.logNumber}</span>
            </div>
            <span className="text-[11px] text-[#94a3b8]">{selectedMilestone.date}</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-[#64748b] text-[11px] uppercase tracking-wider mb-1">Milestone Title</div>
              <h4 className="text-sm font-bold text-[#f1f5f9]">
                {selectedMilestone.title}
              </h4>
            </div>

            <div>
              <div className="text-[#64748b] text-[11px] uppercase tracking-wider mb-1">Focus Area</div>
              <div className="flex items-center gap-2 text-[#3b82f6]">
                <span>{branchDisplayMap[(selectedMilestone.branchLabel || selectedMilestone.branch).toLowerCase()] || selectedMilestone.branch}</span>
              </div>
            </div>

            <div>
              <div className="text-[#64748b] text-[11px] uppercase tracking-wider mb-1">Summary</div>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                {selectedMilestone.summary}
              </p>
            </div>

            {selectedMilestone.details && (
              <div>
                <div className="text-[#64748b] text-[11px] uppercase tracking-wider mb-1">Details &amp; Practice</div>
                <p className="text-xs text-[#f1f5f9] leading-relaxed">
                  {selectedMilestone.details}
                </p>
              </div>
            )}

            {selectedMilestone.learnings && selectedMilestone.learnings.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowAllDetails(!showAllDetails)}
                  className="flex items-center justify-between w-full text-[11px] text-[#3b82f6] font-semibold pt-2 border-t border-[#242e40] cursor-pointer"
                >
                  <span>Key Concepts &amp; Takeaways</span>
                  {showAllDetails ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:duration-0 ${
                    showAllDetails ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul
                      className={`mt-2 space-y-1.5 text-xs text-[#94a3b8] transition-opacity duration-150 ease-out ${
                        showAllDetails ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {selectedMilestone.learnings.map((learning, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#3b82f6]">›</span>
                          <span>{learning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedMilestone.tags && selectedMilestone.tags.length > 0 && (
              <div className="pt-3 border-t border-[#242e40] flex flex-wrap gap-1.5">
                {selectedMilestone.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-[#1a2332] text-[#94a3b8]"
                  >
                    <Tag className="w-2.5 h-2.5 text-[#3b82f6]" />
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
