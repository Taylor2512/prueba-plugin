# Tailwind 3 — reducción de selectores y deduplicación visual

## Fuente activa

- `src/styles/tailwind.css`
- `src/style.css` neutralizado
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css`
- `src/sisad-pdfme/ui/styles/tokens.css`
- `src/features/pdfcomponent/labRoutes.css`

## No usar como fuente activa

- `reports/tailwind-migration/candidates/**`
- `.tailwind-migration-backups/**`

## Migrable a TSX con Tailwind 3

- Botones.
- Cards.
- Píldoras.
- Chips.
- Headers de panel.
- Sidebars no geométricos.
- Toolbars no geométricos.
- Estados hover/focus-visible simples.

## No migrable sin task-card específica

- `.moveable-*`
- `.selecto-*`
- `transform` de canvas/paper/schema.
- `zoom`.
- Coordenadas PDF.
- Scroll principal del canvas.
- Print/PDF.
- `tokens.css`.
- CSS variables runtime.
- Pseudo-elementos complejos.

## Criterio

Se elimina CSS solo cuando:
1. La clase ya vive en TSX.
2. Hay prueba visual o smoke.
3. No toca geometría.
4. No cambia bounding boxes del canvas.
