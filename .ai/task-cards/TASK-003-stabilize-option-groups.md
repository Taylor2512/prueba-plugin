# TASK-003 — Estabilizar option groups

## Objetivo

checkboxGroup, radioGroup y select/dropdown deben compartir contratos sin duplicidad.

## Reglas

- checkboxGroup = multiple.
- radioGroup = single.
- select/dropdown = single compact.
- options internas no son schemas.
- botón + externo solo para grupos, no select.

## Archivos candidatos

```txt
schemas/options/*
schemas/checkbox/index.ts
schemas/checkboxGroup/index.ts
schemas/radioGroup/index.ts
schemas/select/index.ts
GroupOptionFloatingAction.tsx
selectionCommands.ts
```

## Validación

- Agregar opción no mueve grupo.
- Botón + fuera de Moveable.
- DetailView edita options.
- Snapshot preserva optionId/selected.
