# TASK-PDFME-003 — Reasignación de destinatarios con persistencia real

**Estado:** active  
**Prioridad:** P0  
**Responsable sugerido:** Claude  
**Área:** `src/sisad-pdfme/ui/components/Designer`, `src/sisad-pdfme/ui/components/Designer/shared`, `src/sisad-pdfme/react`

## Objetivo

Habilitar por completo el botón **Reasignar responsable** usando las capacidades existentes del runtime, sin crear modal paralelo en el host.

## Circuito obligatorio

```txt
RightSidebar/ListViewToolbar
→ onBulkAssignRecipient
→ SchemaAssignmentDialog
→ seleccionar nuevo destinatario
→ schemaAssignmentService
→ actualizar ownerRecipientId / ownerRecipientIds / recipientId / colors
→ emitir onTemplateChange
→ host actualiza documento
→ guardado conserva reasignación
```

## Archivos a auditar

```bash
rg -n "SchemaAssignmentDialog|onBulkAssignRecipient|showBulkRecipientAction|bulkRecipientDisabled|Reasignar|right-sidebar-reassign|schemaAssignmentService|assign.*Recipient|ownerRecipientId|ownerRecipientIds" src/sisad-pdfme
rg -n "getSchemaIdentity|schemaUid|selectionIdentityResolver|selectedSchemaIds|activeElements" src/sisad-pdfme/ui/components/Designer
```

## Reglas

- No crear `ReassignSchemasModal` en el host.
- No tocar Canvas, Moveable, Selecto, scroll, zoom ni coordenadas.
- No modificar `x`, `y`, `width`, `height`, `pageIndex`, `pageNumber`, `fileId`, `name`, `schemaUid`.
- Reasignar no debe bloquearse por `locked`, `readOnly`, `readonly` u `objectLocked`.
- El cambio debe llegar por `onTemplateChange`, no por estado visual local.
- Resolver identidad con tolerancia: `schema.schemaUid || schema.id || schema.name`.

## Implementación esperada

1. Confirmar que `ListViewToolbar` recibe `onBulkAssignRecipient`.
2. Confirmar que el botón existe solo si hay selección, hay recipients, `assignment.enabled !== false` y `visibility.actions.reassign !== false`.
3. Conectar apertura del `SchemaAssignmentDialog`.
4. El modal debe recibir schemas seleccionados, recipients, activeRecipient y actorId/currentUser.
5. Al confirmar destino distinto al actual, actualizar `ownerMode`, `ownerRecipientId`, `ownerRecipientIds`, `recipientId`, `ownerRecipientName`, `ownerColor`, `recipientColor`, `userColor`, `lastModifiedBy`.
6. Emitir `onTemplateChange(nextTemplate)`.

## Validación manual

- [ ] Seleccionar un schema texto.
- [ ] Click en Reasignar.
- [ ] Modal abre.
- [ ] Elegir Avalista.
- [ ] Botón interno Reasignar se habilita.
- [ ] Confirmar.
- [ ] Cambia color y owner.
- [ ] ListView refleja nuevo responsable.
- [ ] DetailView refleja nuevo responsable.
- [ ] Guardar y recargar mantiene el cambio.
- [ ] Repetir con Firma.
- [ ] Repetir con selección múltiple.
- [ ] Repetir en página 2.
- [ ] Repetir con dos documentos.

## Tests sugeridos

```bash
npx vitest run   tests/unit/sisad-pdfme/ui/components/Designer/shared/schemaAssignmentService.test.ts   tests/unit/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.assignment.test.tsx
```

## Definición de hecho

- Reasignar cambia ownership real.
- `onTemplateChange` se dispara.
- No se altera geometría.
- El cambio persiste en snapshot/documento.

## Cierre (2026-07-14, Claude)

Circuito verificado end-to-end en el core:

- `ListViewToolbar` recibe `onBulkAssignRecipient`; botón `right-sidebar-reassign`
  gated por selección + `assignment.enabled === true` (ahora default `true` en
  `defaultSisadPdfmeConfig`) + `visibility.actions.reassign !== false` +
  `canEditStructure !== false`.
- `ListView.handleConfirmAssignment` → `selectionCommands.assignRecipient`
  (command bus, con undo) o `buildAssignSchemaOwnerOps` → `changeSchemas` →
  `onTemplateChange` (flujo estándar del Designer, no estado visual local).
- Patch de owner ampliado según esta card: ahora incluye `recipientColor` y
  `lastModifiedBy` (actor desde `collaborationContext.actorId`), además de
  `ownerMode/ownerRecipientId/ownerRecipientIds/recipientId/ownerRecipientName/
  ownerColor/userColor`. Ambos caminos (service y selectionCommands) alineados.
- No toca `locked/readOnly/objectLocked/lock` ni geometría (invariante testeada).
- Identidad tolerante: `schemaUid || id || name` (`resolveSchemaUid`).
- El controller público (`assignSchemasToRecipient`) usa el mismo service con
  actor = active recipient del registry y emite `onAssignmentChange`.

Validación automatizada:
- [x] `schemaAssignmentService.test.ts` (7 tests).
- [x] `ListViewToolbar.assignment.test.tsx` (nuevo, 5 tests: click emite intent,
      disabled no emite, oculto sin permiso estructural, oculto sin selección,
      aria-label estable).
- [x] `ListViewToolbar.visibility.test.tsx` (3), `selectionCommands.test.ts` (3),
      `useSisadPdfmeController.recipients.test.tsx` (7).
- [x] e2e `detail-view-collaboration.spec.ts`: modal Reasignar del DetailView.

Pendiente fuera de este repo: la validación manual de guardar/recargar en el
host SISAD-WEB (persistencia del documento es responsabilidad del host).
