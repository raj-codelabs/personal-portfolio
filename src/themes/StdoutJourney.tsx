import React, { useState } from 'react';
import { Milestone } from '../types';
import { GitCommit, GitBranch, Terminal, Calendar, Tag, ChevronDown, ChevronUp } from 'lucide-react';

interface StdoutJourneyProps {
  milestones: Milestone[];
}

export const StdoutJourney: React.FC<StdoutJourneyProps> = ({ milestones }) => {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(milestones[milestones.length - 1]?.id || milestones[0]?.id);
  const [showAllDetails, setShowAllDetails] = useState<boolean>(false);

  const selectedMilestone = milestones.find((m) => m.id === selectedMilestoneId) || milestones[0];

  // Map branches to distinct horizontal lane offsets in SVG
  // lane 0: 'main' (x = 40)
  // lane 1: 'systems' (x = 110)
  // lane 2: 'ml-core' (x = 180)
  const laneMap: Record<string, number> = {
    'main': 45,
    'systems': 105,
    'ml-core': 165,
  };

  const laneColors: Record<string, string> = {
    'main': '#58a6ff',      // blue
    'systems': '#3fb950',   // green
    'ml-core': '#d29922',   // yellow/amber
  };

  // Node vertical spacing
  const stepY = 70;
  const startY = 40;
  const svgHeight = milestones.length * stepY + 30;

  return (
    <div className="space-y-6 text-left">
      {/* Informative Header / Git status */}
      <div className="p-3 rounded border border-[#30363d] bg-[#161b22] text-xs font-mono text-[#8b949e] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-[#58a6ff]" aria-hidden="true" />
          <span className="text-[#e6edf3]">git log --graph --oneline --all</span>
        </div>
        <div className="text-[11px] text-[#8b949e]">
          * Commit hashes are illustrative milestones
        </div>
      </div>

      {/* Main Container: SVG DAG + Git Show Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Git Graph & Node List */}
        <div className="lg:col-span-7 rounded-md border border-[#30363d] bg-[#161b22] p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#30363d] text-xs font-mono text-[#8b949e]">
            <span>Branch Topology & Milestones</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#58a6ff]" /> main
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#3fb950]" /> systems
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#d29922]" /> ml-core
              </span>
            </div>
          </div>

          <div className="relative overflow-x-auto">
            {/* SVG Git Graph */}
            <div className="min-w-[340px]">
              <svg
                width="100%"
                height={svgHeight}
                viewBox={`0 0 210 ${svgHeight}`}
                className="overflow-visible"
                aria-label="Git Directed Acyclic Graph representing portfolio milestones"
                role="img"
              >
                <defs>
                  {/* Subtle glow filter */}
                  <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#58a6ff" floodOpacity="0.4" />
                  </filter>
                </defs>

                {/* Connecting branch paths */}
                {milestones.map((m, idx) => {
                  if (idx === 0) return null;
                  const prev = milestones[idx - 1];
                  const x1 = laneMap[prev.branch] || 45;
                  const y1 = startY + (idx - 1) * stepY;
                  const x2 = laneMap[m.branch] || 45;
                  const y2 = startY + idx * stepY;
                  const strokeColor = laneColors[m.branch] || '#58a6ff';

                  // If same lane, straight line; if branch change, bezier curve
                  const pathData =
                    x1 === x2
                      ? `M ${x1} ${y1} L ${x2} ${y2}`
                      : `M ${x1} ${y1} C ${x1} ${y1 + stepY * 0.5}, ${x2} ${y2 - stepY * 0.5}, ${x2} ${y2}`;

                  return (
                    <path
                      key={`path-${idx}`}
                      d={pathData}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2.5"
                      strokeOpacity="0.75"
                    />
                  );
                })}

                {/* Nodes */}
                {milestones.map((m, idx) => {
                  const x = laneMap[m.branch] || 45;
                  const y = startY + idx * stepY;
                  const isSelected = m.id === selectedMilestoneId;
                  const color = laneColors[m.branch] || '#58a6ff';

                  return (
                    <g
                      key={m.id}
                      className="cursor-pointer focus:outline-none"
                      tabIndex={0}
                      role="button"
                      aria-label={`Milestone: ${m.title}, commit ${m.commitHash}`}
                      onClick={() => setSelectedMilestoneId(m.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedMilestoneId(m.id);
                        }
                      }}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 8 : 6}
                        fill="#0d1117"
                        stroke={color}
                        strokeWidth={isSelected ? 3 : 2}
                        filter={isSelected ? 'url(#node-glow)' : undefined}
                      />
                      {isSelected && (
                        <circle cx={x} cy={y} r={3} fill={color} />
                      )}

                      {/* Small commit tag label next to node inside SVG */}
                      <text
                        x={x + 14}
                        y={y + 4}
                        fill={isSelected ? '#58a6ff' : '#8b949e'}
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                      >
                        {m.commitHash}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Milestone Row Interactive Items aligned with graph */}
              <div className="mt-4 space-y-2">
                {milestones.map((m) => {
                  const isSelected = m.id === selectedMilestoneId;
                  const branchColor = laneColors[m.branch];

                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMilestoneId(m.id)}
                      className={`w-full text-left p-2.5 rounded border transition-all text-xs font-mono cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#58a6ff] bg-[#21262d] text-[#e6edf3]'
                          : 'border-[#30363d] bg-[#0d1117] text-[#8b949e] hover:border-[#8b949e] hover:text-[#e6edf3]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: branchColor }}
                          aria-hidden="true"
                        />
                        <span className="text-[#58a6ff] font-bold shrink-0">{m.commitHash}</span>
                        <span className="truncate">{m.title}</span>
                      </div>
                      <span className="text-[11px] text-[#6e7681] shrink-0">{m.date}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: git show Inspection Drawer */}
        <div className="lg:col-span-5 rounded-md border border-[#30363d] bg-[#161b22] p-5 font-mono text-xs text-[#e6edf3] sticky top-20">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#30363d]">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#3fb950]" aria-hidden="true" />
              <span className="font-bold text-[#3fb950]">$ git show {selectedMilestone.commitHash}</span>
            </div>
            <span className="text-[11px] text-[#8b949e]">{selectedMilestone.date}</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-[#8b949e] text-[11px] uppercase tracking-wider mb-1">Commit Message</div>
              <h4 className="text-sm font-bold text-[#e6edf3]">
                {selectedMilestone.title}
              </h4>
            </div>

            <div>
              <div className="text-[#8b949e] text-[11px] uppercase tracking-wider mb-1">Branch</div>
              <div className="flex items-center gap-2 text-[#58a6ff]">
                <GitBranch className="w-3.5 h-3.5" />
                <span>{selectedMilestone.branchLabel || selectedMilestone.branch}</span>
              </div>
            </div>

            <div>
              <div className="text-[#8b949e] text-[11px] uppercase tracking-wider mb-1">Summary</div>
              <p className="text-[#c9d1d9] leading-relaxed">
                {selectedMilestone.summary}
              </p>
            </div>

            <div>
              <div className="text-[#8b949e] text-[11px] uppercase tracking-wider mb-1">Diff & Inspection</div>
              <div className="p-3 rounded bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] leading-relaxed">
                {selectedMilestone.details}
              </div>
            </div>

            <div>
              <div className="text-[#8b949e] text-[11px] uppercase tracking-wider mb-1.5">Key Learnings</div>
              <ul className="space-y-1 text-[#8b949e]">
                {selectedMilestone.learnings.map((learning, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#3fb950] shrink-0">+</span>
                    <span>{learning}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-[#30363d] flex flex-wrap items-center gap-1.5">
              <span className="text-[#6e7681]">Tags:</span>
              {selectedMilestone.tags.map((tag) => (
                <span key={tag} className="text-[#c9d1d9]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
