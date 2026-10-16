import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  const { theme } = useTheme();
  const { profile } = useCms();

  const title = profile?.title || 'B.Tech in Computer Science and Engineering (AI & ML)';
  const department = profile?.department || 'Department of Computer Science & Engineering';
  const semester = profile?.semester || 'Semester 01';
  const philosophy = profile?.philosophy || 'Never trust a library until you have built its bare-metal scalar equivalent from scratch.';
  const interests = profile?.currentInterests || [
    'Pointer arithmetic & memory-layout invariants in C11',
    'Reverse-mode automatic differentiation DAGs from scratch',
    'Custom free-list heap allocators & buddy subsystems',
    'Bytecode virtual machines & Thompson NFA regex engines',
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-12 sm:py-16 space-y-8 text-left"
    >
      {/* Section Header */}
      <div className="pb-4 border-b border-[var(--border-subtle)]">
        <div className="text-xs font-mono text-[var(--accent-primary)] mb-1">
          04 // STUDENT PROFILE & FIRST-PRINCIPLES MANIFESTO
        </div>
        <h2
          id="about-heading"
          className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[var(--text-primary)]"
        >
          Engineering Philosophy & Trajectory
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-body mt-1 max-w-xl">
          Background context, motivation for computer science, and principles governing how I build, verify, and learn.
        </p>
      </div>

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Narrative (7 cols) */}
        <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)] font-body">
          <p className="text-[var(--text-primary)] font-medium text-sm sm:text-base">
            I am a first-year undergraduate student pursuing a B.Tech in Computer Science and Engineering with a specialization in Artificial Intelligence and Machine Learning.
          </p>

          <p>
            My engineering trajectory began with a simple resistance to black boxes: I wanted to understand why neural network layers trained, saturated, or diverged, rather than blindly importing high-level APIs. That inquiry drew me directly to first principles—from calculating analytical Jacobian matrices on paper, to implementing backward passes in pure Python, to verifying dynamic memory allocation and pointer boundaries in C without garbage collection safety nets.
          </p>

          <p>
            I believe durable machine learning competence is anchored in systems-level hygiene: evaluating cachelines and memory locality, proving numerical invariants, writing unit tests, and maintaining reproducible development environments.
          </p>

          <div className="p-5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] mt-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)]" />
              <span className="text-xs uppercase tracking-wider font-mono font-bold text-[var(--text-primary)]">
                Guiding Engineering Axiom
              </span>
            </div>
            <p className="text-sm font-mono text-[var(--accent-copper)]">
              "{philosophy}"
            </p>
          </div>
        </div>

        {/* Right Column: Academic Framework & Current Focus (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-5 text-xs font-mono shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <span className="font-bold text-sm text-[var(--text-primary)] font-display">Academic Dossier</span>
            <Compass className="w-4 h-4 text-[var(--accent-primary)]" />
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block">
                Degree Track
              </span>
              <span className="font-semibold text-[var(--text-primary)]">
                {title}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block">
                Department
              </span>
              <span className="text-[var(--text-secondary)]">
                {department}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block">
                Current Semester
              </span>
              <span className="text-[var(--accent-primary)] font-semibold">
                {semester}
              </span>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)]">
              <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider block mb-2">
                Active Research & Curriculum Invariants:
              </span>
              <ul className="space-y-1.5 text-[var(--text-secondary)]">
                {interests.map((interest, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                    <span>{interest}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
