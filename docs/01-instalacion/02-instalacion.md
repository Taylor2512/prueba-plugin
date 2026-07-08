# Instalación

Ejemplo conceptual:

```bash
npm install @sisad-pdfme/core
```

En monorepo/local, consumir desde el path interno:

```ts
import { Designer, Form, Viewer, generate } from '@/sisad-pdfme';
```

## Estilos

```ts
import '@/sisad-pdfme/ui/styles/tokens.css';
import '@/sisad-pdfme/ui/styles/sisad-pdfme-global.css';
import '@/sisad-pdfme/ui/styles/canvas-interactions.css';
import '@/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css';
```

Si se usa Tailwind bridge, importar una sola vez:

```ts
import '@/styles/tailwind.css';
import '@/styles/sisad-tailwind-bridge.css';
```
