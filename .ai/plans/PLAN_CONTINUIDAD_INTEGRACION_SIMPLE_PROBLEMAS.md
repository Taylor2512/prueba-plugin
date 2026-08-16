# Plan de continuidad — Problemas funcionales y arquitectura objetivo

Parte 2 de [PLAN_CONTINUIDAD_INTEGRACION_SIMPLE_SISAD_PDFME.md](./PLAN_CONTINUIDAD_INTEGRACION_SIMPLE_SISAD_PDFME.md).
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

---

> Este plan se partió en tres por presupuesto de contexto: 1113 líneas no
> caben en el máximo que exige `.ai/CONTEXT-BUDGET.md`. El contenido no se
> tocó; sólo se cortó en fronteras de sección de nivel 1.
>
> - Estado, veredicto y bloqueantes: [PLAN_CONTINUIDAD_INTEGRACION_SIMPLE_SISAD_PDFME.md](./PLAN_CONTINUIDAD_INTEGRACION_SIMPLE_SISAD_PDFME.md)
> - Orden de ejecución, gates y aceptación: [PLAN_CONTINUIDAD_INTEGRACION_SIMPLE_EJECUCION.md](./PLAN_CONTINUIDAD_INTEGRACION_SIMPLE_EJECUCION.md)
