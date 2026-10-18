import React, { useState, useRef } from 'react';
import { Project } from '../types';
import { projectsData } from '../data/projects';
import { ProjectDialog } from '../components/ProjectDialog';
import { useTheme } from '../context/ThemeContext';
import { ExternalLink, Terminal, ChevronRight, Code2 } from 'lucide-react';

export const Projects: React.FC = () => {
  const { theme } = useTheme();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isStdout = theme === 'stdout';

  // Primary featured project is the AI Study Notes Summarizer
  const summarizer = projectsData[0];

  const handleOpenCaseStudy = () => {
    setSelectedProject(summarizer);
  };

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-12 sm:py-16 space-y-8 text-left scroll-mt-16"
    >
      {/* Section Header */}
      <div className="pb-4 border-b border-[var(--border-subtle)]">
        {isStdout ? (
          <div className="text-xs font-mono text-[#00e5c0] mb-1">
            FEATURED CASE STUDY
          </div>
        ) : (
          <div className="text-sm font-handwriting text-[#1d4ed8] font-bold mb-1">
            Featured Case Study
          </div>
        )}
        <h2
          id="projects-heading"
          className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${
            isStdout ? 'font-mono' : 'font-serif'
          }`}
        >
          Projects
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-body mt-1 max-w-xl">
          Practical tools and software applications built step by step to solve real everyday problems.
        </p>
      </div>

      {/* Featured Full-Width Case Study Card */}
      <article
        className={`rounded-xl border p-6 sm:p-8 transition-all ${
          isStdout
            ? 'border-[#242e40] bg-[#121722] font-mono text-[#94a3b8]'
            : 'border-[#e2dbce] bg-[#ffffff] font-serif text-[#44403c] shadow-xs'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Text & Details (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Badge & Stack */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`px-2.5 py-0.5 rounded font-semibold text-[11px] ${
                  isStdout
                    ? 'bg-[#00e5c0]/15 text-[#00e5c0] border border-[#00e5c0]/40 font-mono'
                    : 'bg-[#1d4ed8]/10 text-[#1d4ed8] border border-[#1d4ed8]/30 font-serif'
                }`}
              >
                Open source
              </span>
              <span className="text-[var(--border-subtle)]" aria-hidden="true">·</span>
              <div className="flex flex-wrap items-center gap-x-2 text-xs font-mono text-[var(--text-secondary)]">
                <span>Python</span>
                <span className="opacity-40">·</span>
                <span>LLM API</span>
                <span className="opacity-40">·</span>
                <span className="text-[var(--text-primary)] font-medium">CLI (Rich / Argparse)</span>
              </div>
            </div>

            {/* Title */}
            <h3
              className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${
                isStdout ? 'font-mono' : 'font-serif'
              }`}
            >
              {summarizer.title}
            </h3>

            {/* What it does */}
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed font-body">
              A command-line tool built with Python that ingests lecture notes, formats prompts for structured extraction, and prints concise review points and key terms directly to the terminal.
            </p>

            {/* Result / Concrete takeaway */}
            <div
              className={`p-3.5 rounded border text-xs sm:text-sm ${
                isStdout
                  ? 'border-[#242e40] bg-[#0d121c] text-[#f1f5f9]'
                  : 'border-[#e2dbce] bg-[#faf8f5] text-[#1c1917]'
              }`}
            >
              <span className="font-bold text-[var(--accent-primary)] mr-1">Result:</span>
              <span className="text-[var(--text-secondary)] font-body">
                Streamlined lecture review workflows and established solid habits around token budget management and command-line parsing.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                ref={triggerRef}
                type="button"
                onClick={handleOpenCaseStudy}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  isStdout
                    ? 'bg-[#00e5c0] text-[#0b0e14] hover:bg-[#33ebd0] font-mono'
                    : 'bg-[#1d4ed8] text-white hover:bg-[#1e40af] font-serif'
                }`}
              >
                <span>Case study</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href="https://github.com/raj-codelabs"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-medium border transition-colors ${
                  isStdout
                    ? 'border-[#242e40] bg-[#0d121c] text-[#f1f5f9] hover:border-[#00e5c0] hover:text-[#00e5c0] font-mono'
                    : 'border-[#e2dbce] bg-[#ffffff] text-[#1c1917] hover:border-[#1d4ed8] hover:text-[#1d4ed8] font-serif'
                }`}
              >
                <span>GitHub ↗</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Code Excerpt & Terminal Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] pb-1">
              <div className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>summarizer.py</span>
              </div>
              <span className="text-[11px] text-[#00e5c0]">CLI Extraction</span>
            </div>

            <pre
              className={`p-4 rounded-lg border overflow-x-auto text-xs font-mono leading-relaxed ${
                isStdout
                  ? 'border-[#242e40] bg-[#0b0e14] text-[#f1f5f9]'
                  : 'border-[#e2dbce] bg-[#fbf9f6] text-[#1c1917]'
              }`}
            >
{`# AI Study Notes Summarizer - core extraction utility
def extract_study_takeaways(notes_text: str, max_points: int = 5) -> list[str]:
    """Splits raw lecture notes into concise review points."""
    if not notes_text.strip():
        return []
    
    # Split into clean, non-empty sentences
    import re
    sentences = [s.strip() for s in re.split(r'[.?!]\\s+', notes_text) if s.strip()]
    
    # Rank sentences by informational length and keyword density
    ranked = sorted(sentences, key=len, reverse=True)
    return ranked[:max_points]`}
            </pre>

            <div
              className={`p-3 rounded border text-xs font-mono space-y-1 ${
                isStdout
                  ? 'border-[#242e40] bg-[#0d121c] text-[#94a3b8]'
                  : 'border-[#e2dbce] bg-[#faf8f5] text-[#686158]'
              }`}
            >
              <div className="text-[11px] font-bold text-[var(--accent-primary)] flex items-center gap-1">
                <Terminal className="w-3 h-3" />
                <span>$ python summarizer.py --input notes.md</span>
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] pl-2">
                ✓ Extracted 4 key definitions and 5 bullet takeaways in 0.4s
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Ideas become a single text line under the project (Phase 2.7) */}
      <div className="pt-2 text-xs sm:text-sm text-[var(--text-muted)] font-mono">
        <span className="font-bold text-[var(--text-secondary)]">Next:</span>{' '}
        <span>PrereqOS (prerequisite graph for learning topics) · Book Recommendation Engine (planned)</span>
      </div>

      {/* Case Study Modal Dialog */}
      {selectedProject && (
        <ProjectDialog
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          triggerRef={triggerRef}
        />
      )}
    </section>
  );
};
