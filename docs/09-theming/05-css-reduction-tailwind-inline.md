# Reducción CSS con Tailwind inline

## Objetivo

Mover estilos visuales seguros a `className` en JSX/TSX y reducir CSS legacy.

## Conservar en CSS

- `tokens.css`
- Variables CSS runtime.
- Moveable/Selecto.
- Geometría del PDF/canvas/paper.
- Zoom/transforms críticos.
- Print/PDF.
- Pseudo-elementos complejos.

## Migrar a Tailwind inline

- Cards.
- Buttons.
- Labels.
- Pills/chips.
- Spacing simple.
- Tipografía.
- Borders.
- Shadows no críticas.
- Sidebars e inspector cuando no afecte medidas críticas.

## Validación

Cada migración debe registrar:
- componente migrado
- reglas CSS eliminadas
- reglas CSS conservadas
- baseline visual revisada
