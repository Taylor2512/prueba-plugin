# TASK-010 — CommandBus y acciones del diseñador

## Objetivo

Mutaciones mediante commandBus/selectionCommands.

## Acciones

- addGroupOption;
- delete;
- duplicate;
- copy/paste;
- align;
- distribute;
- transform;
- update property.

## Archivos candidatos

```txt
ui/commands/commandBus.ts
ui/commands/designerCommands.ts
selectionCommands.ts
schemaClipboard.ts
SelectionContextToolbar.tsx
CanvasContextMenu.tsx
canvasContextMenuActions.tsx
```

## Validación

Componentes visuales disparan comandos, no mutan directo.
