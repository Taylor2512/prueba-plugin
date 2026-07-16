# TASK-LAB-025 — Export bundle desde contrato normalizado

Estado: completed

## Objetivo
Actualizar export/download para no serializar estructuras duplicadas.

## Tareas
- Adaptar `buildExampleBundle.ts` a `LabHostExample`.
- Exportar recipients/documents/config una sola vez.
- Mantener basePdf inline cuando se solicite.

## Criterios
- El JSON descargado puede rehidratar el ejemplo sin duplicar collaboration users.

## Cierre
- `buildExampleBundle.ts` exporta `recipients`, `documents` y `config` top-level.
- La unidad valida el bundle y el smoke verifica el affordance de descarga del card correcto.
