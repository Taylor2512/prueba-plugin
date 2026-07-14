# Contexto CSS/Tailwind

## Archivos CSS reales

```txt
src/styles/tailwind.css
src/style.css
src/styles/sisad-tailwind-bridge.css
src/features/pdfcomponent/labRoutes.css
src/sisad-pdfme/ui/styles/sisad-pdfme.css
src/sisad-pdfme/ui/styles/tokens.css
```

## Evidencia/reports

```txt
reports/tailwind-migration/**
.tailwind-migration-backups/**
```

Los reports y backups no son fuente activa. Sirven para auditoría.

## Regla de seguridad

Migrar clases visuales a JSX/TSX, pero conservar CSS crítico:
tokens, geometry, zoom, transforms, Moveable, Selecto, print/PDF, canvas/paper, pseudo-elementos complejos.
