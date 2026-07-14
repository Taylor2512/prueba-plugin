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

## Regla

Si un agente detecta una falla relacionada con una tarea completada, debe crear una task-card nueva con sufijo `regression` o `continuity`, no editar la tarea completada como si estuviera pendiente.
