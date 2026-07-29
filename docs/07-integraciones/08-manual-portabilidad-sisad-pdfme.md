# Manual de portabilidad e integración de SISAD PDFME

**Componente portable:** `src/sisad-pdfme`  
**Proyecto de origen:** `prueba-plugin`  
**Destino:** otro proyecto React + Vite + TypeScript o JavaScript  
**Objetivo:** copiar el componente completo y configurarlo sin importar internals del Designer.

---

# 1. Qué es SISAD PDFME

`src/sisad-pdfme` es una capa portable para diseñar, llenar, visualizar y generar documentos PDF con schemas configurables.

La fachada pública reúne:

```txt
Designer
Form
Viewer
Provider React
Controller
Configuración
Recipient Registry
Adapters
Schemas/plugins
Documentos
Comentarios
Assignments
Colaboración
Snapshot
Generator
Converter
CommandBus
Eventos
```

El host externo debe aportar únicamente:

```txt
configuración
template
documentos
destinatarios
valores
adapters
callbacks
```

El host no debe importar directamente:

```txt
Canvas
Moveable
Selecto
LeftSidebar
RightSidebar
DetailView
ListView
SchemaAssignmentDialog
servicios internos de selección
servicios internos de geometría
```

---

# 2. Qué carpeta copiar

Copiar completa:

```txt
src/sisad-pdfme/
```

No copiar solo `react`, `ui` o `schemas`, porque existen imports cruzados entre:

```txt
adapters
assignments
browser
canvas
collaboration
commands
comments
common
config
context
contracts
converter
documents
editor
externalForms
generator
integration
react
recipients
runtime
schemas
shared
snapshot
ui
pdf-lib
```

También deben copiarse, cuando existan en el repositorio de origen:

```txt
src/styles/tailwind.css
tailwind.config.*
postcss.config.*
aliases de Vite
paths de TypeScript
```

El entrypoint React público importa:

```ts
import '../ui/styles/tokens.css';
import '../ui/styles/sisad-pdfme.css';
```

Por tanto, el host que importa desde `src/sisad-pdfme/react` recibe el entrypoint visual del componente. Sin embargo, la mayor parte de la UI usa clases Tailwind dentro del código fuente, por lo que Tailwind debe escanear la carpeta copiada.

---

# 3. Dependencias

Instalar como mínimo las dependencias importadas por el componente:

```bash
npm install \
  react react-dom \
  lucide-react antd air-datepicker \
  pdf-lib @pdf-lib/fontkit pdfjs-dist@2.16.105 \
  zod form-render date-fns \
  @dnd-kit/core \
  react-moveable react-selecto @scena/react-guides \
  acorn yjs y-protocols hotkeys-js \
  bwip-js dompurify
```

Dependencias que conviene declarar de forma directa para no depender de instalaciones transitivas:

```bash
npm install csstype estree gesto
```

Según la variante del repositorio también pueden ser necesarias:

```bash
npm install \
  @pdf-lib/standard-fonts \
  @pdf-lib/upng \
  color pako node-html-better-parser
```

## 3.1 PDF.js

La implementación utiliza `pdfjs-dist@2.16.105`.

El entrypoint público expone:

```ts
configurePdfjsLegacyWorker();
```

Llamarlo una vez al iniciar la aplicación cuando el entorno necesite registrar el worker legacy:

```ts
import { configurePdfjsLegacyWorker } from '@/sisad-pdfme';

configurePdfjsLegacyWorker();
```

No llamar esta función en cada render.

---

# 4. Aliases requeridos

La implementación de origen utiliza aliases:

```ts
'@'                       -> src
'@sisad-pdfme/common'     -> src/sisad-pdfme/common
'@sisad-pdfme/ui'         -> src/sisad-pdfme/ui
'@sisad-pdfme/generator'  -> src/sisad-pdfme/generator
'@sisad-pdfme/schemas'    -> src/sisad-pdfme/schemas
'@sisad-pdfme/converter'  -> src/sisad-pdfme/converter/index.browser.ts
```

Ejemplo de Vite:

```ts
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@sisad-pdfme/common': fileURLToPath(
        new URL('./src/sisad-pdfme/common', import.meta.url),
      ),
      '@sisad-pdfme/ui': fileURLToPath(
        new URL('./src/sisad-pdfme/ui', import.meta.url),
      ),
      '@sisad-pdfme/generator': fileURLToPath(
        new URL('./src/sisad-pdfme/generator', import.meta.url),
      ),
      '@sisad-pdfme/schemas': fileURLToPath(
        new URL('./src/sisad-pdfme/schemas', import.meta.url),
      ),
      '@sisad-pdfme/converter': fileURLToPath(
        new URL('./src/sisad-pdfme/converter/index.browser.ts', import.meta.url),
      ),
      'pdf-lib': fileURLToPath(
        new URL('./src/sisad-pdfme/pdf-lib/index.ts', import.meta.url),
      ),
    },
  },
});
```

Ejemplo de `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@sisad-pdfme/common": ["src/sisad-pdfme/common/index.ts"],
      "@sisad-pdfme/ui": ["src/sisad-pdfme/ui/index.ts"],
      "@sisad-pdfme/generator": ["src/sisad-pdfme/generator/index.ts"],
      "@sisad-pdfme/schemas": ["src/sisad-pdfme/schemas/index.ts"],
      "@sisad-pdfme/converter": [
        "src/sisad-pdfme/converter/index.browser.ts"
      ],
      "pdf-lib": ["src/sisad-pdfme/pdf-lib/index.ts"]
    }
  }
}
```

---

# 5. Tailwind

El proyecto de origen usa Tailwind-first y desactiva `preflight`.

Ejemplo:

```js
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  corePlugins: {
    preflight: false,
  },
};
```

El CSS raíz del host debe emitir Tailwind:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

No excluyas `src/sisad-pdfme/**/*.{ts,tsx,js,jsx}` del escaneo.

---

# 6. API pública recomendada

Importar desde la fachada pública:

```ts
import {
  SisadPdfmeProvider,
  SisadPdfmeDesigner,
  SisadPdfmeForm,
  SisadPdfmeViewer,
  createSisadPdfmeConfig,
  configurePdfjsLegacyWorker,
} from '@/sisad-pdfme';
```

También se exportan aliases de bajo nivel:

```txt
Designer
Form
Viewer
PdfEditor
PdfFormView
PdfViewer
DesignerEngineBuilder
```

Para una integración nueva se recomiendan los wrappers:

```txt
SisadPdfmeDesigner
SisadPdfmeForm
SisadPdfmeViewer
```

No construir manualmente el engine desde el host salvo un caso avanzado y documentado.

---

# 7. Integración mínima del Designer

```tsx
import { useMemo, useState } from 'react';
import {
  SisadPdfmeDesigner,
  createSisadPdfmeConfig,
  type SisadPdfmeRecipient,
  type SisadPdfmeDocument,
} from '@/sisad-pdfme';

export function DocumentDesigner() {
  const [template, setTemplate] = useState(initialTemplate);

  const recipients = useMemo<SisadPdfmeRecipient[]>(
    () => [
      {
        id: 'recipient-1',
        label: 'Cliente principal',
        name: 'Cliente principal',
        email: 'cliente@example.com',
        color: '#2563EB',
        role: 'signer',
      },
    ],
    [],
  );

  const documents = useMemo<SisadPdfmeDocument[]>(
    () => [
      {
        id: 'document-1',
        label: 'Contrato principal',
        name: 'Contrato principal',
        pageCount: 3,
        basePdf,
        template,
      },
    ],
    [template],
  );

  const config = useMemo(
    () =>
      createSisadPdfmeConfig({
        runtime: {
          mode: 'designer',
        },
        documents: {
          mode: 'single',
        },
        collaboration: {
          enabled: true,
          canEditStructure: true,
        },
        assignment: {
          enabled: true,
        },
      }),
    [],
  );

  return (
    <div className="h-[100dvh] min-h-0 overflow-hidden">
      <SisadPdfmeDesigner
        config={config}
        template={template}
        documents={documents}
        recipients={recipients}
        activeRecipientId="recipient-1"
        onTemplateChange={setTemplate}
        onSave={(nextTemplate) => {
          console.log('Guardar en el host', nextTemplate);
        }}
      />
    </div>
  );
}
```

## 7.1 Props públicas del Designer

```ts
type SisadPdfmeDesignerProps = {
  config?: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig;
  template: unknown;
  documents?: unknown[];
  recipients?: unknown[];
  activeRecipientId?: string | null;

  onTemplateChange?(template: unknown): void;
  onSave?(template: unknown): void;
  onControllerReady?(controller: SisadPdfmeController): void;

  onRecipientsChange?(recipients: SisadPdfmeRecipient[]): void;
  onActiveRecipientChange?(recipientId: string | null): void;
  onAssignmentChange?(payload: SisadPdfmeAssignmentChangePayload): void;
};
```

`template` es obligatorio.

---

# 8. Form y Viewer

## 8.1 Form

`SisadPdfmeForm` renderiza campos interactivos para captura.

```tsx
<SisadPdfmeForm
  config={config}
  template={template}
  values={values}
  recipients={recipients}
  activeRecipientId="recipient-1"
  onInputChange={({ index, name, value }) => {
    updateValue(index, name, value);
  }}
/>
```

Props relevantes:

```ts
config?
template
values?: unknown[]
recipients?: unknown[]
activeRecipientId?
onInputChange?({ index, name, value })
```

## 8.2 Viewer

`SisadPdfmeViewer` muestra el documento sin edición de datos:

```tsx
<SisadPdfmeViewer
  config={config}
  template={template}
  inputs={values}
  recipients={recipients}
  activeRecipientId="recipient-1"
/>
```

## 8.3 Selección correcta del wrapper

No cambiar un Designer montado a Viewer modificando solamente:

```ts
runtime.mode
```

Usar el wrapper correcto:

```txt
diseño     → SisadPdfmeDesigner
captura    → SisadPdfmeForm
solo vista → SisadPdfmeViewer
```

`runtime.mode` sigue participando en opciones y clasificación de cambios, pero no sustituye la selección del wrapper.

---

# 9. Modelo mental de configuración

Cada capacidad se evalúa con estados diferentes:

```txt
registered → existe en el core o plugin
supported  → el runtime actual la soporta
enabled    → su lógica está activada
visible    → su representación visual se muestra
permitted  → los permisos permiten usarla
available  → el contexto permite usarla
active     → está activa en este momento
executable → puede ejecutarse
reason     → motivo estable de bloqueo
sources    → rutas de config que participaron
```

## 9.1 Activar no es lo mismo que mostrar

Ejemplo:

```ts
assignment: {
  enabled: true,
},
visibility: {
  actions: {
    reassign: false,
  },
},
```

Resultado conceptual:

```txt
la capacidad de asignación está activada
el botón Reasignar está oculto
la API o CommandBus todavía puede tener la capacidad disponible
```

## 9.2 Mostrar deshabilitado

Una acción puede ser visible pero no ejecutable:

```txt
visible=true
executable=false
reason='selection-required'
```

La UI puede mostrar el botón deshabilitado con un tooltip explicativo.

---

# 10. Funcionalidades principales

## 10.1 Canvas

Incluye:

```txt
selección simple
selección múltiple
Selecto
Moveable
drag
resize
rotate
snap lines
guides
limpiar selección al hacer clic vacío
suspensión durante modales
```

Configuración principal:

```ts
canvas: {
  enabled: true,
  selecto: true,
  moveable: true,
  snapLines: true,
  guides: true,
  emptyClickClearsSelection: true,
  multiSelect: true,
  platformSelection: 'auto',
  suspendWhenModalOpen: true,
  resetInteractionOnModalClose: true,
}
```

No desactives `canvas.enabled` esperando conservar Designer funcional.

## 10.2 Sidebars

Sidebar izquierdo:

```txt
catálogo
búsqueda
layouts list/tiles/icons
schemas estándar
```

Sidebar derecho:

```txt
fields
detail
comments
documents
```

La visibilidad de un panel y su habilitación se controlan en rutas diferentes.

## 10.3 Recipients

El Recipient Registry centraliza:

```txt
destinatarios
destinatario activo
colores
permisos
snapshot de recipients
resolución del owner
```

Registrar recipients una sola vez mediante props o adapter.

No duplicarlos manualmente en:

```txt
collaboration.users
runtimeOptions
engine internals
schemas decorados por el host
```

## 10.4 Assignment

Permite cambiar owner/responsable de uno o varios schemas.

Para mostrar y ejecutar Reasignar normalmente se requiere:

```txt
assignment.enabled = true
visibility.actions.reassign = true
collaboration.canEditStructure = true
selección no vacía
recipients disponibles
```

## 10.5 Colaboración

Controla:

```txt
vista global
edición estructural
owner activo
apariencia por destinatario
locks
```

La colaboración no registra por sí sola servicios remotos. El host debe implementar sincronización o persistencia externa cuando sea necesaria.

## 10.6 Documentos

Soporta:

```txt
single
multi
routing de schema por documento y página
documento activo interno o controlado por host
```

En multi-documento, cada documento debe conservar su `template`.

## 10.7 Firma

Modos:

```txt
draw
image
p12
provider
```

`provider` requiere al menos un provider configurado.

El core no debe llamar directamente a una API específica del proveedor. El host aporta providers, adapter y callback/evento.

## 10.8 Comentarios

Existen:

```txt
comentarios de documento
comentarios de página
comentarios de schema
anchors
replies
resolve/reopen
```

La configuración tipada actual no declara `comments.enabled`. La forma pública segura de mostrar las superficies es mediante `visibility`.

## 10.9 Persistencia

Modos declarados:

```txt
none
local
host
```

La implementación actual incluye serialización/deserialización JSON, snapshot y callbacks. No existe todavía un motor automático completo que implemente por sí solo localStorage o una API remota.

## 10.10 Snapshot

El snapshot debe preservar:

```txt
template
documentos
schemas
schemaUid
documentId
pageNumber
geometría
owners
colores
groups/options
recipients
assignments
comentarios
firma
metadata
```

El controller añade snapshot de recipients cuando existe Registry.

## 10.11 Generator

La fachada exporta:

```ts
generateTemplatePdf
generatePdf
generatePdfBuffer
generatePdfWithPreflight
buildDynamicTemplate
```

Ejemplo:

```ts
const pdfBytes = await generatePdf({
  template,
  inputs,
  plugins,
});
```

Usar `generatePdfWithPreflight` cuando se necesite validar antes de generar.

## 10.12 Converter

Se exportan:

```ts
convertImagesToPdf
getPdfPageImages
getPdfPageSizes
```

## 10.13 External Forms

Se exportan utilidades como:

```txt
getSchemaVisibility
resolveExternalFormRuntimeState
areAllRequiredFieldsComplete
InMemoryExternalFormStorage
```

Estas utilidades ayudan a construir un runner externo, pero no reemplazan la persistencia ni el workflow del host.

---

# 11. Contratos de datos

## 11.1 Recipient

```ts
export type SisadPdfmeRecipient = {
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

El adapter también puede reconocer aliases como:

```txt
recipientId
userId
fullName
```

## 11.2 Document

```ts
export type SisadPdfmeDocument = {
  id: string;
  label: string;
  name?: string;
  pageCount?: number;
  basePdf?: unknown;
  template?: unknown;
  metadata?: Record<string, unknown>;
};
```

En multi-documento, no eliminar `template` durante la normalización.

## 11.3 Signature provider

```ts
export type SisadPdfmeSignatureProvider = {
  key: string;
  label: string;
  description?: string;
  capabilities?: string[];
  metadata?: Record<string, unknown>;
};
```

---

# 12. Schemas incorporados

Tipos incorporados observados:

```txt
text
multiVariableText
number
image
svg
signature
initials
dateSigned
fullName
emailAddress
company
title
table
line
rectangle
ellipse
dateTime
date
time
select
dropdown
radioGroup
checkbox
checkboxGroup
attachment
note
approve
decline
qrcode
japanpost
ean13
ean8
code39
code128
nw7
itf14
upca
upce
gs1datamatrix
pdf417
```

Fachada de schemas:

```ts
registerFieldPlugin
registerPlugins
getSchemaPluginByType
getBuiltInFields
getSchemaDefinition
getSchemaFamily
createDefaultSchema
generateUniqueSchemaName
validateSchemaNameUniqueness
changeSchemas
```

## 12.1 Plugin custom

En la implementación actual, `schemas.plugins` está tipado y validado, pero el wrapper del Designer sigue usando el catálogo plano incorporado.

Para registrar un plugin custom con el estado actual:

```ts
import { registerPlugins } from '@/sisad-pdfme';

registerPlugins([myCustomPlugin]);
```

Ejecutarlo antes de montar el Designer.

No asumir que solo agregar:

```ts
schemas: {
  plugins: [myCustomPlugin],
}
```

registrará automáticamente el plugin mientras no se cierre esa integración.

---

# 13. Configuración dinámica

Con controller:

```ts
controller.updateConfig({
  visibility: {
    sidebars: {
      right: {
        panels: {
          comments: true,
        },
      },
    },
  },
});
```

Los cambios de presentación deben conservar recursos estables.

Cambios estructurales pueden reconstruir recursos.

## 13.1 Recursos estables por Provider

```txt
SisadPdfmeConfigService
RecipientRegistry
EventHub
adapters base
controller
```

## 13.2 Recursos reconstruibles

```txt
DesignerEngine
runtimeOptions
plugins resueltos
signature providers
```

## 13.3 Cambios estructurales

La implementación clasifica como estructurales:

```txt
schemas
recipients
collaboration
assignment
documents
signatures
persistence
events
runtime.mode
```

## 13.4 Cambios de presentación

Incluyen:

```txt
app
runtime no estructural
theme
canvas
sidebars
visibility
ui
debug
```

---

# 14. Presets recomendados

## 14.1 Designer completo

```ts
const designerConfig = createSisadPdfmeConfig({
  runtime: {
    mode: 'designer',
    readonly: false,
  },
  collaboration: {
    enabled: true,
    canEditStructure: true,
  },
  assignment: {
    enabled: true,
  },
  documents: {
    mode: 'multi',
    preserveDocumentSchemaRouting: true,
  },
  visibility: {
    sidebars: {
      right: {
        panels: {
          fields: true,
          detail: true,
          comments: true,
          documents: true,
        },
      },
    },
  },
});
```

## 14.2 Designer readonly

```ts
const reviewConfig = createSisadPdfmeConfig({
  runtime: {
    mode: 'designer',
    readonly: true,
  },
  assignment: {
    enabled: false,
  },
  visibility: {
    actions: {
      duplicate: false,
      delete: false,
      paste: false,
      reassign: false,
      lock: false,
      unlock: false,
      align: false,
      distribute: false,
      matchSize: false,
    },
  },
});
```

## 14.3 Form por destinatario

```ts
const formConfig = createSisadPdfmeConfig({
  runtime: {
    mode: 'form',
    readonly: false,
  },
  recipients: {
    enabled: true,
    activeRecipientId: 'recipient-1',
  },
  visibility: {
    runtime: {
      recipientFilter: true,
      ownerColor: true,
    },
  },
});
```

## 14.4 Viewer mínimo

```ts
const viewerConfig = createSisadPdfmeConfig({
  runtime: {
    mode: 'viewer',
    readonly: true,
  },
  sidebars: {
    left: {
      enabled: false,
    },
    right: {
      enabled: false,
    },
  },
  visibility: {
    shell: {
      header: false,
      footer: false,
      statusBar: false,
      resultsPanel: false,
      debugPanel: false,
    },
    canvas: {
      toolbar: false,
      floatingToolbar: false,
      contextMenu: false,
      pageNavigator: true,
      zoomControls: true,
    },
  },
});
```

---

# 15. Reglas de integración

## Hacer

```txt
copiar toda la carpeta
registrar aliases
instalar dependencias
configurar Tailwind
usar wrappers públicos
memoizar config, documents y recipients
conservar template en documentos
usar callbacks del host
registrar plugins antes de montar
usar controller solo para API realmente implementada
```

## No hacer

```txt
importar Canvas desde el host
abrir manualmente AssignmentDialog
inyectar usuarios en varios contextos
usar window.innerWidth como fuente del core
sobrescribir clases internas con CSS del host
alterar .moveable-* o .selecto-*
recrear config inline en cada render
perder document.template al normalizar
suponer que persistence.mode guarda automáticamente
suponer que todos los métodos del controller están implementados
```

---

# 16. Diagnóstico rápido

## El layout aparece sin estilo

Verificar:

```txt
se importa desde @/sisad-pdfme/react o fachada pública
Tailwind escanea src/sisad-pdfme
tokens.css existe
sisad-pdfme.css existe
el CSS raíz emite Tailwind
```

## PDF vacío en multi-documento

Verificar:

```txt
document.id
document.basePdf
document.template
activeDocumentStrategy
preserveDocumentSchemaRouting
```

## Reasignar no aparece

Verificar:

```txt
assignment.enabled
visibility.actions.reassign
collaboration.canEditStructure
selectionCount > 0
recipients.length > 0
```

## Comments no aparece

Verificar:

```txt
visibility.sidebars.right.panels.comments
visibility.modals.comments
sidebars.right.panels incluye comments
```

## Plugin custom no aparece

Verificar:

```txt
registerPlugins ejecutado antes del mount
plugin id/type único
plugin exportado
Tailwind incluye sus clases
```

## Cambio de config remonta el runtime

Verificar si el patch toca:

```txt
schemas
recipients
collaboration
assignment
documents
signatures
persistence
events
runtime.mode
```

---

# 17. Límites actuales importantes

La implementación actual tiene APIs declaradas que todavía son parciales.

No presentar como completamente funcional sin verificación:

```txt
controller.addSchema
controller.updateSchema
controller.removeSchemas
controller.duplicateSchemas
controller.setActiveDocument
controller.validate
persistence automática local/host
comments.enabled tipado
schemas.plugins automático desde config
schemas.enabledTypes aplicado a todas las superficies
todos los config.events conectados por los wrappers
```

Consultar el reporte de gaps incluido en este paquete.

---

# 18. Criterio de integración terminada

La integración está lista cuando:

```txt
[ ] el proyecto compila;
[ ] Designer carga con estilos;
[ ] Form captura valores;
[ ] Viewer renderiza readonly;
[ ] PDF.js carga páginas;
[ ] documentos conservan template;
[ ] recipients mantienen owner/color;
[ ] Reasignar funciona cuando corresponde;
[ ] snapshot restaura recipients y template;
[ ] generator produce PDF;
[ ] plugins custom aparecen;
[ ] no hay imports del host dentro de src/sisad-pdfme;
[ ] no hay CSS del host apuntando a internals;
[ ] los gates focales están verdes.
```
