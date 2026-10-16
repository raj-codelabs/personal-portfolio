import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { profileData } from '../data/profile';
import { Terminal, Compass, BookOpen, Quote } from 'lucide-react';

export const About: React.FC = () => {
  const { theme } = useTheme();
  const isStdout = theme === 'stdout';

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-12 sm:py-16 space-y-8 text-left"
    >
      {/* Section Header */}
      <div className="pb-4 border-b border-inherit">
        <div className="text-xs font-mono text-[var(--text-secondary)] mb-1">
          {isStdout ? '// cat /etc/bio.txt' : 'Section 05 · Personal Monograph'}
        </div>
        <h2
          id="about-heading"
          className={`text-2xl sm:text-3xl font-bold tracking-tight ${
            isStdout ? 'font-mono text-[#e6edf3]' : 'font-serif text-[#302d29]'
          }`}
        >
          About & Engineering Philosophy
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-xl">
          Background context, motivation for computer science, and principles governing how I build and learn.
        </p>
      </div>

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Narrative (7 cols) */}
        <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
          <p className="text-[var(--text-primary)] font-medium text-sm sm:text-base">
            I am a first-year undergraduate student pursuing a B.Tech in Computer Science and Engineering with a specialization in Artificial Intelligence and Machine Learning.
          </p>

          <p>
            My engineering trajectory started with a simple frustration: I wanted to understand why deep learning models behaved the way they did, rather than simply passing tensors into mysterious library calls. That curiosity quickly led me down the stack—from gradient derivations on paper, to implementing backward passes in NumPy, to exploring memory allocators and cache locality in C.
          </p>

          <p>
            I believe that true engineering competence in AI/ML is grounded in software engineering rigor: writing clean tests, understanding systems-level constraints, reading official documentation, and maintaining reproducible Git workflows.
          </p>

          <div
            className={`p-5 rounded-md border mt-6 ${
              isStdout
                ? 'bg-[#161b22] border-[#30363d]'
                : 'bg-[#ffffff] border-[#e3ded2] shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Quote className={`w-4 h-4 ${isStdout ? 'text-[#58a6ff]' : 'text-[#0d5c6e]'}`} />
              <span className="text-xs uppercase tracking-wider font-semibold text-[var(--text-primary)]">
                Core Engineering Axiom
              </span>
            </div>
            <p className={`text-sm italic ${isStdout ? 'font-mono text-[#e6edf3]' : 'font-serif text-[#302d29]'}`}>
              "{profileData.philosophy}"
            </p>
          </div>
        </div>

        {/* Right Column: Academic Framework & Current Focus (5 cols) */}
        <div
          className={`lg:col-span-5 p-6 rounded-md border space-y-5 text-xs ${
            isStdout
              ? 'bg-[#161b22] border-[#30363d] font-mono'
              : 'bg-[#ffffff] border-[#e3ded2] font-sans shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-inherit">
            <span className="font-bold text-sm text-[var(--text-primary)]">Academic Profile</span>
            <Compass className={`w-4 h-4 ${isStdout ? 'text-[#3fb950]' : 'text-[#8a5a00]'}`} />
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block">
                Degree Track
              </span>
              <span className="font-semibold text-[var(--text-primary)]">
                {profileData.title}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block">
                Department
              </span>
              <span className="text-[var(--text-secondary)]">
                {profileData.department}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block">
                Year & Stage
              </span>
              <span className="text-[var(--text-secondary)]">
                {profileData.semester} (Academic Year 2026–2027)
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block">
                Focus Coursework
              </span>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[var(--text-secondary)] mt-1">
                <span>Discrete Structures</span>
                <span>·</span>
                <span>Linear Algebra</span>
                <span>·</span>
                <span>Data Structures in C</span>
                <span>·</span>
                <span>Calculus for ML</span>
              </div>
            </div>

            <div className="pt-3 border-t border-inherit">
              <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                Seeking
              </span>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Undergraduate research opportunities, open-source maintainer mentorship, and technical discussions around compilers and foundational AI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
