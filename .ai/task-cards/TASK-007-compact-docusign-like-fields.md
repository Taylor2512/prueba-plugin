# TASK-007 — Visual compacto tipo DocuSign/Wix

## Objetivo

PDF protagonista y schemas como overlays ligeros.

## Archivos candidatos

```txt
schemas/shared/fieldChrome.ts
schemas/shared/renderSchemaWithChrome.ts
schemas/shared/schemaDom.ts
ui/styles/tokens.css
ui/styles/sisad-pdfme-global.css
ui/styles/canvas-interactions.css
schemas/options/*
schemas/actions/*
schemas/signature/*
schemas/textLike/*
```

## No hacer

No tocar geometría. No tocar Moveable/Selecto. No z-index arbitrario.

## Validación

Campos compactos, ownerColor sutil, sin badges técnicos permanentes.
