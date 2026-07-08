# CSS/Tailwind Context

## Fuentes principales

```txt
src/styles/tailwind.css
src/style.css
src/styles/sisad-tailwind-bridge.css
src/sisad-pdfme/ui/styles/tokens.css
src/sisad-pdfme/ui/styles/sisad-pdfme-global.css
src/sisad-pdfme/ui/styles/canvas-interactions.css
src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css
src/features/pdfcomponent/labRoutes.css
reports/tailwind-migration/*
```

## Decisiones

- Tailwind sin preflight.
- Una sola entrada Tailwind.
- Bridge a nivel raíz si hay clases dinámicas.
- Geometry/paper/transform no migran.
- `public/img-version` es baseline visual.
