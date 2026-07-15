# TASK-PDFME-012 — Continuidad de wiring de visibility config

## Estado

completed

## Objetivo

Completar la conexión de `visibility` en todo el componente sin crear props sueltos ni lógica duplicada.

## Contexto

La configuración global ya existe, pero cada componente debe consumir una fuente resuelta común.

## Áreas

- LeftSidebar
- RightSidebar
- ListView
- DetailView
- Canvas overlays
- Context menu
- Selection toolbar
- SchemaDropSetupModal
- Runtime Form
- Viewer

## Reglas

- `enabled` significa que la capacidad existe.
- `visible` significa que se muestra.
- `allowed` significa que el usuario puede ejecutarla.
- No mostrar UI si la acción no está conectada.
- No duplicar condiciones de visibility en múltiples componentes; crear view models/resolvers.

## Criterios

- [x] `visibility.actions.reassign=false` oculta Reasignar.
- [x] `assignment.enabled=false` oculta Reasignar aunque visibility sea true.
- [x] `visibility.sidebars.right.panels.comments=false` oculta comentarios.
- [x] `visibility.inspector.sections.advanced=false` oculta Técnico.
- [x] No quedan secciones vacías en DetailView.

## Estado (2026-07-14, Claude)

- Se creó un resolver compartido de visibilidad para el diseñador en `shared/visibilityConfig.ts`.
- `ListViewToolbar` y `detailSchemas` consumen la misma lectura del config.
- Se agregaron pruebas de `advanced` y visibilidad total del inspector.
