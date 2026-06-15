# Canvas Multipage Context

## Regla central

Ninguna interacción debe asumir página 1.

## Página DOM

Cada página debe tener:

```html
data-paper-page="true"
data-document-id="..."
data-page-number="..."
data-page-index="..."
```

## Schema DOM

Cada schema root debe tener:

```html
data-schema-id="..."
data-schema-uid="..."
data-document-id="..."
data-page-number="..."
data-page-index="..."
```

## Flujo correcto

```txt
pointer/drop
→ resolver página bajo puntero
→ convertir client point a page point
→ crear/update schema con documentId + pageNumber
→ render en página correcta
→ overlay contra rect real
```

## Validación

- Drop en página 2 crea en página 2.
- Selecto ve targets de todas las páginas.
- Moveable transforma contra página dueña.
- Toolbar aparece en la página del schema.
