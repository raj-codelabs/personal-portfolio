import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { ExternalLink, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { spring } from '../motion/motion-tokens';
import { useReducedMotionGlobal } from '../motion/useReducedMotionGlobal';

interface NavLink {
  label: string;
  href: string;
  id: string;
}

const navLinks: NavLink[] = [
  { label: 'Overview', href: '#home', id: 'home' },
  { label: 'Work', href: '#projects', id: 'projects' },
  { label: 'Architecture', href: '#architecture', id: 'architecture' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export const Navbar: React.FC = () => {
  const { theme } = useTheme();
  const [activeId, setActiveId] = useState<string>('home');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [cursorBlinking, setCursorBlinking] = useState<boolean>(true);
  const reducedMotion = useReducedMotionGlobal();

  // Scroll listener for sticky header compression
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 24);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for scroll-spy active link tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -50% 0px',
        threshold: [0.25, 0.5, 0.75],
      }
    );

    const sectionElements = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Cursor blink interval
  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setCursorBlinking((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  // Click handler with smooth scrolling
  const handleNavClick = (id: string) => {
    setActiveId(id);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-page)]/90 backdrop-blur-md transition-colors border-b border-[var(--border-subtle)]">
      {/* Header Container with compress-on-scroll */}
      <motion.div
        animate={{
          paddingTop: isScrolled ? 10 : 14,
          paddingBottom: isScrolled ? 10 : 14,
        }}
        transition={reducedMotion ? { duration: 0 } : spring.snap}
        className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 flex items-center justify-between gap-4 md:gap-8"
      >
        {/* Zone 1: Unified Brand ($ raj-golder▌) */}
        <div className="shrink-0 flex items-center min-w-[130px]">
          <a
            href="#home"
            onClick={() => handleNavClick('home')}
            className="text-sm md:text-base font-semibold font-mono text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors focus-visible:outline-none"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-[var(--accent-primary)] font-bold">$</span>
              <span className="font-bold">raj-golder</span>
              <span
                className={`text-[var(--accent-primary)] ${
                  cursorBlinking && !reducedMotion ? 'animate-pulse motion-reduce:animate-none' : 'opacity-100'
                }`}
                aria-hidden="true"
              >
                ▌
              </span>
            </span>
          </a>
        </div>

        {/* Zone 2: Navigation Links with Scroll-Spy Underline */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-mono font-medium uppercase tracking-wider relative"
        >
          {navLinks.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.id)}
                className={`relative py-1.5 transition-colors whitespace-nowrap shrink-0 group ${
                  isActive
                    ? 'text-[var(--accent-primary)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{link.label}</span>

                {/* Underline element strictly anchored to active link */}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent-primary)] rounded-full"
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
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all cursor-pointer hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.98]"
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
            className="md:hidden p-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-all cursor-pointer hover:-translate-y-[1px] active:translate-y-[1px]"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Menu className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </motion.div>

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
            className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 space-y-2 overflow-hidden font-mono"
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
                  activeId === link.id
                    ? 'text-[var(--accent-primary)] bg-[var(--accent-subtle)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
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
