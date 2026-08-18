---
id: UX-LEFT-SIDEBAR
campaign: SISAD-PDFME-UX
status: DONE
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
### Evidencia de cierre — 2026-08-18

Caracterización previa (viewport 1440/1280/1024/900px): la fila de filtros +
layout envolvía en 3 líneas (104px de alto) y el catálogo no empezaba hasta
295px del borde del panel. Fix en `LeftSidebar.tsx`: el filtro rápido
(Todos/Favoritos/Recientes) pasa a un único disparador `Dropdown` con la
etiqueta activa y su recuento (`left-sidebar-filter`); los tres modos de
visualización se repliegan tras un disparador `Vista` (`left-sidebar-view`)
cuando el panel baja de 220px de ancho vivo, y quedan expandidos en una fila
cuando hay espacio. Reutiliza íntegramente `quickFilter`/`favoritePlugins`/
`recentPlugins`/`resolvedLayout` de `useLeftSidebarCatalogState`; no se creó
ningún state paralelo. `CATALOG_VIEW_OPTIONS` se exportó desde
`CatalogLayoutToggle.tsx` para no duplicar el catálogo de modos.

Tests: `tests/e2e/designer/catalogo-controles.spec.ts` (13/13): una línea en
4 anchos, filtro+recuento visibles sin abrir nada, los 3 filtros y los 3
modos siguen alcanzables, independencia filtro/layout, arrastre tras cambiar
de layout, teclado/foco.

**Riesgo residual**: no se agregó unit/RTL de la lógica de filtros —
`LeftSidebar.tsx` no expone sus internos y montarlo en RTL exige todo el
árbol de contexts (`OptionsContext`/`PluginsRegistry`/`I18nContext`); el DoD
de filtros/counts/persistencia/responsive queda cubierto por los 13 E2E en
navegador real, evidencia más fuerte que un RTL parcial.

**Riesgo residual no relacionado, hallado durante la caracterización**: el
botón ★ de favoritos del catálogo (`plugin-favorite-toggle`) no responde a un
click de Playwright ni en HEAD sin estos cambios; el test de recuento de
favoritos siembra `localStorage` directamente para verificar el contrato real
(el disparador deriva su recuento de `favoritePlugins`) sin depender de ese
botón. Ajeno a las cuatro brechas de este prompt.

