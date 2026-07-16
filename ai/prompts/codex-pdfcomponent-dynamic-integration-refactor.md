Objetivo:
Refactorizar `src/features/pdfcomponent` para que sea una referencia de integración dinámica de `sisad-pdfme`, consumiendo API pública, config, adapters, recipients registry y controller, sin duplicar lógica de negocio del core.

Proyecto:
~/Documents/Taylor/frontend/prueba-plugin

Reglas:
- No modificar `src/sisad-pdfme` salvo que falte un export público mínimo justificado.
- No tocar Canvas/Moveable/Selecto/zoom/geometría.
- No crear wrappers para internals.
- No registrar recipients dos veces.
- No decorar templates con collaboration en el host.
- No usar `DesignerEngineBuilder` en `src/features/pdfcomponent`.
- No usar `usePdfmeRuntimeInstance` en `src/features/pdfcomponent`.
- No usar `setTimeout` para sincronizar modo/página.

Pasos:
1. Ejecutar `node scripts/audit-pdfcomponent-duplication.mjs`.
2. Crear `src/features/pdfcomponent/integration/*` y `hooks/usePdfmeLabIntegration.ts`.
3. Migrar `PdfmeLabPage.jsx` para consumir el hook y wrappers públicos.
4. Partir `labs/examples/labExamples.js` en data declarativa + registry.
5. Cambiar `CompactControls.jsx` para recibir action descriptors.
6. Cambiar `PageHeader.jsx` para recibir viewModel, no calcular recipients/counters.
7. Cambiar `domain/labPresentation.js` para usar selectors públicos del core.
8. Deprecar wrappers de un archivo tras `rg` de imports.
9. Agregar Playwright de integración dinámica.

Validación:
- `rg "DesignerEngineBuilder|usePdfmeRuntimeInstance|decorateTemplateWithCollaboration|decorateCollaborationUsers" src/features/pdfcomponent`
- `npm run build`
- `npx playwright test tests/playwright/pdfcomponent-dynamic-integration.spec.ts`
