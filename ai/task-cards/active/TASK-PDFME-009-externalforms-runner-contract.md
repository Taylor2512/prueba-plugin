# TASK-PDFME-009 — externalForms como Runner del snapshot sisad-pdfme

**Estado:** active  
**Prioridad:** P1  
**Responsable sugerido:** Codex  
**Área:** `Sisad-Web-FRONTEND/src/modules/externalForms`

## Objetivo

Reducir duplicidad y asegurar que externalForms consuma `Form`/`Viewer` de `sisad-pdfme`.

## Reglas

- externalForms es Runner, no Builder.
- No duplicar Form, Viewer, generator ni renderers.
- No depender de `DigitalAgreements/core/infra/sisad-pdfme`.
- No recrear schema rendering.
- No regenerar PIN durante llenado.
- No mezclar herramientas de laboratorio en UI pública.

## Fases

1. Extraer `RuntimeFormPanel`.
2. Separar snapshot adapter.
3. Separar access policy.
4. Separar input policy.
5. Separar submit/PDF generation service.
6. Reducir `Editor.jsx`.
7. Limpiar wrappers muertos.

## Criterios

- [ ] Renderiza con `Form`.
- [ ] Modo lectura usa `Viewer`.
- [ ] Assignments/ownership se respetan.
- [ ] Reasignación del diseñador se refleja en runtime.
- [ ] Inputs por documento se conservan.
- [ ] Guardado parcial funciona.
- [ ] PDF final se genera desde service.

## Estado parte core (2026-07-14, Claude)

**El módulo objetivo (`Sisad-Web-FRONTEND/src/modules/externalForms`) no está en
este repositorio.** Lo que el core ya ofrece para esa migración:
- `src/sisad-pdfme/externalForms/externalFormRunner.ts`: contrato Runner
  (FlowState, ExternalFormStorage, getSchemaVisibility con
  editable/readonly/hidden, areAllRequiredFieldsComplete, storage en memoria).
- `SisadPdfmeForm`/`SisadPdfmeViewer` como runtime de llenado/lectura (sin
  renderers duplicados), con filtrado por recipient del RecipientRegistry.
- Acceso runtime compartido (`resolveRuntimeSchemaAccess`) que respeta
  assignments/ownership y refleja reasignaciones del diseñador (test
  `runtimeAccessAfterReassignment.test.ts`).
- Generación PDF vía `generator/` exportado por `integration/index.ts`.
