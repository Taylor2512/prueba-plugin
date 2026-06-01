# DetailView Coverage Matrix

| Sección | Propiedad/Widget | Tipo | Schema aplica | Acción usuario | Estado esperado | Test unitario | Test Playwright |
|---|---|---|---|---|---|---|---|
| Identidad | `name` | texto | text/any editable | editar nombre | actualiza `name` y sidebar | `tests/unit/detailView.schemaMatrix.test.ts` | `tests/playwright/detail-view-inspector.spec.ts` |
| Identidad | `renameLabel` | comando | text/any editable | pulsar Renombrar campo / F2 | ejecuta rename, no rompe selección | `tests/unit/detailWidgetRegistry.test.tsx` | `tests/playwright/detail-view-inspector.spec.ts` |
| Identidad | `editTextInline` | comando | schemas inline-editables | pulsar Editar texto / Enter | aparece edición inline solo en texto inline-editable | `tests/unit/detailWidgetRegistry.test.tsx` | `tests/playwright/detail-view-inspector.spec.ts` |
| Caja | `position.x` | número | schemas con geometry | editar X / alinear | mueve canvas y sidebar | `tests/unit/detailView.schemaMatrix.test.ts` | `tests/playwright/detail-view-inspector.spec.ts` |
| Caja | `position.y` | número | schemas con geometry | editar Y / alinear | mueve canvas y sidebar | `tests/unit/detailView.schemaMatrix.test.ts` | `tests/playwright/detail-view-inspector.spec.ts` |
| Caja | `width` | número | schemas con geometry | editar ancho | redimensiona sin perder selección | `tests/unit/detailView.schemaMatrix.test.ts` | `tests/playwright/detail-view-inspector.spec.ts` |
| Caja | `height` | número | schemas con geometry | editar alto | redimensiona sin perder selección | `tests/unit/detailView.schemaMatrix.test.ts` | `tests/playwright/detail-view-inspector.spec.ts` |
| Caja | `align` | widget | text/any geometry | pulsar alineación | actualiza x/y según eje | `tests/unit/detailWidgetRegistry.test.tsx`, `tests/unit/selectionCommands.test.ts` | `tests/playwright/detail-view-alignment.spec.ts` |
| Caja | `distributeSelection` | widget/command | multiselección válida | distribuir vertical/horizontal | solo habilitado con selección válida | `tests/unit/AlignWidget.test.tsx`, `tests/unit/selectionCommands.test.ts` | `tests/playwright/detail-view-alignment.spec.ts` |
| Caja | auto-placement anti-solape por owner | lógica canvas | create/duplicate/drop | crear o duplicar en el mismo punto | evita solape entre schemas del mismo owner en archivo/página | `tests/unit/schemaCollision.test.ts`, `tests/unit/schemaAutoPlace.test.ts` | `tests/playwright/schema-no-overlap.spec.ts` |
| Caja | `rotate` | número | schemas con rotate | editar rotación | cambia rotación sin tocar geometry base | `tests/unit/detailView.schemaMatrix.test.ts` | `tests/playwright/detail-view-inspector.spec.ts` |
| Apariencia | plugin `color` → `nativeColor` | widget | schemas con color props | elegir color | actualiza color visual sin alterar ownership | `tests/unit/detailSchemas.test.ts`, `tests/unit/detailWidgetRegistry.test.tsx`, `tests/unit/detailWidgets.test.tsx` | `tests/playwright/detail-view-inspector.spec.ts` |
| Apariencia | `fontSize` | número | text schemas | editar tamaño fuente | actualiza canvas y sidebar | `tests/unit/detailView.schemaMatrix.test.ts` | `tests/playwright/detail-view-inspector.spec.ts` |
| Apariencia | `textAlign` | select | text schemas | cambiar alineación de texto | cambia render del texto | `tests/unit/detailView.schemaMatrix.test.ts` | `tests/playwright/detail-view-inspector.spec.ts` |
| Colaboración | `ownerRecipientId` | selector/texto | schemas con metadata | cambiar propietario | actualiza __designer/owner y badge | `tests/unit/schemaCollaborationUtils.test.ts`, `tests/unit/detailSchemas.test.ts` | `tests/playwright/detail-view-collaboration.spec.ts` |
| Colaboración | `ownerRecipientName` | texto | schemas con metadata | cambiar nombre propietario | persiste sin perder color | `tests/unit/schemaCollaborationUtils.test.ts` | `tests/playwright/detail-view-collaboration.spec.ts` |
| Colaboración | `ownerColor` | color | schemas con metadata | cambiar destinatario/color | mantiene color propietario persistente | `tests/unit/schemaCollaborationUtils.test.ts`, `tests/unit/snapshotAdapter.test.ts` | `tests/playwright/detail-view-collaboration.spec.ts` |
| Colaboración | `locked/readOnly` | estado | schemas bloqueados | editar campo bloqueado | controles disabled / sin mutación | `tests/unit/detailView.schemaMatrix.test.ts` | `tests/playwright/detail-view-collaboration.spec.ts` |
| Colaboración | permisos `canEditStructure` | guard | cualquier schema | role/permission denegado | no ejecuta comandos | `tests/unit/selectionCommands.test.ts` | `tests/playwright/detail-view-collaboration.spec.ts` |
| Conexiones | `persistence` | config | schemas con bindings | activar persistencia | valida storageKey y persiste en __designer | `tests/unit/schemaConnectionsValidation.test.ts` | `tests/playwright/detail-view-connections.spec.ts` |
| Conexiones | `form` | config | schemas con bindings | activar salida JSON | valida rootKey | `tests/unit/schemaConnectionsValidation.test.ts` | `tests/playwright/detail-view-connections.spec.ts` |
| Conexiones | `api` | config | schemas con bindings | activar API | valida endpoint/baseURL/auth | `tests/unit/schemaConnectionsValidation.test.ts` | `tests/playwright/detail-view-connections.spec.ts` |
| Conexiones | `schemaConnectionsValidation` | validación | schemas con bindings | validar config | muestra errores y no rompe canvas | `tests/unit/schemaConnectionsValidation.test.ts` | `tests/playwright/detail-view-connections.spec.ts` |
| Comentarios | `comments` | lista / widget | schemas con comentarios | agregar comentario / responder | incrementa contador y conserva geometry | `tests/unit/detailView.schemaMatrix.test.ts` | `tests/playwright/detail-view-collaboration.spec.ts` |
| Comentarios | `commentsCount` | contador | schemas con comentarios | crear / resolver hilo | actualiza badge / summary | `tests/unit/detailView.schemaMatrix.test.ts` | `tests/playwright/detail-view-collaboration.spec.ts` |
| Inline | `InlineEditActionsWidget` | botones | text/inline editable | renombrar / editar texto | respeta inline editable, no aparece en no-text | `tests/unit/detailWidgetRegistry.test.tsx` | `tests/playwright/detail-view-inspector.spec.ts` |
| Secciones | `buildInspectorSections` | layout | cualquier schema | cambio de schema activo | secciones canónicas correctas | `tests/unit/detailView.schemaMatrix.test.ts` | `tests/playwright/detail-view-inspector.spec.ts` |
| Secciones | `DetailFormSection` | contenedor | cualquier schema | colapsar/expandir | respeta defaultCollapsed y resetToken | `tests/unit/detailFormSection.test.tsx` | `tests/playwright/detail-view-inspector.spec.ts` |
| Secciones | `DetailHeaderCard` | header | cualquier schema | abrir/cerrar / back | título, tags, summary correctos | `tests/unit/detailHeaderCard.test.tsx` | `tests/playwright/detail-view-inspector.spec.ts` |
| Registry | `AlignWidget` | widget | text/any geometry | click botones | pasa selectionCommands y estados disabled | `tests/unit/AlignWidget.test.tsx`, `tests/unit/detailWidgetRegistry.test.tsx` | `tests/playwright/detail-view-alignment.spec.ts` |
| Registry | `ButtonGroupWidget` | widget | plugin propPanel button groups | click opción | actualiza solo schema activo | `tests/unit/detailWidgetRegistry.test.tsx` | manual-only |
| Registry | `SchemaCollaborationWidget` | widget | schemas con metadata | editar owner/lock | persiste __designer.collaboration | `tests/unit/detailWidgetRegistry.test.tsx`, `tests/unit/schemaCollaborationUtils.test.tsx` | `tests/playwright/detail-view-collaboration.spec.ts` |
| Registry | `SchemaConnectionsWidget` | widget | schemas con bindings | editar persistencia/API | persiste __designer config | `tests/unit/detailWidgetRegistry.test.tsx`, `tests/unit/schemaConnectionsValidation.test.ts` | `tests/playwright/detail-view-connections.spec.ts` |
| Registry | `SchemaFieldCommentsWidget` | widget | schemas con comments | agregar comentario | persiste comments sin tocar geometry | `tests/unit/detailWidgetRegistry.test.tsx` | `tests/playwright/detail-view-collaboration.spec.ts` |
| Snapshot | roundtrip snapshotAdapter | contrato | full template | serialize/deserialize/migrate | preserva geometry, ownerColor, recipients, comments, assignments | `tests/unit/snapshotAdapter.test.ts` | `tests/playwright/detail-view-snapshot.spec.ts` |
| Snapshot | export/import in UI | contrato | full template | exportar/importar | conserva schema UI state tras roundtrip | `tests/unit/snapshotAdapter.test.ts` | `tests/playwright/detail-view-snapshot.spec.ts` |

## Estado de cobertura

- `covered-unit`: la funcionalidad tiene cobertura de Vitest con contrato explícito.
- `covered-playwright`: la funcionalidad tiene cobertura end-to-end en el inspector o canvas.
- `manual-only`: comportamiento de plugin/extensión no trivial de automatizar sin fixture adicional.
- `missing-test`: existe contrato visible y todavía no tiene prueba directa.
- `not-applicable`: no aplica en esta ruta o depende de plugin externo no presente.
