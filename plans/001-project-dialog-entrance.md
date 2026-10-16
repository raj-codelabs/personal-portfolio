# Plan 001: Project Dialog Scale and Opacity Entrance

**Commit Target**: `working-tree` (uncommitted)  
**Status**: Ready for execution  
**Component**: `src/components/ProjectDialog.tsx`  
**Severity**: HIGH (Feel-breaking / jarring modal pop)  
**Category**: Purpose & frequency / Preventing a jarring change  

---

## 1. Context & Rationale

In `src/components/ProjectDialog.tsx`, when a user selects a project card from `src/sections/Projects.tsx`, the dialog mounts conditionally into the DOM. Currently, the backdrop and dialog window appear and disappear instantaneously without transition (`backdrop-blur-xs transition-opacity` is present on line 84, but has no starting styles or transition duration, resulting in a 0ms snap).

This plan adds a restrained, non-blocking 200ms scale-and-fade entrance for the modal card and 180ms fade for the backdrop using CSS transitions and `@starting-style` (or Tailwind transition classes), with full compliance for `prefers-reduced-motion: reduce`.

---

## 2. Shared Motion Vocabulary

- **Primary Easing Token**: `cubic-bezier(0.16, 1, 0.3, 1)` (established in `src/index.css:70`)
- **Duration Scale**:
  - Modal overlay backdrop: `180ms`
  - Dialog card container: `200ms`
- **Transforms**:
  - Initial state: `opacity: 0; transform: scale(0.97);`
  - Settled state: `opacity: 1; transform: scale(1);`
  - Transform origin: `transform-origin: center`
- **Reduced Motion**: Under `@media (prefers-reduced-motion: reduce)`, omit `scale` entirely; transition `opacity` only over `150ms ease-out`.

---

## 3. Current Code Excerpt

File: `src/components/ProjectDialog.tsx` (Lines 81–98)

```tsx
81:  return (
82:    <div
83:      role="presentation"
84:      onClick={onClose}
85:      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs transition-opacity"
86:    >
87:      <div
88:        ref={dialogRef}
89:        role="dialog"
90:        aria-modal="true"
91:        aria-labelledby="dialog-title"
92:        aria-describedby="dialog-description"
93:        onClick={(e) => e.stopPropagation()}
94:        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border shadow-xl p-6 sm:p-8 transition-colors ${
95:          isStdout
96:            ? 'bg-[#161b22] border-[#30363d] text-[#e6edf3]'
97:            : 'bg-[#ffffff] border-[#e3ded2] text-[#302d29]'
98:        }`}
99:      >
```

---

## 4. Exact Implementation Steps

1. In `src/components/ProjectDialog.tsx`, introduce a local mount state or CSS animation classes to ensure the element animates upon entering the DOM.
2. For pure CSS / Tailwind v4 without external libraries:
   Add entry transition classes or inline keyframes to the modal backdrop and dialog panel:
   - Backdrop (outer `div` at line 85):
     ```tsx
     className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs transition-opacity duration-180 ease-[cubic-bezier(0.16,1,0.3,1)] animate-in fade-in"
     ```
   - Dialog window (`div` at line 94):
     ```tsx
     className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border shadow-xl p-6 sm:p-8 transition-[transform,opacity,background-color,border-color,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-reduce:animate-in motion-reduce:fade-in origin-center ${
       isStdout
         ? 'bg-[#161b22] border-[#30363d] text-[#e6edf3]'
         : 'bg-[#ffffff] border-[#e3ded2] text-[#302d29]'
     }`}
     ```
3. Verify that `origin-center` is explicitly declared so the modal expands symmetrically from the center of the viewport, not top-left.
4. Verify that focus trap and keyboard event listeners (`Escape`, `Tab`) continue to function without delay during and after the 200ms transition.

---

## 5. Scope Boundaries

- **DO NOT** add bounce, spring physics, or overshoot.
- **DO NOT** animate from `scale(0)` or `scale(0.8)` — initial scale must be subtle (`0.95`–`0.97`).
- **DO NOT** modify the project data schema or dialog content layout.
- **DO NOT** delay unmounting with arbitrary `setTimeout` unless using an exiting transition wrapper; clean 200ms entrance is the primary requirement.

---

## 6. Verification & Feel-Check

1. **Slow-Motion Inspection**: In Chrome DevTools > Rendering > Animations, throttle motion to 10% (10x slow motion). Click any project card "Inspect Dossier".
   - Confirm the dark scrim fades smoothly in 180ms.
   - Confirm the card emerges from `scale(0.97)` to `1.0` in 200ms with zero jitter or layout jumping.
2. **Reduced Motion Check**: Emulate `prefers-reduced-motion: reduce` in DevTools Rendering panel.
   - Click "Inspect Dossier".
   - Confirm the modal fades in with zero scaling transformation.
3. **Esc Key Check**: Press `Escape`. Ensure the modal closes promptly without hanging or trapping focus.
