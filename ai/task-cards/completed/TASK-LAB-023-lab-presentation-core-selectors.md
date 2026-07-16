# TASK-LAB-023 — Reemplazar reglas duplicadas en `labPresentation`

Estado: completed

## Objetivo
Evitar que el lab calcule por su cuenta visible/editable/locked.

## Tareas
- Exportar/usar selectors públicos del core para owner/access si ya existen.
- Reescribir `getLabCollaborationSummary` para no duplicar lock/readOnly/owner rules.
- Agregar tests unitarios con lock mío, lock de otro, objectLocked, readonly, shared owner.

## Criterios
- Los counters del header coinciden con canvas/list/detail.
