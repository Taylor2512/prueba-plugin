# TASK-CSS-001 — Estabilizar regresiones Tailwind

## Objetivo

Usar `public/img-version` como baseline para corregir regresiones visuales introducidas por la migración Tailwind.

## Archivos candidatos

```txt
src/style.css
src/styles/tailwind.css
src/styles/sisad-tailwind-bridge.css
src/features/pdfcomponent/labRoutes.css
src/features/pdfcomponent/PageHeader.jsx
src/features/pdfcomponent/PdfmeLabPage.jsx
src/features/pdfcomponent/ResultsPanel.jsx
src/sisad-pdfme/ui/styles/*.css
```

## No tocar

Moveable, Selecto, geometry, snapshot, generator/pdf-lib.
