# TASK-LAB-027 — Lab canvas-first shell JSX handoff

**Estado:** completed

## Objetivo
Corregir el diseño de `/lab/multi-document-routing` después de la migración a wrappers públicos, moviendo clases visuales seguras a JSX/TSX y reduciendo la dependencia de `labRoutes.css` sin romper el layout base del diseñador.

## Alcance
- Ajustar `PdfmeLabPage`, `PageHeader`, `CompactControls`, `PopoverMenu` y `ResultsPanel` para que declaren más de su shell visual directamente.
- Reducir `labRoutes.css` a media queries, pseudo-elementos y fallback visual mínimo.
- Mantener el diseñador base intacto.

## Fuera de alcance
- No tocar `Moveable`.
- No tocar `Selecto`.
- No tocar zoom math.
- No tocar canvas geometry interna.
- No tocar paper/page transform.
- No tocar `Generator`/`pdf-lib`.
- No usar `z-index` hacks.

## Archivos foco
- `src/features/pdfcomponent/PdfmeLabPage.jsx`
- `src/features/pdfcomponent/PageHeader.jsx`
- `src/features/pdfcomponent/CompactControls.jsx`
- `src/features/pdfcomponent/PopoverMenu.jsx`
- `src/features/pdfcomponent/ResultsPanel.jsx`
- `src/features/pdfcomponent/integration/createLabPdfmeConfig.ts`
- `src/features/pdfcomponent/labRoutes.css`
- `src/sisad-pdfme/ui/constants.ts`

## Validación
- `npm run build`
- `npm run dev`
- `npx playwright test tests/playwright/lab-designer-visual-baseline-regression.spec.ts`

## Cierre
- El header compacto quedó por debajo del umbral visual esperado.
- El menú de controles quedó compacto y el drawer de resultados no empuja el canvas.
- `labRoutes.css` quedó más reducido y concentrado en fallback/medios.

