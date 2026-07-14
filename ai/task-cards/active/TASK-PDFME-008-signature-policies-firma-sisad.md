# TASK-PDFME-008 — Políticas de firma: Firma SISAD, Electrónica y OneShot

**Estado:** active  
**Prioridad:** P1  
**Responsable sugerido:** Claude  
**Área:** `src/sisad-pdfme/schemas/signature`, host DigitalAgreements

## Objetivo

Unificar conceptos de firma sin contaminar `SIGNATURE_MODE_OPTIONS`.

## Regla

`SIGNATURE_MODE_OPTIONS` sigue siendo técnico:
- `draw`
- `image`
- `p12`
- `provider`

DigitalAgreements debe tener políticas de negocio:
- `sisad` → `signatureMode: "draw"`
- `electronica` → `signatureMode: "p12"`
- `oneshot` → `signatureMode: "provider"`, `signatureProviderKey: "oneshot"`

## Criterios

- [ ] StepOne guarda `signaturePolicyId`.
- [ ] Se conserva `singType` como legacy temporal.
- [ ] StepTwo crea schemas de firma con propiedades técnicas correctas.
- [ ] Form/Viewer detectan provider/capabilities.
- [ ] El inspector muestra configuración de firma disponible.
- [ ] No se agrega `sisad` como `SignatureMode`.

## Estado parte core (2026-07-14, Claude)

Verificado en este repo:
- [x] `SIGNATURE_MODE_OPTIONS` sigue siendo técnico: draw/image/p12/provider
      (`src/sisad-pdfme/schemas/signature/types.ts:39`); no existe `sisad` como
      `SignatureMode` en el core.
- [x] El inspector muestra la configuración de firma disponible
      (`schemas/signature/propPanel.ts` consume `SIGNATURE_MODE_OPTIONS`).
- [x] El snapshot core persiste `signatureConfig.defaultMode` y
      `providerConfig.defaultProvider/allowedProviders`
      (ver TASK-PDFME-007, test `snapshotReassignmentPersistence.test.ts`).

Pendiente en Sisad-Web-FRONTEND (no ejecutable aquí): `signaturePolicyId` en
StepOne, legacy `singType`, creación de schemas de firma en StepTwo con la
política de negocio (sisad→draw, electronica→p12, oneshot→provider+providerKey).
