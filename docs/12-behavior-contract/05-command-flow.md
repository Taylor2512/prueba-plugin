# Flujo de comandos y shortcuts

## Flujo esperado

```txt
keydown
-> resolveShortcutByKeyboardEvent
-> shouldSuppressDesignerShortcuts
-> useDesignerKeyboardShortcuts
-> selectionCommands / commandBus
-> state mutation
-> undo/redo stack
-> UI sync
```

## Comandos críticos

| Atajo/acción | Comando | Debe preservar |
|---|---|---|
| Delete | deleteSelection | undo state |
| Cmd/Ctrl+D | duplicateSelection | owner/doc/page/no-overlap |
| Cmd/Ctrl+C | copySelection | schemaUid source, owner |
| Cmd/Ctrl+V | pasteSelection | nuevos IDs + no-overlap |
| Cmd/Ctrl+A | selectAllVisible | doc/page active scope |
| Escape | clearSelection | no muta schemas |
| Cmd/Ctrl+Z | undo | estado anterior |
| Cmd/Ctrl+Shift+Z/Ctrl+Y | redo | estado posterior |
| Cmd/Ctrl+G | groupSelection | selectionGroup, no schemaGroup |
| Cmd/Ctrl+Shift+G | ungroupSelection | selectionGroup |

## Regla

Atajo registrado no significa funcionalidad cubierta; debe existir test end-to-end.
