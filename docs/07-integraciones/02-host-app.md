# Frontera entre host y core

## Host

- autenticación;
- endpoints;
- permisos de negocio;
- navegación;
- archivos;
- persistencia;
- firma externa;
- telemetría.

## Core

- canvas;
- selección;
- sidebars;
- inspector;
- schemas;
- recipients normalizados;
- assignments;
- documentos;
- snapshots;
- PDF.

## Dependencia

```text
host → API pública de sisad-pdfme
```

No:

```text
host → ui/components/Designer/**
sisad-pdfme → features, endpoints o stores del host
```
