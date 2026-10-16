import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { Terminal, Cpu, Binary } from 'lucide-react';

export const Skills: React.FC = () => {
  const { theme } = useTheme();
  const { skillCategories } = useCms();
  const icons = [Cpu, Binary, Terminal];

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="py-12 sm:py-16 space-y-8 text-left"
    >
      {/* Section Header */}
      <div className="pb-4 border-b border-[var(--border-subtle)]">
        <div className="text-xs font-mono text-[var(--accent-primary)] mb-1">
          03 // FIRST-PRINCIPLES APPARATUS & METHODOLOGIES
        </div>
        <h2
          id="skills-heading"
          className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[var(--text-primary)]"
        >
          Technical Apparatus & Foundations
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-body mt-1 max-w-xl">
          Core toolchain, low-level languages, mathematical structures, and verification environments actively exercised in coursework and experiments.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {skillCategories.map((category, catIdx) => {
          const CategoryIcon = icons[catIdx % icons.length];

          return (
            <div
              key={category.id || category.category}
              className="p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between transition-colors shadow-xs"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-[var(--border-subtle)]">
                  <CategoryIcon
                    className="w-4 h-4 text-[var(--accent-primary)]"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-sm font-bold font-display text-[var(--text-primary)]">
                      {category.category}
                    </h3>
                    <div className="text-[11px] font-mono text-[var(--accent-copper)]">
                      {category.kicker}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-secondary)] font-body leading-relaxed mb-4">
                  {category.description}
                </p>

                {/* Skills List: Zero-Pill Unboxed Text */}
                <div className="space-y-3 pt-2">
                  {category.skills?.map((skill) => (
                    <div key={skill.id || skill.name} className="text-xs">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-semibold text-[var(--text-primary)] font-mono">
                          {skill.name}
                        </span>
                        <span
                          className={`text-[11px] font-mono font-medium ${
                            skill.level === 'Core Fluency'
                              ? 'text-[var(--accent-primary)]'
                              : 'text-[var(--accent-copper)]'
                          }`}
                        >
                          {skill.level}
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] font-body mt-0.5">
                        {skill.focusArea}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Verification Label */}
              <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)] flex items-center justify-between">
                <span>Verified by reproducible suites</span>
                <span className="text-[var(--accent-primary)] font-bold">100% PASS</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
