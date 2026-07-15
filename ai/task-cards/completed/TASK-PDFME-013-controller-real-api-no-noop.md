# TASK-PDFME-013 — Controller público sin no-op silencioso

## Estado

completed

## Objetivo

Evitar que `useSisadPdfmeController` exponga métodos que aparentan funcionar pero no hacen nada.

## Tareas

- [x] Auditar `src/sisad-pdfme/react/useSisadPdfmeController.ts`.
- [x] Identificar métodos no-op.
- [x] Conectar métodos reales a runtime/controller interno cuando exista.
- [x] Si un método no puede implementarse todavía, lanzar warning controlado en dev.
- [x] Agregar pruebas para:
  - `getRecipients`
  - `setRecipients`
  - `getActiveRecipient`
  - `setActiveRecipient`
  - `assignSchemasToRecipient`
  - `getSelectedSchemaIds`
  - `selectSchemas`
  - `clearSelection`

## Estado (2026-07-14, Claude)

- `getRecipients`, `setRecipients`, `getActiveRecipient`, `setActiveRecipient` y `assignSchemasToRecipient` ya delegan en el registry/runtime real.
- `getSelectedSchemaIds`, `selectSchemas` y `clearSelection` ahora soportan runtime real si existe y emiten warning controlado si no hay soporte todavía.
- Se agregaron pruebas de delegación y fallback con warning en `tests/unit/useSisadPdfmeController.recipients.test.tsx`.

## Criterios

- No hay no-op silencioso en API pública.
- El host no necesita importar internals.
- La API pública documenta claramente qué métodos están disponibles.
