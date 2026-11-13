import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';
import { Terminal, Code2, ChevronRight, ExternalLink, Cpu, Play, CheckCircle2, RotateCw } from 'lucide-react';

interface ScrollExpandMediaProps {
  project: Project;
  onOpenCaseStudy: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

type PipelineStage = 'ingestion' | 'prompt' | 'terminal';
type SampleTopic = 'os' | 'algo' | 'consensus';

export const ScrollExpandMedia: React.FC<ScrollExpandMediaProps> = ({
  project,
  onOpenCaseStudy,
  triggerRef,
}) => {
  const reducedMotion = useReducedMotionGlobal();

  // Interactive Live Pipeline Stage State
  const [stage, setStage] = useState<PipelineStage>('terminal');
  const [topic, setTopic] = useState<SampleTopic>('os');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [tokenBudget, setTokenBudget] = useState<number>(256);
  const [autoCycle, setAutoCycle] = useState<boolean>(true);

  // Card loop cycling in 3.2s
  useEffect(() => {
    if (reducedMotion || !autoCycle) return;
    const interval = setInterval(() => {
      setTopic((prev) => (prev === 'os' ? 'algo' : prev === 'algo' ? 'consensus' : 'os'));
    }, 3500);
    return () => clearInterval(interval);
  }, [reducedMotion, autoCycle]);

  const topicsData = {
    os: {
      title: 'Virtual Memory & Page Tables',
      code: 'CS50_OS_04',
      rawText:
        'Virtual memory abstracts physical RAM into contiguous address spaces. Page tables map virtual page numbers (VPN) to physical frame numbers (PFN) via Translation Lookaside Buffers (TLB). Page faults trigger OS trap handler to swap missing frames from disk backing store.',
      tokensIn: 54,
      tokensOut: 38,
      latency: '0.24s',
      promptBounds:
        'PROMPT_TEMPLATE = """\nExtract core invariant definitions from the following lecture notes.\nFORMAT: Key term + operational consequence.\nMAX_TOKENS: 256 | STRICT_BOUNDS: True\nNOTES: {raw_text}\n"""',
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
      latency: '0.21s',
      promptBounds:
        'PROMPT_TEMPLATE = """\nExtract algorithmic invariants and asymptotic bounds.\nFORMAT: Invariant rule + time/space complexity.\nMAX_TOKENS: 256 | STRICT_BOUNDS: True\nNOTES: {raw_text}\n"""',
      richTerminal: [
        { id: '01', term: 'Black-Height Equality', def: 'All simple paths contain identical black nodes' },
        { id: '02', term: 'Rotation Ceiling', def: 'At most 2 tree rotations required upon insertion' },
        { id: '03', term: 'Asymptotic Guarantee', def: 'Strict O(log n) search, insert, and delete bound' },
      ],
    },
    consensus: {
      title: 'Raft State Machine Safety',
      code: 'SYS_RAFT_02',
      rawText:
        'In Raft consensus, leaders append log entries monotonically. State Machine Safety guarantees that if a server applies an entry at index i to its state machine, no other server will ever apply a different entry for index i. Terms act as logical clocks detecting stale leaders.',
      tokensIn: 62,
      tokensOut: 36,
      latency: '0.26s',
      promptBounds:
        'PROMPT_TEMPLATE = """\nExtract distributed system invariants and quorum safety rules.\nFORMAT: Quorum rule + fault tolerance bounds.\nMAX_TOKENS: 256 | STRICT_BOUNDS: True\nNOTES: {raw_text}\n"""',
      richTerminal: [
        { id: '01', term: 'State Machine Safety', def: 'At most one command applied per log index across cluster' },
        { id: '02', term: 'Election Quorum Rule', def: 'Candidate must gather votes from majority (N/2 + 1) nodes' },
        { id: '03', term: 'Log Matching Invariant', def: 'Identical index and term implies identical history' },
      ],
    },
  };

  const activeData = topicsData[topic];

  const handleRunExecution = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setStage('terminal');
    }, 700);
  };

  return (
    <div
      className="relative w-full py-4 sm:py-6"
      onMouseEnter={() => setAutoCycle(false)}
      onMouseLeave={() => setAutoCycle(true)}
    >
      <article className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-[var(--shadow-soft)] font-mono text-[var(--text-secondary)] transition-colors">
        {/* App Window Chrome (Live Software Application Frame) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] text-xs">
          <div className="flex items-center gap-3">
            {/* Window control dots */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span className="w-3 h-3 rounded-full bg-[#eab308]" />
              <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
            </div>

            <span className="text-[var(--border-subtle)]">|</span>

            <span className="font-mono text-[var(--accent-copper)] font-semibold text-xs">
              summarizer.py · Harvard CS50 Applied Tool
            </span>
          </div>

          {/* Sample Topic Switcher (Buttons step & press) */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[var(--text-muted)] hidden sm:inline">Active Lecture:</span>
            <div className="flex items-center gap-1 border border-[var(--border-subtle)] rounded p-0.5 bg-[var(--bg-page)]">
              {(['os', 'algo', 'consensus'] as SampleTopic[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTopic(t);
                    setAutoCycle(false);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] ${
                    topic === t
                      ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] font-bold shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {t === 'os' ? 'Virtual Memory' : t === 'algo' ? 'Red-Black Trees' : 'Raft Consensus'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content & Interactive Pipeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start pt-6">
          {/* Left Column: Project Overview & Core Architecture */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] mb-1.5">
                <span className="text-[var(--accent-primary)] font-bold">PROJECT 01</span>
                <span>·</span>
                <span>HARVARD CS50 PRACTICAL TOOL</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] font-display">
                {project.title}
              </h3>
            </div>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-body">
              {project.problem}
            </p>

            <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] text-xs space-y-2">
              <div className="font-bold text-[var(--accent-copper)] flex items-center gap-1.5 font-mono">
                <Cpu className="w-4 h-4" />
                <span>3-Stage Computational Pipeline:</span>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed font-body">
                1. Markdown ingestion &amp; line-partitioning ──▶ 2. Strict token-window budgeting ──▶ 3. Rich ANSI terminal output deck.
              </p>
            </div>

            {/* Action Triggers: Verb + Object, Step on hover, press on click */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                ref={triggerRef}
                type="button"
                onClick={onOpenCaseStudy}
                className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-bold transition-all cursor-pointer shadow-xs focus-visible:outline-2 hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] font-mono"
              >
                <span>Inspect Dossier</span>
                <ChevronRight className="w-4 h-4 transition-transform duration-150 ease-out group-hover/btn:translate-x-1" />
              </button>

              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all cursor-pointer hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] font-mono"
              >
                <span>View Source</span>
                <ExternalLink className="w-3.5 h-3.5 transition-transform duration-150 ease-out group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>

              <button
                type="button"
                onClick={handleRunExecution}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--accent-copper)] hover:border-[var(--accent-copper)] transition-all cursor-pointer hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] disabled:opacity-50 font-mono"
              >
                {isRunning ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Pipeline</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Live Pipeline Stage Inspector (App-frame) */}
          <div className="lg:col-span-7 space-y-3">
            {/* Stage Selector Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[var(--accent-copper)]" />
                <span className="font-bold text-[var(--text-primary)]">Interactive Execution Deck:</span>
              </div>

              <div className="flex items-center gap-1">
                {(['ingestion', 'prompt', 'terminal'] as PipelineStage[]).map((s, idx) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStage(s)}
                    className={`px-2.5 py-1 rounded text-[11px] transition-all cursor-pointer hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98] ${
                      stage === s
                        ? 'bg-[var(--accent-primary)] text-white font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-page)]'
                    }`}
                  >
                    {idx + 1}. {s === 'ingestion' ? 'Input Stream' : s === 'prompt' ? 'Token Guard' : 'Rich Terminal'}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Stage Screen */}
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-primary)] p-4 sm:p-5 min-h-[280px] flex flex-col justify-between font-mono text-xs">
              {stage === 'ingestion' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-2">
                    <span className="font-semibold text-[var(--text-primary)]">Stage 1: Lecture Note Raw Buffer</span>
                    <span className="text-[var(--accent-copper)]">Lines: 3 · UTF-8 Clean</span>
                  </div>
                  <p className="leading-relaxed text-[var(--text-secondary)] font-body text-xs italic">
                    "{activeData.rawText}"
                  </p>
                  <div className="pt-2 text-[11px] text-[var(--text-muted)] border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <span>ASCII Normalized Stream</span>
                    <span className="text-[var(--accent-primary)] font-bold">{activeData.tokensIn} Input Tokens</span>
                  </div>
                </div>
              )}

              {stage === 'prompt' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-2">
                    <span className="font-semibold text-[var(--text-primary)]">Stage 2: Deterministic Schema &amp; Token Budget</span>
                    <span className="text-[var(--accent-copper)]">Clamp: {tokenBudget} tk</span>
                  </div>
                  <pre className="text-[11px] leading-relaxed p-3 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-x-auto text-[var(--text-secondary)] font-mono">
                    {activeData.promptBounds}
                  </pre>
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center justify-between">
                    <span>Strict JSON Structure Guard</span>
                    <span className="text-[var(--accent-primary)] font-bold">Bounds: Enforced</span>
                  </div>
                </div>
              )}

              {stage === 'terminal' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] border-b border-[var(--border-subtle)] pb-2">
                    <span className="flex items-center gap-1.5 text-[var(--accent-copper)] font-semibold">
                      <Terminal className="w-3.5 h-3.5" />
                      Stage 3: ANSI Rich Formatted Output
                    </span>
                    <span className="text-[var(--accent-primary)] font-bold">
                      Latency: {activeData.latency}
                    </span>
                  </div>

                  <div className="space-y-2 pt-1">
                    {activeData.richTerminal.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4 transition-colors"
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
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Pipeline Exit Code: 0</span>
                    </span>
                    <span className="text-[var(--accent-primary)] font-bold">
                      Emitted {activeData.tokensOut} tokens
                    </span>
                  </div>
                </div>
              )}

              {/* Bottom Pipeline Status Footer */}
              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Topic: <code className="text-[var(--text-primary)] font-bold">{activeData.code}</code></span>
                </div>
                <div className="text-[11px] text-[var(--accent-copper)] font-mono">
                  Auto-cycle active (pauses on hover)
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
