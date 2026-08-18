---
id: UX-LEFT-SIDEBAR
campaign: SISAD-PDFME-UX
status: BACKLOG
priority: P1
depends_on: []
---
# UX-LEFT-SIDEBAR — Catálogo y drag/drop

## Objective
Consolidar shell, búsqueda, filtros, layouts, grupos, custom fields y feedback de drag/drop.

## Absorbs
VISUX-013..017 y COREUX-023.

## Acceptance
- un catálogo/registry;
- búsqueda/filtros/layout sin estados paralelos;
- custom fields y auto-fields bajo capability actual;
- preview/drop setup determinista;
- sin duplicar placement/collision authority.

<!-- designer-ux-hardening:start -->
## Refinamiento activo — controles compactos del catálogo

Reducir la altura consumida por `Todos/Favoritos/Recientes` y los modos de visualización sin duplicar state.

### Dirección

- reutilizar quickFilter/favoritos/recientes/layout existentes;
- densidad normal: filtro + layouts en una fila;
- densidad mini: filtro + control `Vista` con disclosure;
- búsqueda visible;
- counts dinámicos;
- expansión del chrome efímera salvo contrato explícito;
- ARIA, teclado, foco y tooltips obligatorios;
- no degradar drag preview ni catálogo.

### DoD

- unit/RTL: filtros, counts, persistencia, responsive, layout controlado/manual;
- Playwright: ancho/estrecho, disclosure, tres filtros, tres layouts, favorite mutation, keyboard/focus y drag después de cambiar layout;
- no remount, no pérdida de scroll, no card-in-card.
<!-- designer-ux-hardening:end -->
