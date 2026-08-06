# Borrador de API pública declarativa

## Montaje básico

```jsx
import React from 'react';
import { SisadPdfmeInstance } from '@sisad-pdfme/integration';
import definition from '../config/designer-single-user.json';

export function DesignerSingleUserPage() {
  return <SisadPdfmeInstance definition={definition} />;
}
```

## Montaje con recursos y handlers

```jsx
<SisadPdfmeInstance
  definition={definition}
  resources={{
    templates: { contract: contractTemplate },
    plugins: customPlugins,
    signatureProviders,
  }}
  handlers={{
    onSave: save,
    onError: reportError,
  }}
/>
```

## Definition JSON

```json
{
  "version": 1,
  "mode": "designer",
  "config": {
    "schemas": {
      "enabledTypes": ["text", "number", "signature"],
      "disabledTypes": ["qrcode"]
    },
    "recipients": {
      "enabled": true,
      "defaultOwnerStrategy": "activerecipient",
      "colorStrategy": "recipient"
    },
    "assignment": {
      "enabled": true
    }
  },
  "templateRecipe": {
    "groups": [
      {
        "title": "Datos",
        "types": ["text", "number", "signature"]
      }
    ]
  },
  "recipients": [
    { "id": "alice", "label": "Alice", "color": "#2563EB" },
    { "id": "bob", "label": "Bob", "color": "#F59E0B" }
  ],
  "activeRecipientId": "alice"
}
```

## Regla de Reasignar

```txt
assignable recipients <= 1 → oculto
assignable recipients > 1 + selección → visible
sin permiso → visible deshabilitado con reason
```
