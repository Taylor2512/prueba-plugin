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
