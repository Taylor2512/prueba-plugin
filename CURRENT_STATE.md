# CURRENT_STATE — SISAD PDFME Designer

## Estado esperado

El diseñador PDF debe soportar:

- múltiples documentos;
- múltiples páginas;
- recipients/owners;
- color por owner;
- schemas estándar;
- grupos de opciones;
- inspector configurable;
- selección simple/múltiple;
- drag/resize/rotate;
- toolbar contextual;
- snapshot del diseñador;
- visual compacto tipo DocuSign/Wix sin copiar marca.

## Riesgos activos conocidos

- Interacciones que solo funcionan en página 1.
- Selecto seleccionando overlays/options.
- Moveable calculando contra página incorrecta.
- Botón + entrando al target transformable.
- No-overlap sin filtrar por owner/document/page.
- Snapshot perdiendo `pageNumber`.
- Uso excesivo de `any`.
- Wrappers triviales y duplicidad en features/lab.
- CSS global afectando Moveable/Selecto.
- Prompts demasiado amplios generando loops.

## Prioridad actual

1. Multipágina.
2. Selecto/Moveable/guards.
3. Option groups.
4. Schema object model.
5. Inspector sections.
6. Visual compact.
7. Type safety/reducción any.
8. Cleanup wrappers.
