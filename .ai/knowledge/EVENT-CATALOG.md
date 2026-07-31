# Catálogo de eventos

Eventos propuestos: **45**.

| ID | Evento | Dominio | Productor | Trigger |
|---|---|---|---|---|
| EVT-001 | `designer.ready` | lifecycle | Designer | Una vez por instancia/rebuild |
| EVT-002 | `designer.disposed` | lifecycle | Designer | Antes de liberar recursos |
| EVT-003 | `designer.error` | lifecycle | cualquier | Error recuperable/no recuperable |
| EVT-004 | `config.changed` | configuration | ConfigService | Hot update o rebuild |
| EVT-005 | `template.changed` | template | Designer/Runtime | Cambio de template |
| EVT-006 | `schema.added` | schema | Canvas/Catalog | Schema creado |
| EVT-007 | `schema.updated` | schema | Inspector/Canvas | Patch aplicado |
| EVT-008 | `schema.removed` | schema | List/Canvas | Schema eliminado |
| EVT-009 | `schema.duplicated` | schema | CommandBus | Duplicación |
| EVT-010 | `schema.reordered` | schema | ListView | Orden cambiado |
| EVT-011 | `selection.changed` | selection | Canvas/ListView | Selección efectiva cambió |
| EVT-012 | `interaction.phase.changed` | interaction | InteractionMachine | Fase cambió |
| EVT-013 | `inline-edit.started` | interaction | Canvas | Inicio de edición |
| EVT-014 | `inline-edit.committed` | interaction | Canvas | Edición aplicada |
| EVT-015 | `inline-edit.cancelled` | interaction | Canvas | Edición cancelada |
| EVT-016 | `page.changed` | navigation | CtlBar/Scroll | Página cambió |
| EVT-017 | `zoom.changed` | navigation | CtlBar/Controller | Zoom cambió |
| EVT-018 | `viewport.fit` | navigation | CtlBar | Fit page/width |
| EVT-019 | `sidebar.changed` | surface | SurfaceState | Panel abierto/cerrado |
| EVT-020 | `right-panel.changed` | surface | RightSidebar | Fields/detail/docs/comments |
| EVT-021 | `view-feature.changed` | view | CtlBar | Grid/guides/snap/padding |
| EVT-022 | `recipient.registry.changed` | recipients | RecipientRegistry | Lista cambió |
| EVT-023 | `recipient.active.changed` | recipients | RecipientRegistry | Actor activo cambió |
| EVT-024 | `assignment.changed` | assignment | AssignmentService | Owner cambió |
| EVT-025 | `document.added` | documents | DocumentController | Documento agregado |
| EVT-026 | `document.changed` | documents | DocumentController | Activo cambió |
| EVT-027 | `document.reordered` | documents | DocumentController | Orden cambió |
| EVT-028 | `document.removed` | documents | DocumentController | Documento eliminado |
| EVT-029 | `comment.created` | comments | Comments | Comentario creado |
| EVT-030 | `comment.replied` | comments | Comments | Respuesta creada |
| EVT-031 | `comment.resolved` | comments | Comments | Resuelto |
| EVT-032 | `comment.reopened` | comments | Comments | Reabierto |
| EVT-033 | `comment.moved` | comments | Comments | Anchor movido |
| EVT-034 | `comment.deleted` | comments | Comments | Eliminado |
| EVT-035 | `signature.requested` | signature | Signature | Solicitud externa |
| EVT-036 | `signature.completed` | signature | Signature | Firma completada |
| EVT-037 | `signature.failed` | signature | Signature | Firma falló |
| EVT-038 | `validation.completed` | validation | Validator | Validación ejecutada |
| EVT-039 | `save.requested` | persistence | CtlBar/Controller | Usuario solicita guardado |
| EVT-040 | `save.started` | persistence | Persistence | Guardado inicia |
| EVT-041 | `save.succeeded` | persistence | Persistence | Guardado termina |
| EVT-042 | `save.failed` | persistence | Persistence | Guardado falla |
| EVT-043 | `export.started` | artifacts | Artifacts | Export inicia |
| EVT-044 | `export.succeeded` | artifacts | Artifacts | Export termina |
| EVT-045 | `export.failed` | artifacts | Artifacts | Export falla |
