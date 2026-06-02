# Memoria del proyecto

## Contexto permanente

`sisad-pdfme` es un runtime de edición y generación PDF con `Designer`, `Form`, `Viewer`, schemas, colaboración, recipients, ownership, comments, snapshots, generator y converter.

## Decisiones activas

- `.ai` es fuente de verdad para asistentes.
- El catálogo usa color de destinatario activo.
- El canvas usa ownerColor persistente por schema.
- Transformaciones deben pasar por guards y command bus.
- CSS debe permanecer bajo `.sisad-pdfme-root`.
- externalForms debe consumir snapshot y runtime, no duplicar renderer.

## Inventario base

- Código analizado: `510` archivos.
- Markdown previo: `323` archivos.
- CSS: `6` archivos.

## 2026-06-01 — Actualización v4 standard fields y grupos

Se actualiza la arquitectura MD para evitar prompts gigantes y reutilizar la estructura existente. La prioridad nueva es cerrar contratos de `text`, `number`, `checkbox`, `checkboxGroup`, `radioGroup` y `select/dropdown` con casos de uso completos: Designer, DetailView, ListView, Snapshot, Form, Viewer, Generator/PDF, no-overlap y tests. El botón `+` queda formalizado por contexto. No se debe reescribir coordinateService/collision sin evidencia reproducible.

## Actualización v5 — Contrato maestro de comportamiento

Se agrega una arquitectura documental para evitar regresiones por fixes locales. El proyecto debe evolucionar por procesos transversales: crear schema, seleccionar, transformar, shortcuts, commandBus, grupos, no-overlap, snapshot, Form/Viewer/Generator y externalForms. Se separan explícitamente `selectionGroup` y `schemaGroup`. Se incorpora información recolectada de patrones DocuSign/Wix para campos estándar, grupos de opciones/casillas, botón `+`, DetailView compacto y canvas con PDF protagonista. Se agregan reglas, contextos, prompts, agentes, skills y matrices para completar lo faltante.
