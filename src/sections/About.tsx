import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { SectionHeader } from '../components/ui/SectionHeader';
import { GraduationCap, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  const { theme } = useTheme();
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
      <SectionHeader
        kicker="BACKGROUND & PHILOSOPHY"
        title="Engineering Background & Principles"
        description="Undergraduate studies, core motivation for systems software, and principles governing how I build."
      />

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
          <div className="relative pl-5 py-3 my-6 font-serif">
            <div
              className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-full ${profile?.name?.includes('Raj') ? 'bg-[var(--accent-primary)]' : 'bg-[#1d4ed8]'}`}
              aria-hidden="true"
            />

            <div className="space-y-1">
              <div
                className={`text-xs uppercase tracking-wider font-bold ${profile?.name?.includes('Raj') ? 'font-mono text-[var(--accent-copper)]' : 'font-handwriting text-[#1d4ed8] text-sm'}`}
              >
                Engineering Core:
              </div>
              <p
                className={`italic text-base sm:text-lg font-semibold leading-relaxed ${profile?.name?.includes('Raj') ? 'text-[#f6f5f1] font-mono' : 'text-[#1c1917]'}`}>
                "{philosophy}"
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans pt-1">
                Verifiable outcomes, reproducible benchmarks, and clean documentation before adding complexity.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Compact Education Card (4 cols on xl) */}
        <div
          className={`lg:col-span-5 xl:col-span-4 p-6 rounded-lg border shadow-xs space-y-5 text-xs sm:text-sm ${profile?.name?.includes('Raj') ? 'border-[var(--border-subtle)] bg-[var(--bg-surface)] font-mono text-[var(--text-secondary)]' : 'border-[#e0d9cd] bg-[#ffffff] font-serif text-[#44403c]'}`}
        >
          <div
            className={`flex items-center justify-between pb-3 border-b ${profile?.name?.includes('Raj') ? 'border-[var(--border-subtle)]' : 'border-[#e0d9cd]'}`}
          >
            <span
              className={`font-bold text-sm ${profile?.name?.includes('Raj') ? 'font-mono text-[var(--text-primary)]' : 'font-serif text-[#1c1917]'}`}>
              Academic Credentials
            </span>
            <GraduationCap
              className={`w-4 h-4 ${profile?.name?.includes('Raj') ? 'text-[var(--accent-primary)]' : 'text-[#1d4ed8]'}`}
            />
          </div>

          <div className="space-y-3">
            <div>
              <span
                className={`text-[11px] uppercase tracking-wider block ${profile?.name?.includes('Raj') ? 'text-[#64748b] font-mono' : 'text-[#78716c] font-serif'}`}>
                Degree Track
              </span>
              <span
                className={`font-semibold text-sm ${profile?.name?.includes('Raj') ? 'text-[#f1f5f9]' : 'text-[#1c1917]'}`}>
                Bachelor of Technology (B.Tech)
              </span>
            </div>

            <div>
              <span
                className={`text-[11px] uppercase tracking-wider block ${profile?.name?.includes('Raj') ? 'text-[#64748b] font-mono' : 'text-[#78716c] font-serif'}`}>
                Specialization
              </span>
              <span className={profile?.name?.includes('Raj') ? 'text-[#94a3b8]' : 'text-[#44403c]'>
                Computer Science and Engineering — Artificial Intelligence & Machine Learning
              </span>
            </div>

            <div>
              <span
                className={`text-[11px] uppercase tracking-wider block ${profile?.name?.includes('Raj') ? 'text-[#64748b] font-mono' : 'text-[#78716c] font-serif'}`}>
                Institution & Cohort
              </span>
              <span
                className={`font-semibold ${profile?.name?.includes('Raj') ? 'text-[var(--accent-primary)] font-mono' : 'text-[#1d4ed8] font-serif'}`}>
                MATS University · Class of 2030
              </span>
            </div>

            {/* Completed Certifications */}
            <div
              className={`pt-3 border-t ${profile?.name?.includes('Raj') ? 'border-[var(--border-subtle)]' : 'border-[#e0d9cd]'}`}>
              <span
                className={`text-[11px] uppercase tracking-wider block mb-2 font-bold ${profile?.name?.includes('Raj') ? 'text-[var(--text-primary)] font-mono' : 'text-[#1c1917] font-serif'}`}>
                Completed Certifications:
              </span>
              <ul className="space-y-2">
                {certifications.map((cert) => (
                  <li key={cert.name} className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 text-emerald-400`} />
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