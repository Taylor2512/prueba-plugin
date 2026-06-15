# TASK-004 — Aplicar modelo de objetos de schemas

## Objetivo

Fortalecer contratos: BaseSchema, SisadSchema, SchemaPlugin, InspectorContract, ValueAdapter.

## Archivos candidatos

```txt
schemas/shared/schemaTypes.ts
schemas/shared/schemaGuards.ts
schemas/index.ts
schemas/schemaBuilder.ts
schemas/schemaFamilies.ts
schemas/options/*
schemas/actions/*
schemas/signature/*
schemas/textLike/*
```

## No hacer

- No reescribir todos los schemas.
- No cambiar snapshot sin migration.
- No crear clase base profunda.

## Validación

- Menos casts.
- Plugins tipados.
- Families claras.
