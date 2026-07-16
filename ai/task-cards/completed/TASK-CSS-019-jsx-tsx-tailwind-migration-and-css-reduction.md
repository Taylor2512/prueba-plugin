# TASK-CSS-019 — Migración de clases Tailwind a JSX/TSX y reducción de CSS legado

- Estado: completed
- Prioridad: Alta
- Responsable sugerido: GitHub Copilot
- Área: `sisad-pdfme` / Estilos

## Objetivo

Mover la mayor cantidad posible de clases visuales Tailwind desde `sisad-pdfme.css`, `labRoutes.css` y `tokens.css` hacia sus componentes JSX/TSX equivalentes, aprovechando las constantes de prefijo en `src/sisad-pdfme/ui/constants.ts` para mantener compatibilidad de runtime y reducir `@apply` redundantes.

## Foco inicial

- `RightSidebar` panel switcher y superficies
- `ListView` toolbar y rows
- `LeftSidebar` tabs, search, groups y plugin cards
- Shell visual del laboratorio en `src/features/pdfcomponent`

## Archivos a revisar

- `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebarSearch.tsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx`
- `src/features/pdfcomponent/PageHeader.jsx`
- `src/features/pdfcomponent/CompactControls.jsx`
- `src/features/pdfcomponent/ResultsPanel.jsx`
- `src/features/pdfcomponent/PdfmeLabPage.jsx`
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css`
- `src/features/pdfcomponent/labRoutes.css`
- `src/sisad-pdfme/ui/styles/tokens.css`

## Pasos

1. Identificar selectores CSS que ya tienen paridad exacta en inline Tailwind.
2. Mover skins visuales seguros a JSX/TSX usando `DESIGNER_CLASSNAME` y `UI_CLASSNAME`.
3. Conservar geometría, scroll, canvas, Moveable, Selecto y PDF.
4. Reducir o eliminar `@apply` en reglas ya migradas.
5. Actualizar checklist y resumen de completadas cuando se cierre una subpasada.

## Progreso actual

- Migrado `PageHeader.jsx` a utilidades inline para chips, topbar, rail, acciones y métricas.
- Migrado `CompactControls.jsx`, `PopoverMenu.jsx` y `ResultsPanel.jsx` a skins Tailwind directas.
- Ajustado `RightSidebar`, `ListView/Item.tsx`, `ListViewToolbar.tsx`, `SelectableSortableContainer.tsx`, `SelectableSortableItem.tsx`, `ListViewDragOverlay.tsx`, `LeftSidebarGroup.tsx`, `LeftSidebarTabs.tsx`, `LeftSidebarSearch.tsx`, `SidebarRail.tsx`, `SidebarCollapseHandle.tsx`, `DocumentsRail.tsx`, `AlignWidget.tsx`, `SchemaConnectionsShared.tsx`, `SchemaConnectionsWidget.tsx` y `SchemaCollaborationWidget.tsx` para reducir dependencia de hooks CSS y propagar densidad por TSX.
- Podados bloques duplicados de `src/sisad-pdfme/ui/styles/sisad-pdfme.css`; el conteo de `@apply` bajó a 610 tras retirar otra capa base del sidebar, la skin del ListView y reglas duplicadas del sidebar izquierdo.
- Migrado el skin del catálogo del `LeftSidebar` a utilidades inline en TSX, incluyendo labels, estados de favorito y modo `icons`.
- Validado en navegador `http://localhost:5174/lab/multi-document-routing` que el tab `Docs` del RightSidebar está activo en el panel derecho.
- Podadas reglas huérfanas de `src/features/pdfcomponent/labRoutes.css`; el archivo quedó en no-op de compatibilidad sin `@apply` tras mover la responsividad restante a `PdfmeLabPage.jsx` y `PageHeader.jsx`.
- Retirados los bloques base redundantes `.sisad-pdfme-designer-sidebar-frame` y `.sisad-pdfme-designer-sidebar-surface` de `src/sisad-pdfme/ui/styles/sisad-pdfme.css` porque `LeftSidebar.tsx`, `RightSidebar.tsx` y `RightSidebar/layout.tsx` ya poseen esa skin inline en TSX.
- El conteo de `@apply` en `src/sisad-pdfme/ui/styles/sisad-pdfme.css` bajó de 610 a 608 en esta pasada.
- Build verificado con `npm run build`.
- Validado `tests/playwright/right-sidebar-visual-polish.spec.ts`, `tests/playwright/canvas-overflow-regression.spec.ts` y `tests/playwright/drag-preview-and-canvas-scroll-regression.spec.ts`.
- Validado `tests/playwright/multi-document-routing-design.spec.ts` y `tests/playwright/right-sidebar-docs-tab.spec.ts`.
- Revalidado en esta pasada con `npm run build && npx playwright test tests/playwright/multi-document-routing-design.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`.

## Guardrails

- No tocar canvas geometry.
- No tocar Moveable, Selecto, zoom ni coordenadas PDF.
- No crear CSS paralelo nuevo.
- No reabrir task-cards protegidas.
- No perder `data-testid` ni prefijos de runtime.

## Criterio de cierre

- El CSS legado queda reducido en los bloques migrados.
- Los componentes visuales relevantes usan Tailwind inline o clases calculadas desde TSX/JSX.
- La UI mantiene la misma interacción y el build/tests siguen pasando.
