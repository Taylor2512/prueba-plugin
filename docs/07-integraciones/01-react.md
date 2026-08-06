# Integración React

## Ruta principal

```tsx
import {
  SisadPdfmeInstance,
  defineSisadPdfmeInstance,
} from '@/sisad-pdfme';

const instance = defineSisadPdfmeInstance({
  id: 'contracts-designer',
  definition: {
    mode: 'designer',
    defaultState: {
      template: initialTemplate,
    },
  },
  resources: {
    config,
    recipients,
    documents,
  },
  handlers: {
    onSave: saveTemplate,
  },
});

export function Editor() {
  return (
    <main className="h-dvh min-h-0 w-full min-w-0 overflow-hidden">
      <SisadPdfmeInstance instance={instance} />
    </main>
  );
}
```

## Estabilidad

- defina config e instancia fuera de la página o con memoización estable;
- no cambie `id`, `revision` o React `key` en cada render;
- no reconstruya internals;
- el host define la altura;
- el wrapper público del Designer inicia sin auto-fit automático.
