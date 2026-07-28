# Configuración global portable

`src/sisad-pdfme` debe integrarse en cualquier host mediante configuración, datos y callbacks genéricos.

## Uso mínimo

```tsx
<SisadPdfmeDesigner
  template={template}
  documents={documents}
  onTemplateChange={setTemplate}
/>
```

## Uso con recipients

```tsx
<SisadPdfmeDesigner
  config={config}
  template={template}
  documents={documents}
  recipients={recipients}
  onTemplateChange={setTemplate}
  onSave={handleSave}
/>
```

## Config canónica

- `config` es la fuente de verdad.
- `ui.visibility` controla presentación; `visibility` canónica sigue siendo la base resuelta.
- `documents.mode`, `documents.preserveDocumentSchemaRouting` y `documents.activeDocumentStrategy` gobiernan el comportamiento de documentos.
- `signatures.enabled`, `signatures.defaultMode` y `signatures.providers` gobiernan el flujo de firma.
- `comments.enabled` gobierna si el feature existe; la visibilidad del panel no debe mutar la capacidad.

## API dinámica pública

Cuando el host necesita leer o mutar configuración en caliente, usa el controller público:

```ts
controller.getConfig();
controller.updateConfig({ visibility: { ... } });
controller.resetConfig();
controller.getFeatureState('documents');
controller.explainConfiguration();
```

## Separación de conceptos

```txt
enabled = la capacidad existe
visible = el usuario la ve
allowed = el usuario puede ejecutarla
```

El host no debe importar internals como Canvas, RightSidebar, DetailView, ListView o SchemaAssignmentDialog.
