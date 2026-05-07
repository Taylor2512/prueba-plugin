# Persistencia, API, prefill y Form JSON

> Documentación generada para consumo externo de `sisad-pdfme`.

## Configuración por schema
```ts
mergeSchemaDesignerConfig(schema, {
  persistence: { enabled: true, mode: 'local', key: 'draft.' + schema.name },
  api: {
    enabled: true,
    endpoint: '/api/catalog/countries',
    method: 'GET',
    requestMode: 'read',
    responseMapping: { options: 'data.items' }
  },
  form: {
    enabled: true,
    collect: true,
    format: 'nested',
    rootKey: 'formData',
    includeEmpty: false,
    includeHidden: false,
    includeMeta: true
  }
});
```

## Regla
El plugin no debe asumir endpoints SISAD. Debe exponer configuración para que cada host conecte su backend.
