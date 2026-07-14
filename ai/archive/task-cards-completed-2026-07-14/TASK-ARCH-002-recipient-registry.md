# TASK-ARCH-002 — recipient registry and recipient controller contract

**Estado:** completed (verificación final 2026-07-14, Claude)  
**Fecha:** 2026-07-14  
**Responsable sugerido:** Claude  
**Área:** `src/sisad-pdfme/recipients`, `src/sisad-pdfme/react`, `src/sisad-pdfme/ui/collaborationContext.ts`

## Resultado observado

Claude está validando el nuevo contrato de recipients mediante:

```bash
npx vitest run   tests/unit/recipientRegistry.test.ts   tests/unit/recipientResolver.test.ts   tests/unit/useSisadPdfmeController.recipients.test.tsx   tests/unit/sisad-pdfme/config/visibility.test.ts   tests/unit/sisad-pdfme/ui/collaborationContext.test.ts
```

Esto apunta a una dirección correcta: cerrar primero registry/resolver/controller antes de conectar el botón de reasignación.

## Objetivo técnico

Centralizar y normalizar recipients para que Designer, Form, Viewer y controller compartan el mismo contrato:

- `getRecipients()`
- `setRecipients(recipients)`
- `getRecipientById(recipientId)`
- `getActiveRecipient()`
- `setActiveRecipient(recipientId)`
- `recipientResolver`
- `recipientColorResolver`
- `recipientPermissionResolver`
- `recipientSnapshot`

## Criterios de cierre

- [x] Las pruebas `recipientRegistry.test.ts` pasan. (11 tests, 2026-07-14.)
- [x] Las pruebas `recipientResolver.test.ts` pasan. (14 tests.)
- [x] Las pruebas `useSisadPdfmeController.recipients.test.tsx` pasan. (7 tests: controller real,
      reasignación preservando locks, snapshot roundtrip, hook con recipients async.)
- [x] `collaborationContext.test.ts` pasa.
- [x] `getActiveRecipient()` devuelve el recipient correcto cuando existe `activeRecipientId`.
- [x] `setActiveRecipient()` no rompe el contexto de colaboración: los wrappers derivan
      `designerEngine.collaboration` del registry (`buildCollaborationSyncFromRegistry`) y el
      runtime recibe `updateOptions`, así que el contexto se recalcula de la misma fuente.
- [x] `getRecipientById()` resuelve por `id` normalizado (trim en registry).
- [x] El controller no deja no-op silencioso: recipients/reasignación son reales; los métodos aún
      no soportados (`selectSchemas`, `addSchema`, etc.) emiten `console.warn` en desarrollo.
- [x] La API es usable por host apps sin deep imports: todo se exporta desde
      `src/sisad-pdfme/integration/index.ts` (registry, resolvers, hook, tipos).

## Riesgos

- No convertir registry en lógica SISAD; debe ser reusable.
- No mezclar recipients de negocio de DigitalAgreements con recipients runtime.
- No romper snapshots legacy que usen `recipientId`, `ownerRecipientId` u `ownerRecipientIds`.
