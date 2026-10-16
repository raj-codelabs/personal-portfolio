# Dual-Theme Engineering Portfolio: `stdout` & `margin-notes`

A personal engineering portfolio for **Raj Golder**, a 1st-year B.Tech Computer Science student specializing in Artificial Intelligence and Machine Learning. The website features an architecture that supports two distinct, cohesive visual identities sharing a single typed data layer: **`stdout`** (a developer terminal aesthetic with an interactive command prompt and an SVG Git DAG timeline) and **`margin-notes`** (an archival field notebook with Playfair Display typography, ink-line spine, and margin annotations).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The foundational decisions below incorporate your answers from Phase 1 and define the boundaries of the implementation:
>
> - **Student Identity & Domain Focus**: Built for **Raj Golder, B.Tech CSE (AI/ML) · 1st Year**. Projects and skills focus on computer science fundamentals (C/C++, Data Structures, Python), linear algebra/calculus for ML, and introductory machine learning implementations.
> - **Exactly Two Themes**: Strict dual-theme system (`stdout` and `margin-notes`) with automatic system-preference detection (`dark` → `stdout`, `light` → `margin-notes`) and `localStorage` persistence. No hidden, easter-egg, or third themes.
> - **Interactive Terminal in `stdout`**: The dark terminal hero features an interactive command prompt supporting real portfolio operations (e.g., `help`, `projects`, `journey`, `theme`, `clear`, `contact`, `whoami`).
> - **Visual Dualism**: Rather than simple CSS color inversions, the two themes render completely different visual languages: a raw Git-commit DAG timeline in dark mode vs. an ink-and-paper archival notebook timeline in light mode.

---

## 1. Overview & Core Concept

- **What It Does**: Presents a student engineer's technical profile, curated projects, developmental milestone timeline, core technical skills, and engineering philosophy across two distinct visual presentations.
- **Target Audience**: Technical recruiters, professors, research mentors, open-source maintainers, and engineering peers.
- **Key Value**: Communicates technical curiosity, dedication to fundamentals, and engineering craft through high-fidelity, accessible frontend design rather than generic portfolio templates.

---

## 2. User Experience & Visual Design

### Visual Identity Comparison

```
┌───────────────────────────────────────┬───────────────────────────────────────┐
│ stdout (Dark Terminal Mode)           │ margin-notes (Light Editorial Mode)   │
├───────────────────────────────────────┼───────────────────────────────────────┤
│ Canvas: #0d1117 (GitHub Dark / Unix) │ Canvas: #fbf7ee (Archival Paper)      │
│ Surface: #161b22                      │ Surface: #ffffff (Field Cards)        │
│ Borders: #30363d                      │ Borders: #e3ded2 (Subtle Ruled Lines) │
│ Accent: #58a6ff (Terminal Blue)       │ Accent: #0d5c6e (Deep Ink Teal)       │
│ Secondary: #3fb950 (Terminal Green)   │ Secondary Accent: #8a5a00 (Ochre)     │
│ Typography: JetBrains Mono / Fira     │ Typography: Playfair Display + DM Sans│
│ Timeline: SVG Git-style DAG graph     │ Timeline: Vertical spine + [LOG #nn]  │
│ Hero: Window chrome + Command Bar     │ Hero: Asymmetric editorial columns    │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

### Key User Flows

1. **Initial Arrival & Theme Resolution**:
   - The app detects `prefers-color-scheme`. If dark, it mounts as `stdout`; if light, as `margin-notes`.
   - If the user previously chose a theme, their stored choice in `localStorage` takes precedence.
   - The theme toggle in the header smoothly switches the root data attribute `data-theme="stdout" | "margin-notes"` and flips design tokens without layout flickering.
2. **Interactive Exploration in `stdout`**:
   - Visitors can read the hero or interact with the command bar (e.g., typing `projects` or clicking suggested chips like `$ ls -la projects` scrolls directly to the section or prints data).
   - In the **Journey** section, milestones appear as an interactive SVG Git branch graph with commit hashes (clearly marked as illustrative milestones). Clicking a commit node opens a `git show`-style inspection drawer.
3. **Reading Flow in `margin-notes`**:
   - The hero adopts an archival field journal layout with serif display typography and quiet metadata.
   - In the **Journey** section, the entries are numbered `[LOG #01]` through `[LOG #06]` along a delicate ink spine with margin commentary and expandable entry summaries.
4. **Project Deep-Dive Modal**:
   - Clicking "Inspect Project Details" on any card opens a fully accessible modal dialog (ESC key, focus trapped, returning focus to trigger button) detailing the problem, architecture, stack, and key learnings.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Native SVG Git Graph vs. Canvas Library**
  - *Chosen Approach*: Hand-crafted, responsive SVG component with semantic path elements and keyboard-navigable `<circle>` and `<text>` nodes.
  - *Why*: Eliminates heavy external charting libraries, guarantees zero layout shift, allows direct CSS custom property styling for themes, and ensures complete screen-reader accessibility via SVG title tags and ARIA labels.
- **Decision 2: Centralized Typed Data Layer**
  - *Chosen Approach*: Separate pure data files (`profile.ts`, `projects.ts`, `journey.ts`, `skills.ts`) consumed identically by both themes.
  - *Why*: Guarantees that neither theme ever drifts out of sync or fabricates alternate facts, fulfilling the strict single-source-of-truth requirement.
- **Decision 3: Zero-Pill Design Discipline**
  - *Chosen Approach*: Render tech stacks and metadata as unboxed typographic lists with middle dots (`C++ · Python · PyTorch · Git`), reserving button styling strictly for interactive controls.
  - *Why*: Adheres to anti-slop guidelines and prevents the dated "candy pill" look common in AI-generated sites.

---

## 4. Technical Architecture & Data Strategy

### System Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Root Application (App.tsx)                      │
│                [ ThemeContext: stdout | margin-notes ]                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌───────────────────────┐                         ┌───────────────────────┐
│     Shared Shell      │                         │  Central Data Store   │
│  - Skip Link          │                         │  - profile.ts         │
│  - Top Navbar         │◄─── Reads Data ─────────│  - projects.ts        │
│  - Footer             │                         │  - journey.ts         │
│  - ProjectDialog      │                         │  - skills.ts          │
└──────────┬────────────┘                         └───────────────────────┘
           │
           ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Section Flow (#home .. #contact)                │
│                                                                        │
│  1. HeroSection                                                        │
│     ├─ stdout: Terminal Window Chrome + Interactive Command Prompt     │
│     └─ margin-notes: Editorial Serif Layout + Field Introduction       │
│                                                                        │
│  2. ProjectsSection (#projects)                                        │
│     ├─ stdout: Console Buffer Cards with Dot Tech Delimiters           │
│     └─ margin-notes: Clean Index Cards with Editorial Marginalia       │
│                                                                        │
│  3. JourneySection (#journey)                                          │
│     ├─ stdout: StdoutGitGraph (Responsive SVG Directed Acyclic Graph)   │
│     └─ margin-notes: MarginNotesTimeline (Ink-Spine Journal Entries)   │
│                                                                        │
│  4. SkillsSection (#skills)                                            │
│     ├─ Systems & Languages (C, C++, Python, Shell, Git)               │
│     ├─ Machine Learning Foundations (NumPy, Math for ML, PyTorch)      │
│     └─ Tools & Environments (Linux, VS Code, Make, Jupyter)            │
│                                                                        │
│  5. AboutSection (#about)                                              │
│     └─ Background, 1st Year Journey, Curiosity & Engineering Principles│
│                                                                        │
│  6. ContactSection (#contact) & Footer                                 │
│     └─ Verified Email, GitHub, LinkedIn Links + Dynamic Year           │
└────────────────────────────────────────────────────────────────────────┘
```

### Verification & Testing Plan

1. **Compilation & Linting**: Verify clean TypeScript compilation (`tsc`) and Vite build without warnings or broken imports.
2. **Dual-Theme Fidelity**:
   - Test toggle between `stdout` and `margin-notes`.
   - Verify all color tokens update cleanly on root (`data-theme`).
   - Verify `localStorage` persistence across page reloads.
   - Verify OS preference initialization (`prefers-color-scheme`).
3. **Interactive Features**:
   - Test terminal command input (`help`, `projects`, `journey`, `theme`, `clear`, `contact`).
   - Test Git DAG milestone selection and `git show` inspector panel.
   - Test Notebook timeline entry expansion.
   - Test project detail modal: open, ESC key to close, close button, focus return.
4. **Accessibility & Responsive Checks**:
   - Keyboard Tab order and visible focus rings in both themes.
   - Test on 320px mobile viewport, 768px tablet, and 1440px desktop.
   - Check contrast ratios against WCAG 2.2 AA standards.
