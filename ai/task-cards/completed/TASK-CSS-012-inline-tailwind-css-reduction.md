# TASK-CSS-012 — Reducir CSS moviendo estilos seguros a Tailwind inline

## Estado

completed

## Objetivo

Reducir CSS repetido desplazando clases visuales seguras a JSX/TSX con Tailwind, sin romper geometría, canvas, Moveable, Selecto, zoom, paper, runtime ni print/PDF.

## Contexto

El repo mantiene CSS real en:

```txt
src/styles/tailwind.css
src/style.css
src/styles/sisad-tailwind-bridge.css
src/features/pdfcomponent/labRoutes.css
src/sisad-pdfme/ui/styles/sisad-pdfme.css
src/sisad-pdfme/ui/styles/tokens.css
```

También existen candidates y reports en `reports/tailwind-migration/**`, que son evidencia, no fuente activa.

## Regla principal

```txt
Migrar a Tailwind inline solo cuando la regla sea visual y esté localizada en un componente JSX/TSX.
No migrar reglas críticas de layout geométrico del PDF/canvas.
```

## Migrable

- Spacing simple.
- Tipografía.
- Borders.
- Rounded.
- Shadows no críticas.
- Flex/grid de paneles no geométricos.
- Estados hover/focus simples.
- Cards, buttons, labels, pills, chips.
- Sidebars e inspector, si la captura baseline no cambia.

## No migrable sin task-card específica

- `.moveable-*`
- `.selecto-*`
- coordenadas PDF
- `transform` de canvas/paper/schema
- `zoom`
- `position:absolute` ligado a PDF coordinates
- scroll principal del canvas
- print/PDF
- variables CSS runtime
- pseudo-elementos complejos
- `content: attr(...)`
- reglas usadas por medición visual o bounding boxes

## Archivos foco inicial

- `src/features/pdfcomponent/*.jsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebar*.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/**/*.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/*.tsx`
- `src/sisad-pdfme/ui/components/CtlBar.tsx`

## Tareas

- [x] Ejecutar `node scripts/css-inventory.mjs`.
- [x] Revisar `reports/tailwind-migration/line-by-line-style-audit.md`.
- [x] Seleccionar máximo 1 componente por pase.
- [x] Migrar solo clases visuales seguras al JSX/TSX.
- [x] Eliminar del CSS solo reglas migradas y comprobadas.
- [x] Actualizar `reports/tailwind-migration/component-migration-ledger.md`.
- [x] Correr pruebas visuales/manuales de sidebars/canvas/runtime.
- [x] No tocar `tokens.css`.

## Estado (2026-07-14, Claude)

- Pase aplicado sobre `RightSidebar/DetailView/CompactConfigPanel.tsx`.
- Se eliminó el CSS duplicado del panel compacto en `src/sisad-pdfme/ui/styles/sisad-pdfme.css`.
- Validado con `npm run build` y smoke e2e del RightSidebar.

## Criterios de aceptación

- Tailwind se importa una sola vez desde `src/styles/tailwind.css`.
- `src/style.css` permanece neutralizado.
- No se duplica CSS antiguo.
- No cambia la geometría del canvas.
- No se rompen screenshots baseline.
