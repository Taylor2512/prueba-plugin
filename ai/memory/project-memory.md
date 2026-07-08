# Project Memory — SISAD PDFME

## Estado actual

El proyecto `sisad-pdfme` es un diseñador PDF con laboratorios bajo `src/features/pdfcomponent`, core bajo `src/sisad-pdfme`, y migración visual en progreso de CSS puro a Tailwind.

## Reglas persistentes

- `src/sisad-pdfme` es core reutilizable.
- `src/features/pdfcomponent` es host/lab.
- No mezclar lógica de negocio SISAD dentro del core.
- No tocar Moveable/Selecto/geometría sin task-card explícita.
- `public/img-version` es baseline visual para regresiones Tailwind.
- Tailwind debe tener `preflight: false`.
- `tokens.css` es fuente de verdad visual.
- Bridge Tailwind conserva classNames existentes.

## Riesgo activo

La migración Tailwind puede romper layout por doble fuente de verdad: Tailwind JSX + bridge + CSS legacy. Corregir por capas.
