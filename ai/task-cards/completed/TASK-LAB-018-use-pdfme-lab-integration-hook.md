# TASK-LAB-018 — `usePdfmeLabIntegration` como orquestador único

Estado: completed

## Objetivo
Crear un hook que normalice template, recipients, documents, inputs, config, actions y artifacts.

## Tareas
- Crear `src/features/pdfcomponent/hooks/usePdfmeLabIntegration.ts`.
- Crear `integration/normalizeLabHostData.ts`.
- Crear `integration/createLabPdfmeConfig.ts`.
- Eliminar `commonOptions` armado manualmente en `PdfmeLabPage.jsx`.

## Criterios
- Recipients y documents entran una sola vez.
- Active recipient fluye por config/props y controller.

## Cierre
- `usePdfmeLabIntegration` centraliza la normalización de template, recipients, documents, inputs, config y artifacts.
- `PdfmeLabPage.jsx` dejó de armar `commonOptions` manualmente y consume la integración única.
