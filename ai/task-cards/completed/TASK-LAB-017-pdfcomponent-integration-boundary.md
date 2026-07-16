# TASK-LAB-017 — Frontera de integración en `pdfcomponent`

Estado: completed

## Objetivo
Eliminar el uso de internals del core desde `src/features/pdfcomponent`.

## Tareas
- Auditar `DesignerEngineBuilder`, `usePdfmeRuntimeInstance`, decorators de colaboración y `setTimeout`.
- Definir qué imports del core son públicos aceptados.
- Crear reporte `ai/reports/pdfcomponent-integration-boundary.md`.

## Criterios
- `PdfmeLabPage.jsx` no usa `DesignerEngineBuilder` ni `usePdfmeRuntimeInstance`.
- Los ejemplos muestran API pública, no internals.

## Cierre
- Se emitió `ai/reports/pdfcomponent-integration-boundary.md` con la frontera pública aceptada para el host del laboratorio.
- `PdfmeLabPage.jsx` ya no usa `usePdfmeRuntimeInstance` ni `DesignerEngineBuilder`.
