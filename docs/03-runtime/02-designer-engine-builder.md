# DesignerEngineBuilder y configuración del diseñador

> Documentación generada para consumo externo de `sisad-pdfme`.

## Rol
`DesignerEngineBuilder` configura comportamiento sin modificar componentes internos.

## APIs clave
| Export |
| --- |
| CollaborationHistoryEntry |
| CollaborationHistoryEventType |
| CollaborationPresence |
| CollaborationProviderName |
| CollaborationSyncConfig |
| DEFAULT_SCHEMA_CONFIG_STORAGE_KEY |
| DesignerEngine |
| DesignerEngineBuilder |
| FormJsonEnvelope |
| ResolvedSchemaRequest |
| SchemaCollaborativeLock |
| SchemaCollaborativeMetadata |
| SchemaCollaborativeState |
| SchemaComment |
| SchemaCommentAnchor |
| SchemaCommentReply |
| SchemaCreationContext |
| SchemaCreationContextInput |
| SchemaCreationHook |
| SchemaDataFieldSnapshot |
| SchemaDataRuntimeAdapter |
| SchemaDataSnapshot |
| SchemaDesignerConfig |
| SchemaFormJsonConfig |
| SchemaHttpAuthConfig |
| SchemaHttpClientConfig |
| SchemaIdentity |
| SchemaIdentityFactory |
| SchemaIntegrationConfig |
| SchemaPersistenceConfig |
| SchemaPrefillConfig |
| SchemaRequestConfig |
| applySchemaCollaborativeDefaults |
| applySchemaCreationHook |
| attachSchemaIdentity |
| createSchemaCreationContext |
| createSchemaDataRuntimeAdapter |
| getSchemaConfigStorageKey |
| getSchemaDesignerConfig |
| mergeSchemaCollaborativeMetadata |
| mergeSchemaDesignerConfig |
| refreshSchemaCollaborativeMetadata |
| resolveDesignerEngine |
| resolveDesignerHttpClientConfig |
| resolveSchemaCollaborativeMetadata |
| setSchemaDesignerConfig |

## Uso típico
```ts
const engine = new DesignerEngineBuilder()
  .withCanvasFeatureToggles({
    guides: true,
    moveable: true,
    selecto: true,
    snapLines: true,
    padding: true,
    mask: false,
  })
  .withSchemaConfigStorageKey('__designer')
  .withAutoAttachIdentity(true)
  .withSchemaIdentityFactory((schema, context) => ({
    id: schema.id,
    key: String(context.fileId || 'default') + ':' + schema.name,
    namespace: 'sisad-web',
    version: '1',
    tags: [schema.type],
  }))
  .build();
```

## Configuración avanzada por schema
```ts
mergeSchemaDesignerConfig(schema, {
  persistence: { enabled: true, mode: 'local', key: 'draft.' + schema.name },
  api: { enabled: true, endpoint: '/api/catalogs', method: 'GET', requestMode: 'read' },
  form: { enabled: true, collect: true, format: 'nested', includeMeta: true },
});
```

## Buenas prácticas
- Un engine por host, memoizado.
- No mutar schemas directamente; usar helpers del engine.
- Usar `configStorageKey` para aislar configuración por producto.
