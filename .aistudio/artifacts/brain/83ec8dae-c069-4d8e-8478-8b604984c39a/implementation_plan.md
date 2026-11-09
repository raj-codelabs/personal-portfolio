# Codebase Pruning & Redundant UI Cleanup

Eliminate dead code, unused animation hooks, the 662-line splash cover screen, and the redundant 240vh scroll-jacking timeline to deliver an instant-loading, clean, and highly performant portfolio for Raj Golder.

## User Review & Critical Decisions

> [!IMPORTANT]
> The user confirmed the removal of all flagged redundant elements and selected a streamlined single-pass timeline.

- **Confirmed Decision 1 (Unused Hooks Deletion)**: Delete `src/motion/useIntroAnimation.ts` and `src/motion/useScrollReveal.ts` (0 callers across the entire codebase).
- **Confirmed Decision 2 (Splash Cover Pruning)**: Delete `src/components/Cover.tsx` (662 lines), remove its `<Cover />` element from `App.tsx`, and strip the legacy cover-skipping inline script from `index.html`. Users land directly on Raj's hero section without wait times.
- **Confirmed Decision 3 (Timeline Streamlining)**: Delete `src/components/HorizontalSpatialTimeline.tsx` (240vh scroll-hijack container) and simplify `src/sections/Journey.tsx` to render a single, elegant timeline (`StdoutJourney` in dark mode, `MarginNotesJourney` in light mode) without duplicate cards or scroll traps.
- **Confirmed Decision 4 (Hero Logic Simplification)**: Strip `coverSkippedOnLoad` session storage checks from `src/sections/Hero.tsx`, reducing reveal animation complexity to standard lightweight `whileInView` springs.

---

## 1. Overview & Core Concept

- **What It Does**: Strips over 1,000 lines of dead, redundant, or scroll-hijacking code, resulting in an ultra-fast, zero-jank portfolio that respects user scroll velocity and displays content with maximum clarity.
- **Target Audience / Persona**: Recruiters, technical evaluators, and engineering collaborators looking for quick access to Raj's background, coursework milestones, and Python repositories.
- **Key Value**: Instant first paint, natural vertical scrolling (no scroll traps), zero duplicate cards, and a pristine codebase with zero dead imports.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Direct Landing**: Users land immediately on the Hero section with Raj's developer identity, bio, and quick-action buttons.
  2. **Uninterrupted Vertical Scroll**: The page scrolls naturally from Hero → Projects → Journey/Timeline → Skills → About → Contact without 240vh sticky-scroll obstacles.
  3. **Single-Pass Timeline**: The Timeline section presents coursework and software milestones in a single, focused chronological layout with commit hashes, tags, and takeaways.
- **Visual Identity & Theme**:
  - *Dark Mode (`stdout`)*: Terminal aesthetic with authentic branch lines, clean status markers, and tabular data.
  - *Light Mode (`Margin Notes`)*: Archival engineering notebook aesthetic with handwritten margin notes and ruled dividers.
  - *Zero Slop*: No fake compiler versioning, no duplicate inspectors, and no artificial delay timers.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full Deletion of `Cover.tsx`**
  - *Chosen Approach*: Completely remove the 662-line `Cover.tsx` and its references in `App.tsx`, `Hero.tsx`, and `index.html`.
  - *Why*: The cover screen introduced artificial typewriter delays and forced returning visitors to rely on `sessionStorage` checks to bypass it. Direct hero presentation is universally faster and more accessible.
  - *Alternatives Considered*: Retaining a minimized cover banner was rejected as it still adds clutter before the main content.
- **Decision 2: Single-Pass Timeline over Dual Spatial Scroll**
  - *Chosen Approach*: Render milestones once via the dedicated theme components (`StdoutJourney` / `MarginNotesJourney`) and delete `HorizontalSpatialTimeline.tsx`.
  - *Why*: The horizontal spatial timeline hijacked vertical scrolling for 240vh before dumping the user into the exact same milestone list right below it. A single-pass vertical timeline is intuitive on both mobile and desktop.
- **Decision 3: Marking Simplifications with Ponytail Comments**
  - *Chosen Approach*: Mark single-pass layout decisions with `// ponytail: ...` comments noting scalability bounds.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                          App.tsx                            │
│  ├── Navbar (3-Zone Top Bar)                                │
│  ├── Hero (Direct reveal, zero cover dependency)            │
│  ├── Projects (Featured case study + 3-col ProjectCards)    │
│  ├── Journey (Single-pass Stdout / MarginNotes Timeline)     │
│  ├── Skills (Grouped fundamentals & toolchains)             │
│  ├── About & Contact                                        │
│  └── Footer (Quiet copyright + Admin entry)                 │
└─────────────────────────────────────────────────────────────┘
```

- **Execution Steps**:
  1. [x] Delete unused motion hooks: `src/motion/useIntroAnimation.ts` and `src/motion/useScrollReveal.ts`.
  2. [x] Remove `Cover` from `src/App.tsx`, delete `src/components/Cover.tsx`, and clean up `index.html` inline cover script.
  3. [x] Simplify `src/sections/Hero.tsx` to remove `coverSkippedOnLoad` session storage checks and streamline reveal animation props.
  4. [x] Delete `src/components/HorizontalSpatialTimeline.tsx` and simplify `src/sections/Journey.tsx` to render the theme timeline directly.
  5. [x] Run `compile_applet` and `lint_applet` together to verify compilation and linting; restart dev server and test endpoints.
