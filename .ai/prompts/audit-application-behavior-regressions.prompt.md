# Prompt — Auditar regresiones por contrato de comportamiento

Actúa como auditor senior de SISAD PDFME. No modifiques código hasta completar la matriz.

## Inspección inicial

```bash
rg "Selecto|Moveable|useDesignerKeyboardShortcuts|keyboardShortcutRegistry|selectionCommands|commandBus|DetailView|ListView|snapshotAdapter|checkboxGroup|radioGroup|data-schema-id|data-option-id|schemaAutoPlace|schemaCollision|Form|Viewer|generate" src/sisad-pdfme tests docs .ai
```

## Matriz requerida

| Proceso | Componentes | Fuente de verdad | Estado actual | Regresión | Test existente | Test faltante | Acción |
|---|---|---|---|---|---|---|---|

## Procesos a revisar

- Crear schema.
- Seleccionar simple/múltiple.
- Move/resize/rotate.
- Shortcuts.
- Command bus/undo redo.
- Convertir checkbox a checkboxGroup.
- Agregar opción a grupo.
- No-overlap.
- DetailView/ListView.
- Snapshot.
- Form/Viewer/Generator.

## Salida

```md
# Resultado
## Diagnóstico profundo
## Regresiones confirmadas
## Causas raíz
## Plan por fases
## Tests requeridos
## Riesgos residuales
```
