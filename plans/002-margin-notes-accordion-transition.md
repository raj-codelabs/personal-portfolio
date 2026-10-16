# Plan 002: Margin Notes Milestone Accordion Height & Opacity Transition

**Commit Target**: `working-tree` (uncommitted)  
**Status**: Ready for execution  
**Component**: `src/themes/MarginNotesJourney.tsx`  
**Severity**: MEDIUM (Noticeably abrupt content snapping)  
**Category**: Missed opportunities / State indication  

---

## 1. Context & Rationale

In `src/themes/MarginNotesJourney.tsx`, each milestone entry card has an expand/collapse toggle (`ChevronUp` / `ChevronDown` button at lines 70–82). When clicked, the deep research notes and field learnings (`lines 89–120`) mount or unmount conditionally via `{isExpanded && <div className="mt-4 pt-3 ...">}`.

Currently, this conditional render causes an abrupt instantaneous height jump, violently shifting all following cards and timeline spine markers down the page.

This plan converts the abrupt snap into a smooth `grid-template-rows: 0fr` → `1fr` interpolation with child opacity crossfade over 200ms using the repo's easing token `cubic-bezier(0.16, 1, 0.3, 1)`, and rotates the chevron icon instead of unmounting and remounting separate SVG components.

---

## 2. Shared Motion Vocabulary

- **Primary Easing Token**: `cubic-bezier(0.16, 1, 0.3, 1)` (`src/index.css:70`)
- **Duration Scale**:
  - Grid row expansion: `200ms`
  - Content fade: `160ms`
  - Chevron rotation: `160ms`
- **Transforms**:
  - Chevron unexpanded: `transform: rotate(0deg)`
  - Chevron expanded: `transform: rotate(180deg)`
- **Reduced Motion**: Under `@media (prefers-reduced-motion: reduce)`, set duration to `0ms` or perform opacity-only crossfade over `100ms ease`.

---

## 3. Current Code Excerpt

File: `src/themes/MarginNotesJourney.tsx` (Lines 66–93)

```tsx
66:  <div className="flex items-start justify-between gap-4">
67:    <h3 className="text-base sm:text-lg font-serif font-bold text-[#302d29] leading-snug">
68:      {m.title}
69:    </h3>
70:    <button
71:      onClick={() => toggleExpand(m.id)}
72:      aria-expanded={isExpanded}
73:      aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${m.logNumber}`}
74:      className="p-1 rounded text-[#686158] hover:text-[#0d5c6e] hover:bg-[#fbf7ee] transition-colors cursor-pointer shrink-0"
75:    >
76:      {isExpanded ? (
77:        <ChevronUp className="w-4 h-4" />
78:      ) : (
79:        <ChevronDown className="w-4 h-4" />
80:      )}
81:    </button>
82:  </div>
83:
84:  {/* Summary */}
85:  <p className="text-xs sm:text-sm font-sans text-[#686158] leading-relaxed mt-2">
86:    {m.summary}
87:  </p>
88:
89:  {/* Expandable Deep Details */}
90:  {isExpanded && (
91:    <div className="mt-4 pt-3 border-t border-[#e3ded2] space-y-3 text-xs font-sans">
```

---

## 4. Exact Implementation Steps

1. Replace the conditional component swap of `ChevronUp`/`ChevronDown` with a single `ChevronDown` that transitions rotation:
   ```tsx
   <button
     onClick={() => toggleExpand(m.id)}
     aria-expanded={isExpanded}
     aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${m.logNumber}`}
     className="p-1 rounded text-[#686158] hover:text-[#0d5c6e] hover:bg-[#fbf7ee] transition-colors cursor-pointer shrink-0"
   >
     <ChevronDown
       className={`w-4 h-4 transition-transform duration-160 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
         isExpanded ? 'rotate-180' : 'rotate-0'
       }`}
       aria-hidden="true"
     />
   </button>
   ```

2. Replace the hard conditional `{isExpanded && (...)}` with a CSS grid accordion wrapper that preserves DOM presence for smooth CSS height interpolation:
   ```tsx
   <div
     className={`grid transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:duration-0 ${
       isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
     }`}
   >
     <div className="overflow-hidden">
       <div
         className={`mt-4 pt-3 border-t border-[#e3ded2] space-y-3 text-xs font-sans transition-opacity duration-160 ease-[cubic-bezier(0.16,1,0.3,1)] ${
           isExpanded ? 'opacity-100' : 'opacity-0'
         }`}
       >
         <div>
           <div className="font-bold text-[#302d29] mb-1">Observation & Context:</div>
           <p className="text-[#686158] leading-relaxed">{m.details}</p>
         </div>

         <div>
           <div className="font-bold text-[#0d5c6e] mb-1">Field Learnings:</div>
           <ul className="space-y-1 list-disc list-inside text-[#686158]">
             {m.learnings.map((learning, idx) => (
               <li key={idx}>
                 <span className="text-[#302d29]">{learning}</span>
               </li>
             ))}
           </ul>
         </div>

         <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 text-[#8d857a] font-mono text-[11px]">
           {m.tags.map((tag, idx) => (
             <React.Fragment key={tag}>
               {idx > 0 && <span>·</span>}
               <span>{tag}</span>
             </React.Fragment>
           ))}
         </div>
       </div>
     </div>
   </div>
   ```

---

## 5. Scope Boundaries

- **DO NOT** use JavaScript interval loops or layout measuring (`getBoundingClientRect()`) for height animation; use pure CSS `grid-template-rows`.
- **DO NOT** animate outer margins or paddings directly. The `overflow-hidden` container isolates height layout changes cleanly.
- **DO NOT** alter the timeline spine indicator geometry or node positioning.

---

## 6. Verification & Feel-Check

1. **Expansion Rhythm**: Click the toggle button repeatedly.
   - Confirm the content expands naturally in ~200ms without sticking or clipping text prematurely.
   - Confirm the chevron rotates 180 degrees synchronously with the expansion.
2. **Rapid Retargeting**: Click expand, then click collapse halfway through (at ~100ms).
   - Ensure the CSS transition retargets smoothly back to closed state without jumping or breaking the layout.
3. **Reduced Motion**: Enable `prefers-reduced-motion` in Chrome DevTools.
   - Click the toggle. Confirm immediate state expansion without animated slide.
