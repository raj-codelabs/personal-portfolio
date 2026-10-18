import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ExternalLink, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isStdout = theme === 'stdout';

  const navLinks = [
    { href: '#projects', label: 'Projects' },
    { href: '#journey', label: 'Timeline' },
    { href: '#skills', label: 'Skills' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-colors ${
        isStdout
          ? 'bg-[#0d1117]/95 border-[#30363d] backdrop-blur-md'
          : 'bg-[#fbf7ee]/95 border-[#e3ded2] backdrop-blur-md'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand ($ raj-golder▌) */}
        <div className="shrink-0 flex items-center">
          <a
            href="#home"
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
                <span className="text-[#00e5c0] animate-pulse" aria-hidden="true">▌</span>
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

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-medium uppercase tracking-wider"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                isStdout
                  ? 'text-[#94a3b8] hover:text-[#f1f5f9] font-mono hover:border-b hover:border-[#00e5c0]'
                  : 'text-[#686158] hover:text-[#1d4ed8] font-sans hover:border-b hover:border-[#1d4ed8]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: GitHub ↗ outline CTA & Mobile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="https://github.com/raj-codelabs"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
              isStdout
                ? 'border-[#242e40] text-[#f1f5f9] hover:border-[#00e5c0] hover:text-[#00e5c0] bg-[#121722] font-mono'
                : 'border-[#e2dbce] text-[#1c1917] hover:border-[#1d4ed8] hover:text-[#1d4ed8] bg-[#ffffff] font-serif'
            }`}
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={`md:hidden p-1.5 rounded border transition-colors ${
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
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile Navigation"
          className={`md:hidden border-b px-4 py-3 space-y-2 ${
            isStdout ? 'bg-[#161b22] border-[#30363d]' : 'bg-[#ffffff] border-[#e3ded2]'
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm rounded transition-colors ${
                isStdout
                  ? 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d] font-mono'
                  : 'text-[#686158] hover:text-[#0d5c6e] hover:bg-[#fbf7ee] font-sans'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://github.com/raj-codelabs"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2 text-sm rounded border transition-colors flex items-center justify-between ${
              isStdout
                ? 'border-[#30363d] text-[#00e5c0] font-mono'
                : 'border-[#e2dbce] text-[#1d4ed8] font-serif'
            }`}
          >
            <span>GitHub Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </nav>
      )}
    </header>
  );
};
