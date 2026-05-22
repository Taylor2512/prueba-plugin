# CSS y Design System

## Reglas

- Scope bajo `.sisad-pdfme-root`.
- Tokens en CSS variables.
- Evitar hardcodes.
- No invadir consumidores externos.
- No romper paper geometry.
- No cambiar `overflow`, `transform` o `position` del canvas sin test.

## Elementos sensibles

- `.sisad-pdfme-designer-canvas`
- `[data-paper-page='true']`
- `.moveable-*`
- `.selecto-*`
- overlays
- sidebars
