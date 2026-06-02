# Contexto — Select / Dropdown

## Objetivo

El dropdown debe ser compacto y funcionar en Designer, DetailView, Form, Viewer y PDF.

## Estado mínimo

```txt
type: select | dropdown
options: [{ label, value }]
placeholder?: string
selectedValue?: string
defaultValue?: string
required?: boolean
readOnly?: boolean
ownerColor/recipientColor
```

## Reglas

- No mostrar tipo técnico en catálogo.
- El placeholder debe verse como `Seleccionar` o texto definido.
- Las opciones se editan en DetailView.
- Form debe permitir seleccionar un valor.
- Viewer/PDF deben mostrar el valor seleccionado.
- Snapshot conserva options y selected/default value.
