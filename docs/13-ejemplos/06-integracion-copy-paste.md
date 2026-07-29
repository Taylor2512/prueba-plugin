# Guía copy/paste para integrar SISAD PDFME en otro proyecto

# Paso 1 — Copiar carpeta

Desde el proyecto de origen:

```bash
mkdir -p /ruta/proyecto-destino/src
rsync -a \
  --delete \
  /ruta/prueba-plugin/src/sisad-pdfme/ \
  /ruta/proyecto-destino/src/sisad-pdfme/
```

Durante la primera migración puede omitirse `--delete`.

# Paso 2 — Copiar configuración visual

Revisar/copiar:

```txt
tailwind.config.*
postcss.config.*
src/styles/tailwind.css
```

# Paso 3 — Instalar dependencias

Usar la lista del manual principal.

# Paso 4 — Configurar aliases

Agregar aliases Vite y TypeScript.

# Paso 5 — Inicializar PDF.js

```ts
import { configurePdfjsLegacyWorker } from '@/sisad-pdfme';

configurePdfjsLegacyWorker();
```

# Paso 6 — Crear tipos del host

```ts
type HostUser = {
  userId: string;
  fullName: string;
  mail: string;
  hexColor: string;
};

type HostFile = {
  fileId: string;
  name: string;
  pdfBytes: Uint8Array;
  template: unknown;
};
```

# Paso 7 — Adaptar recipients

```ts
import {
  createRecipientsAdapter,
  type SisadPdfmeRecipient,
} from '@/sisad-pdfme';

const recipientsAdapter = createRecipientsAdapter<HostUser>({
  toRecipient(user): SisadPdfmeRecipient {
    return {
      id: user.userId,
      label: user.fullName,
      name: user.fullName,
      email: user.mail,
      color: user.hexColor,
      role: 'signer',
      metadata: user,
    };
  },
});

const recipients = recipientsAdapter.toRecipients(hostUsers);
```

# Paso 8 — Adaptar documentos

```ts
import {
  createDocumentsAdapter,
  type SisadPdfmeDocument,
} from '@/sisad-pdfme';

const documentsAdapter = createDocumentsAdapter<HostFile>({
  toDocument(file): SisadPdfmeDocument {
    return {
      id: file.fileId,
      label: file.name,
      name: file.name,
      basePdf: file.pdfBytes,
      template: file.template,
      metadata: file,
    };
  },
});

const documents = documentsAdapter.toDocuments(hostFiles);
```

# Paso 9 — Crear configuración memoizada

```tsx
const config = useMemo(
  () =>
    createSisadPdfmeConfig({
      runtime: {
        mode: 'designer',
      },
      canvas: {
        enabled: true,
        selecto: true,
        moveable: true,
      },
      sidebars: {
        left: {
          enabled: true,
          catalogLayout: 'list',
        },
        right: {
          enabled: true,
          panels: ['fields', 'detail', 'documents'],
        },
      },
      documents: {
        mode: documents.length > 1 ? 'multi' : 'single',
        preserveDocumentSchemaRouting: true,
      },
      recipients: {
        enabled: true,
        activeRecipientId: recipients[0]?.id ?? null,
      },
      collaboration: {
        enabled: true,
        canEditStructure: true,
      },
      assignment: {
        enabled: true,
      },
    }),
  [documents.length, recipients],
);
```

# Paso 10 — Montar Designer

```tsx
<SisadPdfmeDesigner
  config={config}
  template={template}
  documents={documents}
  recipients={recipients}
  activeRecipientId={activeRecipientId}
  onTemplateChange={setTemplate}
  onActiveRecipientChange={setActiveRecipientId}
  onAssignmentChange={handleAssignmentChange}
  onControllerReady={(controller) => {
    controllerRef.current = controller;
  }}
  onSave={saveTemplate}
/>
```

# Paso 11 — Guardar snapshot

```ts
const snapshot = controllerRef.current?.getSnapshot();

await api.save({
  templateId,
  snapshot,
});
```

# Paso 12 — Restaurar snapshot

```ts
const saved = await api.load(templateId);

controllerRef.current?.restoreSnapshot(saved.snapshot);
```

# Paso 13 — Form

```tsx
<SisadPdfmeForm
  config={formConfig}
  template={template}
  values={values}
  recipients={recipients}
  activeRecipientId={activeRecipientId}
  onInputChange={({ index, name, value }) => {
    setValues((current) => {
      const next = [...current];
      next[index] = {
        ...next[index],
        [name]: value,
      };
      return next;
    });
  }}
/>
```

# Paso 14 — Viewer

```tsx
<SisadPdfmeViewer
  config={viewerConfig}
  template={template}
  inputs={values}
  recipients={recipients}
  activeRecipientId={activeRecipientId}
/>
```

# Paso 15 — Generar PDF

```ts
const bytes = await generatePdfWithPreflight({
  template,
  inputs: values,
  plugins: getBuiltInFields(),
});
```

# Paso 16 — Plugins custom

```ts
registerPlugins(customPlugins);
```

Ejecutar antes del primer render.

# Paso 17 — Gates

```bash
npm run lint
npm run build
npx vitest run
npx playwright test --project=chromium
```

Añadir pruebas focales:

```txt
Designer carga
Form actualiza input
Viewer readonly
multi-documento
recipient activo
reasignación
snapshot round-trip
generator
plugin custom
```
