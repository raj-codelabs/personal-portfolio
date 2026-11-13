import React from 'react';
import { useCms } from '../context/CmsContext';
import { GraduationCap, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  const { profile } = useCms();

  const philosophy =
    profile?.philosophy ||
    'Learn the fundamentals, build small projects, and improve through experimentation.';

  const certifications = [
    { name: 'CS50x — Introduction to Computer Science', issuer: 'Harvard, 2026' },
    { name: 'CS50P — Programming with Python', issuer: 'Harvard, 2026' },
    { name: 'Systems Programming & C Foundations', issuer: 'MATS Coursework' },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-12 sm:py-16 space-y-8 text-left scroll-mt-16"
    >
      {/* Section Header */}
      <div className="relative pb-4">
        <div className="text-xs font-mono text-[var(--accent-copper)] font-semibold mb-1 uppercase tracking-wider">
          BACKGROUND &amp; PHILOSOPHY
        </div>

        <h2
          id="about-heading"
          className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] font-display"
        >
          Engineering Background &amp; Principles
        </h2>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-body mt-1 max-w-xl">
          Undergraduate studies, core motivation for systems software, and principles governing how I build.
        </p>

        {/* Section hairline rule */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--border-subtle)] origin-left"
          aria-hidden="true"
        />
      </div>

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
        {/* Left Column: Narrative (8 cols on xl) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)] font-body">
          <p className="text-[var(--text-primary)] font-medium text-base sm:text-lg leading-relaxed">
            I'm Raj Golder, a first-year student pursuing a B.Tech in Computer Science and Engineering with a specialization in Artificial Intelligence and Machine Learning at MATS University (Class of 2030).
          </p>

          <p>
            I completed Harvard's CS50x and CS50P and learn best by building: start small, understand the memory model, and improve through concrete iteration. My first featured build, the AI Study Notes Summarizer, was engineered to turn unstructured lecture transcripts into deterministic, schema-validated study cards.
          </p>

          <p>
            My current daily practice revolves around clean Python scripting, structured C systems programming, and mastering core algorithms from first principles rather than relying on bloated dependencies.
          </p>

          {/* Quote Block with static left rule */}
          <div className="relative pl-5 py-3 my-6 font-mono">
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-[var(--accent-primary)]"
              aria-hidden="true"
            />

            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider font-bold text-[var(--accent-copper)]">
                Engineering Core:
              </div>
              <p className="italic text-base sm:text-lg font-semibold leading-relaxed text-[var(--text-primary)]">
                "{philosophy}"
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans pt-1">
                Verifiable outcomes, reproducible benchmarks, and clean documentation before adding complexity.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Compact Education Card (4 cols on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 p-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] font-mono text-[var(--text-secondary)] shadow-xs space-y-5 text-xs sm:text-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <span className="font-bold text-sm text-[var(--text-primary)]">
              Academic Credentials
            </span>
            <GraduationCap className="w-4 h-4 text-[var(--accent-primary)]" />
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider block text-[var(--text-muted)] font-mono">
                Degree Track
              </span>
              <span className="font-semibold text-sm text-[var(--text-primary)]">
                Bachelor of Technology (B.Tech)
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider block text-[var(--text-muted)] font-mono">
                Specialization
              </span>
              <span className="text-[var(--text-secondary)]">
                Computer Science and Engineering — Artificial Intelligence &amp; Machine Learning
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider block text-[var(--text-muted)] font-mono">
                Institution &amp; Cohort
              </span>
              <span className="font-semibold text-[var(--accent-primary)]">
                MATS University · Class of 2030
              </span>
            </div>

            {/* Completed Certifications */}
            <div className="pt-3 border-t border-[var(--border-subtle)]">
              <span className="text-[11px] uppercase tracking-wider block mb-2 font-bold text-[var(--text-primary)] font-mono">
                Completed Certifications:
              </span>
              <ul className="space-y-2">
                {certifications.map((cert) => (
                  <li key={cert.name} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                    <span>
                      <strong>{cert.name}</strong> — {cert.issuer}
                    </span>
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
