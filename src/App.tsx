/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { CmsProvider, useCms } from './context/CmsContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { SkipLink } from './components/SkipLink';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { Projects } from './sections/Projects';
import { Journey } from './sections/Journey';
import { Skills } from './sections/Skills';
import { About } from './sections/About';
import { Contact } from './sections/Contact';
import { Footer } from './components/Footer';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { RefreshCw } from 'lucide-react';

function PortfolioMain() {
  const { siteSettings } = useCms();
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const [view, setView] = useState<'public' | 'admin'>('public');

  // Sync hash routing: #admin loads admin view, others load public
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setView('admin');
      } else if (view === 'admin' && window.location.hash !== '#admin') {
        setView('public');
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [view]);

  // Sync dynamic HTML Title & Meta
  useEffect(() => {
    if (siteSettings?.siteTitle) {
      document.title = siteSettings.siteTitle;
    }
    if (siteSettings?.siteDescription) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', siteSettings.siteDescription);
      }
    }
  }, [siteSettings]);

  const handleOpenAdmin = () => {
    window.location.hash = '#admin';
    setView('admin');
  };

  const handleExitAdmin = () => {
    window.history.pushState(null, '', window.location.pathname);
    setView('public');
  };

  if (view === 'admin') {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)] text-[var(--text-primary)] font-mono text-xs">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[var(--accent-primary)]" />
            <span>Verifying administrative authorization...</span>
          </div>
        </div>
      );
    }

    if (isAuthenticated) {
      return <AdminDashboard onExit={handleExitAdmin} />;
    }

    return <AdminLogin onBackToSite={handleExitAdmin} />;
  }

  const visibility = siteSettings?.sectionsVisibility || {
    hero: true,
    projects: true,
    journey: true,
    skills: true,
    about: true,
    contact: true,
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors selection:bg-[var(--accent-subtle)] selection:text-[var(--accent-primary)]">
      <SkipLink />
      <Navbar />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 focus:outline-none"
      >
        {visibility.hero !== false && <Hero />}
        {visibility.projects !== false && <Projects />}
        {visibility.journey !== false && <Journey />}
        {visibility.skills !== false && <Skills />}
        {visibility.about !== false && <About />}
        {visibility.contact !== false && <Contact />}
      </main>

      <Footer onOpenAdmin={handleOpenAdmin} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CmsProvider>
        <AdminAuthProvider>
          <PortfolioMain />
        </AdminAuthProvider>
      </CmsProvider>
    </ThemeProvider>
  );
}
