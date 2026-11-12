import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { SectionHeader } from '../components/ui/SectionHeader';
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
      <SectionHeader
        kicker="TECHNICAL TOOLING & EVIDENCE"
        title="Toolchain & Engineering Disciplines"
        description="Verified tools and concrete systems engineering principles applied across open-source utilities."
      />

      {/* 1. Real Full-Color Tools Grid with 2px hover lift */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8">
        {skillGroups.map((group) => (
          <div
            key={group.group}
            className={`p-6 rounded-xl border flex flex-col justify-between transition-all duration-200`}
          >
            <div>
              <h3
                className={`text-sm font-bold uppercase tracking-wider pb-3 mb-4 border-b`}
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
                            className={`font-semibold text-xs ${item.href ? 'underline' : ''}`}
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