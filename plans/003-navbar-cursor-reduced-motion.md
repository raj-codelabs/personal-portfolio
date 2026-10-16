# Plan 003: Terminal Cursor Accessibility & Reduced Motion Guard

**Commit Target**: `working-tree` (uncommitted)  
**Status**: Ready for execution  
**Component**: `src/components/Navbar.tsx`  
**Severity**: HIGH (Accessibility / WCAG compliance violation)  
**Category**: Accessibility / Continuous animation  

---

## 1. Context & Rationale

In `src/components/Navbar.tsx` (line 47), the terminal wordmark in `stdout` mode features an animated blinking cursor:
```tsx
<span className="inline-block w-1.5 h-3.5 bg-[#58a6ff] animate-pulse ml-0.5" aria-hidden="true" />
```
Because `animate-pulse` runs indefinitely in a persistent sticky header, it violates WCAG 2.2 Success Criterion 2.2.2 (Pause, Stop, Hide) for users who have requested reduced motion at the OS level (`prefers-reduced-motion: reduce`). Continuous movement in the peripheral vision field can cause severe discomfort for users with vestibular disorders or ADHD.

This plan adds strict reduced-motion gating (`motion-reduce:animate-none`), while keeping the subtle pulse active for users who have not requested reduced motion.

---

## 2. Shared Motion Vocabulary

- **Utility**: `animate-pulse` (Tailwind standard opacity pulse)
- **Reduced Motion Guard**: `motion-reduce:animate-none`
- **Fallback Static State**: Solid block cursor with steady opacity (`1.0`).

---

## 3. Current Code Excerpt

File: `src/components/Navbar.tsx` (Lines 43–50)

```tsx
43:  {isStdout ? (
44:    <span className="flex items-center gap-1.5">
45:      <span className="text-[#3fb950]">$</span>
46:      <span>whoami</span>
47:      <span className="inline-block w-1.5 h-3.5 bg-[#58a6ff] animate-pulse ml-0.5" aria-hidden="true" />
48:    </span>
49:  ) : (
```

---

## 4. Exact Implementation Steps

1. In `src/components/Navbar.tsx` at line 47, update the `className` attribute to append `motion-reduce:animate-none`:
   ```tsx
   <span
     className="inline-block w-1.5 h-3.5 bg-[#58a6ff] animate-pulse motion-reduce:animate-none ml-0.5"
     aria-hidden="true"
   />
   ```

2. Verify in `src/index.css` that `@media (prefers-reduced-motion: reduce)` rules properly scope Tailwind's motion variants.

---

## 5. Scope Boundaries

- **DO NOT** remove the terminal cursor in standard viewing mode.
- **DO NOT** modify the brand name or navigation links in `Navbar.tsx`.

---

## 6. Verification & Feel-Check

1. **Standard Mode**: In normal browser conditions, verify the cursor pulses softly in the navbar in `stdout` mode.
2. **Reduced Motion Check**: Emulate `prefers-reduced-motion: reduce` in Chrome DevTools > Rendering.
   - Verify that the cursor is solid blue and does not animate or flicker.
