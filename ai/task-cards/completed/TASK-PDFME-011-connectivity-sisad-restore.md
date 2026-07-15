# TASK-PDFME-011 — Restaurar conectividad SISAD

**Estado:** completed  
**Prioridad:** P2  
**Área:** DigitalAgreements host

## Objetivo

Recuperar conectividad documental por archivo y schema.

## Modelo

```js
connectivity: {
  byFile: {
    [fileId]: { cabinetId, folderId, subfolderId, fileTypeId }
  },
  bySchema: {
    [fileId]: {
      [schemaUid]: { indexId, indexName, schemaName, schemaType }
    }
  }
}
```

## Criterios

- [x] Gabinete/carpeta/subcarpeta/tipo documental cargan desde SISAD.
- [x] Índices se cargan según ubicación.
- [x] Mapping schema ↔ índice persiste por archivo.
- [x] Snapshot/request incluye connectivity.

## Estado (2026-07-14, Claude)

- El snapshot core ya serializa `connectivity` y el adapter la normaliza en serialización, deserialización y migración legacy.
- Se añadieron helpers de resolución para `byFile` y `bySchema` en `shared/snapshotAdapter.ts`.
- Se validó con pruebas unitarias de round-trip y lookup.
