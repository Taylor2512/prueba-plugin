# CommandBus Context

Toda mutación relevante del diseñador debe pasar por command bus o selectionCommands.

## Acciones

- addGroupOption;
- deleteSelection;
- duplicateSelection;
- pasteSelection;
- alignSelection;
- distributeSelection;
- transform schema;
- update schema property.

## Regla

Los componentes visuales disparan comandos. No mutan estado directamente.
