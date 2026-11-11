# Visual Hierarchy Audit & Anti-Slop Detail Polish

Execute a comprehensive visual hierarchy audit and craft polish across Raj Golder's entire public portfolio (Hero, Projects, Journey, Skills, About, Contact, Navbar, Footer) based on the Uizze Anti-UI-Slop design guidelines.

## User Review & Critical Decisions

> [!IMPORTANT]
> The audit focuses on eliminating AI slop artifacts, refining typographic hierarchy, establishing intentional section rhythm, and polishing micro-interactions across both Dark (`stdout`) and Light (`margin-notes`) modes.

- **Confirmed Decision 1 (Typographic Hierarchy & Headline Containment)**: Apply `text-wrap: balance` to all section headers, refine display scales (`clamp(2rem, 4.5vw, 3.5rem)`), and ensure clear contrast deltas between H1/H2 titles, body copy, and metadata across both modes.
- **Confirmed Decision 2 (Eradicating Mechanical Prefixes & Clutter)**: Replace mechanical prefixes like `SYS-01` in `ProjectCard.tsx` with clean, human editorial numbering or direct project identities. Ensure all metadata uses unboxed text with subtle `·` separators (zero-pill discipline).
- **Confirmed Decision 3 (Skills & About Spatial Polish)**: Replace nested bordered boxes with airy whitespace margins and subtle hairline dividers (`border-[var(--border-subtle)]`). Align credentials and certifications cleanly into an authentic academic ledger.
- **Confirmed Decision 4 (Form & Interactive Touch Targets)**: Polish the Contact form inputs with consistent focus-visible rings, 44px minimum touch targets, and inline validation states without layout shifts.

---

## 1. Overview & Core Concept

- **What It Does**: Upgrades the entire portfolio from an assembly of components into a cohesive, high-craft editorial monograph. Every section looks intentionally designed by a senior designer with domain-native visual taste.
- **Target Audience / Persona**: Recruiters, engineering hiring managers, professors, and open-source peers reviewing Raj Golder's work.
- **Key Value**: Elimination of generic AI aesthetics (no cards-in-cards, no mechanical tags, no fake status indicators), replaced by authentic typography, deliberate spatial math, and crisp interactive states.

---

## 2. User Experience & Visual Design

- **Key User Flows & Section Polish**:
  1. **Navbar (Top Bar Contract)**: Single-line brand wordmark (`Raj Golder`), 4 concise text links with hover underlines, and the circular ripple theme toggle.
  2. **Hero Section**: Refined split layout: left column contains the academic degree kicker, balanced H1 headline, and primary action buttons; right column displays the developer identity card / sketch reveal.
  3. **Projects Showcase**: Featured case study stage followed by a balanced 3-column project grid with clean titles, problem statements, tech tags (`·` separated), and case study triggers.
  4. **Timeline & Journey**: Single-pass chronological milestone rail with commit hashes, tags, and takeaways.
  5. **Skills Matrix**: Clean 3-group matrix (Languages, Tooling, Learning Now) with clear evidence lines rather than bulky nested boxes.
  6. **About & Background**: Narrative personal statement paired with an academic credentials card.
  7. **Contact**: Streamlined direct inquiry form with copy-to-clipboard email and social links.
- **Visual Identity & Theme Tokens**:
  - *Dark Mode (`stdout`)*: Canvas `#11151c`, surfaces `#1a202c`, signal cobalt `#3b82f6`, and oxidized copper `#b87333`.
  - *Light Mode (`margin-notes`)*: Canvas `#f6f5f1` with archival paper grid, crisp white surfaces `#ffffff`, and deep royal blue `#1d4ed8`.
  - *Spatial Math*: Section vertical padding `py-16 sm:py-20`, container padding `px-4 sm:px-6 lg:px-8`, button horizontal padding $\approx 2\times$ vertical.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Zero-Pill Metadata Strictness**
  - *Chosen Approach*: Render project tags, statuses, and dates as quiet inline text separated by typographic dots (`·`).
  - *Why*: Colored pill badges on cards create visual noise and scream AI template. Clean typography creates an editorial monograph aesthetic.
- **Decision 2: Hairline Dividers over "Cards-Inside-Cards"**
  - *Chosen Approach*: Separate list items and sub-groups using subtle hairline rules (`border-b border-[var(--border-subtle)]`) and whitespace rather than nesting bordered rectangles.
  - *Why*: Eliminates cramped visual density and preserves single-elevation hierarchy.
- **Decision 3: Marking Simplifications with Ponytail Comments**
  - *Chosen Approach*: Add `// ponytail: ...` comments on intentionally simple data formats.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                          Navbar                             │
│   Brand Wordmark  —  Projects · Journey · Skills · About  —  ThemeToggle │
└─────────────────────────────┬───────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Hero Section                          │
│   • Kicker: B.Tech CSE (AI/ML) · Class of 2030              │
│   • Headline: Balanced display type                         │
│   • Primary CTAs + Right Column: Developer ID Card          │
└─────────────────────────────┬───────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Featured Case Study & Grid                 │
│   • AI Study Notes Summarizer Interactive Stage             │
│   • 3-Column Project Cards with unboxed metadata            │
└─────────────────────────────┬───────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               Journey & Academic Milestones                 │
│   • Chronological single-pass timeline with commit hashes   │
└─────────────────────────────┬───────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Skills, About, and Contact                  │
│   • Airy grouped lists with evidence lines                  │
│   • Background narrative & credentials ledger               │
│   • Direct contact form with 0-shift inline validation      │
└─────────────────────────────────────────────────────────────┘
```

- **Execution Steps**:
  1. [x] Polish `src/components/ProjectCard.tsx`: remove `SYS-01` mechanical prefix, refine card padding and typography, and ensure metadata uses clean unboxed text.
  2. [x] Polish `src/sections/Hero.tsx`: ensure balanced headline text wrapping, refine subheadings and button dimensions.
  3. [x] Polish `src/sections/Skills.tsx`: streamline grouping layout, eliminate visual clutter, and improve evidence text readability.
  4. [x] Polish `src/sections/About.tsx` and `src/sections/Contact.tsx`: verify typographic hierarchy, input touch targets, and contrast ratios.
  5. [x] Verify with `compile_applet` and `lint_applet` together, restart dev server, and test endpoints.
