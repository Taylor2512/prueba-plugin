# TASK-002 — Endurecer Selecto/Moveable/shortcuts

## Objetivo

Evitar colisiones entre selección, transform, overlays, options, botón + e inputs.

## Contexto

Usar `moveable-selecto-rules.md` y `PB-002-selection-transform.md`.

## Búsqueda permitida

```bash
rg "selectableTargetGuards|transformTargetGuards|interactionGuards|Selecto|Moveable|data-option-id|group-add-option|contenteditable|keyboardShortcut|selectionCommands" src/sisad-pdfme/ui src/sisad-pdfme/shared
```

## Archivos candidatos

```txt
selectableTargetGuards.ts
transformTargetGuards.ts
interactionGuards.ts
interactionState.ts
keyboardShortcutRegistry.ts
useDesignerKeyboardShortcuts.ts
Selecto.tsx
Moveable.tsx
SelectionContextToolbar.tsx
```

## Validación

- Options internas no se seleccionan.
- Botón + no se selecciona.
- Toolbar no se selecciona.
- Input/inline edit bloquea shortcuts.
- Multi-select funciona.
