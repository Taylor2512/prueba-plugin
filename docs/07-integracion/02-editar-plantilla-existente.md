# Editar plantilla existente

> Documentación generada para consumo externo de `sisad-pdfme`.

## Flujo
1. Cargar JSON desde backend/archivo.
2. Validar `checkTemplate`.
3. Normalizar `schemas` como `Schema[][]`.
4. Resolver basePdf.
5. Reconciliar `schemaUid`, `fileId`, `pageNumber`.
6. Reconstruir assignments si faltan.
7. Renderizar en Designer.
8. Guardar nueva versión.

## Migración rápida
```ts
schema.schemaUid = schema.schemaUid || fileId + ':' + pageNumber + ':' + schema.name;
schema.fileId = schema.fileId || activeDocumentId;
schema.pageNumber = schema.pageNumber || pageIndex + 1;
```

## Persistencia recomendada
Guardar `template`, `documents`, `assignments`, `recipients`, `comments`, `version`, `updatedBy` y `updatedAt`.
