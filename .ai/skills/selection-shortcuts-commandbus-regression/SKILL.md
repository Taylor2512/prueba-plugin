# SKILL — Regresión de selección, shortcuts y command bus

## Cuándo usar

Cuando fallen selección múltiple, atajos, delete, duplicate, copy/paste o undo/redo.

## Pasos

1. Diagnosticar focus leakage.
2. Revisar Selecto/Moveable guards.
3. Confirmar shortcut -> command.
4. Validar activeSchemas.
5. Agregar Playwright.

## No hacer

No usar setTimeout ni manipular DOM.

## Validación

selection-shortcuts-regression.spec.ts + unitarios.
