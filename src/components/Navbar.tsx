import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ExternalLink, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'motion/react';
import { spring } from '../motion/motion-tokens';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

interface NavbarProps {
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { theme } = useTheme();
  const reducedMotion = useReducedMotionGlobal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>('home');
  const [cursorBlinking, setCursorBlinking] = useState(true);

  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef<number | null>(null);

  const isStdout = theme === 'stdout';

  const navLinks = [
    { href: '#projects', id: 'projects', label: 'Projects' },
    { href: '#journey', id: 'journey', label: 'Timeline' },
    { href: '#skills', id: 'skills', label: 'Skills' },
    { href: '#about', id: 'about', label: 'About' },
    { href: '#contact', id: 'contact', label: 'Contact' },
  ];

  // Stop cursor blinking after 3s
  useEffect(() => {
    if (reducedMotion) {
      setCursorBlinking(false);
      return;
    }
    const timer = setTimeout(() => {
      setCursorBlinking(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  // Robust scroll-spy and scroll compression
  useEffect(() => {
    let ticking = false;

    const determineActiveSection = () => {
      if (isClickScrollingRef.current) return;

      const currentY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;

      // 1. If reached bottom of page, highlight contact
      if (currentY + viewportHeight >= scrollHeight - 80) {
        setActiveId('contact');
        return;
      }

      // 2. If above projects, active section is home (no tab underline)
      const projectsEl = document.getElementById('projects');
      if (projectsEl && currentY < projectsEl.offsetTop - 160) {
        setActiveId('home');
        return;
      }

      // 3. Check sections in reverse order (bottom-up: contact, about, skills, journey, projects)
      const sectionIds = ['contact', 'about', 'skills', 'journey', 'projects'];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 220 && rect.bottom > 80) {
            setActiveId(id);
            return;
          }
        }
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setIsScrolled(currentY > 24);
          determineActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check and re-checks after theme layout reflow
    handleScroll();
    const t1 = setTimeout(determineActiveSection, 60);
    const t2 = setTimeout(determineActiveSection, 220);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(t1);
      clearTimeout(t2);
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [theme]);

  const handleNavClick = (id: string) => {
    setActiveId(id);
    isClickScrollingRef.current = true;
    if (clickTimeoutRef.current) {
      window.clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = window.setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 850);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors ${
        isStdout
          ? 'bg-[#0d1117]/95 backdrop-blur-md'
          : 'bg-[#fbf7ee]/95 backdrop-blur-md'
      }`}
    >
      {/* Header Container with compress-on-scroll */}
      <motion.div
        animate={{
          paddingTop: isScrolled ? 10 : 14,
          paddingBottom: isScrolled ? 10 : 14,
        }}
        transition={reducedMotion ? { duration: 0 } : spring.snap}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 md:gap-8"
      >
        {/* Zone 1: Brand ($ raj-golder▌) */}
        <div className="shrink-0 flex items-center">
          <a
            href="#home"
            onClick={() => handleNavClick('home')}
            className={`text-sm md:text-base font-semibold transition-colors focus-visible:outline-none ${
              isStdout
                ? 'font-mono text-[#f1f5f9] hover:text-[#00e5c0]'
                : 'font-serif text-[#1c1917] hover:text-[#1d4ed8] tracking-tight'
            }`}
          >
            {isStdout ? (
              <span className="flex items-center gap-1.5">
                <span className="text-[#00e5c0] font-bold">$</span>
                <span className="font-bold">raj-golder</span>
                <span
                  className={`text-[#00e5c0] ${
                    cursorBlinking && !reducedMotion ? 'animate-pulse' : 'opacity-100'
                  }`}
                  aria-hidden="true"
                >
                  ▌
                </span>
              </span>
            ) : (
              <span className="flex items-baseline gap-2">
                <span className="text-lg font-bold">Raj Golder</span>
                <span className="text-xs font-sans font-normal text-[#686158] hidden sm:inline">
                  · Field Notebook
                </span>
              </span>
            )}
          </a>
        </div>

        {/* Zone 2: Navigation Links with Scroll-Spy Underline (Scoped to active theme to avoid mode-switch glitch) */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-medium uppercase tracking-wider relative"
        >
          {navLinks.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.id)}
                className={`relative py-1 transition-colors whitespace-nowrap shrink-0 group ${
                  isStdout
                    ? isActive
                      ? 'text-[#00e5c0] font-mono'
                      : 'text-[#94a3b8] hover:text-[#f1f5f9] font-mono'
                    : isActive
                    ? 'text-[#1d4ed8] font-sans font-semibold'
                    : 'text-[#686158] hover:text-[#1d4ed8] font-sans'
                }`}
              >
                <span>{link.label}</span>

                {/* Underline element sliding between nav items */}
                {isActive && (
                  <motion.div
                    layoutId={`nav-underline-${theme}`}
                    transition={reducedMotion ? { duration: 0 } : spring.settle}
                    className={`absolute bottom-0 left-0 right-0 h-[2px] ${
                      isStdout ? 'bg-[#00e5c0]' : 'bg-[#1d4ed8]'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Dark/Light Mode Theme Switcher & GitHub CTA & Mobile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle />

          <motion.a
            href="https://github.com/raj-codelabs"
            target="_blank"
            rel="noopener noreferrer"
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            transition={spring.snap}
            className={`group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
              isStdout
                ? 'border-[#242e40] text-[#f1f5f9] hover:border-[#00e5c0] hover:text-[#00e5c0] bg-[#121722] font-mono'
                : 'border-[#e2dbce] text-[#1c1917] hover:border-[#1d4ed8] hover:text-[#1d4ed8] bg-[#ffffff] font-serif'
            }`}
          >
            <span>GitHub</span>
            <ExternalLink
              className="w-3 h-3 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </motion.a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={`md:hidden p-1.5 rounded border transition-colors cursor-pointer ${
              isStdout
                ? 'border-[#30363d] text-[#e6edf3] hover:bg-[#161b22]'
                : 'border-[#e3ded2] text-[#302d29] hover:bg-[#ffffff]'
            }`}
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Menu className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </motion.div>

      {/* 1px bottom hairline fades in when scrollY > 24 */}
      <motion.div
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={reducedMotion ? { duration: 0 } : spring.snap}
        className={`w-full h-[1px] ${
          isStdout ? 'bg-[#30363d]' : 'bg-[#e3ded2]'
        }`}
        aria-hidden="true"
      />

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            id="mobile-navigation"
            aria-label="Mobile Navigation"
            initial={reducedMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reducedMotion ? undefined : { opacity: 0, height: 0 }}
            transition={spring.snap}
            className={`md:hidden border-b px-4 py-3 space-y-2 overflow-hidden ${
              isStdout ? 'bg-[#161b22] border-[#30363d]' : 'bg-[#ffffff] border-[#e3ded2]'
            }`}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  handleNavClick(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`block px-3 py-2 text-sm rounded transition-colors ${
                  isStdout
                    ? activeId === link.id
                      ? 'text-[#00e5c0] bg-[#21262d] font-mono'
                      : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d] font-mono'
                    : activeId === link.id
                    ? 'text-[#1d4ed8] bg-[#fbf7ee] font-sans font-semibold'
                    : 'text-[#686158] hover:text-[#0d5c6e] hover:bg-[#fbf7ee] font-sans'
                }`}
              >
                {link.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
