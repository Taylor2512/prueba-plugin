# TASK-PDFME-011 — Restaurar conectividad SISAD

**Estado:** backlog  
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

- [ ] Gabinete/carpeta/subcarpeta/tipo documental cargan desde SISAD.
- [ ] Índices se cargan según ubicación.
- [ ] Mapping schema ↔ índice persiste por archivo.
- [ ] Snapshot/request incluye connectivity.
