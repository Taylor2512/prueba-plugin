# Importación de estilos

## Regla

Los estilos de `sisad-pdfme` deben importarse una sola vez.

## Orden sugerido

```ts
import './styles/tailwind.css';
import './sisad-pdfme/ui/styles/tokens.css';
import './sisad-pdfme/ui/styles/sisad-pdfme-global.css';
import './sisad-pdfme/ui/styles/canvas-interactions.css';
import './sisad-pdfme/ui/styles/sisad-pdfme-runtime.css';
import './styles/sisad-tailwind-bridge.css';
```

El orden puede variar según el proyecto, pero debe documentarse y no duplicarse.
