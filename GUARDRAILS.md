# Guardrails globales — SISAD PDFME Designer

## Nunca romper

```txt
schemaUid
documentId
pageNumber
pageIndex
x/y/width/height/rotation
ownerRecipientId
recipientId
ownerColor
recipientColor
groupId
optionId
selectedOptionIds
selectedOptionId
selectedValue
Snapshot del diseñador
Compatibilidad de Form/Viewer/Generator
```

## Prohibido

- Duplicar canvas.
- Duplicar sidebars internas.
- Duplicar inspector.
- Duplicar toolbar interna.
- Duplicar renderer de schemas.
- Manipular DOM interno desde hosts.
- Crear snapshots paralelos.
- Forzar todo a página 1.
- Resolver geometría con `setTimeout`.
- Resolver hit-testing con `z-index` arbitrario.
- Tocar `.moveable-*` desde CSS host.
- Tocar `.selecto-*` desde CSS host.
- Copiar HTML/CSS/SVG/branding de DocuSign.
- Crear nuevos `as any`.
- Convertir una tarea focal en auditoría global.

## Permitido

- Cambios incrementales.
- Helpers compartidos.
- Contracts.
- Type guards.
- Factories.
- Strategies.
- Adapters.
- Commands.
- State unions.
- Task-cards nuevas si excede presupuesto.
