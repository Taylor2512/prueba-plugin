# TASK-LAB-019 — Normalizar catálogo `labExamples`

Estado: completed

## Objetivo
Dividir `labExamples.js` en data declarativa + registry + builders.

## Tareas
- Crear `labs/examples/createLabExample.ts`.
- Crear `labs/examples/labExampleRegistry.ts`.
- Mover ejemplos grandes a `labs/examples/catalog/*.ts`.
- Cambiar `getLabExamples/getLabExampleById/getLabExampleByPath` para usar registry.

## Criterios
- No se duplican recipients dentro de runtimeOptions y collaboration.
- `labExamples.js` queda como façade o desaparece.
