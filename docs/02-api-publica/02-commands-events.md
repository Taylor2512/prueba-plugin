# Commands y Events

## Commands

Los comandos deben permitir controlar el fork sin manipular DOM:

- `loadDocument`
- `loadDocuments`
- `setActiveDocument`
- `setActivePage`
- `setZoom`
- `addSchema`
- `updateSchema`
- `deleteSchema`
- `duplicateSchema`
- `selectSchema`
- `clearSelection`
- `getSnapshot`
- `restoreSnapshot`
- `validate`

## Events

Los eventos deben entregar payloads serializables:

- `onReady`
- `onError`
- `onDocumentChange`
- `onPageChange`
- `onZoomChange`
- `onSchemaCreate`
- `onSchemaUpdate`
- `onSchemaDelete`
- `onSelectionChange`
- `onSnapshotChange`
- `onValidationChange`
