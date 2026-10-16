import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { skillsData } from '../data/skills';
import { Terminal, Cpu, PenTool } from 'lucide-react';

export const Skills: React.FC = () => {
  const { theme } = useTheme();
  const isStdout = theme === 'stdout';

  const icons = [Terminal, Cpu, PenTool];

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="py-12 sm:py-16 space-y-8 text-left"
    >
      {/* Section Header */}
      <div className="pb-4 border-b border-inherit">
        <div className="text-xs font-mono text-[var(--text-secondary)] mb-1">
          {isStdout ? '// tech_stack & competencies' : 'Section 04 · Technical Apparatus'}
        </div>
        <h2
          id="skills-heading"
          className={`text-2xl sm:text-3xl font-bold tracking-tight ${
            isStdout ? 'font-mono text-[#e6edf3]' : 'font-serif text-[#302d29]'
          }`}
        >
          Skills & Current Learning
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-xl">
          Core toolchain, languages, and theoretical disciplines actively exercised in coursework and personal builds.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {skillsData.map((category, catIdx) => {
          const CategoryIcon = icons[catIdx % icons.length];

          return (
            <div
              key={category.category}
              className={`p-6 rounded-md border flex flex-col justify-between transition-colors ${
                isStdout
                  ? 'bg-[#161b22] border-[#30363d]'
                  : 'bg-[#ffffff] border-[#e3ded2] shadow-xs'
              }`}
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-inherit">
                  <CategoryIcon
                    className={`w-4 h-4 ${isStdout ? 'text-[#58a6ff]' : 'text-[#0d5c6e]'}`}
                    aria-hidden="true"
                  />
                  <div>
                    <h3
                      className={`text-sm font-bold ${
                        isStdout ? 'font-mono text-[#e6edf3]' : 'font-serif text-[#302d29]'
                      }`}
                    >
                      {category.category}
                    </h3>
                    <div className="text-[11px] text-[var(--text-secondary)] italic">
                      {category.kicker}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                  {category.description}
                </p>

                {/* Skills List: Zero Pill Rule */}
                <div className="space-y-3 pt-2">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="text-xs">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-semibold text-[var(--text-primary)]">
                          {skill.name}
                        </span>
                        <span
                          className={`text-[11px] font-mono ${
                            skill.level === 'Core Fluency'
                              ? isStdout
                                ? 'text-[#3fb950]'
                                : 'text-[#1f6b45]'
                              : skill.level === 'Active Exploration'
                              ? isStdout
                                ? 'text-[#58a6ff]'
                                : 'text-[#0d5c6e]'
                              : 'text-[var(--text-muted)]'
                          }`}
                        >
                          {skill.level}
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        {skill.focusArea}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Note */}
              <div className="pt-4 mt-4 border-t border-inherit text-[11px] text-[var(--text-muted)] font-mono">
                {isStdout ? `verified: semester_01` : `Status: Active Study`}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
