# TASK-PDFME-007 — Contrato snapshot/request para persistencia

**Estado:** active  
**Prioridad:** P0  
**Responsable sugerido:** Codex  
**Área:** `src/sisad-pdfme/shared`, `DigitalAgreements`, `externalForms`

## Objetivo

Garantizar que todas las acciones del diseñador persisten en snapshot/request/TXT y luego son consumibles por externalForms.

## Debe persistir

- `templateSchemaVersion`
- documents
- uploadedDocuments
- activeDocumentId
- schemas por documento/página
- recipients
- recipient registry
- assignments
- ownership
- colors
- signaturePolicyId
- signatureMode
- signatureProviderKey
- connectivity
- inputs
- contributors
- history
- delivery/message/security

## Flujo de aceptación

```txt
Designer modifica schema
→ onTemplateChange
→ documento actualizado
→ Guardar borrador / plantilla
→ snapshot/request
→ recargar
→ externalForms/Form consume el mismo contrato
```

## Criterios

- [ ] Reasignación se guarda.
- [ ] Firma SISAD se guarda.
- [ ] OneShot se guarda.
- [ ] Connectivity se guarda por archivo/schema.
- [ ] Inputs runtime no contaminan template base.
- [ ] Legacy `singType` puede migrarse a `signaturePolicyId`.
- [ ] Legacy `connectivityMapping` puede migrarse a `connectivity.byFile`.

## Cierre parte core (2026-07-14, Claude)

Contrato core verificado en `src/sisad-pdfme/shared` (snapshot v2):

- [x] `version` (semver del formato), `templateId`, metadata.
- [x] `documents` → páginas → `schemas` con `__designer` completo (por documento/página).
- [x] `recipients` (+ sección de registry en snapshots de template vía
      `recipientsToSnapshot`: activeRecipientId + mapas de color/nombre).
- [x] `assignments` (schemaUid/recipientId/scope) y derivables desde schemas
      (`buildRecipientAssignments` con fileId/pageNumber).
- [x] Ownership + colores: test nuevo `snapshotReassignmentPersistence.test.ts`
      (2 tests): reasignar → serialize → deserialize conserva
      ownerRecipientId/Ids, recipientId, ownerRecipientName, ownerColor,
      recipientColor, userColor, lastModifiedBy, locks y geometría.
- [x] Reasignación se guarda (criterio de la card).
- [x] `signatureMode` (`signatureConfig.defaultMode`) y `signatureProviderKey`
      (`providerConfig.defaultProvider` + allowedProviders) se guardan.
- [x] Inputs runtime NO contaminan el template base: los inputs viven fuera del
      snapshot de template (se pasan a Form por separado).
- [x] `snapshotAdapter.test.ts` (6 tests) + migración legacy pdfme 4.x en verde.

Pendiente fuera del core (host DigitalAgreements/externalForms):
- `activeDocumentId` es estado de UI del host; si se quiere persistir, va en
  `metadata`/request del host, no en el contrato core.
- `signaturePolicyId` (negocio), `connectivity.byFile`, contributors/history/
  delivery/message/security: conceptos del host; el core ofrece
  `providerConfig.tenantConfig` opaco como transporte.
- Migraciones legacy `singType` → `signaturePolicyId` y `connectivityMapping`
  → `connectivity.byFile`: implementarlas en el host que posee esos campos.
