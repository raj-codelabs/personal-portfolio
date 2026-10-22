import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';
import { Terminal, Pencil, Eraser } from 'lucide-react';
import { spring } from '../motion/motion-tokens';
import { motion } from 'motion/react';

export const Cover: React.FC = () => {
  const { theme } = useTheme();
  const reducedMotion = useReducedMotionGlobal();
  const isStdout = theme === 'stdout';
  const coverRef = useRef<HTMLElement>(null);

  // Check if cover should be skipped from storage, hash, or reduced motion
  const checkShouldSkip = useCallback(() => {
    if (typeof window === 'undefined') return true;
    if (reducedMotion) return true;
    if (window.location.hash && window.location.hash.length > 1) return true;
    if (window.scrollY > 40) return true;
    if (document.documentElement.classList.contains('skip-cover')) return true;
    try {
      return (
        sessionStorage.getItem('coverSeen') === '1' ||
        sessionStorage.getItem('coverDismissed') === '1'
      );
    } catch {
      return false;
    }
  }, [reducedMotion]);

  const [isDismissed, setIsDismissed] = useState<boolean>(() => checkShouldSkip());
  const isDismissedRef = useRef<boolean>(isDismissed);
  const isAutoScrollingRef = useRef<boolean>(false);

  const [isSkipped, setIsSkipped] = useState<boolean>(() => checkShouldSkip());
  const [isComplete, setIsComplete] = useState<boolean>(() => checkShouldSkip());
  const [scrollY, setScrollY] = useState<number>(0);
  const [viewportH, setViewportH] = useState<number>(800);

  // Animation timeline step states:
  // For Terminal: 0: wait, 1: cmd, 2: line1, 3: line2, 4: line3, 5: sub, 6: done
  // For Notebook: 0: wait, 1: write line 1, 2: erase line 1, 3: write line 2, 4: erase line 2, 5: write line 3, 6: sub, 7: done
  const [step, setStep] = useState<number>(() => (checkShouldSkip() ? 99 : 0));
  const [cmdText, setCmdText] = useState<string>('');
  const [line1Progress, setLine1Progress] = useState<number>(() => (checkShouldSkip() ? 100 : 0));
  const [line2Progress, setLine2Progress] = useState<number>(() => (checkShouldSkip() ? 100 : 0));
  const [line3Progress, setLine3Progress] = useState<number>(() => (checkShouldSkip() ? 100 : 0));
  const [line1Erased, setLine1Erased] = useState<boolean>(false);
  const [line2Erased, setLine2Erased] = useState<boolean>(false);
  const [subVisible, setSubVisible] = useState<boolean>(() => checkShouldSkip());
  const [cursorSolid, setCursorSolid] = useState<boolean>(false);

  const activeTimersRef = useRef<number[]>([]);

  const clearAllTimers = () => {
    activeTimersRef.current.forEach((t) => window.clearTimeout(t));
    activeTimersRef.current = [];
  };

  // Permanently dismiss the cover for this session once it has been scrolled past
  const dismissCover = useCallback(() => {
    if (isDismissedRef.current) return;
    isDismissedRef.current = true;
    clearAllTimers();

    const h = coverRef.current?.offsetHeight || window.innerHeight || 800;
    const currentScroll = window.scrollY;

    try {
      sessionStorage.setItem('coverSeen', '1');
      sessionStorage.setItem('coverDismissed', '1');
    } catch {
      // Storage restricted
    }

    document.documentElement.classList.add('skip-cover');
    setIsDismissed(true);
    setIsComplete(true);

    // If the user was scrolled at or past the cover, shift scrollY seamlessly by -h
    // so the exact same content remains in the viewport with 0 layout shift
    if (currentScroll >= h - 10) {
      window.scrollTo({
        top: Math.max(0, currentScroll - h),
        behavior: 'instant',
      });
    }
  }, []);

  // Section 1.4: Finish / skip trigger (complete instantly, do not preventDefault)
  const completeCover = useCallback(() => {
    clearAllTimers();
    setIsComplete(true);
    setStep(99);
    setCmdText('intro');
    setLine1Progress(100);
    setLine2Progress(100);
    setLine3Progress(100);
    setLine1Erased(false);
    setLine2Erased(false);
    setSubVisible(true);
    setCursorSolid(true);

    try {
      sessionStorage.setItem('coverSeen', '1');
    } catch {
      // Storage restricted
    }
  }, []);

  // Section 1.7: Theme toggle mid-cover cancels timeline and completes in final state
  const prevThemeRef = useRef(theme);
  useEffect(() => {
    if (prevThemeRef.current !== theme) {
      prevThemeRef.current = theme;
      if (!isComplete) {
        completeCover();
      }
    }
  }, [theme, isComplete, completeCover]);

  // Section 1.4: User interaction skip listeners
  useEffect(() => {
    if (isComplete || isDismissed) return;

    const handleSkip = () => {
      completeCover();
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if ([' ', 'Enter', 'Escape', 'ArrowDown'].includes(e.key)) {
        completeCover();
      }
    };

    window.addEventListener('pointerdown', handleSkip, { passive: true });
    window.addEventListener('wheel', handleSkip, { passive: true });
    window.addEventListener('touchmove', handleSkip, { passive: true });
    window.addEventListener('keydown', handleKeydown, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleSkip);
      window.removeEventListener('wheel', handleSkip);
      window.removeEventListener('touchmove', handleSkip);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [isComplete, isDismissed, completeCover]);

  // Section 1.3: Start sequence after document.fonts.ready (timeout 800ms)
  useEffect(() => {
    if (isComplete || isSkipped || isDismissed || reducedMotion) return;

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      runSequence();
    };

    let fontTimeout = window.setTimeout(start, 800);

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        window.clearTimeout(fontTimeout);
        start();
      });
    }

    return () => {
      window.clearTimeout(fontTimeout);
      clearAllTimers();
    };
  }, [isComplete, isSkipped, isDismissed, reducedMotion, isStdout]);

  // Main animation timeline sequence
  const runSequence = () => {
    clearAllTimers();

    const addTimer = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay);
      activeTimersRef.current.push(id);
      return id;
    };

    if (isStdout) {
      // ==========================================
      // Terminal Sequence (Dark)
      // types command -> welcome lines -> subtitle
      // ==========================================
      setStep(1);
      const cmd = 'intro';
      let cIdx = 0;
      const typeCmd = () => {
        if (cIdx <= cmd.length) {
          setCmdText(cmd.slice(0, cIdx));
          cIdx++;
          addTimer(typeCmd, 40);
        } else {
          // Command typed, now type Line 1
          setStep(2);
          startTypingLine1();
        }
      };
      addTimer(typeCmd, 100);

      const startTypingLine1 = () => {
        let p = 0;
        const step1 = () => {
          p += 6;
          if (p >= 100) {
            setLine1Progress(100);
            setStep(3);
            addTimer(startTypingLine2, 120);
          } else {
            setLine1Progress(p);
            addTimer(step1, 25);
          }
        };
        step1();
      };

      const startTypingLine2 = () => {
        let p = 0;
        const step2 = () => {
          p += 12;
          if (p >= 100) {
            setLine2Progress(100);
            setStep(4);
            addTimer(startTypingLine3, 100);
          } else {
            setLine2Progress(p);
            addTimer(step2, 25);
          }
        };
        step2();
      };

      const startTypingLine3 = () => {
        let p = 0;
        const step3 = () => {
          p += 8;
          if (p >= 100) {
            setLine3Progress(100);
            setStep(5);
            setSubVisible(true);
            addTimer(() => {
              completeCover();
            }, 300);
          } else {
            setLine3Progress(p);
            addTimer(step3, 25);
          }
        };
        step3();
      };
    } else {
      // ==========================================
      // Notebook Sequence (Light)
      // Pencil writes each line; eraser clears it
      // before next; name stays!
      // ==========================================
      setStep(1); // Pencil writes line 1
      let p1 = 0;
      const writeLine1 = () => {
        p1 += 5;
        if (p1 >= 100) {
          setLine1Progress(100);
          // Pause briefly, then erase line 1
          addTimer(() => {
            setStep(2); // Erasing line 1
            let e1 = 100;
            const eraseLine1 = () => {
              e1 -= 8;
              if (e1 <= 0) {
                setLine1Progress(0);
                setLine1Erased(true);
                // Pause briefly, then write line 2
                addTimer(() => {
                  setStep(3); // Writing line 2
                  writeLine2();
                }, 100);
              } else {
                setLine1Progress(e1);
                addTimer(eraseLine1, 20);
              }
            };
            eraseLine1();
          }, 200);
        } else {
          setLine1Progress(p1);
          addTimer(writeLine1, 20);
        }
      };
      addTimer(writeLine1, 100);

      const writeLine2 = () => {
        let p2 = 0;
        const step2 = () => {
          p2 += 8;
          if (p2 >= 100) {
            setLine2Progress(100);
            // Pause briefly, then erase line 2
            addTimer(() => {
              setStep(4); // Erasing line 2
              let e2 = 100;
              const eraseLine2 = () => {
                e2 -= 10;
                if (e2 <= 0) {
                  setLine2Progress(0);
                  setLine2Erased(true);
                  // Pause briefly, then write line 3 (the name)
                  addTimer(() => {
                    setStep(5); // Writing line 3
                    writeLine3();
                  }, 100);
                } else {
                  setLine2Progress(e2);
                  addTimer(eraseLine2, 20);
                }
              };
              eraseLine2();
            }, 180);
          } else {
            setLine2Progress(p2);
            addTimer(step2, 20);
          }
        };
        step2();
      };

      const writeLine3 = () => {
        let p3 = 0;
        const step3 = () => {
          p3 += 6;
          if (p3 >= 100) {
            setLine3Progress(100);
            // THE NAME STAYS!
            setStep(6);
            setSubVisible(true);
            addTimer(() => {
              completeCover();
            }, 400);
          } else {
            setLine3Progress(p3);
            addTimer(step3, 20);
          }
        };
        step3();
      };
    }
  };

  // Section 1.5, 1.6 & Dismissal on Complete Scroll:
  // Once the intro page is completely scrolled past, make it inaccessible again in this session
  useEffect(() => {
    if (isDismissed) return;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollY(currentY);

      if (isDismissedRef.current || isAutoScrollingRef.current) return;

      const h = coverRef.current?.offsetHeight || window.innerHeight || 800;
      // If the intro page has been completely scrolled past
      if (currentY >= h - 2) {
        dismissCover();
      }
    };

    const handleResize = () => {
      setViewportH(window.innerHeight || 800);
    };

    handleResize();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDismissed, dismissCover]);

  // Observer to double-check when cover leaves viewport completely
  useEffect(() => {
    if (isDismissed) return;
    const el = coverRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          !entry.isIntersecting &&
          entry.boundingClientRect.bottom <= 0 &&
          !isAutoScrollingRef.current &&
          !isDismissedRef.current
        ) {
          dismissCover();
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isDismissed, dismissCover]);

  // Section 1.6: As user scrolls the first 60% of viewport height:
  // cover content goes opacity 1 to 0 and translateY 0 to -24px
  const leaveProgress = Math.min(Math.max(scrollY / (viewportH * 0.6), 0), 1);
  const coverOpacity = 1 - leaveProgress;
  const coverTranslateY = -24 * leaveProgress;

  // Section 1.5: Cue fades out once scrollY > 80
  const cueOpacity = scrollY > 80 ? 0 : 1;

  // Section 1.5: Click scrolls to #hero, and once arrived, dismisses cover for this session
  const handleCueClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    completeCover();

    const heroEl = document.getElementById('hero');
    if (!heroEl) {
      dismissCover();
      return;
    }

    if (reducedMotion) {
      dismissCover();
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    isAutoScrollingRef.current = true;
    heroEl.scrollIntoView({ behavior: 'smooth' });

    let finished = false;
    const finishAutoScroll = () => {
      if (finished) return;
      finished = true;
      isAutoScrollingRef.current = false;
      dismissCover();
    };

    if ('onscrollend' in window) {
      window.addEventListener('scrollend', finishAutoScroll, { once: true });
    }
    // Fallback timer for browsers that don't emit scrollend or if scroll finishes earlier
    setTimeout(finishAutoScroll, 700);
  };

  // If already dismissed in this session, do not render into DOM
  if (isDismissed) {
    return null;
  }

  return (
    <section
      ref={coverRef}
      id="cover"
      aria-label="Welcome"
      className={`cover min-h-[100vh] min-h-[100svh] w-full flex flex-col justify-between items-start pt-20 pb-8 relative select-none transition-colors ${
        isStdout
          ? 'bg-[#0d1117] text-[#f1f5f9]'
          : 'bg-[#fbf7ee] text-[#1c1917]'
      }`}
      style={{
        display: isSkipped && isComplete && isDismissed ? 'none' : undefined,
      }}
    >
      {/* Stage: Content aligned to same grid as hero */}
      <div
        className="cover__stage w-full my-auto transition-transform duration-75"
        style={{
          opacity: reducedMotion ? 1 : coverOpacity,
          transform: reducedMotion ? 'none' : `translateY(${coverTranslateY}px)`,
        }}
      >
        <div className="max-w-4xl space-y-4">
          {/* Terminal Command Prompt line */}
          {isStdout && (
            <div className="text-xs sm:text-sm font-mono text-[#64748b] flex items-center gap-2 pb-2">
              <span className="text-[#00e5c0] font-bold">$</span>
              <span className="text-[#94a3b8]">{cmdText || (isComplete ? 'intro' : '')}</span>
              {step === 1 && !isComplete && (
                <span className="text-[#00e5c0] animate-pulse" aria-hidden="true">
                  ▌
                </span>
              )}
            </div>
          )}

          {/* Line 1: Welcome to my portfolio */}
          <div className="relative flex items-center gap-2">
            <p
              className={`cover__line ${
                isStdout
                  ? 'text-base sm:text-2xl font-mono text-[#94a3b8]'
                  : 'text-xl sm:text-3xl font-handwriting text-[#78716c]'
              }`}
              data-line="1"
            >
              <span
                style={{
                  clipPath:
                    isComplete || reducedMotion
                      ? 'none'
                      : `inset(0 ${100 - line1Progress}% 0 0)`,
                  opacity: !isStdout && line1Erased && !isComplete ? 0 : 1,
                  display: 'inline-block',
                  transition: 'opacity 150ms ease-out',
                }}
              >
                Welcome to my portfolio
              </span>
            </p>

            {/* Pencil/Eraser Indicators for Notebook */}
            {!isStdout && !isComplete && (
              <>
                {step === 1 && line1Progress > 0 && line1Progress < 100 && (
                  <Pencil className="w-4 h-4 text-[#78716c] inline-block animate-bounce" aria-hidden="true" />
                )}
                {step === 2 && (
                  <Eraser className="w-4 h-4 text-[#c25e38] inline-block animate-pulse" aria-hidden="true" />
                )}
              </>
            )}

            {/* Cursor for Terminal */}
            {isStdout && step === 2 && !isComplete && (
              <span className="text-[#00e5c0]" aria-hidden="true">
                ▌
              </span>
            )}
          </div>

          {/* Line 2: made by */}
          <div className="relative flex items-center gap-2">
            <p
              className={`cover__line ${
                isStdout
                  ? 'text-sm sm:text-lg font-mono text-[#64748b]'
                  : 'text-base sm:text-xl font-serif italic text-[#a8a29e]'
              }`}
              data-line="2"
            >
              <span
                style={{
                  clipPath:
                    isComplete || reducedMotion
                      ? 'none'
                      : `inset(0 ${100 - line2Progress}% 0 0)`,
                  opacity: !isStdout && line2Erased && !isComplete ? 0 : 1,
                  display: 'inline-block',
                  transition: 'opacity 150ms ease-out',
                }}
              >
                made by
              </span>
            </p>

            {/* Pencil/Eraser Indicators for Notebook */}
            {!isStdout && !isComplete && (
              <>
                {step === 3 && line2Progress > 0 && line2Progress < 100 && (
                  <Pencil className="w-4 h-4 text-[#78716c] inline-block animate-bounce" aria-hidden="true" />
                )}
                {step === 4 && (
                  <Eraser className="w-4 h-4 text-[#c25e38] inline-block animate-pulse" aria-hidden="true" />
                )}
              </>
            )}

            {/* Cursor for Terminal */}
            {isStdout && step === 3 && !isComplete && (
              <span className="text-[#00e5c0]" aria-hidden="true">
                ▌
              </span>
            )}
          </div>

          {/* Line 3: Raj Golder (cover__name) - The name stays! */}
          <div className="relative flex items-center gap-2 pt-1">
            <p
              className={`cover__line cover__name font-bold tracking-tight ${
                isStdout
                  ? 'text-3xl sm:text-6xl font-mono text-[#00e5c0]'
                  : 'text-4xl sm:text-7xl font-serif text-[#1c1917]'
              }`}
              data-line="3"
            >
              <span
                style={{
                  clipPath:
                    isComplete || reducedMotion
                      ? 'none'
                      : `inset(0 ${100 - line3Progress}% 0 0)`,
                  display: 'inline-block',
                }}
              >
                Raj Golder
              </span>
            </p>

            {/* Pencil Indicator for Notebook */}
            {!isStdout && !isComplete && step === 5 && line3Progress < 100 && (
              <Pencil className="w-5 h-5 text-[#1d4ed8] inline-block animate-bounce" aria-hidden="true" />
            )}

            {/* Cursor for Terminal */}
            {isStdout && (step === 4 || (!cursorSolid && !reducedMotion)) && (
              <span
                className={`text-[#00e5c0] ${
                  isComplete ? 'opacity-100' : 'animate-pulse'
                }`}
                aria-hidden="true"
              >
                ▌
              </span>
            )}
          </div>

          {/* Subtitle */}
          <p
            className={`cover__sub pt-3 text-xs sm:text-sm font-medium tracking-wide transition-opacity duration-300 ${
              isStdout
                ? 'font-mono text-[#94a3b8]'
                : 'font-serif text-[#78716c]'
            }`}
            style={{
              opacity: subVisible || isComplete || reducedMotion ? 1 : 0,
            }}
          >
            B.Tech CSE (AI/ML) · MATS University · Class of 2030
          </p>
        </div>
      </div>

      {/* Section 1.5: Cue (Bottom center) */}
      <div className="w-full flex justify-center items-center pointer-events-auto">
        <a
          href="#hero"
          onClick={handleCueClick}
          style={{
            opacity: cueOpacity,
            transition: 'opacity 150ms ease-out',
          }}
          className={`cover__cue px-4 py-2 rounded focus-visible:outline-2 ${
            isStdout
              ? 'font-mono text-xs text-[#64748b] hover:text-[#00e5c0]'
              : 'font-handwriting text-base text-[#78716c] hover:text-[#1d4ed8]'
          }`}
          aria-label={isComplete ? 'Scroll to main content' : 'Skip welcome intro'}
        >
          {isComplete ? 'scroll ↓' : 'skip ↓'}
        </a>
      </div>
    </section>
  );
};
