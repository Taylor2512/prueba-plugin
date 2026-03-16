# UI / UX Review — PDFME Designer (summary)

Date: 2026-03-14

## High-level findings
- Duplicated modules: `DocumentsRail.js` (JSX in .js) caused HMR/import errors; existing `.jsx` version kept.
- Designer composite responsibilities: `Designer/index.tsx` bundles runtime, UI, and state orchestration — candidate to split into subhooks and smaller components.
- Repeated visual patterns: badges, floating toolbars, sidebar cards.
- Accessibility gaps: missing `focus-visible` on selectable items; toolbar semantics could be standardized.
- Layout tokens: spacing/shadows/colors partly scattered between `final-classes.css` and theme tokens.

## Prioritized issues
1. Stop-build duplicate (JSX-in-.js) — fixed.
2. Accessibility: focus outlines and keyboard operability — partially fixed (badges, selectables).
3. UI duplication: centralize floating toolbar and badges — `BadgeChip` and `FloatingToolbar` added.
4. Designer file complexity: plan for hook extraction (next iteration).

## Suggested next iteration
- Extract `FloatingToolbar` and `SidebarCard` fully across components.
- Introduce CSS tokens in `pdfme-improved.css` and migrate local rules.
- Create small library of microcomponents: `BadgeChip`, `FloatingToolbar`, `SidebarCard`, `IconButton`.

## Quick checklist for maintainers
- [x] Remove JSX-in-.js duplicates
- [x] Add `BadgeChip` microcomponent
- [x] Add `FloatingToolbar` microcomponent and apply to selection overlay
- [x] Improve colors and focus outlines for keyboard users
- [ ] Plan `Designer` refactor and hook extraction

## Test coverage suggestions
- Add unit tests for `BadgeChip` and `FloatingToolbar` rendering and ARIA attributes.
- Add E2E tests asserting keyboard navigation (tab / Enter) selects and opens properties.

---
