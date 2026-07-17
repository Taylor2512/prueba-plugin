# Plan 01 — Wave 1.5

## Meta

Cerrar fallos de contratos y tests antes de modificar diseño.

## Codex

- resolveNonOverlappingDropPosition.
- CheckboxGroup roundtrip.
- optionId estable.
- signature validation.
- browser downloads.
- PDFField/PDFButton focal.

## Claude

- HELP ReferenceError.
- editable matrix.
- property maps.
- RadioGroup advanced fields.
- action family.
- CtlBar contract.

## Copilot

- AntD theme resolution.
- tests stale de wrappers retirados.
- smoke imports.
- host lab.
- sin patch a node_modules.

## Gate

```bash
npm run lint
npm run build
npx vitest run
npx playwright test   tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts   tests/playwright/right-sidebar-detail-scroll.spec.ts   tests/playwright/right-sidebar-docs-tab.spec.ts   --project=chromium
```

## Cierre

Cero fallos no clasificados.
