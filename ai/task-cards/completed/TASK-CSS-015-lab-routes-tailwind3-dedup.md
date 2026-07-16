# TASK-CSS-015 — Reducir `labRoutes.css` después del refactor

Estado: active

## Objetivo
Eliminar CSS duplicado del host lab solo después de mover UI segura a JSX/Tailwind 3.

## Tareas
- No tocar canvas/zoom/geometry.
- Migrar skin seguro de PageHeader, CaseCard, PopoverMenu, ResultsPanel.
- Conservar reglas de layout crítico.

## Criterios
- Menos selectores duplicados y sin regresión visual.
