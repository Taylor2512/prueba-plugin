---
id: UX-WORKSPACE
campaign: SISAD-PDFME-UX
status: DONE
priority: P1
depends_on: []
---
# UX-WORKSPACE — Responsive shell, viewport, toolbar y overlays

## Objective
Converger responsive state, sidebars shell, scroll/zoom anchor, toolbar contextual y overlays.

## Absorbs
VISUX-005,006,007,011,012 y COREUX-020,021,022,042,043.

## Acceptance
- una autoridad responsive;
- selección/zoom/scroll no se pierden al cambiar layout;
- overlays con stacking/collision policy única;
- touch/keyboard sin duplicar comportamiento;
- no remount por cambios puramente presentacionales.

<!-- designer-ux-hardening:start -->
## Refinamiento activo — selección regional y cuadrícula

### Selección regional

- Tratar `DesignerCoordinateService` como autoridad de conversión; no compensar zoom/scroll en múltiples componentes.
- El rect visual de Selecto y el hit-test deben representar exactamente el mismo espacio.
- Scope de página/documento se fija al inicio del gesto según el contrato actual.
- No capturar option internals, overlays, inputs ni handles como schemas independientes.

**DoD**
- unitarios de conversión zoom/scroll/paper offset/reverse drag;
- Playwright con bounding boxes + IDs seleccionados en 50/75/100/125/150/200 %;
- sidebars, scroll, multipágina y access policy cubiertos.

### Cuadrícula

- Mantener grid en espacio de página/mm.
- Cada paper activo debe recibir estado efectivo y variables CSS requeridas.
- `grid` y `snapToGrid` permanecen capacidades independientes.

**DoD**
- unitarios de capabilities/geometry;
- Playwright verifica `data-grid-visible`, CSS vars y `background-image` real en paper;
- toggle, zoom, padding, multipágina y grid/snap independientes.
<!-- designer-ux-hardening:end -->
### Evidencia de cierre — 2026-08-18

**Cuadrícula.** Causa raíz doble: (1) la capa de rejilla competía por
`background-image` con el fondo de página que `Paper` escribe inline —el
estilo inline gana siempre, así que `data-grid-visible='true'` cambiaba de
estado sin pintar nada; (2) `Designer.canvasFeatureToggles` enumeraba ocho
claves a mano y perdía `rulers`/`snapToGrid`/`objectSnap`/`guideCreation`/
`guideSnap`, que llegaban `undefined` al canvas. Fix: la rejilla ahora vive en
su propia capa `::before` (`sisad-pdfme.css`), y `canvasFeatureToggles`
recorre `CANVAS_VIEW_CAPABILITIES` en vez de listarlas (`Designer/index.tsx`).
Tests: `tests/e2e/designer/grid-geometry.spec.ts` (14/14, incluye 6 nuevos de
presentación efectiva) + `tests/unit/contracts/canvas/canvasViewCapabilities.test.ts`
(12/12).

**Selección por región.** Causa raíz: `Selecto` recibía `rootContainer`
apuntando al contenedor con scroll del canvas; en ese modo dibuja el
rectángulo con `position:absolute` trasladado en coordenadas de viewport, así
que un canvas desplazado (`scrollTop>0`) desalineaba el marquee respecto al
hit-test, que sigue en viewport. Fix: se omite `rootContainer` en
`Canvas.tsx` (Selecto cae a `position:fixed`, mismo espacio que el hit-test).
Tests: `tests/e2e/designer/seleccion-region.spec.ts` (11/11: 6 niveles de
zoom, 3 de scroll, reverse-drag, aislamiento de opciones internas) +
`tests/unit/contracts/canvas/regionSelectionCoordinates.test.ts` (7/7).

**Regresión**: `npm run lint`, `npm run typecheck`, `npm run build` y
`tests/e2e/designer/*` (69/69 Chromium) en verde. Riesgos residuales: ver
`.ai/plans/DESIGNER-UX-HARDENING.md`.

