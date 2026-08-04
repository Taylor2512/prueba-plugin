# Paquete de corrección visual y comportamiento — SISAD PDFME

Este paquete agrega un plan ejecutable y **42 task-cards** para corregir
el diseño, la interacción y la paridad funcional de las superficies visuales de
`src/sisad-pdfme`.

No contiene cambios de aplicación. Está preparado como overlay aditivo para la
raíz de `prueba-plugin`.

## Contenido principal

```text
.ai/plans/PLAN_MAESTRO_VISUAL_COMPORTAMIENTO_SISAD_PDFME_2026-08-04.md
.ai/prompts/PROMPT_CODEX_VISUAL_COMPORTAMIENTO_SISAD_PDFME.md
.ai/scrum/task-cards/VISUX-001..VISUX-042
.ai/scrum/VISUX-EXECUTION-ORDER.md
.ai/scrum/VISUX-PRODUCT-BACKLOG-ROWS.md
.ai/scrum/VISUX-MERGE-INSTRUCTIONS.md
reports/visual-behavior/
README-VISUAL-BEHAVIOR.md
CHECKLIST-ACEPTACION-VISUAL.md
INSTALL-CHECKLIST-VISUAL.md
ROLLBACK-VISUAL.md
MANIFEST.md
```

## Relación con COREUX

Las tarjetas `VISUX-*` **refinan** el trabajo existente `COREUX-*`. No deben
convertirse en una segunda autoridad del producto.

Antes de activar una tarjeta:

1. revisar la tarjeta `COREUX-*` relacionada;
2. fusionar sus criterios nuevos en la task activa;
3. conservar un solo claim y un solo writer;
4. no ejecutar dos tarjetas que toquen los mismos archivos;
5. archivar la tarjeta VISUX cuando sus criterios estén absorbidos.

## Inicio

1. Copiar el contenido del ZIP en la raíz del repositorio.
2. Leer el plan maestro.
3. Ejecutar `VISUX-001`.
4. Mantener todas las tarjetas en Backlog hasta liberar WIP.
5. Ejecutar una task-card por sesión/claim.
