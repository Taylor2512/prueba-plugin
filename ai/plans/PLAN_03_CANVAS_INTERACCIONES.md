# Plan 03 — Canvas e interacciones

## Objetivos

- Toolbar contextual fuera del schema.
- Flip y clamp.
- Drop preview estable.
- Scroll multipágina.
- Focus y keyboard.
- Exclusions coherentes.

## Reglas

- No cambiar geometría PDF.
- No offsets mágicos sin stage bounds.
- Toolbar excluida de Selecto.
- Modal visible suspende selección.
- Popup oculto no congela canvas.
- Cancelar conserva selección.

## Tests

selection-context-toolbar, drag-preview-and-canvas-scroll, assignment-modal-selection-freeze, detail-dropdown-focus-return y transform.
