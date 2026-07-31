# Catálogo canónico de eventos propuesto

El código actual expone un event hub genérico con `type: string`; este catálogo propone una unión discriminada y un adaptador legacy para `config.events.onX`.

| Evento | Dominio | Emisor | Cuándo | Payload mínimo |
|---|---|---|---|---|
| designer.ready | lifecycle | Designer | Una vez por instancia/rebuild | controller, capabilities, configVersion |
| designer.disposed | lifecycle | Designer | Antes de liberar recursos | instanceId |
| designer.error | lifecycle | cualquier | Error recuperable/no recuperable | code, message, cause, recoverable |
| config.changed | configuration | ConfigService | Hot update o rebuild | paths, impact, revision |
| template.changed | template | Designer/Runtime | Cambio de template | revision, cause, changedSchemaIds |
| schema.added | schema | Canvas/Catalog | Schema creado | schemaId, type, documentId, pageNumber |
| schema.updated | schema | Inspector/Canvas | Patch aplicado | schemaId, patch, cause |
| schema.removed | schema | List/Canvas | Schema eliminado | schemaIds |
| schema.duplicated | schema | CommandBus | Duplicación | sourceIds, createdIds |
| schema.reordered | schema | ListView | Orden cambiado | schemaIds, before/after |
| selection.changed | selection | Canvas/ListView | Selección efectiva cambió | ids, mode, documentId, pageNumber |
| interaction.phase.changed | interaction | InteractionMachine | Fase cambió | previous, current, reason |
| inline-edit.started | interaction | Canvas | Inicio de edición | schemaId, target |
| inline-edit.committed | interaction | Canvas | Edición aplicada | schemaId, patch |
| inline-edit.cancelled | interaction | Canvas | Edición cancelada | schemaId, reason |
| page.changed | navigation | CtlBar/Scroll | Página cambió | previous, current, total, documentId |
| zoom.changed | navigation | CtlBar/Controller | Zoom cambió | previous, current, cause |
| viewport.fit | navigation | CtlBar | Fit page/width | mode, zoom |
| sidebar.changed | surface | SurfaceState | Panel abierto/cerrado | side, expanded, presentation, cause |
| right-panel.changed | surface | RightSidebar | Fields/detail/docs/comments | previous, current |
| view-feature.changed | view | CtlBar | Grid/guides/snap/padding | feature, enabled |
| recipient.registry.changed | recipients | RecipientRegistry | Lista cambió | revision, recipients |
| recipient.active.changed | recipients | RecipientRegistry | Actor activo cambió | previousId, currentId |
| assignment.changed | assignment | AssignmentService | Owner cambió | schemaIds, previousOwnerIds, ownerId |
| document.added | documents | DocumentController | Documento agregado | documentId, index |
| document.changed | documents | DocumentController | Activo cambió | previousId, currentId |
| document.reordered | documents | DocumentController | Orden cambió | order |
| document.removed | documents | DocumentController | Documento eliminado | documentId, nextActiveId |
| comment.created | comments | Comments | Comentario creado | commentId, scope, anchor |
| comment.replied | comments | Comments | Respuesta creada | commentId, replyId |
| comment.resolved | comments | Comments | Resuelto | commentId |
| comment.reopened | comments | Comments | Reabierto | commentId |
| comment.moved | comments | Comments | Anchor movido | commentId, anchor |
| comment.deleted | comments | Comments | Eliminado | commentId |
| signature.requested | signature | Signature | Solicitud externa | schemaId, recipientId, providerKey |
| signature.completed | signature | Signature | Firma completada | schemaId, status, metadata |
| signature.failed | signature | Signature | Firma falló | schemaId, error |
| validation.completed | validation | Validator | Validación ejecutada | profile, valid, issues |
| save.requested | persistence | CtlBar/Controller | Usuario solicita guardado | correlationId, revision |
| save.started | persistence | Persistence | Guardado inicia | correlationId |
| save.succeeded | persistence | Persistence | Guardado termina | correlationId, revision |
| save.failed | persistence | Persistence | Guardado falla | correlationId, error |
| export.started | artifacts | Artifacts | Export inicia | correlationId, format |
| export.succeeded | artifacts | Artifacts | Export termina | correlationId, size |
| export.failed | artifacts | Artifacts | Export falla | correlationId, error |

## Reglas

- Todo evento incluye `version`, `eventId`, `timestamp`, `instanceId` y `correlationId` opcional.
- La UI no invoca directamente callbacks del host y event hub por caminos diferentes.
- Un dispatcher adapta eventos canónicos a los callbacks legacy `onReady`, `onChange`, `onSave`, `onError`, `onSelectionChange`, `onRecipientsChange`, `onActiveRecipientChange`, `onAssignmentChange`, `onDocumentChange` y `onSignatureRequest`.
- Un observer que falla no bloquea a otros; el error se informa por diagnostics.
- Eventos de alta frecuencia pueden coalescerse, pero nunca perder el estado final.
