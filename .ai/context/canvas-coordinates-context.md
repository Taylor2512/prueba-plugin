# Canvas Coordinates Context

## Regla multipágina

Ninguna interacción asume página 1.

Cada página debe exponer `data-paper-page`, `data-document-id`, `data-page-number`, `data-page-index`.

Cada schema root debe exponer `data-schema-id`, `data-document-id`, `data-page-number`, `data-page-index`.

## Flujo correcto

```txt
pointer/drop -> resolver página bajo puntero -> client point a page point -> schema con documentId/pageNumber -> render por página -> overlays contra rect real
```
