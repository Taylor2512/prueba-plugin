# Matriz de comportamiento por dominio — baseline (CONFIG-002 / Fase 0)

Modelo único por feature: `registered · supported · enabled · visible · permitted · available · active · executable · reason` (plan §4).
`executable = registered && supported && enabled && permitted && available`; `renderable = registered && supported && enabled && visible`.

| Dominio | Rutas de config que participan | Owner de la decisión (destino) |
|---|---|---|
| runtime | `runtime.mode/readonly/isolateDomEvents/preserveSelectionOnModalClose` | `selectRuntime*` |
| canvas | `canvas.enabled/selecto/moveable/snapLines/guides/multiSelect/suspendWhenModalOpen` (+ nuevo `canvas.transform.{move,resize,rotate}`) | `selectCanvasConfig` |
| left sidebar | `sidebars.left.*` + `visibility.sidebars.left.*` | `selectLeftSidebarConfig` |
| right sidebar | `sidebars.right.*` + `visibility.sidebars.right.*` | `selectRightSidebarConfig` |
| inspector | `inspector.*` (visible/sections/fields/fieldsBySchemaType) | `selectInspectorConfig` |
| schemas | `schemas.enabledTypes` + `visibility.schemas.{catalog,canvas,inspector,runtime}` | `selectSchemaConfig(type)` |
| acciones | `visibility.actions.*` + `assignment.*` + `collaboration.canEditStructure` + selección/lock | `getActionState(id, ctx)` |
| recipients/asignación | `recipients.activeRecipientId`, `assignment.enabled/allowSingle/allowBulk`, `visibility.actions.reassign`, `visibility.modals.assignment` | `getActionState('reassign')` |
| documents | `documents.mode/preserveDocumentSchemaRouting/activeDocumentStrategy` + `visibility...panels.documents` | `selectDocumentsConfig` |
| comments | `comments.enabled/allow*` + panel visible | `selectCommentsConfig` |
| signatures | `signatures.enabled/defaultMode/providers` | `selectSignatureConfig` |
| persistence | `persistence.mode/autosave/serializeSnapshot` | `selectPersistenceConfig` |
| theme/densidad | `theme.density/tokens`, `ui.visualPreset/layoutPreset/classNames` + densidad responsiva | `selectVisibility`/`theme` |

Regla transversal: **visible ≠ enabled ≠ permitted**; ocultar del catálogo no elimina schema del canvas/snapshot; cambiar visibilidad de panel nunca cambia routing.
