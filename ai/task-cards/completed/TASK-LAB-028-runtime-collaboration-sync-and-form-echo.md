# TASK-LAB-028 — Sincronización de colaboración runtime y eco de inputs del Form

- Estado: completed
- Prioridad: Alta
- Responsable sugerido: GitHub Copilot
- Área: `features/pdfcomponent` / `sisad-pdfme` integración laboratorio

## Referencia

Basada en `auditoria_profunda_funcional_sisad_pdfme.md`.

## Objetivo

Hacer que el laboratorio propague correctamente el usuario activo y la vista global al runtime público de `sisad-pdfme`, y que el Form publique los cambios de inputs de vuelta al host.

## Alcance

- `src/features/pdfcomponent/PdfmeLabPage.jsx`
- `src/features/pdfcomponent/hooks/usePdfmeLabIntegration.ts`
- `src/features/pdfcomponent/integration/createLabPdfmeConfig.ts`
- `src/sisad-pdfme/config/SisadPdfmeConfig.ts`
- `src/sisad-pdfme/react/SisadPdfmeDesigner.tsx`
- `src/sisad-pdfme/react/SisadPdfmeForm.tsx`
- `src/sisad-pdfme/react/SisadPdfmeViewer.tsx`

## Pasos

1. Propagar `activeCollaboratorId` e `isGlobalView` desde `PdfmeLabPage` al hook de integración.
2. Hacer que `usePdfmeLabIntegration` y `createLabPdfmeConfig` acepten overrides de `activeRecipientId` y `isGlobalView`.
3. Añadir `collaboration.isGlobalView` al contrato público de config y a los defaults/resolver.
4. Hacer que `SisadPdfmeDesigner` pase `isGlobalView` al `buildCollaborationSyncFromRegistry`.
5. Hacer que `SisadPdfmeForm` reciba `onInputChange` y lo conecte al runtime hook.
6. Hacer que `SisadPdfmeForm` y `SisadPdfmeViewer` respeten `config.collaboration.isGlobalView` en `options.collaboration`.
7. Añadir pruebas unitarias para el contrato de integración y para los wrappers runtime.

## Guardrails

- No tocar Canvas geometry.
- No tocar Moveable/Selecto.
- No crear lógica de host específica.
- No duplicar recipients ni assignment.

## Cierre

- `PdfmeLabPage.jsx` propaga `activeCollaboratorId` e `isGlobalView` al runtime público.
- `SisadPdfmeForm` devuelve cambios de inputs al host y respeta la vista global.
- `SisadPdfmeViewer` y `SisadPdfmeDesigner` respetan la colaboración global del contrato.
- Validado con `vitest` y `npm run build`.
