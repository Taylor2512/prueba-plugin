# TASK-LAB-029 — RightSidebar abre Docs por defecto en multi-document-routing

- Estado: completed
- Prioridad: Alta
- Responsable sugerido: GitHub Copilot
- Área: `features/pdfcomponent` / `RightSidebar`

## Referencia

Basada en la petición del host para `http://localhost:5174/lab/multi-document-routing`.

## Objetivo

Hacer que la ruta `multi-document-routing` abra el RightSidebar con el tab `Docs` activo por defecto cuando existen documentos cargados y la visibilidad del panel documental está habilitada.

## Alcance

- `src/features/pdfcomponent/labs/examples/catalog/multiDocumentRouting.ts`
- `src/sisad-pdfme/ui/components/Designer/index.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx`
- `tests/playwright/right-sidebar-docs-tab.spec.ts`
- `tests/unit/features/pdfcomponent/labIntegration.test.ts`

## Pasos

1. Inyectar `rightSidebarViewMode: 'docs'` en el ejemplo `multi-document-routing`.
2. Verificar que el contrato de runtime propague `rightSidebarViewMode` al Designer.
3. Confirmar que `RightSidebar` sigue mostrando el tab `Docs` solo cuando hay documentos y `visibility.sidebars.right.panels.documents !== false`.
4. Actualizar la prueba Playwright para validar que la ruta abre en `docs` sin intervención manual.
5. Mantener intacta la selección de schema, el rail de documentos y el resto de tabs.

## Guardrails

- No tocar Canvas geometry.
- No tocar Moveable/Selecto.
- No cambiar la lógica de documentos.
- No crear una ruta paralela ni un panel nuevo.

## Cierre

- `multi-document-routing` abre el RightSidebar en `docs` cuando hay documentos múltiples.
- El tab `Docs` sigue condicionado por la visibilidad del panel documental.
- Validado con `vitest`, `npm run build` y Playwright.
