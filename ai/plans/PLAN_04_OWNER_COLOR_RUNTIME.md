# Plan 04 — Owner color y runtime

## Contrato

El color de un schema existente depende de su owner persistido, no del recipient activo.

## Trabajo

- Consolidar recipient color resolver.
- Consolidar ownership appearance.
- Verificar fallback.
- Preservar owner en reassignment.
- Propagar active recipient a Form/Viewer.
- Validar global view.
- Snapshot roundtrip.
- Multi-document.

## No hacer

No recolorear schemas al cambiar usuario ni derivar owner desde selección actual.
