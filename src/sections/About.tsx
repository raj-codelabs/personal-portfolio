import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { GraduationCap, CheckCircle2, ExternalLink } from 'lucide-react';

export const About: React.FC = () => {
  const { theme } = useTheme();
  const { profile } = useCms();
  const isStdout = theme === 'stdout';

  const philosophy =
    profile?.philosophy ||
    'Learn the fundamentals, build small projects, and improve through experimentation.';

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-12 sm:py-16 space-y-8 text-left scroll-mt-16"
    >
      {/* Section Header */}
      <div className="pb-4 border-b border-[var(--border-subtle)]">
        {isStdout ? (
          <div className="text-xs font-mono text-[#00e5c0] mb-1">
            ABOUT ME &amp; APPROACH
          </div>
        ) : (
          <div className="text-sm font-handwriting text-[#1d4ed8] font-bold mb-1">
            Personal Note &amp; Background
          </div>
        )}
        <h2
          id="about-heading"
          className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${
            isStdout ? 'font-mono' : 'font-serif'
          }`}
        >
          About Me
        </h2>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] font-body mt-1 max-w-xl">
          Background context, motivation for computer science, and principles governing how I build and learn.
        </p>
      </div>

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Narrative (7 cols) */}
        <div className="lg:col-span-7 space-y-4 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)] font-body">
          <p className="text-[var(--text-primary)] font-medium text-base sm:text-lg leading-relaxed">
            I'm Raj Golder, a first-year student pursuing a B.Tech in Computer Science and Engineering with a specialization in Artificial Intelligence and Machine Learning at MATS University (Class of 2030).
          </p>

          <p>
            I completed Harvard's CS50x and CS50P and learn best by building: start small, understand the code, improve through iteration. My first project, the AI Study Notes Summarizer, was built to make reviewing dense lecture materials faster and more structured. Next I want to deepen my understanding of systems-level programming, data structures, and neural network mechanics.
          </p>

          <p>
            My current daily practice revolves around clean Python scripting, structured C programming, and mastering core algorithms from first principles rather than treating libraries as black boxes.
          </p>

          {/* My Approach Callout */}
          {isStdout ? (
            <div className="p-5 rounded-md border border-[#242e40] bg-[#121722] mt-6 shadow-xs font-mono">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-[#f1f5f9]">
                  My Approach
                </span>
              </div>
              <p className="text-sm sm:text-base font-mono text-[#00e5c0] font-bold mb-2">
                "{philosophy}"
              </p>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed font-sans">
                I focus on verifiable outcomes, clear documentation, and understanding how each abstraction works before building higher layers.
              </p>
            </div>
          ) : (
            <div className="relative pl-4 border-l-2 border-[#1d4ed8]/50 py-2 my-5 font-serif">
              <div className="text-xs font-handwriting text-[#1d4ed8] font-bold mb-1">
                My Approach:
              </div>
              <p className="font-serif italic text-base sm:text-lg text-[#1c1917] font-semibold leading-relaxed mb-2">
                "{philosophy}"
              </p>
              <p className="text-xs sm:text-sm text-[#44403c] leading-relaxed font-sans">
                I focus on verifiable outcomes, clear documentation, and understanding how each abstraction works before building higher layers.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Compact Education Card (5 cols) */}
        <div
          className={`lg:col-span-5 p-6 rounded-lg border shadow-xs space-y-5 text-xs sm:text-sm ${
            isStdout
              ? 'border-[#242e40] bg-[#121722] font-mono text-[#94a3b8]'
              : 'border-[#e2dbce] bg-[#ffffff] font-serif text-[#44403c]'
          }`}
        >
          <div
            className={`flex items-center justify-between pb-3 border-b ${
              isStdout ? 'border-[#242e40]' : 'border-[#e2dbce]'
            }`}
          >
            <span
              className={`font-bold text-sm ${
                isStdout ? 'font-mono text-[#f1f5f9]' : 'font-serif text-[#1c1917]'
              }`}
            >
              Education &amp; Credentials
            </span>
            <GraduationCap
              className={`w-4 h-4 ${
                isStdout ? 'text-[#00e5c0]' : 'text-[#1d4ed8]'
              }`}
            />
          </div>

          <div className="space-y-3">
            <div>
              <span
                className={`text-[11px] uppercase tracking-wider block ${
                  isStdout ? 'text-[#64748b] font-mono' : 'text-[#78716c] font-serif'
                }`}
              >
                Degree Track
              </span>
              <span
                className={`font-semibold text-sm ${
                  isStdout ? 'text-[#f1f5f9]' : 'text-[#1c1917]'
                }`}
              >
                Bachelor of Technology (B.Tech)
              </span>
            </div>

            <div>
              <span
                className={`text-[11px] uppercase tracking-wider block ${
                  isStdout ? 'text-[#64748b] font-mono' : 'text-[#78716c] font-serif'
                }`}
              >
                Specialization
              </span>
              <span className={isStdout ? 'text-[#94a3b8]' : 'text-[#44403c]'}>
                Computer Science and Engineering — Artificial Intelligence &amp; Machine Learning
              </span>
            </div>

            <div>
              <span
                className={`text-[11px] uppercase tracking-wider block ${
                  isStdout ? 'text-[#64748b] font-mono' : 'text-[#78716c] font-serif'
                }`}
              >
                Institution &amp; Cohort
              </span>
              <span
                className={`font-semibold ${
                  isStdout ? 'text-[#00e5c0] font-mono' : 'text-[#1d4ed8] font-serif'
                }`}
              >
                MATS University · Class of 2030
              </span>
            </div>

            <div
              className={`pt-3 border-t ${
                isStdout ? 'border-[#242e40]' : 'border-[#e2dbce]'
              }`}
            >
              <span
                className={`text-[11px] uppercase tracking-wider block mb-2 font-bold ${
                  isStdout ? 'text-[#f1f5f9] font-mono' : 'text-[#1c1917] font-serif'
                }`}
              >
                Completed Certifications:
              </span>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                      isStdout ? 'text-[#00e5c0]' : 'text-[#1d4ed8]'
                    }`}
                  />
                  <span>
                    <strong>CS50x</strong> — Introduction to Computer Science (Harvard, 2026)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                      isStdout ? 'text-[#00e5c0]' : 'text-[#1d4ed8]'
                    }`}
                  />
                  <span>
                    <strong>CS50P</strong> — Programming with Python (Harvard, 2026)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                      isStdout ? 'text-[#00e5c0]' : 'text-[#1d4ed8]'
                    }`}
                  />
                  <span>Python &amp; C Programming Foundations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
