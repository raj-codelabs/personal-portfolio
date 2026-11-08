# Frontend Performance Optimization & Codebase Simplification

Streamline Raj Golder's engineering portfolio by stripping out heavy, unrequested WebGL/canvas simulation leftovers, eliminating blocking preloader delays, removing pseudo-technical clutter, and establishing an instant, clean, and highly responsive user experience.

## User Review & Critical Decisions

> [!IMPORTANT]
> The primary objective is code simplification and frontend performance optimization under the "Lazy Senior Developer" ethos (minimal diffs, deletion over addition, zero unrequested abstractions).

- **Confirmed Decision 1 (Preloader Removal)**: Completely remove `EchoOrbitalPreloader` (400 lines of canvas simulation with artificial 2.4-second boot latency). The portfolio will render directly upon initial visit with zero layout shifts or modal blocking.
- **Confirmed Decision 2 (Generative Shader Cleanup)**: Delete `LiquidMeshCanvas` (WebGL fragment shader) and streamline `Projects.tsx` to focus on the high-clarity project grid and featured case study, retiring the redundant 3D reel abstraction.
- **Confirmed Decision 3 (Anti-Slop Restoration)**: Remove mechanical pseudo-technical tags (e.g. `COORDS // MATS UNIV · SYS_CLOCK: 120Hz · COMPILED`) in favor of authentic, human academic credentials.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms the portfolio from a heavy, animation-strained bundle into a lightning-fast, accessible showcase of Raj Golder's first-year CSE achievements, Python tools, and academic journey.
- **Target Audience / Persona**: Recruiters, professors, engineering peers, and technical collaborators who value clarity, direct access to code repositories, and fast page loads without gimmicks.
- **Key Value**: 0ms blocking latency, zero background WebGL draw calls, reduced memory footprint, and crystal-clear presentation of real engineering projects.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Instant First Paint**: The user lands on the portfolio and immediately sees Raj's hero section, developer identity, and core mission without waiting for simulated terminal loading screens.
  2. **Direct Project Exploration**: The Projects section presents the featured AI Study Notes Summarizer case study followed by a responsive 3-column grid of Python and C tools, complete with tags, architecture summaries, and live GitHub repo links.
  3. **Seamless Dual Theme**: Clean contrast in both Light ("Margin Notes" paper aesthetic) and Dark ("stdout" terminal aesthetic) modes without jank or dropped frames.
- **Visual Identity & Theme**:
  - *Typography*: Monospace accents for code and terminal elements (`JetBrains Mono`), warm editorial serif for notes (`Newsreader`), and clean geometric sans for UI prose (`Plus Jakarta Sans`).
  - *Color Palette*: 60% neutral canvas (`#0d1117` in dark, `#fbf7ee` in light), 30% structural surfaces and hairline borders, 10% high-contrast accents (signal cobalt `#1d4ed8` / terminal emerald `#00e5c0`).
  - *Anti-Slop Restraint*: Clean unboxed metadata (`·` separators), no fake telemetry tickers, no artificial status dots, and no redundant view-switcher modes.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Direct Canvas Deletion over Pausing**
  - *Chosen Approach*: Fully remove `EchoOrbitalPreloader` and `LiquidMeshCanvas` instead of adding flags or toggles.
  - *Why*: The best code is code never written or executed. Removing 600+ lines of unused canvas and WebGL shaders permanently prevents frame drops and memory leaks on mobile devices.
  - *Alternatives Considered*: Retaining the preloader behind an admin toggle was rejected as unnecessary cognitive overhead.
- **Decision 2: Standard Grid View as Canonical Showcase**
  - *Chosen Approach*: Render projects exclusively in a structured, accessible CSS grid with full keyboard navigation and dialog details.
  - *Why*: The 3D reel mode added CSS perspective complexity and depended on the WebGL liquid canvas. A clean grid ensures all projects are visible at a glance without pagination or rotation.
- **Decision 3: Marking Simplifications with Ponytail Comments**
  - *Chosen Approach*: Add `// ponytail: ...` comments on intentionally simple data lookups and local states for clean documentation.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       Browser Client                        │
│                                                             │
│  ┌──────────────────┐  ┌─────────────────┐  ┌────────────┐  │
│  │   Hero Section   │  │ Projects (Grid) │  │  Journey   │  │
│  │  (Identity & Bio)│  │ (Direct Cards)  │  │ & Skills   │  │
│  └─────────┬────────┘  └────────┬────────┘  └─────┬──────┘  │
│            │                    │                 │         │
│            ▼                    ▼                 ▼         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          CMS Context / Static Fallback Data           │  │
│  └──────────────────────────┬────────────────────────────┘  │
└─────────────────────────────┼───────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Express Server                         │
│   • /api/health (Instant JSON prober)                       │
│   • /api/cms (Fast SQLite read-through)                     │
└─────────────────────────────────────────────────────────────┘
```

- **Execution Steps**:
  1. Remove `EchoOrbitalPreloader` reference and DOM node from `src/App.tsx`, and delete `src/components/EchoOrbitalPreloader.tsx`.
  2. Simplify `src/sections/Projects.tsx`: remove `WorksWheel3D` and `viewMode` toggle; render the featured case study followed by the clean `ProjectCard` grid. Delete `LiquidMeshCanvas.tsx` and `WorksWheel3D.tsx`.
  3. Clean `src/sections/Hero.tsx`: remove mock hardware/clock metadata lines.
  4. Verify with `compile_applet` and `lint_applet` to guarantee zero errors and clean build output.
