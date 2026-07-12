# TASK-CANVAS-002 — Snap lines exactas y sidebars compactos

## Objetivo
Mejorar la precisión visual de las snap lines al mover schemas y compactar el comportamiento visual de ambos sidebars sin tocar geometría global ni persistencia.

## Alcance
- `src/sisad-pdfme/ui/components/Designer/Canvas/SnapLines.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx`
- `src/sisad-pdfme/ui/styles/tokens.css`

## Fuera de alcance
- `Paper.tsx`
- `Selecto.tsx`
- `Moveable.tsx`
- `snapshotAdapter`
- `generator`
- `pdf-lib`

## Pasos
1. Endurecer el snap para que la guía se vea alineada con más precisión.
2. Compactar el rail colapsado del lado derecho.
3. Reducir el ancho del rail colapsado del lado izquierdo.
4. Validar que no se rompa el layout horizontal.

## Validación
- `npm run build`
- `npm run lint`
- `npx playwright test tests/e2e/sidebar-collapse-parity.spec.ts --project=chromium`

## Criterio de parada
- Si hace falta tocar geometría global, detenerse.

## Entrega final
- Resumen corto de archivos modificados
- Validación ejecutada
