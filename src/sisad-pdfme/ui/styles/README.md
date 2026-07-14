# Estilos SISAD PDFME consolidados

Este paquete contiene una propuesta de limpieza para reducir duplicidad CSS y diseño repetido usando Tailwind.

## Estructura

```txt
src/sisad-pdfme/ui/styles/
├── sisad-pdfme.css
└── tokens.css
```

## Uso

```ts
import './styles/sisad-pdfme.css';
```

## Nota

`tokens.css` no usa `@apply` porque su responsabilidad es declarar variables reutilizables.
El resto del diseño queda centralizado en `sisad-pdfme.css`.
