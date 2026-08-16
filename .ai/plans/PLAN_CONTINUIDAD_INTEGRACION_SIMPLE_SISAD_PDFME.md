# Plan de continuidad — Integración simple y portable de SISAD PDFME

**Proyecto:** `prueba-plugin`  
**Ámbito:** `src/sisad-pdfme` y migración de `src/`  
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
Migración de                     pendiente
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

Los  no deben usar imports profundos.

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

## P0-4 — Los  siguen enseñando la integración antigua

Las páginas actuales siguen usando:

```text
useState
useRuntimeConfig
useController
useEventLog
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

---

> Este plan se partió en tres por presupuesto de contexto: 1113 líneas no
> caben en el máximo que exige `.ai/CONTEXT-BUDGET.md`. El contenido no se
> tocó; sólo se cortó en fronteras de sección de nivel 1.
>
> - Problemas funcionales y arquitectura objetivo: [PLAN_CONTINUIDAD_INTEGRACION_SIMPLE_PROBLEMAS.md](./PLAN_CONTINUIDAD_INTEGRACION_SIMPLE_PROBLEMAS.md)
> - Orden de ejecución, gates y aceptación: [PLAN_CONTINUIDAD_INTEGRACION_SIMPLE_EJECUCION.md](./PLAN_CONTINUIDAD_INTEGRACION_SIMPLE_EJECUCION.md)
