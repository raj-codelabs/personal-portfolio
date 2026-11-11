# System Context & Architecture Model

## 1. Executive Summary

This codebase is a full-stack engineering portfolio and content management system for **Raj Golder**, a first-year Computer Science & Engineering (AI/ML) undergraduate student. It adheres to strict company-grade layout, performance, accessibility, and visual guidelines inspired by `figma.com` and `x.ai`.

---

## 2. Technology Stack

- **Runtime & Language**: Node.js 22+, TypeScript 5+, React 19.
- **Frontend Build**: Vite 8, Tailwind CSS v4, Motion (`motion/react`).
- **Backend**: Express 4 server (`server.ts`) hosting REST endpoints and Vite middleware in development.
- **Persistence**: SQLite database stored at `.data/portfolio.db` (initialized automatically via `src/server/db.ts`).
- **Icons & Visuals**: Real full-colour brand SVGs (`TechIcons.tsx`), Lucide React icons, and animated canvas/SVG computational pipelines (`PipelineDiagram.tsx`).

---

## 3. Core Modules & Responsibilities

### Frontend Layers (`/src`)

- **Root Routing & State Orchestration**:
  - `src/App.tsx`: Handles public viewport vs `#admin` authentication views, synchronizes dynamic HTML `<title>` and metadata.
  - `src/context/ThemeContext.tsx`: Manages active theme state (`stdout` terminal workstation vs `margin-notes` physical laboratory notebook).
  - `src/context/CmsContext.tsx`: Caches and hydrates public portfolio data from `/api/public/portfolio`, falling back to static fixtures in `src/data/`.
  - `src/context/AdminAuthContext.tsx`: Manages HTTP-only cookie session authentication and credentials verification for the admin panel.

- **Primary Page Sections (`/src/sections`)**:
  - `Hero.tsx`: Screen 1 entrance with `data-enter`. Features category declaration, hard credentials (MATS University, CS50x/CS50P certified), verb+object hero CTAs, and interactive `DeveloperIdCard`.
  - `Projects.tsx`: Signature software application frame (`ScrollExpandMedia.tsx`) demonstrating the *AI Study Notes Summarizer* with real-time token budgeting and ANSI terminal deck, followed by all build cards.
  - `Skills.tsx`: Full-colour brand icons for Python, C, Git, VS Code, Linux/Bash, CS50, and the multi-lane computational pipeline diagram (`PipelineDiagram.tsx`).
  - `Journey.tsx`: Dual-theme timeline engine (`StdoutJourney.tsx` directed acyclic graph vs `MarginNotesJourney.tsx` archival vertical spine).
  - `About.tsx`: Narrative approach, educational credentials card, and core principles quote block.
  - `Contact.tsx`: Direct correspondence form with inline validation, contact cards adhering to district-only location rules (`Raipur District, India`), and `.example` email routing.

- **Interactive Components (`/src/components`)**:
  - `Navbar.tsx`: Sticky navigation with scroll-spy active indicator, theme toggle, and keyboard accessibility.
  - `Footer.tsx`: Single-line licensing credits, admin portal entry, and verified links.
  - `DeveloperIdCard.tsx`: Student credential card with zero-tilt physical rotation, 1.025x photo zoom, and keyboard toggle.
  - `PipelineDiagram.tsx`: SVG architecture visual showcasing 1 input, 1 core processor, 3 parallel lanes, and active traveling pulse particles.
  - `ProjectDialog.tsx`: Modal dossier with multi-tab inspection (pipeline, CLI args, engineering trade-offs, source code).

### Backend Layers (`/src/server`)

- `server.ts`: Application entry point. Mounts `/api` routers, serves static upload assets from `public/uploads`, and mounts Vite dev middleware.
- `src/server/db.ts`: SQLite schema initialization and automatic default seeding.
- `src/server/auth.ts`: Admin session generation, SHA-256 password verification, and authentication middleware (`requireAdmin`).
- `src/server/routes/cmsRoutes.ts`:
  - `GET /api/public/portfolio`: Published data for the public page.
  - `POST /api/contact/messages`: Public inquiry submission.
  - `GET/PUT/POST/DELETE /api/cms/*`: Authenticated administrator CRUD routes for projects, skills, milestones, settings, and messages.
- `src/server/routes/mediaRoutes.ts`: Avatar and project screenshot upload management via `multer` and image processing via `sharp`.

---

## 4. Key Architectural Invariants & Rules

1. **Screen Height Discipline**: Every section is 1 or 2 screens tall at 1440×900. Hero occupies Screen 1 alone with no peeking headings.
2. **Motion Layer Invariants**:
   - Linked cards lift 2px (`hover:-translate-y-[2px]`).
   - Photos zoom 1.02–1.03× (`group-hover:scale-[1.025]`).
   - Action buttons step on hover (`hover:-translate-y-[1px]`) and press on click (`active:translate-y-[1px] active:scale-[0.98]`).
   - Zero scroll-based opacity fade-ins (`whileInView` opacity fades are strictly forbidden).
   - Under reduced motion (`prefers-reduced-motion: reduce`), all animations collapse to instantaneous transitions.
3. **Information & Contact Discipline**:
   - Location is district-only (`Raipur District, India`). No postal codes, coordinates, or street numbers.
   - External inquiries routed to `contact@rajgolder.example`. No real phone formats.
   - Single licence credit line in the footer.
