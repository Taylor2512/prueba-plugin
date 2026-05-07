# Multidocumento y paginación

> Documentación generada para consumo externo de `sisad-pdfme`.

## Modelo recomendado
```ts
type MultiDocumentSession = {
  activeDocumentId: string;
  activePageIndex: number;
  documents: Array<{
    id: string;
    name: string;
    basePdf: string | BasePdf;
    pageCount: number;
    schemas: Schema[][];
    inputs?: Record<string, unknown>[];
    comments?: unknown[];
  }>;
};
```

## Cambio de documento
1. Guardar schemas del documento actual.
2. Cambiar `activeDocumentId`.
3. Restaurar basePdf, schemas, inputs, comments y page.
4. Limpiar selección inválida.
5. Mantener zoom estable.
6. Reconciliar assignments por `fileId`.

## Errores que evita
- Campos de un PDF sobre otro PDF.
- Pérdida de campos al navegar.
- Viewer/Form sin datos del documento correcto.
- Render que cambia tamaño por recalcular en scroll.
