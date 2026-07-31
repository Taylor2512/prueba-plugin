# Plan maestro — arquitectura de instancias declarativas SISAD PDFME

**Objetivo:** trasladar la orquestación genérica que hoy vive en `src/examples`
hacia `src/sisad-pdfme`, manteniendo el core en TypeScript/TSX y reduciendo los
ejemplos a JavaScript/JSX/JSON declarativo.

## 1. Evidencia inicial

La estructura actual contiene páginas de ejemplos de 55–184 líneas, un panel
de controller de 200 líneas y utilidades como `runtimeConfig.js`,
`showcaseTemplate.js`, `multiUserExample.js`, `exampleBuilder.js` y
`exampleBundle.js`. Los ejemplos construyen estado, callbacks, templates,
colores, ownership, merges de configuración, eventos y bundles.

El core ya dispone de:

```txt
config service y registries
normalizeHostData
adapters de recipients/documents/signatures
RecipientRegistry
schemaController
controller React
generator/converter
snapshot
Designer/Form/Viewer
```

La brecha no es una ausencia total de funciones. La brecha es la falta de una
fachada declarativa de alto nivel que componga esas capacidades.

## 2. Decisión arquitectónica

Agregar una API de conveniencia, sin eliminar las APIs de bajo nivel:

```txt
SisadPdfmeDesigner
SisadPdfmeForm
SisadPdfmeViewer
             ↑
      SisadPdfmeInstance
```

`SisadPdfmeInstance` consume:

```txt
definition   JSON-safe y versionada
resources    valores no serializables o pesados
handlers     callbacks del host
```

### 2.1 Definition

```ts
type SisadPdfmeInstanceDefinition = {
  version: 1;
  id?: string;
  mode: 'designer' | 'form' | 'viewer';
  config?: SisadPdfmeGlobalConfig;

  template?: Template;
  templateRecipe?: SisadPdfmeTemplateRecipe;

  recipients?: SisadPdfmeRecipientDefinition[];
  activeRecipientId?: string | null;

  documents?: SisadPdfmeDocumentDefinition[];
  activeDocumentId?: string | null;

  values?: unknown[];
  initialState?: {
    page?: number;
    zoom?: number;
    selectedSchemaIds?: string[];
  };
};
```

### 2.2 Resources

No todo puede vivir en JSON. Plugins, callbacks, `Uint8Array`, Blob y providers
con funciones deben entrar por una frontera separada:

```ts
type SisadPdfmeInstanceResources = {
  templates?: Record<string, Template>;
  basePdfs?: Record<string, Template['basePdf']>;
  plugins?: unknown[];
  signatureProviders?: unknown[];
  adapters?: SisadPdfmeHostDataAdapters;
};
```

### 2.3 Handlers

```ts
type SisadPdfmeInstanceHandlers = {
  onReady?: (payload: unknown) => void;
  onChange?: (payload: unknown) => void;
  onSave?: (payload: unknown) => void;
  onError?: (error: unknown) => void;
  onSelectionChange?: (payload: unknown) => void;
  onRecipientsChange?: (payload: unknown) => void;
  onActiveRecipientChange?: (id: string | null) => void;
  onAssignmentChange?: (payload: unknown) => void;
  onDocumentChange?: (payload: unknown) => void;
  onSignatureRequest?: (payload: unknown) => void;
};
```

## 3. Estructura objetivo

```txt
src/sisad-pdfme/
├── instance/
│   ├── instanceTypes.ts
│   ├── instanceDefinitionSchema.ts
│   ├── instanceDefinitionMigration.ts
│   ├── resolveSisadPdfmeInstance.ts
│   ├── createSisadPdfmeInstance.ts
│   ├── instanceState.ts
│   ├── instanceDiagnostics.ts
│   └── index.ts
├── templates/
│   ├── createDefaultTemplate.ts
│   ├── templateRecipeTypes.ts
│   ├── createTemplateFromRecipe.ts
│   └── schemaRecipeLayout.ts
├── config/
│   ├── schemaTypePolicy.ts
│   └── actionConfigRegistry.ts
├── integration/
│   ├── normalizeHostData.ts
│   ├── portableBundle.ts
│   └── index.ts
├── react/
│   ├── SisadPdfmeInstance.tsx
│   ├── useSisadPdfmeInstance.ts
│   └── index.ts
└── runtime/
    ├── instanceEventDispatcher.ts
    └── usePdfmeArtifacts.ts
```

Los nombres son propuestos. Cada tarea debe confirmar si la responsabilidad ya
existe antes de crear un archivo nuevo.

## 4. Estructura final de examples

```txt
src/examples/
├── config/
│   ├── designer-single-user.json
│   ├── designer-multi-user.json
│   ├── runtime-form.json
│   ├── runtime-viewer.json
│   └── schema-families.json
├── components/
│   ├── ExampleDocumentationShell.jsx
│   ├── ExampleImmersiveShell.jsx
│   ├── ExampleRuntimePage.jsx
│   └── RouteCard.jsx
├── pages/
│   ├── DesignerSingleUserPage.jsx
│   ├── DesignerMultiUserPage.jsx
│   ├── RuntimeFormPage.jsx
│   ├── RuntimeViewerPage.jsx
│   ├── SchemaFamilyPage.jsx
│   └── advanced/
│       ├── ControllerExamplePage.jsx
│       ├── EventsExamplePage.jsx
│       └── ArtifactsExamplePage.jsx
└── data/
    ├── familyCatalog.js
    └── labRoutes.jsx
```

## 5. Reglas de schemas

La resolución debe distinguir:

```txt
registered
supported
enabled
visible
permitted
available
active
executable
reason
sources
```

Política:

```txt
registered types
→ enabledTypes allowlist, si existe
→ disabledTypes denylist
→ runtime support
→ permissions
→ visibility por superficie
```

`visibility.schemas.*` nunca debe desregistrar una capacidad.

## 6. Regla automática de Reasignar responsable

La acción debe resolverse una sola vez en Action Registry:

```txt
visible:
  assignment.enabled
  visibility.actions.reassign != false
  modal assignment visible
  assignableRecipientCount > 1
  selectionCount > 0

enabled/executable:
  visible
  runtime no readonly
  canEditStructure
  selection editable
```

Con 0–1 recipients asignables la acción permanece oculta. Con más de uno y
falta de permiso puede mostrarse deshabilitada con una razón estable.

`assignableRecipientCount` excluye:

```txt
disabled
copy-only
sin permiso de ownership
recipient eliminado
```

## 7. Modelo controlado/no controlado

Cada estado debe tener una única fuente:

| Estado | Controlado | No controlado |
|---|---|---|
| template | prop/handler | state interno |
| values | prop/handler | state interno |
| recipients | prop/handler | RecipientRegistry |
| activeRecipient | prop/handler | registry |
| documents | prop/handler | document state |
| activeDocument | prop/handler | document state |
| config | ConfigService externo | Provider local |

No copiar props a state sin una política de reconciliación.

## 8. Casos funcionales incluidos

La matriz canónica está en:

```txt
reports/declarative-instances/01-USE-CASE-MATRIX.md
```

Incluye Designer, Form, Viewer, todos los recipients, assignment, documents,
schemas, firma, comentarios, snapshot, generator, converter, datos asíncronos,
DigitalAgreements, ExternalForms, responsive, accesibilidad y quality gates.

## 9. Oleadas

### Wave 0 — Baseline y contratos

```txt
DECL-001..005
```

### Wave 1 — Configuración, schemas y acciones

```txt
DECL-006..010
```

### Wave 2 — Datos, recipes y ownership

```txt
DECL-011..016
```

### Wave 3 — Estado, eventos, persistencia y artifacts

```txt
DECL-017..022
```

### Wave 4 — Fachada React

```txt
DECL-023..027
```

### Wave 5 — Migración de examples

```txt
DECL-028..032
```

### Wave 6 — QA, rendimiento y release

```txt
DECL-033..036
```

## 10. Invariantes

- Todo código nuevo de `src/sisad-pdfme` es TS/TSX.
- Todo código de `src/examples` es JS/JSX/JSON.
- Examples no importan archivos `.ts` profundos.
- Examples consumen entrypoints públicos.
- No duplicar deep merge, colors, ownership, template layout o events.
- No modificar Canvas/Moveable/Selecto para simplificar ejemplos.
- No cambiar snapshot sin migración y pruebas.
- No eliminar APIs de bajo nivel.
- No usar una mega-config con callbacks serializados.
- No usar `structuredClone` sobre funciones.
- No afirmar gates no ejecutados.

## 11. Métricas de éxito

```txt
páginas básicas <= 30 líneas
0 imports profundos desde examples
0 archivos TS/TSX en examples
0 archivos JS/JSX nuevos en sisad-pdfme
0 deepMerge en examples
0 decoración manual de recipients/templates en examples
1 resolver de schema policy
1 resolver de action state
1 normalization boundary
1 high-level facade
```

## 12. Condiciones de parada

Detener una task-card cuando:

- requiere más de cinco archivos modificados;
- mezcla dos dominios;
- necesita cambiar geometría;
- rompe compatibilidad pública;
- el comportamiento no tiene prueba;
- aparece un conflicto con CONFIG/RESTORE/UX;
- no se puede distinguir host de core;
- el contexto supera 75 %.
