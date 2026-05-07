# CSS, tokens y reducción de redundancia visual

> Documentación generada para consumo externo de `sisad-pdfme`.

## CSS fuente
Se consolidaron estilos desde `sisad-pdfme-global.css`, `labRoutes.css`, `canvas-interactions.css` y `tokens.css`.

## Reglas
- Tokens para colores, radios, sombras, z-index, sidebars y transiciones.
- Cero estilos inline para owner badges, chips repetidos y botones estándar.
- Separar estilos del laboratorio de estilos exportables.
- No permitir que CSS de UX altere geometría del paper.

## Reducción de redundancia
Crear/reutilizar:
- `EditorContextSummary`.
- `OwnerBadge`.
- `DocumentPageChip`.
- `ToolbarGroup`.
- `IconActionButton`.
- `SearchBox` común para left/right cuando aplique.

## Éxito
Menos headers duplicados, canvas-first real, sidebars más compactos y acciones consistentes.
