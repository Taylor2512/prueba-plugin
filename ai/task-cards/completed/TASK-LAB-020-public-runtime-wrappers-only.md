# TASK-LAB-020 — Usar wrappers públicos de runtime

Estado: completed

## Objetivo
Renderizar Designer/Form/Viewer desde wrappers públicos, no desde runtime interno.

## Tareas
- Reemplazar `usePdfmeRuntimeInstance` en el host del lab.
- Usar `SisadPdfmeDesigner`, `SisadPdfmeForm`, `SisadPdfmeViewer` según mode.
- Si falta una capacidad, abrir tarea de export público en core; no importar internals.

## Criterios
- `src/features/pdfcomponent` no conoce `DesignerEngineBuilder`.

## Cierre
- `PdfmeLabPage.jsx` ya renderiza `SisadPdfmeDesigner`, `SisadPdfmeForm` y `SisadPdfmeViewer` desde la API pública.
- El host dejó de importar `usePdfmeRuntimeInstance` y validó build + smoke del docs tab.
