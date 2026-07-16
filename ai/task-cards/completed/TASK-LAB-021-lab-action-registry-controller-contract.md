# TASK-LAB-021 — Action registry para botones del lab

Estado: completed

## Objetivo
Que cada botón visible consuma un descriptor de acción y no lógica local repetida.

## Tareas
- Crear `integration/labActionRegistry.ts`.
- Convertir acciones de `CompactControls.jsx` en descriptors.
- Cada action incluye visible/enabled/disabledReason/run/testId.
- Generator/converter viven en `labArtifactService`.

## Criterios
- `CompactControls.jsx` no construye listas de acciones con reglas propias.
