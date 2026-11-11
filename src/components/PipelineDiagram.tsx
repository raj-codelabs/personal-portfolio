import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';
import { Cpu, Terminal, ArrowRight, Zap, Layers } from 'lucide-react';

interface LaneInfo {
  id: string;
  name: string;
  description: string;
  metric: string;
}

const lanes: LaneInfo[] = [
  {
    id: 'lane-1',
    name: 'Invariant Extraction',
    description: 'Filters definitions, invariants, and structural properties',
    metric: '18 tokens/sec',
  },
  {
    id: 'lane-2',
    name: 'Asymptotic Bounds',
    description: 'Calculates Big-O time and space operational bounds',
    metric: 'Strict ceiling',
  },
  {
    id: 'lane-3',
    name: 'Operational Synthesis',
    description: 'Transforms parsed nodes into ANSI colored terminal cards',
    metric: 'Zero overhead',
  },
];

export const PipelineDiagram: React.FC = () => {
  const { theme } = useTheme();
  const isStdout = theme === 'stdout';
  const reducedMotion = useReducedMotionGlobal();
  const [activeLane, setActiveLane] = useState<string>('lane-1');

  return (
    <div
      className={`rounded-xl border p-5 sm:p-6 select-none transition-colors ${
        isStdout
          ? 'border-[#273142] bg-[#141b26] text-[#9aa2b1] font-mono'
          : 'border-[#e0d9cd] bg-[#ffffff] text-[#44403c] font-serif shadow-xs'
      }`}
    >
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">
            <Layers className="w-3.5 h-3.5" />
          </span>
          <span className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">
            Computational Flow: One Input · Core Processor · Three Parallel Lanes
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--accent-copper)]">
          <Zap className="w-3 h-3 animate-pulse" />
          <span>Active Pulse: Running</span>
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="py-4 overflow-x-auto">
        <svg
          viewBox="0 0 760 220"
          className="w-full min-w-[640px] h-auto"
          aria-hidden="true"
        >
          <defs>
            {/* Linear gradients */}
            <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="laneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#b87333" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background grid lines */}
          <line x1="30" y1="110" x2="160" y2="110" stroke={isStdout ? '#273142' : '#e0d9cd'} strokeWidth="2" />
          
          {/* Fan-out lines from Processor to 3 lanes */}
          <path
            d="M 280 110 C 330 110, 330 45, 380 45"
            fill="none"
            stroke={isStdout ? '#273142' : '#e0d9cd'}
            strokeWidth="2"
          />
          <path
            d="M 280 110 L 380 110"
            fill="none"
            stroke={isStdout ? '#273142' : '#e0d9cd'}
            strokeWidth="2"
          />
          <path
            d="M 280 110 C 330 110, 330 175, 380 175"
            fill="none"
            stroke={isStdout ? '#273142' : '#e0d9cd'}
            strokeWidth="2"
          />

          {/* Merge lines from 3 lanes to Output Deck */}
          <path
            d="M 520 45 C 570 45, 570 110, 620 110"
            fill="none"
            stroke={isStdout ? '#273142' : '#e0d9cd'}
            strokeWidth="2"
          />
          <path
            d="M 520 110 L 620 110"
            fill="none"
            stroke={isStdout ? '#273142' : '#e0d9cd'}
            strokeWidth="2"
          />
          <path
            d="M 520 175 C 570 175, 570 110, 620 110"
            fill="none"
            stroke={isStdout ? '#273142' : '#e0d9cd'}
            strokeWidth="2"
          />

          {/* Animated Pulses running along lines (CSS animations disabled under reducedMotion) */}
          {!reducedMotion && (
            <>
              {/* Pulse 1: Input to Processor */}
              <circle r="3.5" fill="#3b82f6" filter="url(#glow)">
                <animateMotion
                  path="M 30 110 L 160 110"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Pulse 2: Processor into Lane 1 (top) */}
              <circle r="3" fill="#60a5fa" filter="url(#glow)">
                <animateMotion
                  path="M 280 110 C 330 110, 330 45, 380 45 L 520 45 C 570 45, 570 110, 620 110"
                  dur="3s"
                  begin="0.4s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Pulse 3: Processor into Lane 2 (middle) */}
              <circle r="3" fill="#b87333" filter="url(#glow)">
                <animateMotion
                  path="M 280 110 L 520 110 L 620 110"
                  dur="2.8s"
                  begin="0.8s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* Pulse 4: Processor into Lane 3 (bottom) */}
              <circle r="3" fill="#10b981" filter="url(#glow)">
                <animateMotion
                  path="M 280 110 C 330 110, 330 175, 380 175 L 520 175 C 570 175, 570 110, 620 110"
                  dur="3.2s"
                  begin="1.2s"
                  repeatCount="indefinite"
                />
              </circle>
            </>
          )}

          {/* 1. INPUT NODE */}
          <g transform="translate(30, 85)">
            <rect
              width="130"
              height="50"
              rx="8"
              fill={isStdout ? '#1a2230' : '#f6f5f1'}
              stroke={isStdout ? '#3b82f6' : '#1d4ed8'}
              strokeWidth="1.5"
            />
            <text
              x="65"
              y="22"
              textAnchor="middle"
              fontSize="11"
              fontWeight="bold"
              fill={isStdout ? '#f6f5f1' : '#1c1917'}
              fontFamily="monospace"
            >
              1. INPUT STREAM
            </text>
            <text
              x="65"
              y="37"
              textAnchor="middle"
              fontSize="9.5"
              fill={isStdout ? '#9aa2b1' : '#6b7280'}
              fontFamily="monospace"
            >
              Raw Lecture Notes
            </text>
          </g>

          {/* 2. MAIN PROCESSOR NODE */}
          <g transform="translate(170, 75)">
            <rect
              width="110"
              height="70"
              rx="10"
              fill={isStdout ? '#1e293b' : '#edeae2'}
              stroke={isStdout ? '#60a5fa' : '#1d4ed8'}
              strokeWidth="2"
            />
            <text
              x="55"
              y="26"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill={isStdout ? '#b87333' : '#b87333'}
              fontFamily="monospace"
            >
              CORE PROCESSOR
            </text>
            <text
              x="55"
              y="42"
              textAnchor="middle"
              fontSize="11"
              fontWeight="bold"
              fill={isStdout ? '#ffffff' : '#1c1917'}
              fontFamily="monospace"
            >
              Token Partition
            </text>
            <text
              x="55"
              y="56"
              textAnchor="middle"
              fontSize="9"
              fill={isStdout ? '#94a3b8' : '#6b7280'}
              fontFamily="monospace"
            >
              Budget: 256 tk
            </text>
          </g>

          {/* 3. THREE PARALLEL LANES */}
          {/* Lane 1: Invariant Extraction */}
          <g transform="translate(380, 20)">
            <rect
              width="140"
              height="48"
              rx="6"
              fill={activeLane === 'lane-1' ? (isStdout ? '#1f2e45' : '#e0ebff') : (isStdout ? '#161e2a' : '#fcfbf9')}
              stroke={activeLane === 'lane-1' ? '#3b82f6' : (isStdout ? '#273142' : '#e0d9cd')}
              strokeWidth={activeLane === 'lane-1' ? '2' : '1'}
              className="cursor-pointer"
              onClick={() => setActiveLane('lane-1')}
            />
            <text
              x="70"
              y="20"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill={activeLane === 'lane-1' ? '#3b82f6' : (isStdout ? '#f6f5f1' : '#1c1917')}
              fontFamily="monospace"
            >
              Lane 1: Invariants
            </text>
            <text
              x="70"
              y="35"
              textAnchor="middle"
              fontSize="9"
              fill={isStdout ? '#9aa2b1' : '#78716c'}
              fontFamily="monospace"
            >
              Kernel Invariant Map
            </text>
          </g>

          {/* Lane 2: Asymptotic Bounds */}
          <g transform="translate(380, 86)">
            <rect
              width="140"
              height="48"
              rx="6"
              fill={activeLane === 'lane-2' ? (isStdout ? '#28231c' : '#fef3c7') : (isStdout ? '#161e2a' : '#fcfbf9')}
              stroke={activeLane === 'lane-2' ? '#b87333' : (isStdout ? '#273142' : '#e0d9cd')}
              strokeWidth={activeLane === 'lane-2' ? '2' : '1'}
              className="cursor-pointer"
              onClick={() => setActiveLane('lane-2')}
            />
            <text
              x="70"
              y="20"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill={activeLane === 'lane-2' ? '#b87333' : (isStdout ? '#f6f5f1' : '#1c1917')}
              fontFamily="monospace"
            >
              Lane 2: Complexity
            </text>
            <text
              x="70"
              y="35"
              textAnchor="middle"
              fontSize="9"
              fill={isStdout ? '#9aa2b1' : '#78716c'}
              fontFamily="monospace"
            >
              O(log n) Invariants
            </text>
          </g>

          {/* Lane 3: Operational Synthesis */}
          <g transform="translate(380, 152)">
            <rect
              width="140"
              height="48"
              rx="6"
              fill={activeLane === 'lane-3' ? (isStdout ? '#152b22' : '#dcfce7') : (isStdout ? '#161e2a' : '#fcfbf9')}
              stroke={activeLane === 'lane-3' ? '#10b981' : (isStdout ? '#273142' : '#e0d9cd')}
              strokeWidth={activeLane === 'lane-3' ? '2' : '1'}
              className="cursor-pointer"
              onClick={() => setActiveLane('lane-3')}
            />
            <text
              x="70"
              y="20"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill={activeLane === 'lane-3' ? '#10b981' : (isStdout ? '#f6f5f1' : '#1c1917')}
              fontFamily="monospace"
            >
              Lane 3: Synthesis
            </text>
            <text
              x="70"
              y="35"
              textAnchor="middle"
              fontSize="9"
              fill={isStdout ? '#9aa2b1' : '#78716c'}
              fontFamily="monospace"
            >
              Rich Deck Format
            </text>
          </g>

          {/* 4. OUTPUT TERMINAL DECK */}
          <g transform="translate(620, 85)">
            <rect
              width="120"
              height="50"
              rx="8"
              fill={isStdout ? '#0b1017' : '#1c1917'}
              stroke="#10b981"
              strokeWidth="1.5"
            />
            <text
              x="60"
              y="22"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#10b981"
              fontFamily="monospace"
            >
              RICH TERMINAL
            </text>
            <text
              x="60"
              y="37"
              textAnchor="middle"
              fontSize="9"
              fill="#94a3b8"
              fontFamily="monospace"
            >
              Exit Code 0
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive lane metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[var(--border-subtle)] text-xs">
        {lanes.map((lane) => {
          const isSelected = activeLane === lane.id;
          return (
            <button
              key={lane.id}
              type="button"
              onClick={() => setActiveLane(lane.id)}
              className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                isSelected
                  ? isStdout
                    ? 'border-[#3b82f6] bg-[#1a2536] text-[#f6f5f1]'
                    : 'border-[#1d4ed8] bg-[#f0f6ff] text-[#1c1917]'
                  : isStdout
                  ? 'border-[#273142] bg-[#111620] hover:border-[#3b82f6]/50'
                  : 'border-[#e0d9cd] bg-[#fdfcfa] hover:border-[#1d4ed8]/50'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-xs mb-1">
                <span className={isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}>
                  {lane.name}
                </span>
                <span className="text-[10px] text-[var(--accent-copper)] font-mono">{lane.metric}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[var(--text-secondary)] font-sans">
                {lane.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
