# Props del Designer

Ejemplo conceptual:

```tsx
<Designer
  template={template}
  plugins={plugins}
  recipients={recipients}
  activeRecipientId={activeRecipientId}
  onChangeTemplate={setTemplate}
  onSave={handleSave}
/>
```

## Props comunes

| Prop | Descripción |
|---|---|
| template | Estado del documento. |
| plugins | Registro de schemas. |
| recipients | Destinatarios. |
| activeRecipientId | Destinatario activo. |
| onChangeTemplate | Callback de cambio. |
| config | Config canónica del wrapper. |
| onControllerReady | Expone el controller público. |

## Reglas

- No leer `visibility`, `assignment`, `sidebars`, `canvas` o `schemas` desde el host si ya existe `config`.
- `documents`, `comments` y `signatures` deben resolverse desde configuración, no desde props ad hoc.
- `onControllerReady` es el punto de extensión para lectura, reset y update dinámico.
