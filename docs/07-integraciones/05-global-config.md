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

## Separación de conceptos

```txt
enabled = la capacidad existe
visible = el usuario la ve
allowed = el usuario puede ejecutarla
```

El host no debe importar internals como Canvas, RightSidebar, DetailView, ListView o SchemaAssignmentDialog.
