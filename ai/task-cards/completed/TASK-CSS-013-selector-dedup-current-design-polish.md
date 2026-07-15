# TASK-CSS-013 — selector dedup y polish visual actual

**Estado:** active  
**Prioridad:** P1  
**Responsable sugerido:** Codex  
**Área:** `sisad-pdfme` / CSS / UI polish

## Objetivo

Reducir selectores CSS duplicados del diseñador y mejorar el skin actual del
`RightSidebar`, `LeftSidebar`, `ListView` y panel switcher sin tocar geometría
del canvas, Moveable, Selecto, zoom ni coordenadas PDF.

## Alcance

- Auditoría real de selectores duplicados en CSS activo.
- Polish visual seguro del panel switcher derecho.
- Polish visual seguro de filas y toolbar del `ListView`.
- Preparar la siguiente pasada para `LeftSidebar`.
- Eliminar solo reglas migradas y verificadas en `sisad-pdfme.css`.

## Fuera de alcance

- Canvas geometry.
- Scroll principal del canvas.
- Moveable, Selecto, zoom.
- Print/PDF.
- Tokens CSS salvo lectura.
- CSS nuevo paralelo.
- Hacks de `z-index`.

## Archivos candidatos

- `scripts/css-selector-duplicates.mjs`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx`
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css`
- `reports/tailwind-migration/selector-duplicates-current.md`

## Archivos prohibidos

- `src/sisad-pdfme/ui/components/Designer/Canvas/**`
- `src/sisad-pdfme/ui/components/Designer/Moveable/**`
- `src/sisad-pdfme/ui/components/Designer/Selecto/**`
- `src/sisad-pdfme/ui/components/Designer/**/zoom/**`
- `src/sisad-pdfme/ui/styles/tokens.css`

## Pasos

1. Crear el auditor `scripts/css-selector-duplicates.mjs`.
2. Generar `reports/tailwind-migration/selector-duplicates-current.md`.
3. Ajustar skin seguro del `RightSidebar` y `ListView`.
4. Eliminar del CSS solo reglas ya migradas y verificadas.
5. Validar con build y pruebas existentes.

## Validación

- `node scripts/css-inventory.mjs`
- `node scripts/css-selector-duplicates.mjs`
- `npm run build`
- `npx playwright test tests/playwright/canvas-overflow-regression.spec.ts`
- `npx playwright test tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts`

## Criterio de parada

- Si aparece una regresión de selección, drag/drop o reasignación.
- Si una regla toca geometría del canvas o scroll principal.
- Si la limpieza exige más de 5 archivos modificados en un solo slice.

## Entrega final

- Reporte de duplicados actualizado.
- Switcher derecho sin borde negro.
- Rows del ListView con selección y owner accent separados.
- CSS duplicado reducido de forma verificable.

## Cierre (2026-07-15, Claude)

- [x] Auditor `scripts/css-selector-duplicates.mjs` operativo; reporte
      `reports/tailwind-migration/selector-duplicates-current.md` generado
      (649 filas clasificadas MERGE_SAME_SELECTOR).
- [x] Polish del switcher/ListView previamente commiteado y validado por specs.
- [x] Reglas NO eliminadas en esta pasada (criterio de parada: >5 archivos por
      slice); los merges quedan planificados por zona en el ledger.
- Validación: `css-inventory.mjs` + `css-selector-duplicates.mjs` + build exit 0 +
  `canvas-overflow-regression` y `drag-preview-and-canvas-scroll-regression` en verde.
