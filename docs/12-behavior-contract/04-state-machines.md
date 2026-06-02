# State machines de interacción

## Estados válidos

```txt
idle
hovering-schema
selecting-schema
multi-selecting
region-selecting
dragging-plugin
dragging-schema
resizing-schema
rotating-schema
inline-editing
context-menu-open
modal-open
command-running
```

## Reglas

- `region-selecting` no convive con `dragging-schema`, `resizing-schema` o `rotating-schema`.
- `inline-editing` bloquea shortcuts globales.
- `modal-open` bloquea canvas interactions.
- `command-running` no debe dejar flags activos al terminar.
- `selected` no implica `blocking overlay`.

## Limpieza obligatoria

Cada start debe tener end/cancel:

| Start | End/cancel |
|---|---|
| drag | drop/cancel |
| resize | resizeEnd/cancel |
| rotate | rotateEnd/cancel |
| inline edit | save/cancel/blur controlado |
| region select | selectEnd/cancel |
