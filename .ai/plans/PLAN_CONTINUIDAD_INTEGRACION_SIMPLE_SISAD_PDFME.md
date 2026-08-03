# Plan de continuidad — Integración simple y portable de SISAD PDFME

**Proyecto:** `prueba-plugin`  
**Ámbito:** `src/sisad-pdfme` y migración de `src/examples`  
**Objetivo final:** copiar el componente en otro proyecto y limitar la integración del host a tres registros:

1. datos;
2. configuración;
3. instancia.

La página consumidora debe montar una instancia ya definida, sin reconstruir estado, recipients, documentos, callbacks, plugins, sidebars, controller ni runtime.

---

# 1. Estado actual confirmado

La implementación ya avanzó de manera importante.

## 1.1 Capacidades ya incorporadas

Actualmente existen:

- `SisadPdfmeInstance`;
- `useSisadPdfmeInstance`;
- `resolveSisadPdfmeInstance`;
- selección automática de `Designer`, `Form` o `Viewer`;
- separación entre `definition`, `resources` y `handlers`;
- estado interno para:
  - template;
  - inputs;
  - recipients;
  - documents;
  - activeRecipientId;
  - activeDocumentId;
- soporte controlado por campo mediante `state`;
- soporte inicial no controlado mediante `defaultState`;
- merge de `state` y `defaultState` por campo;
- merge profundo de configuración;
- combinación de plugins;
- providers de firma;
- normalización de datos del host;
- `templateKey`;
- `templateRecipe`;
- validación básica de definición;
- bundle serializable;
- serialize/parse del bundle;
- pruebas focales verdes.

## 1.2 Archivos principales ya creados

```text
src/sisad-pdfme/integration/
├── SisadPdfmeInstance.tsx
├── resolveSisadPdfmeInstance.ts
├── SisadPdfmeInstanceBundle.ts
├── validateSisadPdfmeInstanceDefinition.ts
├── normalizeHostData.ts
└── index.ts

src/sisad-pdfme/templates/
├── createDefaultTemplate.ts
├── createTemplateFromRecipe.ts
└── index.ts
```

## 1.3 Verificación reportada

Se reportó:

```text
18 pruebas de integración/bundle aprobadas
4 pruebas focales del bundle aprobadas en ejecución aislada
git diff --check limpio
```

Esto demuestra que la base existe. Sin embargo, todavía no demuestra portabilidad completa, ausencia de remount, paridad multidocumento ni integración mínima desde otro proyecto.

---

# 2. Veredicto técnico

La arquitectura declarativa dejó de ser solo una propuesta y ya es ejecutable.

El estado aproximado es:

```text
Fachada declarativa base                 avanzada
Estado interno por campo                 avanzado
Validación                               inicial
Bundle JSON                              inicial
Recipes                                  inicial/intermedio
Migración de examples                    pendiente
Instancia registrada en un solo objeto   pendiente
Portabilidad visual autónoma             pendiente
Defaults completamente habilitados       pendiente
Paridad Designer/Form/Viewer              parcial
Persistencia/snapshot real               pendiente
Consumer test externo                    pendiente
```

La siguiente etapa no debe seguir agregando helpers aislados. Debe cerrar el contrato de consumo final.

---

# 3. Bloqueantes actuales

## P0-1 — La configuración puede reconstruir engine y EventHub en cada render

`SisadPdfmeInstance` resuelve usando:

```ts
useMemo(
  () => resolveSisadPdfmeInstance(props, runtimeState),
  [props, runtimeState],
);
```

El objeto `props` cambia de identidad cuando el padre renderiza nuevamente.

Además:

```text
resolveSisadPdfmeInstance
→ mergeConfigs
→ nuevo objeto config
→ SisadPdfmeDesigner
→ useSisadPdfmeConfigService(config)
→ nuevo ConfigService
→ nuevo resolved config
→ nuevo DesignerEngine/EventHub
```

Esto contradice el caso de uso de no-remount y puede provocar:

- recreación de recursos;
- resuscripción de eventos;
- sincronizaciones de template innecesarias;
- pérdida de edición local;
- degradación con templates grandes;
- efectos repetidos.

### Corrección

La configuración debe compilarse una sola vez por instancia registrada.

Crear:

```text
src/sisad-pdfme/integration/defineSisadPdfmeInstance.ts
```

La función debe devolver un objeto estable.

```ts
export type SisadPdfmeRegisteredInstance = {
  id: string;
  definition: SisadPdfmeInstanceDefinition;
  resources: SisadPdfmeInstanceResources;
  handlers?: SisadPdfmeInstanceHandlers;
};

export function defineSisadPdfmeInstance(
  input: SisadPdfmeRegisteredInstance,
): SisadPdfmeRegisteredInstance;
```

`SisadPdfmeInstance` debe aceptar:

```tsx
<SisadPdfmeInstance instance={contractDesignerInstance} />
```

y conservar por compatibilidad:

```tsx
<SisadPdfmeInstance
  definition={definition}
  resources={resources}
  handlers={handlers}
/>
```

La ruta `instance` debe ser la recomendada.

---

## P0-2 — No existe un entrypoint raíz único

Actualmente el consumidor debe conocer entrypoints como:

```text
@/sisad-pdfme/react
@sisad-pdfme/common
@sisad-pdfme/integration
```

Para copiar y pegar con mínima configuración debe existir:

```text
src/sisad-pdfme/index.ts
```

Debe exportar únicamente la API pública necesaria:

```ts
export {
  SisadPdfmeInstance,
  defineSisadPdfmeInstance,
  createSisadPdfmeConfig,
  createSisadPdfmeInstanceBundle,
  parseSisadPdfmeInstanceBundle,
  serializeSisadPdfmeInstanceBundle,
} from './integration/index.js';

export {
  SisadPdfmeDesigner,
  SisadPdfmeForm,
  SisadPdfmeViewer,
  SisadPdfmeProvider,
} from './react/index.js';
```

Los examples no deben usar imports profundos.

---

## P0-3 — Los defaults no tienen todo habilitado

La configuración actual deshabilita o esconde por defecto varias funciones:

```text
collaboration.enabled = false

left.allowCustomFields = false

visibility.left.customFields = false
visibility.left.favorites = false
visibility.left.recent = false
visibility.left.recipients = false

visibility.right.comments = false
visibility.right.documents = false

visibility.actions.rename = false
visibility.actions.hide = false
visibility.actions.show = false

visibility.inspector.showComments = false

visibility.modals.customField = false
visibility.modals.comments = false

persistence.mode = none
persistence.autosave = false
```

Por tanto, el requisito “todo habilitado por defecto” todavía no se cumple.

### Regla recomendada

Separar cuatro conceptos:

```text
enabled     → la capacidad forma parte de la instancia
visible     → la UI puede mostrarla
available   → existen los datos/recursos necesarios
executable  → el contexto actual permite ejecutarla
```

Una capacidad puede estar habilitada por defecto y quedar temporalmente deshabilitada con una razón si falta un recurso.

Ejemplo:

```text
Firma externa habilitada
+ sin provider registrado
→ selector disponible
→ opción provider deshabilitada
→ motivo: “Registra un proveedor de firma”
```

No se debe simular una ejecución que no tiene adapter.

### Defaults funcionales recomendados

```ts
collaboration: {
  enabled: true,
  isGlobalView: false,
  canEditStructure: true,
}

sidebars: {
  left: {
    enabled: true,
    defaultOpen: true,
    allowCustomFields: true,
  },
  right: {
    enabled: true,
    defaultOpen: true,
    panels: ['fields', 'detail', 'comments', 'documents'],
  },
}

visibility: {
  sidebars: {
    left: {
      visible: true,
      search: true,
      tabs: true,
      catalog: true,
      customFields: true,
      favorites: true,
      recent: true,
      recipients: true,
    },
    right: {
      visible: true,
      tabs: true,
      panels: {
        fields: true,
        detail: true,
        comments: true,
        documents: true,
      },
    },
  },
  actions: {
    reassign: true,
    rename: true,
    duplicate: true,
    delete: true,
    copy: true,
    paste: true,
    lock: true,
    unlock: true,
    hide: true,
    show: true,
    align: true,
    distribute: true,
    matchSize: true,
  },
  inspector: {
    visible: true,
    showCollaboration: true,
    showComments: true,
  },
  modals: {
    assignment: true,
    schemaDropSetup: true,
    customField: true,
    comments: true,
    shortcutHelp: true,
  },
}
```

### Excepciones correctas

No deben activarse automáticamente efectos externos inseguros:

```text
debug logging
autosave remoto
firma con proveedor
persistencia host
webhooks
descargas automáticas
```

Estas capacidades quedan habilitadas, pero solo ejecutables cuando el host registra el adapter o handler requerido.

---

## P0-4 — Los examples siguen enseñando la integración antigua

Las páginas actuales siguen usando:

```text
useState
useExampleRuntimeConfig
useExampleController
useExampleEventLog
buildShowcaseTemplate
SisadPdfmeDesigner/Form/Viewer
callbacks sueltos
```

La página multiusuario todavía tiene alrededor de 186 líneas.

La prueba definitiva de la arquitectura debe ser migrar los ejemplos a:

```tsx
export function DesignerMultiUserPage() {
  return (
    <RuntimePageShell ...>
      <SisadPdfmeInstance instance={designerMultiUserInstance} />
    </RuntimePageShell>
  );
}
```

El ejemplo puede conservar UI de diagnóstico, pero la orquestación runtime debe estar en el archivo de instancia.

---

## P0-5 — El bundle no es todavía un workspace portable completo

`SisadPdfmeInstanceBundle` omite adapters, lo cual es correcto, pero aún puede intentar clonar:

- plugins con funciones;
- configuraciones resueltas con engine;
- providers con callbacks;
- recursos binarios;
- objetos no clonables.

`structuredClone` falla con funciones.

Además, el bundle actual no representa todavía:

- snapshot oficial;
- assets;
- PDF binario;
- manifest;
- checksums;
- migraciones;
- estado del workspace.

### Corrección

Separar:

```text
InstanceDefinition
→ JSON declarativo

InstanceData
→ datos serializables

InstanceRuntime
→ plugins, adapters, callbacks y servicios no serializables

WorkspaceSnapshot
→ template, documents, inputs, recipients, assignments y comentarios

PortablePackage
→ definition + data + snapshot + assets + manifest
```

No incluir plugins o handlers dentro del JSON.

---

# 4. Problemas funcionales importantes

## 4.1 Semántica ambigua de campos directos

Actualmente:

```ts
definition.template
definition.inputs
definition.documents
```

se comportan como valores iniciales, porque el `runtimeState` tiene prioridad sobre ellos.

Sin embargo, un consumidor puede interpretar que son valores controlados.

### Contrato obligatorio

```text
state
→ controlado

defaultState
→ inicial no controlado

definition.templateKey / templateRecipe
→ forma declarativa de obtener el valor inicial

resources
→ datos registrados disponibles

campos directos viejos
→ compatibilidad deprecada
```

Los campos directos deben documentarse como compatibilidad y retirarse progresivamente.

---

## 4.2 Falta reset al cambiar de instancia o registro

El estado interno permanece aunque el host cambie la definición.

Ejemplo:

```text
contrato A
→ usuario edita

host carga contrato B
→ runtimeState anterior puede seguir ganando
```

Agregar:

```ts
id: string;
revision?: string | number;
```

Cuando cambie `instance.id` o `revision`, la instancia debe reiniciar su estado interno con `defaultState`.

No resetear por cada render.

---

## 4.3 Falta callback único de estado

Actualmente existen callbacks separados.

Agregar:

```ts
onStateChange?: (
  nextState: SisadPdfmeInstanceStateInput,
  change: {
    field:
      | 'template'
      | 'inputs'
      | 'recipients'
      | 'documents'
      | 'activeRecipientId'
      | 'activeDocumentId';
    source: 'user' | 'runtime' | 'host';
  },
) => void;
```

Los callbacks específicos continúan por compatibilidad.

Esto facilita persistencia host y auditoría.

---

## 4.4 `activeRecipientId` pierde semántica de vista global

El estado puede guardar `null`, pero `normalizeHostData` lo convierte al primer recipient o `''`.

Se debe distinguir:

```text
null → vista global o ningún recipient, según config
''   → valor inválido/no resuelto
id   → recipient activo
```

Crear:

```text
resolveActiveRecipient.ts
```

Debe validar:

- existencia;
- enabled;
- copy-only;
- capacidad de ownership;
- global view.

---

## 4.5 Multidocumento incompleto en Form y Viewer

Designer recibe documentos. Form y Viewer reciben `activeDocumentId`, pero la superficie runtime no demuestra todavía paridad completa con documentos.

Agregar y probar:

```text
documents
activeDocumentId
onActiveDocumentChange
document order
document/page routing
Form multidocumento
Viewer multidocumento
```

---

## 4.6 Recipe todavía tiene riesgos

El builder corrigió el `pageNumber`, pero mantiene problemas:

### IDs duplicados entre grupos

El `typeIndex` se reinicia por grupo.

Dos grupos con `text` como primera entrada pueden producir el mismo ID en la misma página.

Usar un contador global o IDs declarados.

### PDF real

`basePdf` puede ser binario. No debe tratarse siempre como un objeto de página en blanco.

Separar:

```text
blankPage
importedPdf
```

### Tipos inválidos

Un typo no debe crear silenciosamente un schema genérico.

Debe producir un issue.

### Recipe objetivo

```ts
type TemplateRecipeField = {
  id: string;
  type: string;
  name?: string;
  page?: number;
  documentId?: string;
  ownerId?: string;
  required?: boolean;
  readOnly?: boolean;
  value?: unknown;
  options?: unknown[];
  size?: { width: number; height: number };
  properties?: Record<string, unknown>;
};
```

---

# 5. Arquitectura objetivo del host

```text
src/pdfme/
├── data/
│   └── contract.data.ts
├── config/
│   ├── designer.config.ts
│   ├── form.config.ts
│   └── viewer.config.ts
├── instances/
│   ├── contract-designer.instance.ts
│   ├── contract-form.instance.ts
│   └── contract-viewer.instance.ts
└── handlers/
    └── contract.handlers.ts
```

## 5.1 Datos

```ts
// data/contract.data.ts

export const contractData = {
  template: contractTemplate,
  documents: contractDocuments,
  recipients: contractRecipients,
  inputs: contractInputs,
  signatureProviders,
};
```

## 5.2 Configuración Designer

```ts
// config/designer.config.ts

import { createSisadPdfmeConfig } from '@/sisad-pdfme';

export const designerConfig = createSisadPdfmeConfig({
  runtime: {
    mode: 'designer',
    readonly: false,
  },
});
```

No es necesario habilitar manualmente canvas, schemas, sidebars, documentos, comentarios o assignment si el default es completo.

## 5.3 Instancia

```ts
// instances/contract-designer.instance.ts

import {
  defineSisadPdfmeInstance,
} from '@/sisad-pdfme';

import { contractData } from '../data/contract.data';
import { designerConfig } from '../config/designer.config';
import { contractHandlers } from '../handlers/contract.handlers';

export const contractDesignerInstance = defineSisadPdfmeInstance({
  id: 'contract-designer',
  definition: {
    version: 1,
    mode: 'designer',
    defaultState: contractData,
  },
  resources: {
    config: designerConfig,
  },
  handlers: contractHandlers,
});
```

## 5.4 Página

```tsx
import {
  SisadPdfmeInstance,
} from '@/sisad-pdfme';

import {
  contractDesignerInstance,
} from './pdfme/instances/contract-designer.instance';

export function ContractDesignerPage() {
  return <SisadPdfmeInstance instance={contractDesignerInstance} />;
}
```

Esta es la aceptación principal del plan.

---

# 6. Orden de ejecución recomendado

## Wave 1 — Contrato de consumo final

### PORT-001 — Instancia registrada

Crear:

```text
src/sisad-pdfme/integration/defineSisadPdfmeInstance.ts
```

Agregar prop `instance` a `SisadPdfmeInstance`.

### PORT-002 — Entry point raíz

Crear:

```text
src/sisad-pdfme/index.ts
```

Eliminar imports profundos de examples.

### PORT-003 — Estabilidad de configuración

Evitar reconstruir ConfigService, engine, EventHub y adapters por render.

Criterio:

```text
rerender del host
→ mismo ConfigService
→ mismo engine
→ mismo EventHub
→ misma selección
→ mismo zoom
```

### PORT-004 — Semántica de estado

Formalizar:

```text
state
defaultState
id/revision
onStateChange
reset
```

---

## Wave 2 — Default completo y paridad funcional

### PORT-005 — Defaults funcionales completos

Habilitar capacidades built-in por defecto.

Mantener side effects externos condicionados por adapters.

### PORT-006 — Multidocumento uniforme

Cerrar Designer/Form/Viewer.

### PORT-007 — Active recipient y global view

Resolver IDs válidos y permisos.

### PORT-008 — Action/capability states

Usar:

```text
enabled
visible
available
executable
reason
```

Corregir Reasignar:

```text
assignableRecipientCount > 1
```

No `> 2`.

---

## Wave 3 — Migración de examples

Orden:

```text
Viewer
Form
SchemaFamily
DesignerSingleUser
DesignerMultiUser
```

Eliminar después:

```text
useExampleRuntimeConfig
useExampleController
builders duplicados
normalización residual
callbacks runtime repetidos
```

No eliminar `ExampleEventLog` ni UI de diagnóstico.

---

## Wave 4 — Portabilidad real

### PORT-009 — Estilos autocontenidos

Actualmente el CSS principal está vacío y gran parte del diseño depende de Tailwind compilado por el host.

Para copiar y pegar sin modificar Tailwind del host se necesita:

```text
dist/sisad-pdfme.css
```

precompilado, namespaced y cargado desde el entrypoint.

Los tokens deben quedar bajo el root del componente cuando sea posible.

### PORT-010 — Package/manifest

Entregar junto al componente:

```text
package.json o manifest de dependencias
exports públicos
CSS compilado
README de 5 minutos
consumer test
script de validación
```

### PORT-011 — Consumer test externo

Crear una app mínima de prueba que solo haga:

```tsx
<SisadPdfmeInstance instance={instance} />
```

No debe importar internals ni añadir CSS del core manualmente.

---

## Wave 5 — Bundle y snapshot

### PORT-012 — Bundle serializable seguro

Excluir:

```text
adapters
handlers
plugins con funciones
config resuelta con engine
eventHub
controllers
binary object URLs
```

### PORT-013 — Workspace snapshot

Reutilizar el snapshot oficial ya existente.

### PORT-014 — Package portable

Unir:

```text
definition
data
snapshot
assets
manifest
version
checksums
```

---

# 7. Gates obligatorios

```bash
npm run typecheck
npm run build
npm run lint
npm run test:unit
npx vitest run tests/unit/sisad-pdfme/integration
npx playwright test tests/e2e/examples-layout.spec.ts
npm run quality:direct-config-readers
npm run quality:example-style-boundary
npm run quality:source-language-boundary
```

Agregar pruebas:

```text
registered instance renders
rerender does not replace engine
changing instance id resets internal state
changing revision resets internal state
same id preserves internal state
full defaults expose all built-in features
missing adapter returns reason
Viewer declarative
Form declarative
Designer declarative
multi-document Form/Viewer
recipe duplicate IDs
unknown schema type
bundle with plugin function
bundle snapshot round-trip
copy-paste consumer build
```

---

# 8. Prompt para Codex

```text
Actúa como arquitecto frontend senior experto en React, TypeScript, Vite, Tailwind, pdfme y diseño de librerías portables.

Proyecto:
~/Documents/Taylor/frontend/prueba-plugin

Objetivo:
Cerrar la integración declarativa de src/sisad-pdfme para que un host solo registre:
1. datos,
2. configuración,
3. instancia.

La página final debe montar:
<SisadPdfmeInstance instance={registeredInstance} />

Estado actual:
- Existe SisadPdfmeInstance.
- Existe estado interno por campo.
- Existe state/defaultState.
- Existen activeDocumentId, plugins y signatureProviders.
- Existe validación básica.
- Existe bundle JSON.
- Los examples aún usan wrappers bajos y orquestación propia.
- defaultSisadPdfmeConfig todavía deshabilita varias funciones.
- resolveSisadPdfmeConfig crea engine/EventHub/adapters.
- La instancia puede recrear config por render.

Prioridades:
P0:
1. Crear defineSisadPdfmeInstance.
2. Agregar soporte instance={...} a SisadPdfmeInstance.
3. Crear src/sisad-pdfme/index.ts.
4. Evitar reconstruir ConfigService/DesignerEngine/EventHub en rerenders.
5. Formalizar id/revision/reset/onStateChange.
6. Habilitar por defecto todas las capacidades built-in seguras.
7. Mantener side effects externos condicionados por adapters.
8. Migrar primero RuntimeViewerPage y RuntimeFormPage.

Contrato de archivos del host:
data/*.data.ts
config/*.config.ts
instances/*.instance.ts
handlers/*.handlers.ts

Reglas estrictas:
- No importar internals desde examples.
- No mover lógica de negocio del host al core.
- No crear otro sistema de configuración.
- Reutilizar SisadPdfmeConfigService.
- No crear otro snapshot.
- No crear otro event bus.
- No crear otro RecipientRegistry.
- No tocar Moveable/Selecto en esta tarea.
- No tocar geometría del canvas.
- No usar setTimeout.
- No resolver con z-index.
- No añadir nombres “canonical”, “legacy” o “manager” salvo compatibilidad técnica existente.
- Usar nombres directos: instance, data, config, state, defaultState, resources, handlers.
- No borrar APIs bajas Designer/Form/Viewer.
- Mantener compatibilidad con definition/resources/handlers.
- Máximo 8 archivos abiertos inicialmente.
- Máximo 6 archivos modificados por task-card.
- Máximo 2 rondas de búsqueda sin nueva evidencia.
- Si el alcance crece, detenerse y crear una nueva task-card.

Semántica de defaults:
- Canvas, sidebars, schemas built-in, recipients, collaboration, assignment,
  documents, signatures, comments, custom fields, favorites y recent deben
  estar habilitados por defecto.
- Debug permanece apagado.
- Autosave remoto, providers externos y persistencia host solo son ejecutables
  cuando exista adapter/handler.
- Una función habilitada sin recursos debe quedar disabled con reason, no fallar
  ni ejecutar un no-op silencioso.

Primera task-card:
PORT-001 — Instancia registrada y estabilidad de recursos.

Archivos foco:
src/sisad-pdfme/integration/SisadPdfmeInstance.tsx
src/sisad-pdfme/integration/resolveSisadPdfmeInstance.ts
src/sisad-pdfme/integration/index.ts
src/sisad-pdfme/integration/defineSisadPdfmeInstance.ts
src/sisad-pdfme/index.ts
tests/unit/sisad-pdfme/integration/SisadPdfmeInstance.test.ts

Criterios:
- defineSisadPdfmeInstance devuelve un objeto estable y tipado.
- SisadPdfmeInstance acepta instance.
- La API anterior continúa funcionando.
- Rerender con la misma instancia conserva ConfigService, engine y EventHub.
- Cambio de instance.id reinicia internal state.
- Cambio de revision reinicia internal state.
- Mismo id/revision conserva template, inputs y documents internos.
- No se recrea engine por cambios de inputs o activeRecipientId.
- Pruebas focales y typecheck pasan.

Después de PORT-001:
- detenerse;
- reportar archivos;
- reportar pruebas;
- reportar riesgos;
- no iniciar PORT-002 automáticamente.
```

---

# 9. Criterio final de aceptación

La integración estará lista cuando un proyecto nuevo pueda hacer esto:

```text
copiar paquete/carpeta
instalar dependencias
registrar data
registrar config
registrar instance
renderizar componente
```

y no necesite:

```text
crear RecipientRegistry
crear DesignerEngine
crear EventHub
normalizar documentos manualmente
normalizar recipients manualmente
construir collaborationContext
abrir modales internos
gestionar sidebars
gestionar selección
gestionar controller
importar CSS interno manualmente
modificar Tailwind content
importar rutas profundas
```

La demostración final debe ser una app consumidora mínima y los examples migrados a la misma API que usará cualquier proyecto real.
