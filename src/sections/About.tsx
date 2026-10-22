import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { spring, distance } from '../motion/motion-tokens';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

export const About: React.FC = () => {
  const { theme } = useTheme();
  const { profile } = useCms();
  const reducedMotion = useReducedMotionGlobal();
  const isStdout = theme === 'stdout';

  const philosophy =
    profile?.philosophy ||
    'Learn the fundamentals, build small projects, and improve through experimentation.';

  const certifications = [
    { name: 'CS50x — Introduction to Computer Science', issuer: 'Harvard, 2026', status: 'completed' as const },
    { name: 'CS50P — Programming with Python', issuer: 'Harvard, 2026', status: 'completed' as const },
    { name: 'Python & C Programming Foundations', issuer: 'MATS Coursework', status: 'completed' as const },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-12 sm:py-16 space-y-8 text-left scroll-mt-16"
    >
      {/* Section Header with Section 5 reveals */}
      <div className="relative pb-4">
        <motion.div
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={spring.settle}
        >
          {isStdout ? (
            <div className="text-xs font-mono text-[#00e5c0] mb-1">
              ABOUT ME &amp; APPROACH
            </div>
          ) : (
            <div className="text-sm font-handwriting text-[#1d4ed8] font-bold mb-1">
              Personal Note &amp; Background
            </div>
          )}
        </motion.div>

        <motion.h2
          id="about-heading"
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={{ ...spring.settle, delay: 0.05 }}
          className={`text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] ${
            isStdout ? 'font-mono' : 'font-serif'
          }`}
        >
          About Me
        </motion.h2>

        <motion.p
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={{ ...spring.settle, delay: 0.1 }}
          className="text-sm sm:text-base text-[var(--text-secondary)] font-body mt-1 max-w-xl"
        >
          Background context, motivation for computer science, and principles governing how I build and learn.
        </motion.p>

        {/* Section hairline rule: scaleX 0 to 1, origin left, soft spring (Section 5) */}
        <motion.div
          data-reveal
          initial={reducedMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={spring.soft}
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-[var(--border-subtle)] origin-left"
          aria-hidden="true"
        />
      </div>

      {/* Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Narrative (7 cols) - Notice: no paragraph per-letter/word animation (Section Philosophy) */}
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

          {/* Section 5: Quote Block - Left rule draws scaleY 0 to 1 (top to bottom) over ~500ms, then text fades */}
          <div className="relative pl-5 py-3 my-6 font-serif">
            {/* Animated left rule */}
            <motion.div
              data-reveal
              initial={reducedMotion ? false : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`absolute left-0 top-0 bottom-0 w-[3px] origin-top rounded-full ${
                isStdout ? 'bg-[#00e5c0]' : 'bg-[#1d4ed8]'
              }`}
              aria-hidden="true"
            />

            {/* Quote content fading in after rule draws */}
            <motion.div
              data-reveal
              initial={reducedMotion ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, delay: reducedMotion ? 0 : 0.45 }}
              className="space-y-1"
            >
              <div
                className={`text-xs uppercase tracking-wider font-bold ${
                  isStdout ? 'font-mono text-[#00e5c0]' : 'font-handwriting text-[#1d4ed8] text-sm'
                }`}
              >
                My Approach:
              </div>
              <p
                className={`italic text-base sm:text-lg font-semibold leading-relaxed ${
                  isStdout ? 'text-[#f1f5f9] font-mono' : 'text-[#1c1917]'
                }`}
              >
                "{philosophy}"
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-sans pt-1">
                I focus on verifiable outcomes, clear documentation, and understanding how each abstraction works before building higher layers.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Compact Education Card (5 cols) */}
        <motion.div
          data-reveal
          initial={reducedMotion ? false : { opacity: 0, y: distance.reveal }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
          transition={spring.settle}
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

            {/* Completed Certifications (Section 5: Check icon draws stroke-dashoffset, 250ms, 60ms stagger) */}
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
                {certifications.map((cert, idx) => (
                  <li key={cert.name} className="flex items-start gap-2">
                    {/* Check icon draws stroke-dashoffset over 250ms with 60ms stagger */}
                    <svg
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isStdout ? 'text-[#00e5c0]' : 'text-[#1d4ed8]'
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <motion.circle
                        cx="12"
                        cy="12"
                        r="9"
                        strokeOpacity="0.3"
                      />
                      <motion.path
                        d="M8.5 12.5l2.5 2.5 5-5"
                        initial={reducedMotion ? false : { pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={
                          reducedMotion
                            ? { duration: 0 }
                            : { duration: 0.25, delay: idx * 0.06, ease: 'easeOut' }
                        }
                      />
                    </svg>

                    <span>
                      <strong>{cert.name}</strong> — {cert.issuer}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
