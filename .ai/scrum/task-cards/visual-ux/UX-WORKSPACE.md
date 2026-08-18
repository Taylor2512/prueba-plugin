---
id: UX-WORKSPACE
campaign: SISAD-PDFME-UX
status: BACKLOG
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
