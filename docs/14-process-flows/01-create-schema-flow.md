# Proceso — Crear schema

## Objetivo

Inserta un campo desde catálogo con identidad, owner, color, doc/page y no-overlap.

## Componentes involucrados

- Designer
- Canvas/Renderer
- selectionCommands/commandBus cuando hay mutación
- DetailView/ListView cuando hay edición o selección
- Snapshot/Form/Viewer/Generator si cambia contrato de schema

## Fuente de verdad

- Identidad: `schemaUid`/`__designer`.
- Geometría: coordenadas de página.
- Owner: `ownerRecipientId`/`ownerColor`.
- Grupo: `groupId`/`optionId`.

## Estados inválidos

- Perder owner/color.
- Crear fuera del paper.
- Solapar con mismo owner.
- Duplicar responsabilidad entre host y runtime.
- Tests superficiales sin interacción real.

## Tests mínimos

- Unitario para lógica pura.
- Playwright si toca canvas/interacción.
- Snapshot/Form/Viewer/Generator si cambia schema.

## Checklist

- [ ] Diagnóstico con `rg`.
- [ ] Test antes o junto al fix.
- [ ] Build/lint.
- [ ] Matriz actualizada.
