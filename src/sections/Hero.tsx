import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { InvariantWorkbench } from '../components/InvariantWorkbench';
import { CommandPrompt } from '../components/CommandPrompt';
import { DeveloperIdCard } from '../components/DeveloperIdCard';
import { SketchReveal } from '../components/SketchReveal';
import { ArrowDown, GitFork, ExternalLink, Terminal, ShieldCheck, Cpu } from 'lucide-react';

export const Hero: React.FC = () => {
  const { theme } = useTheme();
  const { profile } = useCms();
  const [showCli, setShowCli] = React.useState(false);

  const name = profile?.name || 'Raj Golder';
  const semester = profile?.semester || 'SEMESTER 01';
  const department = profile?.department || 'B.TECH CSE (AI/ML)';
  const bio = profile?.shortBio || `Hi, I'm ${name}. I investigate how computational abstractions actually function on physical hardware — from custom heap allocators and pointer arithmetic in C up to scalar autograd DAGs and tensor projection manifolds.`;
  const philosophy = profile?.philosophy || 'Never trust a library until you have built its bare-metal scalar equivalent from scratch.';
  const primaryText = profile?.primaryCtaText || 'Inspect Repositories';
  const primaryLink = profile?.primaryCtaLink || '#projects';
  const secondaryText = profile?.secondaryCtaText || 'Milestone DAG Graph';
  const secondaryLink = profile?.secondaryCtaLink || '#journey';
  const github = profile?.contact?.github || 'https://github.com/raj-golder';

  return (
    <section
      id="home"
      aria-label="Engineering Introduction & Live Invariant Workbench"
      className="py-10 sm:py-16 space-y-12 text-left"
    >
      {/* Top Hero Layout: Introduction & Thesis alongside Theme Signature Interaction */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Primary Thesis Statement & Terminal Panel */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono tracking-wider text-[var(--accent-primary)] font-semibold">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
              <span>FIRST-PRINCIPLES COMPUTING</span>
            </span>
            <span className="text-[var(--text-muted)]" aria-hidden="true">·</span>
            <span className="text-[var(--text-secondary)]">{department.toUpperCase()} · {semester.toUpperCase()}</span>
            <span className="text-[var(--text-muted)]" aria-hidden="true">·</span>
            <span className="text-[var(--accent-copper)]">SYSTEMS INVARIANTS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)] font-display leading-[1.12]">
            From Silicon Boundaries to Neural Weights.
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] font-body leading-relaxed">
            {bio}
          </p>

          {/* Guiding Philosophy Block */}
          <div className="p-4 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs sm:text-sm font-mono text-[var(--text-secondary)] flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="text-[var(--text-primary)] font-bold">CORE PHILOSOPHY: </span>
              <span>"{philosophy}"</span>
            </div>
          </div>

          {/* Action Triggers & Quick Navigation */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={primaryLink}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold font-mono rounded bg-[var(--accent-primary)] text-[#0b0e14] hover:bg-[var(--accent-primary-hover)] transition-colors shadow-xs"
            >
              <span>{primaryText}</span>
              <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
            </a>

            <a
              href={secondaryLink}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium font-mono rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              <span>{secondaryText}</span>
            </a>

            <button
              onClick={() => setShowCli(!showCli)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{showCli ? 'Hide Terminal Prompt' : 'Interactive Terminal'}</span>
            </button>

            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors ml-auto"
              >
                <GitFork className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{github.replace(/^https?:\/\/github\.com\//, '')}</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            )}
          </div>

          {/* Conditionally Revealed Interactive Terminal */}
          {showCli && (
            <div className="space-y-2 pt-2">
              <div className="text-xs font-mono text-[var(--text-muted)]">
                Command shell prober:
              </div>
              <CommandPrompt />
            </div>
          )}
        </div>

        {/* Right Column: Theme-Isolated Interactive Experience */}
        <div className="lg:col-span-5 flex flex-col items-center justify-start w-full">
          {theme === 'stdout' ? (
            <DeveloperIdCard />
          ) : (
            <SketchReveal />
          )}
        </div>
      </div>

      {/* Signature Element: Live Invariant Engine Workbench */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)]">
          <span className="font-semibold text-[var(--text-primary)] uppercase tracking-wider">
            Signature Instrument: Interactive Verification Canvas
          </span>
          <span className="text-[var(--text-muted)] hidden sm:inline">
            Deterministic Mechanics · Zero Black-Boxes
          </span>
        </div>
        <InvariantWorkbench />
      </div>
    </section>
  );
};

