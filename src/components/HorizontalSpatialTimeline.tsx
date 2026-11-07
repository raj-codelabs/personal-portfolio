/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Milestone } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { spring } from '../motion/motion-tokens';
import { BookOpen, Calendar, Tag, ChevronRight, Activity, Cpu } from 'lucide-react';

interface HorizontalSpatialTimelineProps {
  milestones: Milestone[];
}

export const HorizontalSpatialTimeline: React.FC<HorizontalSpatialTimelineProps> = ({ milestones }) => {
  const { theme } = useTheme();
  const isStdout = theme === 'stdout';
  const reducedMotion = useReducedMotionGlobal();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>(milestones[0]?.id || '');

  // Vertical scroll tracking mapped to horizontal translation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    mass: 0.5,
  });

  // Calculate horizontal travel distance (translates horizontally as user scrolls vertically)
  // With 4 cards, translating ~ (milestones.length - 1) * 360px
  const maxTranslatePercent = Math.max(30, (milestones.length - 1) * 22);
  const x = useTransform(smoothProgress, [0, 1], ['0%', `-${maxTranslatePercent}%`]);

  // Branch colors
  const branchColors: Record<string, string> = {
    main: isStdout ? '#00e5c0' : '#1d4ed8',
    foundations: isStdout ? '#00e5c0' : '#1d4ed8',
    python: isStdout ? '#58a6ff' : '#2563eb',
    projects: isStdout ? '#e27d60' : '#c25e38',
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${
        reducedMotion ? 'min-h-auto' : 'hidden md:block min-h-[240vh]'
      }`}
    >
      {/* Sticky Viewport Stage */}
      <div className={`${reducedMotion ? 'relative' : 'sticky top-20 h-[calc(100vh-6rem)] overflow-hidden'} flex flex-col justify-center`}>
        {/* Spatial HUD Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)] text-xs">
          <div className="flex items-center gap-2">
            {isStdout ? (
              <div className="flex items-center gap-2 font-mono text-[#00e5c0]">
                <Activity className="w-4 h-4 animate-pulse" />
                <span className="font-bold">SPATIAL_TIMELINE_CANVAS // SCRUB_BUS</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 font-serif text-[#1d4ed8]">
                <BookOpen className="w-4 h-4" />
                <span className="font-bold">Horizontal Curriculum Ledger</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-muted)]">
            <span className="hidden sm:inline">Scrub to advance timeline →</span>
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-primary)] font-bold">
                {milestones.findIndex((m) => m.id === activeMilestoneId) + 1}
              </span>
              <span>/</span>
              <span>{milestones.length}</span>
            </div>
          </div>
        </div>

        {/* Living Flow Rail (stdout glowing SVG bus) */}
        {isStdout && (
          <div className="relative w-full h-8 mb-4 pointer-events-none">
            <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-[#242e40]" />
            <motion.div
              style={{
                scaleX: smoothProgress,
                transformOrigin: 'left center',
              }}
              className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00e5c0] via-[#58a6ff] to-[#00e5c0] shadow-[0_0_12px_rgba(0,229,192,0.6)]"
            />
          </div>
        )}

        {/* Horizontal Moving Cards Track */}
        <div className="relative w-full overflow-hidden py-4">
          <motion.div
            style={{ x: reducedMotion ? '0%' : x }}
            className="flex items-stretch gap-6 pl-2"
          >
            {milestones.map((m, idx) => {
              const isCurrent = m.id === activeMilestoneId;
              const branchColor = branchColors[m.branch] || (isStdout ? '#00e5c0' : '#1d4ed8');

              return (
                <div
                  key={m.id}
                  onClick={() => setActiveMilestoneId(m.id)}
                  className={`w-[360px] sm:w-[420px] shrink-0 rounded-xl border p-6 sm:p-7 flex flex-col justify-between transition-[border-color,background-color,box-shadow] duration-200 ease-out cursor-pointer ${
                    isStdout
                      ? isCurrent
                        ? 'border-[#00e5c0] bg-[#121722] shadow-[0_0_24px_rgba(0,229,192,0.15)] font-mono text-[#f1f5f9]'
                        : 'border-[#242e40] bg-[#0d121c]/90 text-[#94a3b8] hover:border-[#384660] font-mono'
                      : isCurrent
                      ? 'border-[#1d4ed8] bg-[#ffffff] shadow-lg font-serif text-[#1c1917]'
                      : 'border-[#e2dbce] bg-[#faf8f5] text-[#44403c] hover:border-[#1d4ed8]/40 font-serif'
                  }`}
                >
                  {/* Top metadata */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-[var(--border-subtle)]">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: branchColor }}
                        />
                        <span className="font-bold text-[var(--accent-primary)] font-mono">
                          {m.logNumber || `0${idx + 1}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{m.date}</span>
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--text-primary)] leading-snug">
                      {m.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-body">
                      {m.summary}
                    </p>
                  </div>

                  {/* Middle: Details & Learnings */}
                  <div className="my-4 pt-3 border-t border-[var(--border-subtle)] space-y-2 text-xs font-mono">
                    <div className="text-[11px] text-[var(--accent-primary)] font-bold uppercase tracking-wider">
                      Key Takeaway
                    </div>
                    <p className="text-[var(--text-secondary)] leading-relaxed">
                      {m.details || m.learnings?.[0] || 'Core foundational milestones and coursework implementation.'}
                    </p>
                  </div>

                  {/* Bottom: Tags & Step Indicator */}
                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {m.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-mono border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-secondary)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="text-[11px] font-mono text-[var(--accent-primary)] flex items-center gap-1">
                      <span>Node #{idx + 1}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
