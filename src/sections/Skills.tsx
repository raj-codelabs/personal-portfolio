import React from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  PythonIcon,
  CIcon,
  GitIcon,
  VSCodeIcon,
  GitHubIcon,
  CS50Icon,
  LinuxBashIcon,
} from '../components/TechIcons';

interface ToolItem {
  name: string;
  evidence: string;
  Icon: React.FC<{ className?: string; size?: number }>;
  href?: string;
}

export const Skills: React.FC = () => {
  const { theme } = useTheme();
  const isStdout = theme === 'stdout';

  const skillGroups: { group: string; items: ToolItem[] }[] = [
    {
      group: 'Core Languages',
      items: [
        {
          name: 'Python 3.12',
          evidence: 'CS50P certified, LLM study pipeline, AST parser tooling',
          Icon: PythonIcon,
        },
        {
          name: 'C (Systems)',
          evidence: 'CS50x problem sets, pointer arithmetic, memory management',
          Icon: CIcon,
        },
      ],
    },
    {
      group: 'Engineering Toolchain',
      items: [
        {
          name: 'Git & GitHub',
          evidence: 'Trunk branch hygiene, atomic commits, pull request workflows',
          Icon: GitIcon,
        },
        {
          name: 'Visual Studio Code',
          evidence: 'Configured debuggers, lint pipelines, terminal integration',
          Icon: VSCodeIcon,
        },
        {
          name: 'Linux & Bash',
          evidence: 'CLI workflows, POSIX pipes, shell automation scripts',
          Icon: LinuxBashIcon,
        },
      ],
    },
    {
      group: 'Academic Foundations',
      items: [
        {
          name: 'Harvard CS50x & CS50P',
          evidence: 'Computer science fundamentals, algorithms, algorithms in Python',
          Icon: CS50Icon,
        },
        {
          name: 'Open Source Repositories',
          evidence: 'Public tools, documentation, test suites on GitHub',
          Icon: GitHubIcon,
          href: 'https://github.com/raj-codelabs',
        },
      ],
    },
  ];

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="py-12 sm:py-16 space-y-10 text-left scroll-mt-16"
    >
      {/* Section Header */}
      <div className="relative pb-4">
        <div>
          {isStdout ? (
            <div className="text-xs font-mono text-[var(--accent-copper)] mb-1 uppercase tracking-wider font-semibold">
              TECHNICAL TOOLING &amp; EVIDENCE
            </div>
          ) : (
            <div className="text-sm font-handwriting text-[#1d4ed8] font-bold mb-1">
              Technical Tooling &amp; Practice
            </div>
          )}
        </div>

        <h2
          id="skills-heading"
          className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${
            isStdout ? 'font-mono' : 'font-serif'
          }`}
        >
          Toolchain &amp; Engineering Disciplines
        </h2>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-body mt-1 max-w-xl">
          Verified tools and concrete systems engineering principles applied across open-source utilities.
        </p>

        {/* Section hairline rule */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--border-subtle)] origin-left"
          aria-hidden="true"
        />
      </div>

      {/* 1. Real Full-Color Tools Grid with 2px hover lift */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8">
        {skillGroups.map((group) => (
          <div
            key={group.group}
            className={`p-6 rounded-xl border flex flex-col justify-between transition-all duration-200 ${
              isStdout
                ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)] font-mono text-[var(--text-secondary)]'
                : 'border-[#e0d9cd] bg-[#ffffff] font-serif text-[#44403c] shadow-xs'
            }`}
          >
            <div>
              <h3
                className={`text-sm font-bold uppercase tracking-wider pb-3 mb-4 border-b ${
                  isStdout
                    ? 'text-[var(--text-primary)] border-[#273142]'
                    : 'text-[#1c1917] border-[#e0d9cd]'
                }`}
              >
                {group.group}
              </h3>

              <div className="space-y-4">
                {group.items.map((item) => {
                  const ItemIcon = item.Icon;
                  return (
                    <div
                      key={item.name}
                      className="group/tool flex items-start gap-3 p-2.5 rounded-lg border border-transparent hover:border-[var(--border-subtle)] hover:bg-[var(--bg-page)] hover:-translate-y-[2px] transition-all duration-150 ease-out"
                    >
                      <div className="shrink-0 p-1 rounded bg-[var(--bg-page)] border border-[var(--border-subtle)] group-hover/tool:border-[var(--accent-primary)]/40 transition-colors">
                        <ItemIcon size={22} className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold text-xs ${
                              isStdout ? 'text-[var(--text-primary)]' : 'text-[#1c1917]'
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-[var(--text-muted)] font-body">
                          {item.evidence}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
