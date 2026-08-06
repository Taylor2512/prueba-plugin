# Ejemplo copy/paste

```ts
import { configurePdfjsWorker } from '@/sisad-pdfme/integration';

await configurePdfjsWorker();
```

```ts
const config = createSisadPdfmeConfig({
  documents: { mode: 'multi' },
});
```

```ts
const instance = defineSisadPdfmeInstance({
  id: 'consumer-designer',
  definition: {
    mode: 'designer',
    defaultState: {
      template,
      activeDocumentId: documents[0]?.id ?? null,
      activeRecipientId: recipients[0]?.id ?? null,
    },
  },
  resources: {
    config,
    documents,
    recipients,
  },
  handlers: {
    onSave: api.saveTemplate,
  },
});
```

```tsx
<div className="h-dvh min-h-0 w-full min-w-0 overflow-hidden">
  <SisadPdfmeInstance instance={instance} />
</div>
```
