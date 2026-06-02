# Contexto — Standard Fields y grupos

## Objetivo

Cerrar el contrato completo de los schemas estándar:

- `text`
- `number`
- `checkbox`
- `checkboxGroup`
- `radioGroup`
- `select/dropdown`

El comportamiento debe estar inspirado en patrones generales de DocuSign/Wix/Figma, sin copiar marca ni CSS propietario.

## Contrato transversal

Cada schema estándar debe cubrir:

- Designer renderer.
- DetailView.
- ListView/right rail.
- Form.
- Viewer.
- Generator/PDF.
- Snapshot round-trip.
- Owner/recipient color.
- Required/readonly/locked.
- No-overlap por owner/document/page.
- Tests unitarios y Playwright si afecta interacción real.

## Reglas de identidad

Nunca perder:

```txt
schemaUid
id si aplica
documentId
pageNumber
ownerRecipientId
recipientId
ownerColor
recipientColor
groupId
optionId
```

## Botón +

| Contexto | Resultado |
|---|---|
| checkbox individual | convertir a `checkboxGroup` preservando identidad |
| checkboxGroup | agregar casilla al mismo grupo |
| radioGroup | agregar opción al mismo grupo |
| select/dropdown | no usa `+` flotante; sus opciones se gestionan en DetailView |

## No hacer

- No reescribir `DesignerCoordinateService` por intuición.
- No duplicar `radioGroup` y `checkboxGroup` con contratos incompatibles.
- No renderizar metadata técnica como contenido final del PDF.
