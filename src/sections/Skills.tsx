import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Code, Wrench, BookOpen } from 'lucide-react';

export const Skills: React.FC = () => {
  const { theme } = useTheme();
  const isStdout = theme === 'stdout';

  const skillGroups = [
    {
      group: 'Languages',
      icon: Code,
      items: [
        {
          name: 'Python',
          evidence: 'AI Study Notes Summarizer, CS50P certification',
        },
        {
          name: 'C',
          evidence: 'CS50x problem sets, university programming coursework',
        },
      ],
    },
    {
      group: 'Tools',
      icon: Wrench,
      items: [
        {
          name: 'Git · GitHub',
          evidence: 'Version control, repositories, workflow hygiene',
        },
        {
          name: 'VS Code',
          evidence: 'Primary development environment and debugging tools',
        },
      ],
    },
    {
      group: 'Learning now',
      icon: BookOpen,
      items: [
        {
          name: 'AI/ML Foundations',
          evidence: 'Prompt engineering, token optimization, introductory models',
        },
        {
          name: 'Data Structures & Algorithms',
          evidence: 'Algorithm analysis, memory layout, core data structures',
        },
      ],
    },
  ];

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="py-12 sm:py-16 space-y-8 text-left scroll-mt-16"
    >
      {/* Section Header */}
      <div className="pb-4 border-b border-[var(--border-subtle)]">
        {isStdout ? (
          <div className="text-xs font-mono text-[#00e5c0] mb-1 uppercase tracking-wider">
            TECHNICAL TOOLING &amp; EVIDENCE
          </div>
        ) : (
          <div className="text-sm font-handwriting text-[#1d4ed8] font-bold mb-1">
            Technical Tooling &amp; Practice
          </div>
        )}
        <h2
          id="skills-heading"
          className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${
            isStdout ? 'font-mono' : 'font-serif'
          }`}
        >
          Skills
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-body mt-1 max-w-xl">
          Core toolchain and verified programming disciplines backed by completed projects and coursework.
        </p>
      </div>

      {/* Single Unified Grid with Evidence (Phase 2.6) */}
      <div
        className={`rounded-xl border divide-y transition-colors overflow-hidden ${
          isStdout
            ? 'border-[#242e40] bg-[#121722] divide-[#242e40] font-mono'
            : 'border-[#e2dbce] bg-[#ffffff] divide-[#e2dbce] font-serif shadow-xs'
        }`}
      >
        {skillGroups.map((group) => {
          const GroupIcon = group.icon;
          return (
            <div
              key={group.group}
              className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
            >
              {/* Category Column (4 cols) */}
              <div className="md:col-span-4 flex items-center gap-2.5">
                <div
                  className={`p-1.5 rounded ${
                    isStdout
                      ? 'bg-[#00e5c0]/15 text-[#00e5c0] border border-[#00e5c0]/30'
                      : 'bg-[#1d4ed8]/10 text-[#1d4ed8] border border-[#1d4ed8]/20'
                  }`}
                >
                  <GroupIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3
                    className={`text-base font-bold ${
                      isStdout ? 'text-[#f1f5f9]' : 'text-[#1c1917]'
                    }`}
                  >
                    {group.group}
                  </h3>
                </div>
              </div>

              {/* Items & Evidence Column (8 cols) */}
              <div className="md:col-span-8 space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-sm"
                  >
                    <span
                      className={`font-semibold shrink-0 sm:w-44 ${
                        isStdout ? 'text-[#00e5c0]' : 'text-[#1d4ed8]'
                      }`}
                    >
                      {item.name}
                    </span>
                    <span
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isStdout ? 'text-[#94a3b8]' : 'text-[#44403c] font-sans'
                      }`}
                    >
                      {item.evidence}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
