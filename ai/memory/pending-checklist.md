# Checklist pendiente real

Este archivo contiene solo trabajo pendiente o continuidad. Las tareas completadas viven en `ai/task-cards/completed/` y se resumen en `ai/task-cards/completed/completed-summary.md`.

## Active existente

- [ ] `TASK-REGRESSION-021-shell-token-visual-recovery.md`
- `TASK-CSS-019-jsx-tsx-tailwind-migration-and-css-reduction.md` ya vive en `ai/task-cards/completed/`.

## Backlog / continuidad

- `TASK-PDFME-005-digital-agreements-runtime-adapter.md` - fuera de este repo; el core equivalente ya está cubierto en `src/sisad-pdfme`.
- `TASK-PDFME-008-signature-policies-firma-sisad.md` - fuera de este repo; el core ya expone políticas técnicas y el negocio vive en el host.
- `TASK-PDFME-009-externalforms-runner-contract.md` - fuera de este repo; el runner core ya existe en `src/sisad-pdfme/externalForms`.


## Pendientes transversales

- [x] Confirmar que `src/sisad-pdfme/docs/**` no se use como copia ni reemplazo de `docs/**`.
- [x] Confirmar que `reports/**`, `dist/**`, `test-results/**` y `.tailwind-migration-backups/**` están excluidos del contexto activo por defecto.
- [x] Confirmar que el CSS migrado a Tailwind inline no rompe geometry, zoom, canvas, paper, Moveable, Selecto o print/PDF.
