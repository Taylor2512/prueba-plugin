# API pública: controller, hooks, adapters y eventos

# 1. Hooks React

## `useSisadPdfmeConfigService`

Obtiene la instancia de configuración del Provider actual.

```ts
const configService = useSisadPdfmeConfigService();
```

Usos:

```ts
configService.getRawConfig();
configService.getResolvedConfig();
configService.updateConfig(patch);
configService.reset();
configService.subscribe(listener);
configService.explain();
```

## `useSisadPdfmeConfig`

Obtiene la configuración resuelta del Provider.

```ts
const config = useSisadPdfmeConfig();
```

## `useSisadPdfmeController`

Obtiene/construye la fachada de control.

```ts
const controller = useSisadPdfmeController();
```

## `useSisadPdfmeFeature`

Consulta un feature state.

```ts
const documentsState = useSisadPdfmeFeature('documents');
```

Resultado:

```ts
{
  registered,
  supported,
  enabled,
  visible,
  permitted,
  available,
  active,
  executable,
  reason,
  sources,
}
```

## `useSisadPdfmeAction`

Consulta el estado de una acción.

```ts
const reassignState = useSisadPdfmeAction('reassign-recipient', {
  selectionCount: selectedIds.length,
  recipientCount: recipients.length,
  canEditStructure: true,
});
```

## `useSisadPdfmeComponent`

Consulta el estado de un componente visual.

```ts
const detailPanel = useSisadPdfmeComponent('detail-panel');
```

---

# 2. Controller

## Métodos implementados

### Template

```ts
controller.getTemplate();
controller.setTemplate(template);
```

### Snapshot

```ts
controller.getSnapshot();
controller.restoreSnapshot(snapshot);
```

Cuando existe Recipient Registry, el snapshot integra recipients.

### Configuración

```ts
controller.getConfig();
controller.updateConfig(patch);
controller.resetConfig();
controller.getFeatureState(featureId, context);
controller.explainConfiguration();
```

### Selección

Dependiendo de soporte del runtime:

```ts
controller.getSelectedSchemaIds();
controller.selectSchemas(ids, 'replace' | 'add' | 'toggle');
controller.clearSelection();
```

### Recipients

```ts
controller.getRecipients();
controller.setRecipients(recipients);
controller.getRecipient(id);
controller.getActiveRecipient();
controller.setActiveRecipient(id);
```

### Assignment

```ts
controller.assignSchemasToRecipient(schemaIds, recipientId);
```

Preserva los campos de lock/geometría mediante el servicio común de assignment.

### Zoom y guardado

```ts
controller.setZoom(value);
controller.save();
```

## Métodos que existen en implementación pero deben verificarse por tipo público/runtime

```txt
fitToPage
fitToWidth
setPage
addSchemaByType
```

No asumir portabilidad hasta confirmar que están expuestos en la versión copiada.

## Métodos stub/no implementados realmente

No depender de estos métodos en una integración nueva:

```ts
controller.addSchema();          // retorna string vacío
controller.updateSchema();       // unsupported
controller.removeSchemas();      // unsupported
controller.duplicateSchemas();   // unsupported
controller.setActiveDocument();  // unsupported
controller.validate();           // retorna null
```

Usar CommandBus o la API real del runtime mientras se completa la fachada.

---

# 3. ConfigService

Métodos observados:

```ts
getRawConfig()
getResolvedConfig()
getIssues()
getMigrationIssues()
getSelectors()

selectFeatureState(featureId, context?)
selectActionState(actionId, context?)
selectComponentState(componentId, context?)

replace(config)
update(patch)
reset()
transaction(callback)
subscribe(listener)
explain()
```

## Deep merge

`update()`:

- combina objetos;
- reemplaza arrays;
- no concatena arrays.

Ejemplo:

```ts
configService.update({
  sidebars: {
    right: {
      panels: ['fields', 'detail'],
    },
  },
});
```

El array anterior queda reemplazado.

## Transaction

```ts
configService.transaction(() => {
  configService.update({
    visibility: {
      sidebars: {
        right: {
          panels: {
            comments: true,
          },
        },
      },
    },
  });

  configService.update({
    sidebars: {
      right: {
        defaultPanel: 'comments',
      },
    },
  });
});
```

La notificación se agrupa.

---

# 4. Feature IDs

```txt
runtime
canvas
sidebars
inspector
documents
comments
signatures
assignment
collaboration
persistence
```

Dependencias observadas:

```txt
canvas       → runtime
sidebars     → runtime
inspector    → runtime
signatures   → runtime
persistence  → runtime
documents    → runtime + canvas
comments     → runtime + canvas
assignment   → runtime + collaboration
collaboration→ runtime
```

---

# 5. Action IDs

```txt
reassign-recipient
duplicate-schema
delete-schema
copy
paste
lock-position
unlock-position
hide-schema
show-schema
align
distribute
match-size
switch-right-panel-fields
switch-right-panel-detail
switch-right-panel-comments
switch-right-panel-documents
add-comment
```

## Contextos frecuentes

```ts
{
  readOnly?: boolean;
  selectionCount?: number;
  recipientCount?: number;
  hasClipboard?: boolean;
  canEditStructure?: boolean;
}
```

---

# 6. Component IDs

```txt
left-sidebar
right-sidebar
canvas-toolbar
canvas-context-menu
inspector
comments-panel
documents-panel
fields-panel
detail-panel
assignment-dialog
shortcut-help-panel
```

---

# 7. Adapters

## Recipients

```ts
createRecipientsAdapter({
  toRecipient(hostUser) {
    return {
      id: hostUser.userId,
      label: hostUser.fullName,
      email: hostUser.email,
      color: hostUser.color,
      metadata: hostUser,
    };
  },
});
```

La implementación base reconoce:

```txt
id
recipientId
userId
label
name
fullName
role
email
color
```

## Documents

```ts
createDocumentsAdapter({
  toDocument(hostDocument) {
    return {
      id: hostDocument.fileId,
      label: hostDocument.name,
      basePdf: hostDocument.bytes,
      template: hostDocument.template,
      pageCount: hostDocument.pageCount,
      metadata: hostDocument,
    };
  },
});
```

El adapter base preserva:

```txt
id/documentId/fileId
label/name
pageCount
basePdf
template
metadata
```

No eliminar `template`.

## Persistence

El adapter actual resuelve serialización JSON:

```ts
createPersistenceAdapter();
```

No implementa automáticamente:

```txt
localStorage
IndexedDB
API REST
autosave remoto
versionado
```

El host debe conectar esas operaciones.

## Signature provider

```ts
createSignatureProviderAdapter({
  toProvider(hostProvider) {
    return {
      key: hostProvider.id,
      label: hostProvider.name,
      description: hostProvider.description,
      capabilities: hostProvider.capabilities,
      metadata: hostProvider,
    };
  },
});
```

---

# 8. Eventos

```ts
type SisadPdfmeEventName =
  | 'onReady'
  | 'onChange'
  | 'onSave'
  | 'onError'
  | 'onSelectionChange'
  | 'onRecipientsChange'
  | 'onActiveRecipientChange'
  | 'onAssignmentChange'
  | 'onDocumentChange'
  | 'onSignatureRequest';
```

Configuración:

```ts
events: {
  onAssignmentChange: (payload) => {
    console.log(payload);
  },
}
```

Estado verificado del wrapper Designer:

```txt
onRecipientsChange       conectado
onActiveRecipientChange  conectado
onAssignmentChange       conectado
onSave prop              conectado
```

Los demás nombres están declarados, pero deben verificarse antes de depender de ellos como única integración.

---

# 9. Registro de schemas

```ts
registerFieldPlugin(plugin);
registerPlugins(plugins);
getSchemaPluginByType(type);
getBuiltInFields();
getSchemaDefinition(type);
getSchemaFamily(type);
createDefaultSchema(type);
generateUniqueSchemaName(...);
validateSchemaNameUniqueness(...);
changeSchemas(...);
```

## Registro custom seguro

```ts
import { registerPlugins } from '@/sisad-pdfme';

registerPlugins([
  {
    type: 'myCustomField',
    propPanel: { /* ... */ },
    designer: { /* ... */ },
    form: { /* ... */ },
    viewer: { /* ... */ },
    pdf: { /* ... */ },
  },
]);
```

Ejecutar antes de montar cualquier wrapper.

---

# 10. CommandBus

La fachada exporta CommandBus y comandos del Designer.

Usarlo para acciones no cubiertas todavía por Controller.

Principio:

```txt
Controller → API pública estable
CommandBus → comandos funcionales del editor
internals → no importar desde el host
```

Mientras algunos métodos del Controller sean stub, conviene ampliar la fachada pública o registrar acciones por CommandBus, no importar servicios internos profundos.

---

# 11. Snapshot

Fachada pública:

```txt
buildDesignerSnapshot
parseDesignerSnapshot
normalizeDesignerSnapshot
```

Ejemplo conceptual:

```ts
const snapshot = buildDesignerSnapshot({
  template,
  documents,
  recipients,
});

const restored = parseDesignerSnapshot(snapshot);
```

Usar la misma versión de snapshot en export/import.

---

# 12. Generator y converter

Generator:

```ts
generatePdf
generatePdfBuffer
generatePdfWithPreflight
buildDynamicTemplate
```

Converter:

```ts
convertImagesToPdf
getPdfPageImages
getPdfPageSizes
```

Estas funciones requieren plugins y datos compatibles con el template.

---

# 13. Helpers de documentos

```txt
normalizeTemplatePagesForDocument
normalizeDocuments
resolveActiveDocument
pdfToImages
pdfToPageSizes
imagesToPdf
```

Usar estos helpers en el host en lugar de reconstruir routing a mano.
