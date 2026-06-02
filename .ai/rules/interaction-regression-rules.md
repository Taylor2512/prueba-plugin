# Reglas — Interacciones, selección y shortcuts

- Solo el root del schema puede tener `data-schema-id`.
- Options internas usan `data-option-id`; el botón `+` no es schema seleccionable.
- Shortcuts no se disparan en inputs, textareas, selects, contenteditable, modals o popups activos.
- Shortcuts sí deben volver al hacer foco en canvas.
- Selecto no inicia durante drag, resize, rotate, inline edit o command-running.
- Moveable debe limpiar flags al finalizar cada interacción.
- Comandos que modifican estado pasan por `commandBus` para undo/redo.
- Delete, duplicate, copy, paste y align operan sobre todos los `activeSchemas` aplicables.
