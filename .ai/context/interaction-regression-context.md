# Contexto — Regresiones de selección, shortcuts y command bus

## Riesgo

Cambios visuales o de schemas pueden romper selección, Selecto, Moveable, shortcuts y command bus.

## Flujo correcto de atajos

```txt
keydown -> resolveShortcutByKeyboardEvent -> shouldSuppressDesignerShortcuts -> useDesignerKeyboardShortcuts -> selectionCommands/commandBus -> state update -> undo/redo
```

## Funcionalidades críticas

- Click simple selecciona root de schema.
- Shift/Cmd click agrega/quita selección.
- Drag region con Selecto selecciona roots de schemas.
- Moveable usa targets correctos.
- Delete/Duplicate/Copy/Paste/Cut operan sobre todos los seleccionados.
- Ctrl/Cmd+A selecciona visibles de documento/página activa.
- Escape limpia selección.
- Undo/redo revierten comandos reales.
- Group/Ungroup operan sobre `selectionGroup`, no sobre `schemaGroup`.
- Options internas de checkboxGroup/radioGroup no son schemas seleccionables.

## Causas típicas de regresión

- `pointer-events` o `z-index` de overlays.
- Inputs o popups dejando foco y suprimiendo shortcuts.
- Flags de interacción no limpiados.
- Options internas con `data-schema-id`.
- Comando registrado pero handler desconectado.
- Toolbar contextual ejecutando acción sobre un solo schema.
