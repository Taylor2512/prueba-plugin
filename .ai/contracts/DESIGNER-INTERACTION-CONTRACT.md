# Designer interaction

Selección, transformaciones, inline edit, clipboard, grouping, page/document
routing y sidebars deben usar Policy→Command→Event→Effect.

Un schema bloqueado puede seleccionarse e inspeccionarse, pero no transformarse.

Abrir/cerrar sidebars conserva zoom, scroll, page, document y selection.
Undo/redo registra una operación por gesto, no por frame.
