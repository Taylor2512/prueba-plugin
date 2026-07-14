# TASK-PDFME-005 — Adapter de runtime para DigitalAgreements

**Estado:** active  
**Prioridad:** P1  
**Responsable sugerido:** Codex  
**Área:** `Sisad-Web-FRONTEND/src/features/DigitalAgreements/integration/pdf-designer`

## Objetivo

Separar la configuración runtime de DigitalAgreements en un adapter claro y comparable con el laboratorio.

## Archivo sugerido

`src/features/DigitalAgreements/integration/pdf-designer/pdfDesignerRuntimeConfig.js`

## Funciones sugeridas

- `buildDigitalAgreementsCollaborationConfig`
- `buildDigitalAgreementsDesignerOptions`
- `buildDigitalAgreementsRuntimeProps`

## Reglas

- No crecer más `useDigitalAgreementPdfDesigner.js` con lógica dispersa.
- No crear wrappers paralelos.
- No mover lógica SISAD a `src/components/sisad-pdfme`.
- Mantener `uploadedDocuments`, `activeDocumentId`, callbacks, `onTemplateChange`, `schemaCreationHook`, políticas de firma y connectivityMapping.

## Criterios

- [ ] `useDigitalAgreementPdfDesigner` queda más legible.
- [ ] RuntimeOptions usa el contrato equivalente al lab.
- [ ] `withCollaboration` recibe datos completos.
- [ ] `canEditStructure` no bloquea Reasignar.
- [ ] `visibility.actions.reassign` no queda en false.
- [ ] Guardar sigue usando el flujo real de StepTwo.
- [ ] No se rompe drag/drop, scroll ni zoom.

## Estado (2026-07-14, Claude)

**No ejecutable en este repositorio.** El área es
`Sisad-Web-FRONTEND/src/features/DigitalAgreements/...` (otro repo; aquí no
existe `src/features/DigitalAgreements`). Lo que este repo ya aporta para esa
tarea: contrato portable completo en `src/sisad-pdfme/integration`
(`createSisadPdfmeConfig`, `SisadPdfmeDesigner`, RecipientRegistry, controller
real) y la matriz de referencia en
`ai/reports/lab-parity-multidocument-routing.md`. `visibility.actions.reassign`
y `assignment.enabled` ya quedan activos por defecto en el core.
