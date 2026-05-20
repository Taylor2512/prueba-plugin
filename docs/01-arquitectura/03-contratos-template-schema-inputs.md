# Contratos Template, Schema, BasePdf e Inputs

> Documentación generada para consumo externo de `sisad-pdfme`.

## Template portable
```ts
type Template = {
  basePdf: string | { width: number; height: number; padding?: number[] };
  schemas: Schema[][];
  sampledata?: Record<string, unknown>[];
  pdfComments?: unknown[];
  documents?: DocumentRuntimeState[];
  assignments?: SchemaAssignments;
};
```

## Schema esencial
Un schema debe persistirse en milímetros y con identidad durable:

```ts
type Schema = {
  id?: string;              // identidad UI temporal
  schemaUid?: string;       // identidad durable recomendada
  name: string;             // clave de datos
  type: string;             // plugin
  position: { x: number; y: number };
  width: number;
  height: number;
  content?: string;
  required?: boolean;
  editable?: boolean;
  hidden?: boolean;
  fileId?: string;
  pageNumber?: number;
  collaboration?: unknown;
  comments?: unknown[];
  __designer?: SchemaDesignerConfig;
};
```

## Inputs
Los inputs se mapean por `schema.name`:

```ts
const inputs = [{
  client_name: 'Juan Pérez',
  accept_terms: 'true',
  signature_1: 'data:image/png;base64,...'
}];
```

## Reglas
- No persistir coordenadas en pixeles.
- No usar `content` como clave de datos.
- Mantener `schemaUid`, `fileId` y `pageNumber` para multidocumento.
- Guardar configuración avanzada en `__designer` o `configStorageKey` definido por engine.
