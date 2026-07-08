# Documents y Pages

Cada schema debe conocer el documento y página donde vive.

Campos críticos:

```txt
documentId
pageNumber
pageIndex
```

## Regla multipágina

Nunca asumir página 1. Todo drop, selección, move, resize, overlay y snapshot debe conservar la página real.
