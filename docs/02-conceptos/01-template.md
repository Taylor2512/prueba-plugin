# Template

Un template contiene los documentos PDF, schemas, recipients, configuración y metadata.

## Estructura conceptual

```ts
type Template = {
  documents: PdfDocument[];
  schemas: SchemaForUI[][];
  recipients?: Recipient[];
  assignments?: Assignment[];
  version?: string;
  metadata?: Record<string, unknown>;
};
```

## Reglas

- Debe ser serializable.
- No debe contener objetos DOM.
- Debe preservar identidad de schemas.
