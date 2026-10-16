/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SkipLink } from './components/SkipLink';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { Projects } from './sections/Projects';
import { Journey } from './sections/Journey';
import { Skills } from './sections/Skills';
import { About } from './sections/About';
import { Contact } from './sections/Contact';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col transition-colors selection:bg-[var(--accent-subtle)] selection:text-[var(--accent-primary)]">
        <SkipLink />
        <Navbar />

        <main id="main-content" tabIndex={-1} className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 focus:outline-none">
          <Hero />
          <Projects />
          <Journey />
          <Skills />
          <About />
          <Contact />
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
