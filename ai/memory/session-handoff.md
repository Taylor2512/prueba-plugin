# Session Handoff

## Último foco

Cierre de todas las task-cards activas ejecutables en este repo (2026-07-14):

- **Completadas y movidas a `completed/`**: ARCH-001 (verificación final:
  `assignment.enabled` ahora default `true`), ARCH-002 (Recipient Registry),
  DOCS-001, CANVAS-002, INSPECTOR-001, LAB-001, SCHEMA-001 (se restauró el
  marcador raíz `data-checkbox-group-root`/`data-radio-group-root` en
  `applyOptionGroupRootRuntime`), PDFME-003 (patch de reasignación ampliado con
  `recipientColor` + `lastModifiedBy` en service y selectionCommands),
  PDFME-004 (reporte `ai/reports/lab-parity-multidocument-routing.md`),
  PDFME-006 y PDFME-007 (parte core, con tests nuevos
  `runtimeAccessAfterReassignment` y `snapshotReassignmentPersistence`).
- **Siguen activas (trabajo en Sisad-Web-FRONTEND, otro repo)**: PDFME-005,
  PDFME-008 (parte core verificada aquí), PDFME-009. Cada card tiene sección
  "Estado" con lo verificado y lo pendiente.

Validación: build exit 0, lint exit 0, 85+ unit tests de las áreas tocadas en
verde, 9 specs e2e en verde (se actualizaron specs desactualizados frente al
DetailView compacto/expandido por defecto y al trigger "Reasignar").

## Próximo paso sugerido

- En `Sisad-Web-FRONTEND`: ejecutar la auditoría rg del reporte de paridad y
  abordar PDFME-005/008(host)/009.
- Commitear el working tree (incluye trabajo previo de Codex sin commitear en
  Canvas/RightSidebar/runtime/options + todo lo de esta sesión).
- Los ~13 unit tests que fallaban antes de esta sesión siguen pendientes
  (antd/es/theme/internal en collect, expectativas desactualizadas, pdf-lib);
  ninguno toca las áreas cerradas.

## Atención

- `defaultSisadPdfmeConfig.assignment.enabled` cambió a `true`: el botón
  Reasignar aparece por defecto cuando hay selección y recipients.
- `useRecipientRegistry`: `activeRecipientId` es prop controlada (se re-aplica
  al cambiar recipients).
- No usar git stash (hay 4 stashes ajenos, ver memoria).
