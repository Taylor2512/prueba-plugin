# TASK-009 — Snapshot del diseñador roundtrip

## Objetivo

Guardar/importar conserva metadata del diseñador.

## Archivos candidatos

```txt
shared/snapshotAdapter.ts
shared/schemaMigration.ts
shared/schemaDesignerMeta.ts
shared/snapshot.ts
templates/createDefaultTemplate.ts
schemas/options/*
schemas/shared/schemaTypes.ts
```

## Validación

- documentId/pageNumber.
- ownerColor.
- groupId/optionId.
- selected values.
- geometry.
