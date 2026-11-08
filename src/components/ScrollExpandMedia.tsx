/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Project } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Terminal, Code2, ChevronRight, ExternalLink, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';
import { spring } from '../motion/motion-tokens';

interface ScrollExpandMediaProps {
  project: Project;
  onOpenCaseStudy: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

type PipelineStage = 'ingestion' | 'prompt' | 'terminal';
type SampleTopic = 'os' | 'algo';

export const ScrollExpandMedia: React.FC<ScrollExpandMediaProps> = ({
  project,
  onOpenCaseStudy,
  triggerRef,
}) => {
  const { theme } = useTheme();
  const isStdout = theme === 'stdout';
  const reducedMotion = useReducedMotionGlobal();
  const containerRef = useRef<HTMLDivElement>(null);

  // Interactive Live Pipeline Stage State
  const [stage, setStage] = useState<PipelineStage>('terminal');
  const [topic, setTopic] = useState<SampleTopic>('os');

  // Track scroll position through the kinetic expansion stage
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 24,
    mass: 0.4,
  });

  // Kinetic interpolation transforms
  const scale = useTransform(smoothProgress, [0, 1], [0.94, 1]);
  const borderRadius = useTransform(smoothProgress, [0, 1], ['20px', '12px']);
  const opacity = useTransform(smoothProgress, [0, 0.3, 1], [0.7, 0.95, 1]);

  const topicsData = {
    os: {
      title: 'Virtual Memory & Page Tables',
      code: 'CS50_OS_04',
      rawText:
        'Virtual memory abstracts physical RAM into contiguous address spaces. Page tables map virtual page numbers (VPN) to physical frame numbers (PFN) via Translation Lookaside Buffers (TLB). Page faults trigger OS trap handler to swap missing frames from disk backing store.',
      tokensIn: 54,
      tokensOut: 38,
      latency: '0.28s',
      promptBounds:
        'PROMPT_TEMPLATE = """\\nExtract core invariant definitions from the following lecture notes.\\nFORMAT: Key term + operational consequence.\\nMAX_TOKENS: 256 | STRICT_BOUNDS: True\\nNOTES: {raw_text}\\n"""',
      richTerminal: [
        { id: '01', term: 'Virtual Page Number (VPN)', def: 'Mapped to PFN via Hardware TLB cache' },
        { id: '02', term: 'TLB Hit vs Miss Penalty', def: 'Hardware TLB eliminates 2-level RAM traversal' },
        { id: '03', term: 'Page Fault Invariant', def: 'Synchronous OS trap to swap backing frame' },
      ],
    },
    algo: {
      title: 'Red-Black Balancing Invariants',
      code: 'CS50_ALGO_08',
      rawText:
        'A Red-Black Tree is a self-balancing binary search tree where every node is colored red or black. Properties: Root is black, no two adjacent red nodes, and every path from root to leaf contains identical black-height. Insertion maintains balance through rotations in O(log n) time.',
      tokensIn: 68,
      tokensOut: 42,
      latency: '0.22s',
      promptBounds:
        'PROMPT_TEMPLATE = """\\nExtract algorithmic invariants and asymptotic bounds.\\nFORMAT: Invariant rule + time/space complexity.\\nMAX_TOKENS: 256 | STRICT_BOUNDS: True\\nNOTES: {raw_text}\\n"""',
      richTerminal: [
        { id: '01', term: 'Black-Height Equality', def: 'All simple paths contain identical black nodes' },
        { id: '02', term: 'Rotation Ceiling', def: 'At most 2 tree rotations required upon insertion' },
        { id: '03', term: 'Asymptotic Guarantee', def: 'Strict O(log n) search, insert, and delete bound' },
      ],
    },
  };

  const activeData = topicsData[topic];

  return (
    <div ref={containerRef} className="relative w-full py-4 sm:py-6">
      <motion.article
        style={{
          scale: reducedMotion ? 1 : scale,
          borderRadius: reducedMotion ? '12px' : borderRadius,
          opacity: reducedMotion ? 1 : opacity,
        }}
        className={`relative overflow-hidden border p-6 sm:p-8 transition-colors ${
          isStdout
            ? 'border-[#273142] bg-[#1a202c] hover:border-[#3b82f6] shadow-[0_4px_24px_rgba(0,0,0,0.5)] font-mono text-[#9aa2b1]'
            : 'border-[#e0d9cd] bg-[#ffffff] hover:border-[#1d4ed8] shadow-md font-serif text-[#44403c]'
        }`}
      >
        {/* Kinetic Header Perimeter */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded font-semibold text-[11px] uppercase tracking-wider ${
                isStdout
                  ? 'bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/40 font-mono'
                  : 'bg-[#1d4ed8]/10 text-[#1d4ed8] border border-[#1d4ed8]/30 font-serif'
              }`}
            >
              [SIGNATURE BUILD · LIVE PIPELINE]
            </span>
            <span className="text-[var(--border-subtle)]">·</span>
            <span className="font-mono text-[var(--accent-copper)] font-semibold">
              Python 3.12 / LLM Tooling
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-[var(--text-muted)]">Sample Note:</span>
            <div className="flex items-center gap-1 border border-[var(--border-subtle)] rounded p-0.5 bg-[var(--bg-page)]">
              <button
                type="button"
                onClick={() => setTopic('os')}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                  topic === 'os'
                    ? isStdout
                      ? 'bg-[#273142] text-[#f6f5f1] font-bold'
                      : 'bg-[#edeae2] text-[#1d4ed8] font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                OS Virtual Memory
              </button>
              <button
                type="button"
                onClick={() => setTopic('algo')}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                  topic === 'algo'
                    ? isStdout
                      ? 'bg-[#273142] text-[#f6f5f1] font-bold'
                      : 'bg-[#edeae2] text-[#1d4ed8] font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                Red-Black Trees
              </button>
            </div>
          </div>
        </div>

        {/* Content & Interactive Pipeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
          {/* Left Column: Project Overview & Core Philosophy */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] mb-1.5">
                <span>PROJECT 01</span>
                <span>·</span>
                <span>HARVARD CS50 PRACTICAL TOOL</span>
              </div>
              <h3
                className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${
                  isStdout ? 'font-mono' : 'font-serif'
                }`}
              >
                {project.title}
              </h3>
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-body">
              {project.problem}
            </p>

            <div
              className={`p-4 rounded border text-xs space-y-2 ${
                isStdout
                  ? 'border-[#273142] bg-[#11151c] text-[#f6f5f1]'
                  : 'border-[#e0d9cd] bg-[#f6f5f1] text-[#1c1917]'
              }`}
            >
              <div className="font-bold text-[var(--accent-copper)] flex items-center gap-1.5 font-mono">
                <Cpu className="w-4 h-4" />
                <span>3-Stage Computational Pipeline:</span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed font-body">
                (1) Markdown ingestion &amp; line-partitioning ──▶ (2) Strict token-window budgeting ──▶ (3) ANSI terminal output deck formatted with Rich.
              </p>
            </div>

            {/* Action Triggers */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <motion.button
                ref={triggerRef}
                type="button"
                onClick={onOpenCaseStudy}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                transition={spring.snap}
                className={`group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-bold transition-all cursor-pointer shadow-xs focus-visible:outline-2 ${
                  isStdout
                    ? 'bg-[#3b82f6] text-[#ffffff] hover:bg-[#60a5fa] font-mono'
                    : 'bg-[#1d4ed8] text-white hover:bg-[#1e40af] font-serif'
                }`}
              >
                <span>Full Architectural Dossier</span>
                <ChevronRight className="w-4 h-4 transition-transform duration-150 ease-out group-hover/btn:translate-x-1" />
              </motion.button>

              <motion.a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                transition={spring.snap}
                className={`group/link inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-medium border transition-colors cursor-pointer ${
                  isStdout
                    ? 'border-[#273142] bg-[#11151c] text-[#f6f5f1] hover:border-[#3b82f6] hover:text-[#3b82f6] font-mono'
                    : 'border-[#e0d9cd] bg-[#ffffff] text-[#1c1917] hover:border-[#1d4ed8] hover:text-[#1d4ed8] font-serif'
                }`}
              >
                <span>GitHub Source</span>
                <ExternalLink className="w-3.5 h-3.5 transition-transform duration-150 ease-out group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </motion.a>
            </div>
          </div>

          {/* Right Column: Live Pipeline Stage Inspector (Signature Centerpiece) */}
          <div className="lg:col-span-7 space-y-3">
            {/* Stage Selector Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[var(--accent-copper)]" />
                <span className="font-bold text-[var(--text-primary)]">Live Pipeline Inspector:</span>
              </div>

              <div className="flex items-center gap-1">
                {(['ingestion', 'prompt', 'terminal'] as PipelineStage[]).map((s, idx) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStage(s)}
                    className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                      stage === s
                        ? isStdout
                          ? 'bg-[#3b82f6] text-[#ffffff] font-bold'
                          : 'bg-[#1d4ed8] text-white font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-page)]'
                    }`}
                  >
                    {idx + 1}. {s === 'ingestion' ? 'Ingest' : s === 'prompt' ? 'Budget' : 'Terminal Deck'}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Stage Screen */}
            <div
              className={`rounded-lg border p-4 sm:p-5 min-h-[260px] flex flex-col justify-between font-mono text-xs ${
                isStdout
                  ? 'border-[#273142] bg-[#11151c] text-[#f6f5f1]'
                  : 'border-[#e0d9cd] bg-[#f6f5f1] text-[#1c1917]'
              }`}
            >
              {stage === 'ingestion' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-2">
                    <span>STAGE 1 // RAW LECTURE NOTE INGESTION</span>
                    <span className="text-[var(--accent-copper)]">Normalized lines: 3</span>
                  </div>
                  <p className="leading-relaxed text-[var(--text-secondary)] font-body text-xs italic">
                    "{activeData.rawText}"
                  </p>
                  <div className="pt-2 text-[11px] text-[var(--text-muted)] border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <span>Cleaned ASCII buffer</span>
                    <span className="text-[var(--accent-primary)] font-bold">{activeData.tokensIn} Raw Input Tokens</span>
                  </div>
                </div>
              )}

              {stage === 'prompt' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-2">
                    <span>STAGE 2 // TOKEN WINDOW CLAMPING &amp; TEMPLATE</span>
                    <span className="text-[var(--accent-copper)]">Max tokens: 256</span>
                  </div>
                  <pre className="text-[11px] leading-relaxed p-3 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-x-auto text-[var(--text-secondary)]">
                    {activeData.promptBounds}
                  </pre>
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center justify-between">
                    <span>Deterministic JSON schema prompt guard</span>
                    <span className="text-[var(--accent-primary)] font-bold">Strict Clamping Active</span>
                  </div>
                </div>
              )}

              {stage === 'terminal' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-2">
                    <span className="flex items-center gap-1.5 text-[var(--accent-copper)] font-bold">
                      <Terminal className="w-3.5 h-3.5" />
                      STAGE 3 // ANSI RICH TERMINAL DECK
                    </span>
                    <span className="text-[var(--accent-primary)] font-bold">
                      Latency: {activeData.latency}
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    {activeData.richTerminal.map((item) => (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded border flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 ${
                          isStdout
                            ? 'border-[#273142] bg-[#1a202c]'
                            : 'border-[#e0d9cd] bg-[#ffffff]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--accent-copper)] font-bold">[{item.id}]</span>
                          <span className="font-bold text-[var(--text-primary)]">{item.term}</span>
                        </div>
                        <span className="text-[var(--text-secondary)] text-[11px]">
                          {item.def}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-[11px] text-[var(--text-muted)] border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <span>Status: Exit code 0 (Success)</span>
                    <span className="text-[var(--accent-primary)] font-bold">
                      Emitted {activeData.tokensOut} tokens
                    </span>
                  </div>
                </div>
              )}

              {/* Bottom Pipeline Status Footer */}
              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent-copper)]" />
                  <span>Module: <code className="text-[var(--text-primary)]">summarizer.py</code></span>
                </div>
                <div className="flex items-center gap-1 text-[var(--accent-primary)]">
                  <span>Interactive Pipeline Stage</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
};
