# ECHO Interactive Architecture & Editorial Physics Integration

A sequential engineering plan to integrate high-fidelity editorial features from the ECHO portfolio architecture into Raj Golder's developer portfolio. This plan adapts 7 key interactive systems—Orbital Preloader, Editorial Hero with metallic shaders, ScrollExpandMedia Kinetic Canvas, Horizontal Spatial Canvas timeline, WorksWheel 3D Drum Reel, WebGL Liquid displacement, and Dynamic Modal Inspection—while strictly maintaining Raj's authentic identity as a first-year CSE student and honoring the dual-theme contract (`stdout` technical workstation vs `margin-notes` archival engineering notebook).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural plan directly incorporates your confirmed preferences and design boundaries:
>
> 1. **Sequential Phased Implementation**: All adapted ECHO systems will be implemented in four sequential phases, verifying stability and build health at each milestone.
> 2. **Theme Allocation (Strict Divergence)**:
>    - **`stdout` (Dark Terminal / Workstation)**: Receives the full computational and mathematical instrument suite—mathematical 3D cylindrical WorksWheel projection, WebGL liquid mesh refraction (lightweight shader canvas), hardware-accelerated kinetic expand canvas, and orbital vector preloader.
>    - **`margin-notes` (Light Paper Notebook)**: Deliberately preserves the quiet, tactile feel of a physical engineer's drafting notebook. 3D drums and liquid chromatic shaders are cleanly disabled in favor of an archival drafting compass preloader, an unfolding ledger timeline, and physical blueprint cards.
> 3. **Preloader Session Lifecycle**: The preloader runs once per session via `sessionStorage` (`echo_preloader_seen`), with a quick replay trigger accessible in the footer and smooth `requestAnimationFrame` cleanup.
> 4. **Authentic First-Year Engineering Identity**: No exaggerated senior-engineer claims or generic corporate fluff. The graphics, shaders, and 3D reels showcase Raj's passion for mathematical beauty, computational physics, and clean code (Python, C, CS50x/CS50P).
> 5. **Accessibility & Zero-Lag Physics**: All motion systems respect `prefers-reduced-motion` and Apple WWDC fluid interface principles (zero-delay pointer response, spring physics via Motion 12, interruptible gestures).

---

## 1. Overview & Core Concept

- **What It Builds**: Transforms Raj Golder's portfolio from a static layout into an editorial kinetic experience. Combines precision typography with hardware-accelerated spatial mechanics:
  - **Orbital Preloader**: Mathematical orbital wavy wave dot system with session persistence.
  - **Editorial Hero & Metallic Shaders**: Dynamic fluid typography (`clamp` / `vw`) paired with subtle metallic luminance gradient shifts and code-depth layering.
  - **ScrollExpandMedia Kinetic Canvas**: Scroll-driven expansion of the featured case study (AI Study Notes Summarizer) from a compact specimen card into a full-bleed inspection canvas.
  - **Horizontal Spatial Experience Canvas**: Converts vertical page scroll in `#journey` into horizontal spatial progression along an engineering track graph.
  - **WorksWheel 3D Drum Reel (`stdout` mode)**: Mathematical 3D cylindrical drum projection with smooth pointer drag, inertia momentum, and keyboard navigation.
  - **FlexCarousel WebGL Liquid Displacement (`stdout` mode)**: Lightweight interactive canvas overlay simulating subtle optical liquid lens refraction on hover/drag.
  - **Dynamic Specimen Modal**: Expanded deep-dive modal featuring verified Python CLI architecture, token pipelines, and trade-off notes.

---

## 2. User Experience & Visual Design

### Visual Hierarchy & Theme Matrix

| Feature | `stdout` (Terminal Workstation) | `margin-notes` (Engineering Notebook) | Reduced Motion Fallback |
| :--- | :--- | :--- | :--- |
| **Preloader** | Orbital wavy coordinate matrix + ASCII boot probe | Compass drafting circle animation with warm ink stroke | Instant fade-in (150ms opacity transition) |
| **Editorial Hero** | Dynamic typography with metallic luminance shimmer | Hand-inked headline style (`Newsreader`), pencil grid | Static high-contrast typography |
| **Expand Stage** | Kinetic scale & unblur GPU interpolator | Clean responsive accordion expand | Static expanded view |
| **Timeline Canvas** | Sticky horizontal coordinate track progression | Unfolding horizontal engineering ledger | Vertical timeline list |
| **WorksWheel Reel**| Cylindrical 3D drum reel (`rotateX`, `translateZ`) | Editorial flat grid with index numbers | Accessible 2D grid with keyboard navigation |
| **Liquid Lens** | Real-time WebGL chromatic aberration & wave bending | Flat archival paper textures (no WebGL overhead) | Disabled |
| **Project Modal** | Technical spec sheet, terminal ASCII log, CLI flags | Handwritten margin notes, paper ticket style | Instant non-animated dialog |

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: WebGL Overhead vs Performance Budget**
  - *Chosen Approach*: Implement WebGL liquid distortion using a lightweight native canvas shader (~2KB custom fragment shader) rather than importing heavy three.js or monolithic libraries.
  - *Why*: Keeps bundle size minimal, loads instantly, and runs at 60–120 FPS on mobile and low-power laptops without dropped frames.
- **Decision 2: Scroll Hijacking vs Natural Sticky Scrubbing**
  - *Chosen Approach*: Use CSS `position: sticky` and native viewport scroll tracking (`useScroll` from Motion 12) for the Horizontal Spatial Canvas rather than hijacking the browser's native wheel event.
  - *Why*: Eliminates rubber-banding bugs and trackpad friction, ensuring native gesture momentum feels smooth and predictable.
- **Decision 3: Dual-Mode Isolation for WorksWheel 3D Reel**
  - *Chosen Approach*: Render WorksWheel in `stdout` mode while providing a responsive editorial card grid in `margin-notes` mode.
  - *Why*: Directly honors the user's requirement to protect the quiet, analog paper feel of `margin-notes` while letting `stdout` shine as a high-tech developer workstation.
- **Decision 4: Mobile & Touch Gestures**
  - *Chosen Approach*: WorksWheel and Expand Canvas automatically adapt to horizontal swipe gestures on touch viewports with momentum deceleration and boundary spring bounce.

---

## 4. Technical Architecture

### Component Hierarchy & Interaction Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│ EchoPreloader (sessionStorage check -> Orbital Canvas -> Dissolve)     │
├────────────────────────────────────────────────────────────────────────┤
│ App Container (Theme Provider: stdout | margin-notes)                  │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Navbar ($ raj-golder▌, Nav links, Status indicator, GitHub ↗)      │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ EditorialHero (Metallic shader text shimmer + Fluid clamp type)     │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ ProjectsSection:                                                   │ │
│ │   ├── ScrollExpandMedia (Kinetic unblur stage for Summarizer)      │ │
│ │   ├── [If stdout] WorksWheel3D (Cylindrical 3D Drum Reel)          │ │
│ │   └── [If margin-notes] EditorialGrid (Archival Specimen Cards)    │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ JourneySection:                                                    │ │
│ │   └── HorizontalSpatialCanvas (Sticky vertical-to-horizontal scrub)│ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ SkillsSection (Evidence-based tooling matrix, zero pill tags)      │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ AboutSection (CS50x/CS50P journey, first-principles philosophy)    │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ ContactSection (Prompt email copy feedback, clean terminal mail)   │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ Footer (Theme switcher, session preloader replay button, copyright)│ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ ProjectInspectionModal (Deep-dive specs, CLI flags, pipeline breakdown)│
└────────────────────────────────────────────────────────────────────────┘
```

### Sequential Implementation Phases

```
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Orbital Preloader & Editorial Hero Enhancements               │
│ • Implement EchoPreloader with sessionStorage session cache.           │
│ • Build dual-mode animation: Orbital dot wave (stdout) / Drafting      │
│   compass arc (margin-notes).                                          │
│ • Enhance Hero with metallic luminance shader text and dynamic clamp   │
│   fluid typography.                                                    │
│ • Add preloader replay button in the footer for easy demonstration.    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ Phase 2: Horizontal Spatial Timeline Canvas                            │
│ • Rebuild #journey with sticky vertical-to-horizontal scrub.           │
│ • stdout: Interactive coordinate track graph with pulse nodes.         │
│ • margin-notes: Unfolding horizontal archival ledger.                  │
│ • Full accessible vertical fallback for prefers-reduced-motion.        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ Phase 3: ScrollExpandMedia Kinetic Canvas Stage                        │
│ • Implement ScrollExpandMedia stage for AI Study Notes Summarizer.     │
│ • Scrub card geometry, border radius, and dual-layer GPU unblur.       │
│ • Deep project inspection modal with interactive CLI pipeline tabs.    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ Phase 4: WorksWheel 3D Drum Reel & WebGL Liquid Shaders (stdout only)  │
│ • Implement mathematical 3D cylindrical drum (rotateX / translateZ).   │
│ • Drag physics with momentum inertia, wheel steps, and touch support.  │
│ • Add lightweight WebGL liquid displacement shader on card hover.      │
│ • Preserve flat archival layout in margin-notes; verify build & audit. │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Verification & Testing Strategy

- **Build & Compilation**: Run `compile_applet` and `lint_applet` after each phase to guarantee zero TypeScript or CSS regressions.
- **Session Lifecycle**: Verify `sessionStorage` correctly prevents preloader re-triggering on navigation while allowing manual replay via the footer action.
- **Theme Invariance**: Test theme toggle dynamically to ensure 3D canvas and WebGL shaders instantiate cleanly in `stdout` and tear down without memory leaks when switching to `margin-notes`.
- **Accessibility & Motion**: Verify full responsiveness across desktop, tablet, and mobile, with instant non-kinetic rendering under `prefers-reduced-motion: reduce`.
