# Prompt — Estabilizar selección, shortcuts y command bus

Actúa como experto en Selecto, Moveable, command bus y state machines.

## Objetivo

Recuperar selección simple, selección múltiple, shortcuts, copy/paste/delete/duplicate, undo/redo, align/distribute y group/ungroup sin romper checkboxGroup/radioGroup.

## Diagnóstico obligatorio

```bash
rg "Selecto|Moveable|shouldSuppressDesignerShortcuts|shouldSuppressCanvasRegionSelection|canStartInteraction|selectionCommands|groupSelection|ungroupSelection|deleteSelection|duplicateSelection|copySelection|pasteSelection|selectAllVisible|commandBus|undo|redo|data-schema-id|data-option-id" src/sisad-pdfme tests
```

## Casos mínimos Playwright

- Click selecciona schema.
- Shift/Cmd click multi-selecciona.
- Drag region selecciona varios.
- Delete elimina todos.
- Ctrl/Cmd+A selecciona visibles.
- Copy/paste/duplicate conservan owner/doc/page y no-overlap.
- Undo/redo funcionan.
- Options internas no son schemas.
- Después de DetailView o `+`, shortcuts vuelven al canvas.

## Reglas

- No usar setTimeout.
- No manipular DOM manualmente.
- No mezclar selectionGroup con schemaGroup.
