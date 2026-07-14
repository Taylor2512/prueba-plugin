# TASK-PDFME-012 — Continuidad de wiring de visibility config

## Estado

backlog

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

- `visibility.actions.reassign=false` oculta Reasignar.
- `assignment.enabled=false` oculta Reasignar aunque visibility sea true.
- `visibility.sidebars.right.panels.comments=false` oculta comentarios.
- `visibility.inspector.sections.advanced=false` oculta Técnico.
- No quedan secciones vacías en DetailView.
