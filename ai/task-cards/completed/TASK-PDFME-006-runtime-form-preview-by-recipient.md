# TASK-PDFME-006 — Preview runtime FORM por destinatario

**Estado:** active  
**Prioridad:** P1  
**Responsable sugerido:** Claude  
**Área:** `src/sisad-pdfme/react`, `src/sisad-pdfme/runtime`, host DigitalAgreements

## Objetivo

Habilitar vista previa de llenado por usuario usando el runtime real `Form`, no un renderer inventado.

## Contrato

Debe reutilizar `Form`, `Viewer`, `SisadPdfmeForm`, `SisadPdfmeViewer`, `usePdfmeRuntimeInstance`, `buildRuntimeFormOptions`, plugins oficiales y recipient filtering / schemaRuntimeAccess.

## Casos

- Vista global.
- Destinatario específico.
- Schema sin owner.
- Schema con `ownerRecipientId`.
- Schema con `ownerRecipientIds`.
- Campos requeridos.
- Firma SISAD.
- OneShot provider.
- Dos documentos.
- Página 2.
- Inputs temporales sin guardar.
- Inputs guardados parcial.

## Criterios

- [ ] Preview usa `mode: "form"`.
- [ ] No existe renderer paralelo.
- [ ] El destinatario anterior no puede editar campos reasignados.
- [ ] El nuevo destinatario sí puede editar.
- [ ] Se puede simular llenado sin persistir automáticamente.
- [ ] Viewer se usa para modo lectura.

## Cierre parte core (2026-07-14, Claude)

Contrato verificado en este repo (`src/sisad-pdfme`):

- [x] Preview usa `mode: "form"`: `SisadPdfmeForm` monta `ui/Form` vía
      `usePdfmeRuntimeInstance` con `mode: 'form'`; `SisadPdfmeViewer` usa
      `mode: 'viewer'` para lectura.
- [x] No existe renderer paralelo: los wrappers reutilizan `Form`/`Viewer`
      oficiales; el filtrado vive en `Preview` → `resolveRuntimeSchemaAccess`.
- [x] El destinatario anterior no puede editar campos reasignados y el nuevo sí:
      test nuevo `runtimeAccessAfterReassignment.test.ts` (3 tests) une
      `assignSchemaOwner` (mismo service del diseñador) con
      `resolveRuntimeSchemaAccess` (mismo resolver del Form runtime).
- [x] Casos owner/ownerRecipientIds/sin owner/shared/locked/global cubiertos por
      `schemaRuntimeAccess.test.ts` (11 tests, en verde).
- [x] Se puede simular llenado sin persistir: `SisadPdfmeForm` recibe `values`
      y no persiste automáticamente (persistencia = decisión del host).
- [x] El activeRecipient del Form/Viewer nace del RecipientRegistry
      (`options.collaboration.activeRecipientId`), no de props sueltos.

Pendiente fuera de este repo (host DigitalAgreements):
- Casos Firma SISAD / OneShot provider con backend real.
- Preview embebido en el wizard del host con inputs guardados parciales.
