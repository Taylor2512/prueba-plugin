# TASK-CSS-014 — Tailwind 3: deduplicación visual actual y polish

- Estado: active
- Agente principal: css-tailwind-agent
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Continuar `TASK-CSS-013` sin reabrirla. Reducir selectores repetidos moviendo skin visual seguro a TSX con Tailwind 3. Corregir diseño actual del rail derecho, panel switcher, ListView, LeftSidebar y toolbar inferior.

## Archivos foco

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/**/*.tsx
src/sisad-pdfme/ui/components/Designer/LeftSidebar*.tsx
src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx
src/sisad-pdfme/ui/components/CtlBar.tsx
src/sisad-pdfme/ui/styles/sisad-pdfme.css
src/features/pdfcomponent/labRoutes.css
scripts/css-active-selector-audit.mjs
reports/tailwind-migration/**
```

## Pasos

```txt
1. Ejecutar `node scripts/css-active-selector-audit.mjs`.
2. Trabajar por componente, máximo 1 zona por pase:
   a. right-sidebar collapsed rail
   b. right-sidebar panel switcher
   c. ListView item/card skin
   d. LeftSidebar compact rail
   e. bottom zoom toolbar
3. Migrar a Tailwind 3 solo:
   - flex/grid de paneles no geométricos
   - padding/margin visual
   - border/radius/shadow
   - hover/focus-visible
   - chips/pills/cards/buttons
4. Eliminar del CSS solo reglas migradas y comprobadas.
5. Mantener `tokens.css`.
6. No usar sintaxis Tailwind 4.
7. Actualizar `reports/tailwind-migration/component-migration-ledger.md`.
```

## Criterios de aceptación

```txt
[ ] El rail derecho colapsado se ve estable y no invade el canvas.
[ ] El botón Guardar no parece parte del rail derecho.
[ ] El panel switcher no muestra borde negro.
[ ] ListView separa owner accent de selected state.
[ ] Zoom trigger muestra `90%`, no `0.9`.
[ ] CSS activo reduce duplicados sin tocar geometría crítica.
```

## Validación

```bash
node scripts/css-active-selector-audit.mjs
npm run build
npx playwright test tests/playwright/canvas-overflow-regression.spec.ts
npx playwright test tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts
```

## Notas / guardrails

No tocar `.moveable-*`, `.selecto-*`, transform, zoom math, paper/canvas geometry, print/PDF ni tokens.
