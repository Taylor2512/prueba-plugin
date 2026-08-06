# SISAD PDFME — Manual maestro de implementación en otros proyectos

**Modelo de distribución documentado:** copia controlada de
`src/sisad-pdfme`  
**Destino recomendado:** React 18 + Vite + TypeScript + Tailwind CSS 3  
**Fecha de referencia del código:** 2026-08-05

---

# 1. Resultado que debe lograr la integración

Una aplicación consumidora debe limitarse a proporcionar:

```text
datos
+ configuración
+ adapters
+ handlers
+ instancia declarativa
+ montaje React
```

La pantalla consumidora no debe reconstruir el canvas, la selección, Moveable,
Selecto, los sidebars, DetailView, el controller ni el registro de recipients.

La ruta principal es:

```text
defineSisadPdfmeInstance
→ SisadPdfmeInstance
→ resolveSisadPdfmeInstance
→ Designer | Form | Viewer
```

---

# 2. API pública y fronteras

## 2.1 API raíz recomendada

```ts
import {
  SisadPdfmeInstance,
  defineSisadPdfmeInstance,
  createSisadPdfmeConfig,
  createSisadPdfmeInstanceBundle,
  serializeSisadPdfmeInstanceBundle,
  parseSisadPdfmeInstanceBundle,
  validateSisadPdfmeInstanceBundle,
  restoreSisadPdfmeInstanceBundle,
  type SisadPdfmeController,
  type SisadPdfmeRecipient,
  type SisadPdfmeDocument,
} from '@/sisad-pdfme';
```

## 2.2 API avanzada documentada

```ts
import {
  configurePdfjsWorker,
  normalizeHostData,
  createRecipientsAdapter,
  createDocumentsAdapter,
  createSignatureProviderAdapter,
  createPersistenceAdapter,
} from '@/sisad-pdfme/integration';
```

Use el entrypoint avanzado solo cuando la función todavía no esté promovida al
entrypoint raíz.

## 2.3 Internals prohibidos para el host

```text
src/sisad-pdfme/ui/components/**
src/sisad-pdfme/ui/designerEngine.ts
src/sisad-pdfme/ui/collaborationContext.ts
Canvas
Moveable
Selecto
RightSidebar
DetailView
SchemaAssignmentDialog
```

---

# 3. Copiar el componente

```bash
mkdir -p /ruta/destino/src

rsync -a \
  /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/src/sisad-pdfme/ \
  /ruta/destino/src/sisad-pdfme/
```

No use `--delete` en la primera copia.

Copie la carpeta completa. No copie únicamente `react`, `integration`, `ui` o
`schemas`, porque existen imports entre config, runtime, generator, converter,
recipients, collaboration, documents y shared.

Revise también:

```text
vite.config.js
tsconfig.json
tailwind.config.js
postcss.config.js
src/styles/tailwind.css
```

---

# 4. Dependencias

La entrega analizada utiliza, entre otras:

```bash
npm install \
  react@18.2.0 \
  react-dom@18.2.0 \
  antd@5.27.4 \
  pdf-lib@1.17.1 \
  pdfjs-dist@2.16.105 \
  react-moveable@0.56.0 \
  react-selecto@1.12.0 \
  @scena/react-guides@0.28.2 \
  @dnd-kit/core@6.0.8 \
  @dnd-kit/sortable@10.0.0 \
  bwip-js@4.8.0 \
  date-fns@2.30.0 \
  dompurify@3.3.1 \
  fontkit@2.0.2 \
  hotkeys-js@3.13.15 \
  lucide-react@0.563.0 \
  pako@2.1.0 \
  yjs@13.6.30 \
  y-protocols@1.0.7 \
  zod@4.3.6
```

Para desarrollo:

```bash
npm install -D \
  vite@3.2.5 \
  @vitejs/plugin-react@2.2.0 \
  typescript@6.0.3 \
  tailwindcss@3.4.19 \
  postcss@8.5.16 \
  autoprefixer@10.5.2 \
  vitest@0.34.0 \
  @playwright/test@1.58.2
```

Reglas:

- no instale una segunda copia de React;
- conserve inicialmente `pdfjs-dist@2.16.105`;
- compare siempre contra el `package.json` de la versión copiada;
- resuelva conflictos de Ant Design, Tailwind o React antes de montar el
  componente.

---

# 5. Vite

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@sisad-pdfme/common': path.resolve(
        __dirname,
        'src/sisad-pdfme/common',
      ),
      '@sisad-pdfme/ui': path.resolve(
        __dirname,
        'src/sisad-pdfme/ui',
      ),
      '@sisad-pdfme/generator': path.resolve(
        __dirname,
        'src/sisad-pdfme/generator',
      ),
      '@sisad-pdfme/schemas': path.resolve(
        __dirname,
        'src/sisad-pdfme/schemas',
      ),
      '@sisad-pdfme/converter': path.resolve(
        __dirname,
        'src/sisad-pdfme/converter/index.browser.ts',
      ),
    },
  },
});
```

## Fork local de `pdf-lib`

El repositorio de origen puede resolver:

```json
"pdf-lib": ["./src/sisad-pdfme/pdf-lib/index.ts"]
```

Si esa carpeta forma parte de la entrega, cópiela y añada el alias equivalente
en Vite. Si no existe, retire el alias local y valide el componente contra el
paquete npm.

---

# 6. TypeScript

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "noEmit": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "paths": {
      "@/*": ["./src/*"],
      "@sisad-pdfme/*": ["./src/sisad-pdfme/*"],
      "@sisad-pdfme/common": [
        "./src/sisad-pdfme/common/index.ts"
      ],
      "@sisad-pdfme/converter": [
        "./src/sisad-pdfme/converter/index.browser.ts"
      ],
      "@sisad-pdfme/generator": [
        "./src/sisad-pdfme/generator/index.ts"
      ],
      "@sisad-pdfme/schemas": [
        "./src/sisad-pdfme/schemas/index.ts"
      ],
      "@sisad-pdfme/ui": [
        "./src/sisad-pdfme/ui/index.ts"
      ]
    }
  }
}
```

El repositorio original tiene `strict: false`. Un consumidor puede usar
`strict: true`, pero deberá tipar sus adapters y handlers sin ocultar errores con
`any`.

---

# 7. Tailwind y estilos

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
```

Use una sola entrada:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`preflight: false` evita alterar:

- inputs;
- Ant Design;
- canvas;
- PDF;
- Moveable;
- Selecto;
- reglas de medidas del diseñador.

El entrypoint React carga `tokens.css` y `sisad-pdfme.css`. En el estado
analizado, `sisad-pdfme.css` está vacío y la mayoría del diseño vive en clases
Tailwind dentro de TSX. Por eso la carpeta copiada debe estar incluida en
`content`.

---

# 8. PDF.js

Inicialice el worker durante el bootstrap:

```ts
import { configurePdfjsWorker } from '@/sisad-pdfme/integration';

await configurePdfjsWorker();
```

El nombre actual es `configurePdfjsWorker`. No use
`configurePdfjsLegacyWorker`.

En Vite el worker se resuelve mediante:

```text
pdfjs-dist/build/pdf.worker.min.js?url
```

---

# 9. Estructura del proyecto consumidor

```text
src/features/contracts/
├── data/
│   ├── recipients.data.ts
│   ├── documents.data.ts
│   └── templates.data.ts
├── adapters/
│   └── sisadPdfme.adapters.ts
├── config/
│   └── sisadPdfme.config.ts
├── handlers/
│   └── sisadPdfme.handlers.ts
├── instances/
│   ├── contractDesigner.instance.ts
│   ├── contractForm.instance.ts
│   └── contractViewer.instance.ts
└── pages/
    └── ContractDesignerPage.tsx
```

La página solo debe montar una instancia.

---

# 10. Contratos de datos

## Recipient

```ts
type SisadPdfmeRecipient = {
  id: string;
  label: string;
  name?: string;
  role?: string;
  email?: string;
  color?: string;
  order?: number;
  disabled?: boolean;
  metadata?: Record<string, unknown>;
};
```

## Documento

```ts
type SisadPdfmeDocument = {
  id: string;
  label: string;
  name?: string;
  pageCount?: number;
  basePdf?: unknown;
  template?: unknown;
  metadata?: Record<string, unknown>;
};
```

En multidocumento preserve siempre `template`.

## Provider de firma

```ts
type SisadPdfmeSignatureProvider = {
  key: string;
  label: string;
  description?: string;
  capabilities?: Record<string, boolean>;
  metadata?: Record<string, unknown>;
};
```

---

# 11. Adapters

## 11.1 Factories automáticas

```ts
import {
  createRecipientsAdapter,
  createDocumentsAdapter,
  createSignatureProviderAdapter,
} from '@/sisad-pdfme/integration';

const adapters = {
  recipients: createRecipientsAdapter(),
  documents: createDocumentsAdapter(),
  signatures: createSignatureProviderAdapter(),
};
```

Las factories actuales no reciben opciones.

## 11.2 Mapping personalizado

```ts
type HostUser = {
  userId: string;
  fullName: string;
  mail: string;
  hexColor: string;
};

const mapRecipient = (user: HostUser) => ({
  id: user.userId,
  label: user.fullName,
  name: user.fullName,
  email: user.mail,
  color: user.hexColor,
  role: 'signer',
  metadata: { source: 'host' },
});

export const recipientsAdapter = {
  toRecipient: mapRecipient,
  toRecipients: (items: HostUser[]) => items.map(mapRecipient),
};
```

Documento personalizado:

```ts
type HostFile = {
  fileId: string;
  title: string;
  bytes: Uint8Array;
  template: unknown;
};

const mapDocument = (file: HostFile) => ({
  id: file.fileId,
  label: file.title,
  name: file.title,
  basePdf: file.bytes,
  template: file.template,
  metadata: { source: 'host' },
});

export const documentsAdapter = {
  toDocument: mapDocument,
  toDocuments: (items: HostFile[]) => items.map(mapDocument),
};
```

Entréguelos en:

```ts
resources: {
  recipients: hostUsers,
  documents: hostFiles,
  adapters: {
    recipients: recipientsAdapter,
    documents: documentsAdapter,
  },
}
```

---

# 12. Configuración

```ts
import { createSisadPdfmeConfig } from '@/sisad-pdfme';

export const contractDesignerConfig = createSisadPdfmeConfig({
  configVersion: 2,
  app: {
    id: 'contracts',
    name: 'Contratos',
    locale: 'es',
    environment: 'production',
  },
  runtime: {
    mode: 'designer',
    readonly: false,
    isolateDomEvents: true,
    preserveSelectionOnModalClose: true,
  },
  documents: {
    mode: 'multi',
    preserveDocumentSchemaRouting: true,
    activeDocumentStrategy: 'internal',
  },
  persistence: {
    mode: 'host',
    autosave: false,
    serializeSnapshot: true,
  },
});
```

Defaults relevantes:

```text
canvas.enabled = true
sidebars.left.enabled = true
sidebars.right.enabled = true
collaboration.enabled = true
assignment.enabled = true
signatures.enabled = true
documents.mode = single
persistence.mode = local
persistence.autosave = false
debug.enabled = false
```

Diferencie:

```text
enabled
visible
allowed
available
```

---

# 13. Instancia declarativa

```ts
import {
  defineSisadPdfmeInstance,
  type SisadPdfmeController,
} from '@/sisad-pdfme';

let controller: SisadPdfmeController | null = null;

export const contractDesignerInstance = defineSisadPdfmeInstance({
  id: 'contract-designer',
  revision: 1,
  definition: {
    version: 1,
    mode: 'designer',
    defaultState: {
      activeRecipientId: null,
      activeDocumentId: null,
    },
  },
  resources: {
    config: contractDesignerConfig,
    template: contractTemplate,
    recipients: hostUsers,
    documents: hostFiles,
    adapters,
  },
  handlers: {
    onControllerReady(nextController) {
      controller = nextController;
    },
    async onSave(template) {
      await contractsApi.saveTemplate(template);
    },
    onStateChange(nextState, change) {
      auditStore.record({
        field: change.field,
        source: change.source,
        nextState,
      });
    },
    onEvent(event) {
      telemetry.track(event.type, event);
    },
  },
});
```

## Identidad

- `id`: identidad estable;
- `revision`: reinicio deliberado de una revisión;
- `instanceKey`: identidad de la firma directa sin objeto registrado.

No cambie estas propiedades en cada render.

---

# 14. Estado controlado y no controlado

## Controlado

```ts
definition: {
  state: {
    template,
    recipients,
    documents,
    activeRecipientId,
  },
}
```

El host devuelve el valor nuevo después de `onStateChange`.

## No controlado

```ts
definition: {
  defaultState: {
    template: initialTemplate,
    inputs: initialInputs,
  },
}
```

## Precedencia

```text
definition.state
→ resources.state
→ runtime interno
→ definition.defaultState
→ resources.defaultState
→ campos directos de definition
→ resources
→ fallback
```

No mezcle `state` y `defaultState` para el mismo campo sin una decisión
documentada.

---

# 15. Montaje

```tsx
import { SisadPdfmeInstance } from '@/sisad-pdfme';
import { contractDesignerInstance } from '../instances/contractDesigner.instance';

export function ContractDesignerPage() {
  return (
    <main className="h-dvh min-h-0 w-full min-w-0 overflow-hidden">
      <SisadPdfmeInstance instance={contractDesignerInstance} />
    </main>
  );
}
```

El host es dueño del viewport. La cadena completa debe tener altura:

```text
html → body → #root → shell → página → SisadPdfmeInstance
```

---

# 16. Designer, Form y Viewer

```ts
definition: { mode: 'designer' }
definition: { mode: 'form' }
definition: { mode: 'viewer' }
```

- Designer: edita estructura.
- Form: captura valores.
- Viewer: muestra sin edición.

No reconstruya renderers por modo en el host.

---

# 17. Controller

Recíbalo con `onControllerReady`.

Operaciones principales:

```text
getTemplate / setTemplate
getSnapshot / restoreSnapshot
getConfig / updateConfig / resetConfig
getFeatureState / getCapabilityState
getSelectedSchemaIds / selectSchemas / clearSelection
addSchema / updateSchema / removeSchemas / duplicateSchemas
getRecipients / setRecipients / setActiveRecipient
assignSchemasToRecipient
setActiveDocument
setZoom
validate
save
```

Antes de una capacidad opcional:

```ts
const state = controller.getCapabilityState('documents');

if (state.available) {
  controller.setActiveDocument('contract');
}
```

---

# 18. Persistencia, snapshot y bundle

## Guardado

```ts
handlers: {
  async onSave(template) {
    await api.put('/templates/123', template);
  },
}
```

`persistence.mode = 'host'` no crea un endpoint.

## Snapshot

```ts
const snapshot = controller.getSnapshot();
await api.saveSnapshot(snapshot);

const restored = await api.loadSnapshot();
controller.restoreSnapshot(restored);
```

## Bundle

```ts
const bundle = createSisadPdfmeInstanceBundle({
  definition: instance.definition,
  resources: instance.resources,
});

const json = serializeSisadPdfmeInstanceBundle(bundle);
const parsed = parseSisadPdfmeInstanceBundle(json);
```

El bundle excluye `resources.adapters`.

No incluya:

- callbacks;
- funciones;
- `File`;
- DOM;
- React elements;
- engines;
- credenciales;
- providers vivos.

---

# 19. Multidocumento

```ts
const config = createSisadPdfmeConfig({
  documents: {
    mode: 'multi',
    preserveDocumentSchemaRouting: true,
    activeDocumentStrategy: 'internal',
  },
});
```

```ts
const documents = [
  {
    id: 'contract',
    label: 'Contrato',
    basePdf: contractPdf,
    template: contractTemplate,
  },
  {
    id: 'annex',
    label: 'Anexo',
    basePdf: annexPdf,
    template: annexTemplate,
  },
];
```

Pruebe:

- cambio de documento;
- cambio de página;
- schemas por documento;
- guardado;
- snapshot;
- restore;
- generación PDF.

---

# 20. Recipients y assignments

No cree registros paralelos de recipients.

```ts
controller.assignSchemasToRecipient(
  controller.getSelectedSchemaIds(),
  'alice',
);
```

El owner color representa responsabilidad. El contenido semántico de aprobar,
rechazar, note, image o barcode puede conservar su color.

La acción Reasignar depende de:

```text
assignment.enabled
visibility.actions.reassign
handler
canEditStructure
recipients asignables
selección
```

---

# 21. Firma

## Local

```ts
createSisadPdfmeConfig({
  signatures: {
    enabled: true,
    defaultMode: 'draw',
  },
});
```

## Externa

El core registra descriptors. El host controla:

- autenticación;
- transacción;
- OTP;
- liveness;
- certificado;
- webhook;
- auditoría;
- almacenamiento seguro.

No guarde secretos en template, snapshot o bundle.

---

# 22. Custom schemas

```ts
resources: {
  plugins: {
    myCustomType: myCustomPlugin,
  },
}
```

Pruebe cada plugin en:

- Designer;
- Form;
- Viewer;
- PDF;
- inspector;
- snapshot;
- recipient color;
- readonly;
- validation;
- cleanup de listeners y Object URLs.

---

# 23. Comportamiento visual actual

- El Designer público inicia sin `autoFit` automático.
- El zoom visible inicial es 100 %.
- El host puede pedir fit después.
- Los controles de zoom pueden mostrarse en densidad compacta.
- Colapsar el sidebar izquierdo docked no debe mover el papel.
- El host define la altura; el componente ocupa el espacio disponible.

---

# 24. Seguridad

- Valide archivos también en backend.
- Sanitice SVG.
- Limite MIME, tamaño y cantidad.
- Revoque Object URLs.
- No serialice secretos.
- Redacte telemetría.
- Valide el bundle antes de restaurar.
- El backend vuelve a validar recipient, lock y autorización.

---

# 25. Consumer test

En un proyecto limpio:

```text
1. instalar dependencias
2. copiar src/sisad-pdfme
3. configurar Vite
4. configurar TypeScript
5. configurar Tailwind
6. configurar PDF.js
7. montar Designer
8. montar Form
9. montar Viewer
10. probar save
11. probar snapshot/restore
12. generar PDF
13. probar dos documentos
14. probar varios recipients
15. ejecutar build y Playwright
```

Gates:

```bash
npm run lint
npm run build
npm test -- --run
npm run test:e2e
```

---

# 26. Troubleshooting

## Pantalla vacía

Revise altura de ancestros, template y consola.

## Tailwind no aplica

Incluya `src/sisad-pdfme/**/*.{ts,tsx,js,jsx}` en `content`.

## Inputs deformados

Confirme `preflight: false`.

## Worker PDF.js falla

Use `configurePdfjsWorker` y conserve inicialmente
`pdfjs-dist@2.16.105`.

## Documento sin schemas

El adapter probablemente eliminó `document.template`.

## Estado vuelve atrás

El campo es controlado y el host no devolvió el valor nuevo.

## Bundle no serializa

Hay funciones, `File`, DOM, React o recursos vivos.

## Canvas se mueve al colapsar sidebars

No envuelva ni reimplemente internamente los sidebars. Ejecute la regresión
visual en el proyecto consumidor.

---

# 27. Checklist final

## Infraestructura

- [ ] carpeta completa;
- [ ] dependencias;
- [ ] una copia de React;
- [ ] aliases Vite;
- [ ] paths TypeScript;
- [ ] Tailwind;
- [ ] `preflight: false`;
- [ ] PDF.js;
- [ ] fork de pdf-lib resuelto.

## Integración

- [ ] config estable;
- [ ] instancia estable;
- [ ] adapters tipados;
- [ ] handlers;
- [ ] viewport;
- [ ] cero imports internos.

## Funcional

- [ ] Designer;
- [ ] Form;
- [ ] Viewer;
- [ ] save;
- [ ] snapshot/restore;
- [ ] PDF;
- [ ] recipients;
- [ ] multidocumento;
- [ ] firma;
- [ ] responsive.

## Calidad

- [ ] lint;
- [ ] build;
- [ ] unit;
- [ ] e2e;
- [ ] visual;
- [ ] consumer test;
- [ ] seguridad;
- [ ] rollback.
