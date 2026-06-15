# Guardrails globales

## Nunca perder

```txt
schemaUid
documentId
pageNumber/pageIndex
x/y/width/height/rotation
ownerRecipientId/recipientId
ownerColor/recipientColor
groupId/optionId
selectedOptionIds/selectedOptionId/selectedValue
snapshot oficial
Form/Viewer/Generator parity
```

## Prohibido

- Duplicar canvas, sidebars, toolbar, inspector o renderer.
- Manipular DOM interno desde hosts.
- CSS host contra `.moveable-*` o `.selecto-*`.
- Resolver errores con `setTimeout`.
- Resolver hit-testing con `z-index` arbitrario.
- Crear prompts/contextos duplicados por proveedor.

## Permitido

- Refactor incremental.
- Helpers compartidos.
- Adapters en bordes.
- Factories por familia.
- Type guards.
- Contextos pequeños.
- Prompts focalizados.
