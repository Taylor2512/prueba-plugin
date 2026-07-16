# `pdfcomponent` como host de referencia

`src/features/pdfcomponent` debe demostrar cómo un host externo integra `sisad-pdfme` sin tocar internals.

## Patrón esperado

```tsx
const integration = usePdfmeLabIntegration(example)

return (
  <SisadPdfmeDesigner
    config={integration.config}
    template={integration.template}
    documents={integration.documents}
    recipients={integration.recipients}
    activeRecipientId={integration.activeRecipientId}
    onTemplateChange={integration.setTemplate}
    onControllerReady={integration.setController}
  />
)
```

## Prohibido en ejemplos host

- `DesignerEngineBuilder`
- `usePdfmeRuntimeInstance`
- `decorateTemplateWithCollaboration`
- `decorateCollaborationUsers`
- `commonOptions.collaboration` construido a mano
- wrappers para `SchemaAssignmentDialog`, `RightSidebar`, `Canvas`, `Moveable` o `Selecto`

## Datos externos

El host puede traer usuarios/documentos desde API, BD o fixtures. Debe mapearlos una sola vez con adapters.
