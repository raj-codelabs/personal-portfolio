# Portfolio Credibility, Clarity & Polish Overhaul

A systematic plan to transform Raj Golder's engineering portfolio into an authentic, credible showcase for recruiters and peers. This overhaul eliminates placeholder copy, removes contradictory badges and duplicate consoles, rebuilds the AI Study Notes Summarizer as a featured case study, refines the hero and skills presentations with concrete evidence, and ensures clean accessibility and mobile responsiveness across both `stdout` and `margin-notes` themes.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The implementation incorporates your confirmed answers and strict boundary rules:
>
> - **AI Study Notes Summarizer Stack**: Identified as a **Python CLI** with command-line arguments and rich terminal formatting. Card and case study will reflect this concrete UI rather than generic web or TBD labels.
> - **Contact Response Time**: Specified as **"I reply promptly by email"** (omitting unverified hourly claims).
> - **Interactive Terminal Demotion**: Demoted from a third button to a quiet inline text link: **"Try the terminal › (Quick keyboard-driven portfolio navigation)"**.
> - **Zero Placeholder Policy**: Every occurrence of `tbd`, `pending`, `to be confirmed`, `honest overview`, `last update`, and `logged to` will be eliminated or replaced with verified facts.
> - **No Invented Metrics or Stubs**: Unstarted ideas (`PrereqOS`, `Book Recommendation Engine`) are removed from the main project card grid and consolidated into a clean 1-line text note: `Next: PrereqOS (prerequisite graph for learning topics) · Book Recommendation Engine (planned)`.
> - **Single Consolidated Project Showcase**: Remove the duplicate "Project & Learning Console" / "Portfolio Status Register" views and move relevant code excerpts directly into the Summarizer case study.
> - **Header & Navigation Polish**: Replace the top-right theme switch with a clean `GitHub ↗` outline button (preparing for the future `Resume` button). Relocate the theme switcher to the footer with clean labels (`Terminal` / `Notebook`). Logo updated to `$ raj-golder▌`.
> - **Public Route Decoupling**: Remove the public CMS login link from the footer; retain `/admin` only via unlinked hash/route.

---

## 1. Overview & Core Concept

- **What It Does**: Streamlines the portfolio into a lean, honest, and high-impact engineering profile. Positions Raj as a dedicated first-year computer science student (MATS University, Class of 2030) with completed CS50x and CS50P coursework who builds useful command-line and machine learning tools in Python and C.
- **Audience**: Hiring managers, technical recruiters, research mentors, and peer engineers.
- **Key Value**: Replaces self-undermining disclaimers and draft markers with clear evidence of competence, clean code architecture, and restrained aesthetic polish.

---

## 2. User Experience & Visual Design

### Structural Rhythm & Content Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│ Top Bar: Brand ($ raj-golder▌) ── Nav (5 links) ── Action (GitHub ↗)   │
├────────────────────────────────────────────────────────────────────────┤
│ Hero Section:                                                          │
│ - Eyebrow: B.TECH CSE (AI/ML) · MATS UNIVERSITY · CLASS OF 2030        │
│ - Headline: I build small, useful tools in Python_                    │
│ - Subhead: First-year CSE student... CS50x & CS50P completed.          │
│ - CTAs: [See my work ↓]  [GitHub ↗]                                   │
│ - Demoted prober: Try the terminal › (Quick keyboard-driven nav)       │
│ - Right column: Clean Developer Card (verified details, no barcode)    │
├────────────────────────────────────────────────────────────────────────┤
│ Featured Project Case Study (Full-Width Showcase):                     │
│ - Left: AI Study Notes Summarizer problem, 3-step pipeline, learnings  │
│ - Right: Code excerpt / Terminal preview                               │
│ - Actions: [Case study] [GitHub ↗] (Live demo omitted if not deployed) │
│ - Quiet footer note: Next builds (PrereqOS · Book Recommendation)      │
├────────────────────────────────────────────────────────────────────────┤
│ Development Journey & Timeline (Clean Title Case & Real Milestones)    │
├────────────────────────────────────────────────────────────────────────┤
│ Skills & Tooling (Single unified grid with evidence, zero pills)       │
│ - Languages: Python (Summarizer, CS50P) · C (CS50x, Coursework)        │
│ - Tools: Git, GitHub, VS Code, Linux CLI                               │
│ - Learning now: AI/ML foundations, Data structures & algorithms        │
├────────────────────────────────────────────────────────────────────────┤
│ About & Philosophy (CS50x/CS50P completion, motivation, My Approach)   │
├────────────────────────────────────────────────────────────────────────┤
│ Contact (Email mailto + copy feedback, clean form, prompt reply note) │
├────────────────────────────────────────────────────────────────────────┤
│ Footer (Raj Golder · © 2026 · GitHub · LinkedIn · Theme Switcher)      │
└────────────────────────────────────────────────────────────────────────┘
```

### Visual & Typographic Polish Rules
- **Typography Scale**: Body paragraphs $\ge 16\text{px}$ (sans) or $\ge 14\text{px}$ (mono). Eyebrows and metadata $\ge 12\text{px}$. Strictly no micro-text under $11\text{px}$.
- **Tracking Discipline**: Reset tight tracking on sans body text (`letter-spacing: 0`). Headings and monospace UI labels retain disciplined typographic hierarchy.
- **Color Contrast**: Ensure text contrast $\ge 4.5:1$ against dark surfaces (`#0d1117` / `#161b22`) and light surfaces (`#fbf7ee` / `#ffffff`). Borders maintain at least $3:1$ contrast.
- **Section Anchors**: Set `scroll-margin-top: 4rem` on all section IDs (`#projects`, `#journey`, `#skills`, `#about`, `#contact`) to prevent header clipping on jump.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Removal of Duplicate Console & Invariant Workbench**
  - *Chosen Approach*: Retire the separate "Project & Learning Console" and "Portfolio Status Register" components that duplicated project content and introduced confusing status tabs.
  - *Why*: Eliminates cognitive clutter. The AI Study Notes Summarizer becomes a single full-width case study card containing its architecture, code excerpt, and takeaways.
- **Decision 2: Ideas Demoted to Single Text Line**
  - *Chosen Approach*: Remove empty concept cards (`PrereqOS`, `Book Recommendation Engine`) from the project grid and render them as a single quiet line: `Next: PrereqOS (prerequisite graph for learning topics) · Book Recommendation Engine (planned)`.
  - *Why*: Prevents recruiters from clicking cards that have "Implementation not started", which undermines technical credibility.
- **Decision 3: Skills with Evidence**
  - *Chosen Approach*: Replace 3 scattered skill cards with a single structured grid linking each language and tool directly to concrete evidence (e.g. `Python: AI Study Notes Summarizer, CS50P`).
  - *Why*: Eliminates self-deprecating "Beginner" badges while remaining honest about first-year mastery.
- **Decision 4: Plain-Language Renaming**
  - *Chosen Approach*: Rename jargon controls to standard terminology: "Examine Dossier" → "Case study", "source ↗" → "GitHub ↗", "Built Projects & Concepts" → "Projects", "Connect & Collaborate" → "Get in touch".
  - *Why*: Meets recruiter expectations for clear, direct web navigation.

---

## 4. Technical Architecture & Phased Execution

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Critical Sanitization & Case Study                             │
│ 1. Search & purge all placeholder/draft strings (grep check)            │
│ 2. Fix project status logic (public repo links, remove pending badges)  │
│ 3. Build AI Study Notes Summarizer case study view                      │
│ 4. Update CS50x / CS50P completion records across data files            │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│ Phase 2: Hero, Header & Skills Redesign                                 │
│ 1. Update Hero: new eyebrow, headline, subhead, demoted prober link    │
│ 2. Update Developer Card: remove barcode/ID, ensure 11px min text       │
│ 3. Header: $ raj-golder▌ logo, GitHub ↗ outline CTA, no theme switch   │
│ 4. Skills: single evidence-based grid, zero beginner disclaimers        │
│ 5. Projects: single section, retire console & ideas cards               │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│ Phase 3: Journey, About, Contact & Footer                               │
│ 1. Journey: node labels (Title + Date), Title Case display map          │
│ 2. About: CS50 motivation, single My Approach quote, concise prose     │
│ 3. Contact: clean email copy, prompt response note, validation states   │
│ 4. Footer: move Theme Switcher here, remove public CMS link             │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
┌────────────────────────────────────▼────────────────────────────────────┐
│ Phase 4: Contrast, Typography & Verification                            │
│ 1. Apply scroll-margin-top, contrast audit, 16px body/12px label rule   │
│ 2. Verify keyboard navigation, escape listeners, reduced-motion hooks   │
│ 3. Compile applet and run linter                                        │
└─────────────────────────────────────────────────────────────────────────┘
```

### Detailed Component & File Execution Mapping

1. **`src/data/profile.ts` & `src/data/projects.ts` & `src/data/journey.ts`**:
   - Update metadata to MATS University Class of 2030, CS50x/CS50P completed.
   - Clean out draft markers and placeholder links.
   - Restructure `ai-study-notes-summarizer` with CLI details, concrete problem, 3-step pipeline, and code excerpt.
2. **`src/sections/Hero.tsx` & `src/components/DeveloperIdCard.tsx`**:
   - Rewrite headline: `I build small, useful tools in Python_`.
   - Eyebrow: `B.TECH CSE (AI/ML) · MATS UNIVERSITY · CLASS OF 2030`.
   - Subhead: `First-year CSE (AI/ML) student at MATS University. CS50x and CS50P completed. Currently building AI tools for studying.`.
   - Remove duplicate GitHub link and loose philosophy box.
   - Demote prober to `Try the terminal › (Quick keyboard-driven portfolio navigation)`.
   - Clean ID card (remove barcode, ensure font sizes $\ge 11\text{px}$, disable 3D tilt under reduced motion).
3. **`src/components/Navbar.tsx` & `src/components/Footer.tsx`**:
   - Navbar brand: `$ raj-golder▌`.
   - Top action: `GitHub ↗` button.
   - Footer: Include theme switch (`Terminal / Blueprint` or `stdout / margin-notes`), remove public CMS link.
4. **`src/sections/Projects.tsx` & `src/components/ProjectCard.tsx` & `src/components/ProjectDialog.tsx`**:
   - Single clean project section.
   - Featured case study card for Summarizer with Python CLI stack, problem, flow, and code block.
   - Single-line ideas note for `PrereqOS` and `Book Recommendation Engine`.
   - "Case study" and "GitHub ↗" button terminology.
5. **`src/sections/Skills.tsx`**:
   - Single unified grid: Languages, Tools, Learning now, with project and coursework attribution.
6. **`src/sections/About.tsx` & `src/sections/Contact.tsx`**:
   - Clean 3-sentence motivation in About with single quote block.
   - Contact with mail icon, copy-email feedback, prompt reply promise, and unlinked `/admin` preservation.
7. **`src/index.css` & Accessibility**:
   - `scroll-margin-top: 4rem` on sections.
   - Font size, contrast, and focus outline auditing.
   - Final `compile_applet` and `lint_applet` verification.
