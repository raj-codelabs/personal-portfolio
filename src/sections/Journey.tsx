import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { milestonesData } from '../data/journey';
import { StdoutJourney } from '../themes/StdoutJourney';
import { MarginNotesJourney } from '../themes/MarginNotesJourney';
import { GitBranch, BookOpen } from 'lucide-react';

export const Journey: React.FC = () => {
  const { theme } = useTheme();
  const isStdout = theme === 'stdout';

  return (
    <section
      id="journey"
      aria-labelledby="journey-heading"
      className="py-12 sm:py-16 space-y-8 text-left"
    >
      {/* Section Header */}
      <div className="pb-4 border-b border-inherit">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] mb-1">
          {isStdout ? (
            <>
              <GitBranch className="w-3.5 h-3.5 text-[#58a6ff]" />
              <span>git log --topo-order --graph</span>
            </>
          ) : (
            <>
              <BookOpen className="w-3.5 h-3.5 text-[#0d5c6e]" />
              <span className="font-serif italic text-[#8a5a00]">Section 03 · Developmental Milestones</span>
            </>
          )}
        </div>
        <h2
          id="journey-heading"
          className={`text-2xl sm:text-3xl font-bold tracking-tight ${
            isStdout ? 'font-mono text-[#e6edf3]' : 'font-serif text-[#302d29]'
          }`}
        >
          Development Journey
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-xl">
          {isStdout
            ? 'Chronological DAG branch representing curriculum progress, systems experimentation, and neural net research.'
            : 'Chronological research logs tracing first-year academic milestones, lab insights, and software architectures.'}
        </p>
      </div>

      {/* Theme-Specific Renderer */}
      {isStdout ? (
        <StdoutJourney milestones={milestonesData} />
      ) : (
        <MarginNotesJourney milestones={milestonesData} />
      )}
    </section>
  );
};
