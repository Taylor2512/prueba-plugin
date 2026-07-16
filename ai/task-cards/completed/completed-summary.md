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

- `TASK-LAB-021-lab-action-registry-controller-contract.md`
  - `CompactControls.jsx` consume descriptors de acción y el lab separa artefactos de generador/conversión.
  - No reintroducir lógica de botones dispersa en el host del lab.

- `TASK-LAB-019-normalize-lab-example-data-contract.md`
  - `labExamples.js` quedó como fachada y los ejemplos grandes fueron movidos a catálogos separados bajo `labs/examples/catalog`.
  - No volver a concentrar todos los ejemplos en un solo archivo monolítico.

- `TASK-LAB-020-public-runtime-wrappers-only.md`
  - `PdfmeLabPage.jsx` quedó montado sobre los wrappers públicos `SisadPdfmeDesigner`, `SisadPdfmeForm` y `SisadPdfmeViewer`.
  - El host dejó de importar `usePdfmeRuntimeInstance` y validó build + smoke del docs tab.

- `TASK-LAB-018-use-pdfme-lab-integration-hook.md`
  - `usePdfmeLabIntegration` centraliza la normalización de template, recipients, documents, inputs, config y artifacts.
  - `PdfmeLabPage.jsx` dejó de armar `commonOptions` manualmente y consume una única integración.

- `TASK-LAB-017-pdfcomponent-integration-boundary.md`
  - `PdfmeLabPage.jsx` ya no usa `DesignerEngineBuilder` ni `usePdfmeRuntimeInstance`.
  - Se dejó un reporte explícito de frontera pública aceptada para el host del laboratorio.

- `TASK-LAB-022-remove-compat-wrapper-reexports.md`
  - Se eliminaron wrappers sin consumo real: `CaseGrid.jsx`, `Hero.jsx`, `IconButton.jsx`, `template.js`, `utils/binary.js` y `domain/collaborationAppearance.js`.
  - `npm run build` siguió pasando tras la poda.

- `TASK-LAB-025-example-bundle-normalized-export.md`
  - `buildExampleBundle.ts` exporta `recipients`, `documents` y `config` top-level.
  - La unidad valida el bundle y el smoke verifica el affordance de descarga del card correcto.

- `TASK-LAB-024-external-data-integration-e2e.md`
  - Se validó la carga asíncrona de datos externos, la reinyección sin duplicar recipients y el routing de docs del host.
  - La validación de `Form/Viewer` quedó fuera de esta tarjeta porque el runtime de formulario ya rompe en la ruta base con el template actual.

- `TASK-LAB-026-restore-designer-visual-baseline-after-integration.md`
  - El lab volvió a abrir con `data-ux-mode="default"` por defecto, preservando el baseline clásico de 3 paneles.
  - Se agregó una regresión Playwright que valida baseline visual, header, rails laterales y results inline.

- `TASK-LAB-027-lab-canvas-first-shell-jsx-handoff.md`
  - El shell del laboratorio movió estilos seguros a JSX/TSX y redujo la dependencia de `labRoutes.css`.
  - `PopoverMenu`, `CompactControls` y `ResultsPanel` quedaron más compactos sin empujar el canvas ni romper el baseline.

- `TASK-CSS-012-inline-tailwind-css-reduction.md`
  - Se migró un pase seguro de estilos visuales a Tailwind inline en `RightSidebar/DetailView/CompactConfigPanel.tsx`.
  - Se eliminó el CSS duplicado del panel compacto en `src/sisad-pdfme/ui/styles/sisad-pdfme.css`.
  - Validado con `npm run build` y smoke e2e del RightSidebar.

- `TASK-CSS-018-stabilize-tailwind-cleanup.md`
  - Se consolidaron los selectores objetivo del RightSidebar shell en TSX/Tailwind inline y se cerró la limpieza redundante del CSS legado.
  - No reabrir como tarea activa; la continuidad visual sigue en task-cards separadas de regresión funcional.

- `TASK-CSS-019-jsx-tsx-tailwind-migration-and-css-reduction.md`
  - Se cerró la migración visual segura del shell del lab, LeftSidebar y superficies del RightSidebar hacia Tailwind inline/TSX.
  - `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó los bloques redundantes `sidebar-frame` y `sidebar-surface`, y el conteo de `@apply` bajó de 610 a 608 en el último pase.
  - Validado con `npm run build` y Playwright focal sobre `multi-document-routing` y `right-sidebar-docs-tab`.

- `TASK-CSS-023-right-sidebar-documents-tailwind-continuity.md`
  - El rail de documentos del RightSidebar quedó estabilizado en TSX con clases inline y sin selectores `documents-rail` en `sisad-pdfme.css`.
  - Se corrigió el paso de items del rail para usar el origen combinado de docs/pages y se validó `right-sidebar-docs-tab` en Playwright.

- `TASK-LAB-028-runtime-collaboration-sync-and-form-echo.md`
  - El laboratorio ahora propaga el usuario activo y la vista global al runtime público de `sisad-pdfme`.
  - El Form devuelve cambios de inputs al host y respeta `isGlobalView` en colaboración.

- `TASK-LAB-029-multidocument-right-sidebar-docs-default.md`
  - La ruta `multi-document-routing` abre el RightSidebar con `Docs` por defecto cuando hay múltiples documentos.
  - El tab `Docs` sigue respetando la visibilidad del panel documental y se validó con Playwright.

- `TASK-PDFME-013-controller-real-api-no-noop.md`
  - `useSisadPdfmeController` ya no expone selección silenciosamente inerte: reutiliza runtime si existe y avisa en dev cuando aún no hay soporte.
  - Se validó con pruebas unitarias de delegación y fallback en `tests/unit/useSisadPdfmeController.recipients.test.tsx`.

- `TASK-REGRESSION-020-owner-color-renderer-continuity.md`
  - Se validó la continuidad del color exterior por propietario con pruebas unitarias de tono dueño/fallback.
  - No reabrir salvo regresión demostrada en `resolveSchemaTone` o `resolveSchemaOwnerTone`.

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
