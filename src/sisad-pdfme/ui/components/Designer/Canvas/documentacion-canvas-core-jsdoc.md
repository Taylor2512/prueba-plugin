# Reporte de documentación JSDoc — Canvas core

| Archivo | JSDoc antes | JSDoc después | Líneas antes | Líneas después |
|---|---:|---:|---:|---:|
| `Canvas.tsx` | 0 | 71 | 1613 | 1883 |
| `Guides.tsx` | 0 | 5 | 100 | 118 |
| `Mask.tsx` | 0 | 3 | 33 | 48 |
| `Moveable.tsx` | 0 | 5 | 127 | 149 |
| `Padding.tsx` | 0 | 4 | 82 | 100 |
| `Selecto.tsx` | 0 | 6 | 110 | 132 |
| `SnapLines.tsx` | 5 | 14 | 349 | 380 |

## Observaciones técnicas

- `Canvas.tsx` concentra mucha responsabilidad: selección, transformación, overlays, menú contextual, edición inline y render state. La documentación marca límites para evitar mezclar reglas de negocio del host.
- `Moveable.tsx` y `Selecto.tsx` se mantienen como adapters; sus props documentan cómo Canvas inyecta condiciones y callbacks.
- `SnapLines.tsx` mantiene el cálculo en milímetros y render en píxeles mediante `ZOOM`.
- `Guides.tsx`, `Mask.tsx` y `Padding.tsx` quedan como slots visuales puros.
