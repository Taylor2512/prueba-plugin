# Schemas

Un schema representa un campo sobre el PDF.

Campos mínimos:

```ts
type BaseSchema = {
  schemaUid: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  documentId?: string;
  pageNumber?: number;
  ownerRecipientId?: string;
  ownerColor?: string;
};
```

Los schemas pueden extender esta base según familia.
