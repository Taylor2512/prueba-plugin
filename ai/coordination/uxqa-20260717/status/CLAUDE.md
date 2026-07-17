# STATUS — CLAUDE

## task activa
W1-CLAUDE-RS-SCROLL

## worktree
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-claude (ai/claude-uxqa-20260717)

## archivos owned (Wave 1)
- src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx
- src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx
- tests/playwright/right-sidebar-detail-scroll.spec.ts
- tests/playwright/right-sidebar-docs-tab.spec.ts

## objetivo
Restablecer un solo scroll owner por panel (contrato min-h-0/overflow del plan §3.2).
Preservar header y tabs, sin reinicio de scroll por keypress, sin overflow horizontal.
Validar Fields, Detail, Docs y Comments. NO rediseño profundo de cards todavía.

## hora de inicio
2026-07-17

## tests previstos
- npx playwright test tests/playwright/right-sidebar-detail-scroll.spec.ts --project=chromium
- npx playwright test tests/playwright/right-sidebar-docs-tab.spec.ts --project=chromium
- lint focal sobre archivos owned

## estado
handoff entregado (CLAUDE-W1.md) — commit fa8221f. Lock liberado.
Rol integrador: EN ESPERA (hold) para gate Wave 1.

Realineación 2026-07-17:
- main: cuarentena OK (ya estaba limpio; patch rogue vacío) — ver CLAUDE-QUARANTINE-MAIN.md
- Copilot: LISTO (ab52464 + 14ff144 fix canónico labExamples.js)
- Claude: LISTO (fa8221f)
- Codex: NO LISTO (rama vacía; falta hooks-only). ÚNICO bloqueo.
- readiness: ver CLAUDE-INTEGRATION-W1-READINESS.md
- No inicio Wave 2. No hago polish visual. Espero commit+handoff de Codex.
