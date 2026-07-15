# Resumen de tareas completadas protegidas

Este archivo es memoria histórica compacta. Sirve para evitar que agentes IA reabran tareas ya cerradas o rompan correcciones existentes.

## Protegidas: no reabrir salvo regresión demostrada

- `TASK-ARCH-001-sisad-pdfme-global-config-portability.md`
  - Configuración global portable creada.
  - No crear otra carpeta de configuración paralela.
  - Continuidad permitida solo mediante task-card nueva enfocada en wiring faltante.

- `TASK-ARCH-002-recipient-registry.md`
  - Recipient Registry creado.
  - No duplicar mapas de recipients en Canvas, RightSidebar, AssignmentDialog, Form o Viewer.
  - Cualquier ajuste debe consumir el registry existente.

- `TASK-PDFME-003-reassign-recipient-dialog-persistence.md`
  - Reasignación y persistencia base completadas.
  - No crear modal paralelo.
  - No volver a pasar `SchemaAssignmentDialog` desde el host.
  - Las regresiones deben corregirse dentro del flujo existente.

- `TASK-PDFME-004-lab-parity-multidocument-routing.md`
  - Paridad base de laboratorio multidocumento completada.
  - No romper `documentId`, `fileId`, `pageNumber`, `pageIndex`.

- `TASK-PDFME-006-runtime-form-preview-by-recipient.md`
  - Vista runtime por recipient implementada.
  - No mezclar Form runtime con Designer estructural.
  - No activar Moveable/Selecto en Form.

- `TASK-PDFME-007-snapshot-persistence-contract.md`
  - Contrato de snapshot persistente protegido.
  - No eliminar metadata crítica de schemas.

- `TASK-CANVAS-002-snap-lines-and-sidebar-compactness.md`
  - Compactación y snap-lines base protegidos.
  - No tocar Moveable/Selecto por cambios CSS generales.

- `TASK-INSPECTOR-001-detailview-density.md`
  - Densidad base del DetailView protegida.
  - Ajustes nuevos deben usar contracts/widgets existentes.

- `TASK-SCHEMA-001-option-indicator-docusign.md`
  - Indicadores de option groups protegidos.
  - No regresar a estados visuales ambiguos.

- `TASK-ARCH-003-enforce-existing-ai-folder-architecture.md`
  - Arquitectura IA y carpetas reales validadas.
  - No crear árboles paralelos ni reabrir completed como active.

- `TASK-PDFME-014-rightsidebar-reassign-state-regression.md`
  - Reasignación del RightSidebar corregida para respetar selección real y contrato de config.
  - No limpiar selección al cerrar el modal.

- `TASK-CSS-012-inline-tailwind-css-reduction.md`
  - Se migró un pase seguro de estilos visuales a Tailwind inline en `RightSidebar/DetailView/CompactConfigPanel.tsx`.
  - Se eliminó el CSS duplicado del panel compacto en `src/sisad-pdfme/ui/styles/sisad-pdfme.css`.
  - Validado con `npm run build` y smoke e2e del RightSidebar.

- `TASK-PDFME-013-controller-real-api-no-noop.md`
  - `useSisadPdfmeController` ya no expone selección silenciosamente inerte: reutiliza runtime si existe y avisa en dev cuando aún no hay soporte.
  - Se validó con pruebas unitarias de delegación y fallback en `tests/unit/useSisadPdfmeController.recipients.test.tsx`.

- `TASK-PDFME-012-global-visibility-wiring-continuity.md`
  - Se consolidó la lectura de visibilidad compartida en `shared/visibilityConfig.ts`.
  - `ListViewToolbar` y `detailSchemas` usan el mismo resolver para `assignment` y secciones del inspector.
  - Se validó que Reasignar e Inspector respeten `visibility` y `assignment.enabled`.

- `TASK-PDFME-011-connectivity-sisad-restore.md`
  - El snapshot core ya soporta `connectivity` por archivo y schema con normalización y lookup estable.
  - Se añadieron helpers de resolución para `byFile` y `bySchema` en `shared/snapshotAdapter.ts`.
  - Se validó con pruebas unitarias de serialización, migración y lookup.

- `TASK-PDFME-010-drag-preview-and-canvas-scroll-regression.md`
  - Se cubrió la regresión de drag preview y drop multipágina con un test de Playwright.
  - La prueba valida preview visible, placeholder de drop y caída efectiva en la página 2 del canvas.
  - No se tocó Moveable/Selecto ni geometría.

- `TASK-CANVAS-001-protect-canvas-overflow.md`
  - Se verificó que el canvas conserva `overflow:auto` y que el stage mantiene el encaje esperado.
  - Se añadió una regresión de Playwright que comprueba scroll real y orden vertical de páginas.
  - No se tocó la geometría ni el comportamiento de interacción.

## Regla

Si un agente detecta una falla relacionada con una tarea completada, debe crear una task-card nueva con sufijo `regression` o `continuity`, no editar la tarea completada como si estuviera pendiente.
