# Arquitectura general del componente

```txt
sisad-pdfme/
├── ui/
│   ├── Designer
│   ├── Form
│   ├── Viewer
│   └── components
├── schemas/
│   ├── text-like
│   ├── option-based
│   ├── signing-based
│   ├── action-based
│   ├── media
│   └── shared
├── runtime/
├── generator/
├── shared/
├── commands/
└── styles/
```

## Principios

- Designer controla canvas, sidebars, overlays, toolbar, selección y configuración.
- Form/Viewer consumen el mismo modelo de schemas.
- Generator usa el snapshot y los valores finales.
- Host apps solo pasan datos, callbacks y adaptadores.
