# TASK-PDFME-013 — Controller público sin no-op silencioso

## Estado

backlog

## Objetivo

Evitar que `useSisadPdfmeController` exponga métodos que aparentan funcionar pero no hacen nada.

## Tareas

- [ ] Auditar `src/sisad-pdfme/react/useSisadPdfmeController.ts`.
- [ ] Identificar métodos no-op.
- [ ] Conectar métodos reales a runtime/controller interno cuando exista.
- [ ] Si un método no puede implementarse todavía, lanzar warning controlado en dev.
- [ ] Agregar pruebas para:
  - `getRecipients`
  - `setRecipients`
  - `getActiveRecipient`
  - `setActiveRecipient`
  - `assignSchemasToRecipient`
  - `getSelectedSchemaIds`
  - `selectSchemas`
  - `clearSelection`

## Criterios

- No hay no-op silencioso en API pública.
- El host no necesita importar internals.
- La API pública documenta claramente qué métodos están disponibles.
