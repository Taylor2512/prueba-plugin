# TASK-REGRESSION-021 — Recuperación visual shell/tokens antes de seguir migrando Tailwind

- Estado: active
- Prioridad: Alta
- Responsable sugerido: GitHub Copilot
- Área: `sisad-pdfme` / Shell visual / Sidebars / Tokens de presentación

## Objetivo

Recuperar la paridad visual del shell del laboratorio y de las superficies base del diseñador usando JSX/TSX con Tailwind, tomando como baseline el contrato visual previo definido por el CSS consolidado histórico y las capturas anteriores, antes de continuar reduciendo `@apply`.

## Baseline usado

- Baseline híbrido por falta de un commit único visualmente correcto.
- CSS/base shell: `4c40ca1` (`src/features/pdfcomponent/labRoutes.css`).
- Header shell: `e96a7ab` (`src/features/pdfcomponent/PageHeader.jsx`).
- LeftSidebar tabs/layout: `2404b7a` (`src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx`).
- Referencia visual secundaria: capturas previas del usuario y `ai/baselines/multi-document-routing-2026-07-15.jpg`.

## Regresiones foco de esta tarjeta

1. Jerarquía visual degradada del shell del lab y sidebars.
2. Selector Lista/Tarjetas/Iconos y bandas superiores del sidebar izquierdo con densidad/espaciado inconsistentes.
3. Cards/superficies del sidebar derecho e inspector con borde, padding y contraste distintos al baseline.
4. Pérdida de contratos visuales que antes vivían en CSS consolidado y no fueron trasladados al nodo JSX/TSX correcto.

## Alcance

- Restaurar shell, header, sidebars y superficies base.
- Reubicar utilidades Tailwind faltantes al JSX/TSX correcto.
- Mantener `tokens.css` y CSS crítico fuera del alcance.
- No continuar la reducción masiva de `@apply` hasta demostrar paridad visual.

## Fuera de alcance

- Moveable, Selecto, geometría, zoom, guías, snapshot, generator y `pdf-lib`.
- Correcciones funcionales de drag/drop o owner-color si exigen otra superficie.
- Limpieza adicional de CSS por conteo.

## Archivos candidatos

- `src/features/pdfcomponent/PdfmeLabPage.jsx`
- `src/features/pdfcomponent/PageHeader.jsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx`

## Archivos prohibidos

- `src/sisad-pdfme/ui/styles/sisad-pdfme.css`
- `src/features/pdfcomponent/labRoutes.css`
- `src/sisad-pdfme/ui/styles/tokens.css`
- cualquier archivo de canvas geometry, Moveable, Selecto, snapshot o generator

## Validación

- `npm run build`
- comparación visual en `/lab/multi-document-routing`
- `npx playwright test tests/playwright/multi-document-routing-design.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`

## Progreso actual

- `LeftSidebarTabs.tsx` recuperó la jerarquía compacta del selector superior sin volver a CSS de hoja; se usaron pills más bajas, badges absolutos y labels cortos para evitar clipping.
- `LeftSidebar.tsx` recuperó padding, dock header, chip recipient y superficie glass del panel izquierdo en el nodo dueño.
- `CatalogLayoutToggle.tsx` quedó compactado para densidades/anchos estrechos, ocultando labels cuando el rail no tiene espacio suficiente y evitando el recorte del selector Lista/Tarjetas/Iconos.
- `SchemaCollaborationWidget.tsx` eliminó el bloque redundante de `Propiedad` para que los detalles del schema de firma no repitan el resumen del owner y el bloque de colaboración quede más limpio.
- `DetailHeaderCard.tsx`, `SidebarSurfacePrimitives.tsx`, `DetailSectionCard.tsx`, `InspectorField.tsx` y `InspectorPrimitives.tsx` suavizaron bordes, sombras y fondos del inspector para recuperar la densidad visual del baseline sin cambiar lógica ni contratos.
- `Item.tsx` suavizó borde, sombra y estado seleccionado de las filas del ListView para separar mejor el accent del propietario del estado `selected` y bajar el ruido del row activo.
- `Item.tsx` también desactivó la apariencia nativa del hit-target del row, eliminando el borde `2px outset` del navegador que hacía ver las cards como si tuvieran un contorno negro pesado.
- `index.tsx` dejó explícita la precedencia de `RightSidebar` para que el modo `docs` del laboratorio multidocumento no sea pisado por props del engine al entrar a la ruta.
- `PageHeader.jsx` y `PdfmeLabPage.jsx` absorbieron la capa visual del shell del lab con Tailwind inline; en `multi-document-routing` se reactivó el hero superior para recuperar la paridad visual con el baseline.
- `LeftSidebarSearch.tsx`, `LeftSidebarGroup.tsx` y `LeftSidebarCustomPanel.tsx` suavizaron superficies, bordes y focus rings del rail izquierdo para mantener la densidad compacta sin perder el look del baseline.
- `DetailHeaderCard.tsx` y `InspectorPrimitives.tsx` continuaron la limpieza de superficies del inspector con botones/Tags sin borde nativo y chips más suaves para evitar contraste duro en el resumen del schema.
- `SidebarSurfacePrimitives.tsx`, `DocumentsRail.tsx` y `ListViewToolbar.tsx` homogeneizaron las superficies del rail derecho, los cards de documentos y los controles de lista con borde/sombra más suaves y botones sin apariencia nativa.
- `CompactConfigPanel.tsx` y `SchemaConnectionsWidget.tsx` siguieron la misma línea visual para el inspector técnico/conexiones, bajando gradientes y elevando el contrato de tarjeta simple sobre CSS global.
- `SchemaOptionsEditor.tsx` y `InspectorDefinitionList.tsx` suavizaron la microinteracción de opciones y definiciones para mantener el inspector denso pero limpio, con botones sin borde nativo y tarjetas menos pesadas.
- `SchemaCollaborationWidget.tsx` migró el `Collapse` del bloque colaborativo a utilidades inline, suavizó el estado de bloqueo y eliminó la dependencia de separación duplicada en CSS.
- `SchemaConnectionsShared.tsx` homogeneizó el editor de pares y el `SectionHeader` compartido con tarjetas más suaves, botones sin apariencia nativa y campos consistentes con el baseline del inspector.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` perdió dos reglas redundantes de `schema-config-collapse` y `schema-config-section-head` que ya estaban cubiertas por Tailwind en TSX.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` también perdió el bloque de layout de `detail-view`, `detail-view-host`, `list-view` y `detail-view-sections`, ya duplicado por clases inline en `DetailViewContent.tsx` y `ListView.tsx`.
- `DetailHeaderCard.tsx` absorbió la densidad mínima del header en el propio componente y dejó de depender del selector `data-detail-header-density`, permitiendo borrar los overrides CSS de subtitle/trailing compactos.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó los bloques redundantes de `detail-header-card`, `detail-section-card`, `detail-view-context-strip`, `detail-view-context-chip` y `compact-config-panel`, quedando solo contratos semánticos y reglas aún activas de AntD/inspector.
- La comparación visual manual sobre `/lab/multi-document-routing` muestra mejora clara respecto al estado degradado: desapareció la franja superior en blanco y se estabilizó la banda superior del catálogo.
- Validado con `npm run build`, `npx playwright test tests/playwright/right-sidebar-docs-tab.spec.ts`, `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts` y `npx -y react-doctor@latest . --verbose --diff`.
- Captura más reciente del viewport confirma que el shell sigue estable, la fila del ListView perdió el contorno negro nativo y el tab `Docs` sigue disponible/activo en la ruta multidocumento.
- `LeftSidebar.tsx` absorbió el último skin residual del catálogo por densidad mínima en el propio nodo React: los botones de catálogo ahora resuelven min-height, padding, gap, label clamp e icon sizing por clase Tailwind, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó esos selectores redundantes.
- Validado ese slice con `npm run build`, `npx playwright test tests/e2e/left-sidebar-view-modes.spec.ts` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts`; el smoke `tests/playwright/sidebar-left-right-design.spec.ts -g "DetailView"` quedó fallando en una condición ajena al cambio actual porque no encuentra `detail-view` visible.
- `InspectorPrimitives.tsx` absorbió el skin principal del summary card, métricas y acciones del inspector: los chips ahora viven en JSX/TSX con gap, density minimal, truncado y botón compacto, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` perdió el bloque `inspector-summary-card`/`inspector-metric-*` redundante.
- Validado ese slice con `npm run build`, `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts` y `npx playwright test tests/e2e/left-sidebar-view-modes.spec.ts`; el intento de correr `tests/playwright/detailview-inspector.spec.ts` no encontró archivo coincidente en este checkout, así que no se usó como gate.
- `ListViewToolbar.tsx` absorbió el skin final duplicado de búsqueda/filtro/acciones masivas y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque residual de `bulk-update`, `input-auto`, `search-auto` y `layers-auto`; además se retiró el wrapper CSS de `list-view` y el override compact del título del sidebar surface porque ya viven en TSX.
- `tests/playwright/list-view-regression.spec.ts` se alineó al contrato actual del panel derecho (`fields`) y dejó de depender de un `data-panel-mode="list"` obsoleto; la validación ahora entra al `ListView` real y pasó con `npm run build` + `npx playwright test tests/playwright/list-view-regression.spec.ts`.
- `SelectableSortableItem.tsx` y `ListViewDragOverlay.tsx` absorbieron el skin base de `item-auto`, por lo que `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó esa regla duplicada y el row/overlay quedaron definidos por clases Tailwind locales.
- `DetailFormSection.tsx` absorbió el skin del `detail-view-form-shell` con utilidades inline y variantes arbitrarias sobre `fr-form`, `ant-form`, `ant-row`, `ant-col`, `ant-form-item`, inputs y cards; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó esos selectores de shell y de AntD asociados.
- `CommentsRail.tsx` absorbió el skin completo de hilos, respuestas, pills, badges y metadatos del rail de comentarios; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque `comments-rail-*` correspondiente.
- Validado ese slice con `npm run build`, `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron.
- Conteo de la hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` tras este slice: 1593 líneas y 341 apariciones de `@apply`.
- `LeftSidebarCustomFieldModal.tsx` absorbió el skin del modal de campos personalizados con `Modal.classNames` y utilidades inline para superficie, backdrop, header, body y botones; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque `custom-field-*` completo.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron de nuevo tras la limpieza del modal.
- Conteo actualizado de la hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css`: 1426 líneas y 294 apariciones de `@apply`.
- `CtlBar.tsx` absorbió la skin principal de la barra de control y del zoom con utilidades inline y `mergeClassNames`, incluyendo root, clusters, pills, botones y el selector de zoom con variantes internas; el CSS correspondiente se redujo dejando solo los contratos que todavía se están revisando.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron otra vez tras el cierre del control bar.
- Conteo actualizado de la hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css`: 1336 líneas y 272 apariciones de `@apply`.
- `SidebarSurfacePrimitives.tsx` absorbió el tamaño compacto de las `Tag` del header de superficies y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` perdió el selector `sidebar-surface-header-badges .ant-tag`, dejando el badge sizing como contrato del componente.
- `DetailHeaderCard.tsx` ya tenía el botón de volver completamente inline; se retiró el selector CSS `detail-header-back-btn` y el título `detail-view-title` por no tener consumidor en TSX.
- `DetailFormSection.tsx` ya cubría la tipografía/espaciado del shell de form-render; se retiraron los bloques duplicados de `ant-form-item`, `ant-form-item-label`, `ant-input`, `ant-input-number-input` y `ant-select-selection-item` que seguían vivos en CSS.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar.
- Conteo actualizado de la hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css`: 1239 líneas y 244 apariciones de `@apply`.
- `LeftSidebar.tsx` ya cubría la skin final de los botones del catálogo con transición y hover inline; se retiraron los selectores redundantes de `plugin-btn[data-catalog-layout]` y su override de `active`.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar.
- Conteo actualizado de la hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css`: 1195 líneas y 230 apariciones de `@apply`.
- `SchemaOptionsEditor.tsx` y los constructores DOM de `select/index.ts` + `optionGroupEditorFactory.ts` absorbieron el skin del editor de opciones y del desplegable: header, lista, filas, inputs, botones de borrar/agregar y el plus del botón quedaron en utilidades locales, y la hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó los selectores `sisad-option-editor-*` y `sisad-option-editor-select-*` asociados.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts`; ambos pasaron sin regresiones visibles en el panel derecho.
- `groupSchemaRender.ts` absorbió el layout base del `option-group` runtime (`inline-flex`, alineación y justificación) y permitió retirar el último bloque CSS del body; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` ya no depende de reglas para `sisad-pdfme-option-group-body`.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts`; ambos pasaron sin regresiones visibles.
- `actionSchemaFactory.ts` absorbió por completo el skin de `note` y `attachment` y `schemaDom.ts` absorbió el skin del botón de acción principal; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó los bloques de `note`, `attachment` y `sisad-pdfme-action-button`.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles.
- `fieldChrome.ts` absorbió el skin base del chrome de schemas, incluyendo superficie, borde, estados selected/multi-selected/readonly/locked/invalid y variantes por familia; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó todo el bloque `field-chrome` residual.
- `optionGroupFactory.ts` y `select/index.ts` absorbieron el skin runtime del grupo de opciones y del chevrón, incluyendo overflow, fondo, border, sizing del modo form y el padding compacto de `singleCompact`; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque `option-group-root` y `select-chevron` redundante.
- `optionGroupRenderer.ts` absorbió la altura mínima por modo, la opacidad de estado disabled y el borde de invalidación del wrapper de option groups; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó los selectores restantes de `option-group__option`, `option-group-invalid` y `option-group-label`.
- `Renderer.tsx` absorbió el skin base y los estados visuales locales de `.sisad-pdfme-ui-custom-selectable` (`active`, `editing`, `hover`, `readonly`, `hidden`, `selectable=false`) para que el wrapper del schema deje de depender de la capa base de CSS; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó la base del wrapper y sus selectores de estado equivalentes.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles.
- `Renderer.tsx` también trasladó el caption y el badge del schema a nodos reales inline, de modo que `src/sisad-pdfme/ui/styles/sisad-pdfme.css` pudo eliminar el bloque `::after` residual y dejar solo los overlays base que todavía sostienen contraste e interacción.
- `Renderer.tsx` absorbió también el tinte del estado oculto directamente en el wrapper, por lo que la hoja pudo perder el selector `data-schema-hidden` y seguir estable en la ruta `multi-document-routing`.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` además eliminó el bloque huérfano de `radioGroup` que ya no tenía pseudo-elementos vivos en el wrapper.
- `CtlBar.tsx` absorbió la skin móvil y el estado de interacción seleccionado del control bar con clases inline, y `Designer/index.tsx` pasó `interactionPhase` para que `src/sisad-pdfme/ui/styles/sisad-pdfme.css` pudiera borrar el ajuste móvil del control bar y su box-shadow de selección.
- `CanvasStateOverlay.tsx` absorbió la micro-tipografía del estado vacío del canvas en el propio nodo React; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó las reglas duplicadas de `canvas-empty-state-title` y `canvas-empty-state-hint`.
- `RightSidebar.tsx` absorbió la animación de apertura del rail y la transición del DetailView en el propio wrapper, permitiendo borrar los selectores `right-sidebar[data-sidebar-open="true"]` y `detail-view-host/custom-detailView` de la hoja.
- `RightSidebar.tsx` absorbió también la línea decorativa superior del rail derecho como nodo absoluto inline, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el pseudo-elemento `right-sidebar-content::before`.
- Validado ese slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles.
- Conteo actualizado de la hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css`: 785 líneas y 117 apariciones de `@apply`.
- `CanvasStateOverlay.tsx` absorbió el skin completo del card de estado vacío del canvas, incluyendo ancho máximo, padding, borde dashed, gradient, tipografía y sombra; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el selector `canvas-empty-state-card` que ya no tenía razón de vivir en CSS.
- `CanvasStateOverlay.tsx` ya mantenía la tipografía fina del título y del hint del estado vacío, así que la limpieza dejó ese overlay enteramente resuelto por Tailwind inline.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 602 líneas y 112 apariciones de `@apply` tras la última validación.
- Validado el slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar sin regresiones.
- `LeftSidebar.tsx` absorbió el skin base del colapso/expansión del rail izquierdo en el propio root y en los wrappers de frame/content, incluyendo ancho expandido, rail colapsado, overflow y visibilidad, de modo que `src/sisad-pdfme/ui/styles/sisad-pdfme.css` pudo eliminar los selectores `left-sidebar[data-sidebar-collapsed="true"]`, sus children y `left-sidebar[data-expanded="true"]`.
- El mismo slice dejó el comportamiento móvil preparado en JSX con utilidades inline para no depender del selector `data-expanded` cuando el rail entra en modo overlay.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 584 líneas y 109 apariciones de `@apply` tras la última validación.
- Validado el slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar sin regresiones.
- `LeftSidebar.tsx` también absorbió el fallback de `prefers-reduced-motion` para los botones del catálogo mediante variantes `motion-reduce`, y `RightSidebar.tsx` absorbió la misma cobertura para el host del detail view; la hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque `prefers-reduced-motion` que neutralizaba esos transforms.
- `scripts/css-selector-duplicates.mjs` se volvió a ejecutar y regeneró `reports/tailwind-migration/selector-duplicates-current.md` con el estado actualizado de los duplicados del CSS activo.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 576 líneas y 108 apariciones de `@apply` tras la última validación.
- Validado el slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar sin regresiones.
- `Item.tsx` dejó el delete del ListView anclado al hover del `li` completo para que no desaparezca al mover el puntero hacia el botón, `DetailSectionCard.tsx` y `SchemaConnectionsShared.tsx` aclararon los accordions del inspector con títulos más cercanos al fondo y `SchemaConnectionsShared.tsx` suavizó el bloque de conexiones para mantener el contraste del baseline.
- `DocumentsRail.tsx` quedó con la validación del rail derecho intacta y `src/sisad-pdfme/ui/styles/tokens.css` se redujo a 86 líneas tras podar tokens sin consumidores directos; el build siguió pasando y la ruta `/lab/multi-document-routing` mostró el panel derecho estable en las vistas `Campos`, `Detalle` y `Docs`.
- `DetailSectionCard.tsx` y `SchemaConnectionsShared.tsx` terminaron de unificar los headers de acordeón con la superficie blanca del panel, bajando el tinte gris que aún se percibía en los detalles del schema y en las secciones técnicas/conexiones; validado con `npm run build` y los smoke tests del rail derecho.
- `Canvas/SnapLines.tsx` absorbió el skin base de `snap-line` y `snap-label` para que la posición absoluta, pointer-events y la semántica de texto vivan en el componente y no en CSS; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó esos selectores redundantes.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 569 líneas y 106 apariciones de `@apply` tras la última validación.
- `scripts/css-selector-duplicates.mjs` se volvió a ejecutar y regeneró `reports/tailwind-migration/selector-duplicates-current.md` con el estado actualizado de los duplicados del CSS activo.
- Validado el slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar sin regresiones.
- `Shortcuts/ShortcutHelpPanel.tsx` absorbió el skin del modal de atajos mediante `Modal.classNames` para mover la superficie, el backdrop y el body al propio componente, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el override huérfano `.sisad-pdfme-shortcuts-panel .ant-modal-content`.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 563 líneas y 104 apariciones de `@apply` tras esta validación.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque huérfano `sisad-inspector-select-popup`, que no tenía consumidores en el código activo.
- `SchemaConnectionsWidget.tsx`, `SchemaCollaborationWidget.tsx` y `detailWidgetRegistry.tsx` absorbieron el skin inline del `Divider`, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el override global `.ant-divider-horizontal`.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 545 líneas y 101 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque global de `ant-btn` (`.ant-btn`, `.ant-btn-default`, `.ant-btn-text` y sus hover) porque los botones visibles ya tienen skin local en TSX, dejando solo el contrato de `ant-select-selector` para una revisión posterior.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 513 líneas y 91 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles tras retirar el override global de botones.
- `InspectorSelect.tsx`, `SchemaCollaborationWidget.tsx`, `SchemaConnectionsWidget.tsx` y `ListViewToolbar.tsx` absorbieron el skin base del `Select` en sus wrappers locales, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el override global `.ant-select-selector`.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 510 líneas y 90 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles tras retirar el override global de select.
- `SchemaDropSetupModal.tsx` absorbió también el skin base del `Select` del modal de configuración de campo para que ese flujo no dependa del override global eliminado.
- Validado ese ajuste con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` consolidó la base del shell (`workspace`, `canvas`, `designer-root`, `designer-background` y el centrado de `paper-root`) en bloques únicos, reduciendo duplicación sin tocar geometría ni scroll.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 494 líneas y 87 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` retiró residuos mecánicos del shell: `@media` vacíos y la segunda declaración de `font-family` en `.sisad-pdfme-root`, sin tocar geometría ni el skin visible.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 488 líneas y 87 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles.
- `RightSidebar.tsx` absorbió el skin base del rail derecho (posición, ancho, borde, fondo, sombra, transición y estados open/collapsed) en el propio nodo React, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque raíz equivalente; quedaron en CSS solo los ajustes responsivos y geométricos que aún dependen de media queries.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 474 líneas y 85 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles tras mover el skin del rail derecho.
- `LeftSidebar.tsx` absorbió el skin base del rail izquierdo (posición, ancho, borde, fondo, shrink y transición) en el nodo React, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque raíz equivalente; quedaron en CSS solo los ajustes de catálogo/dragging y las reglas responsivas que siguen siendo geométricas.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 466 líneas y 84 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar sin regresiones visibles tras mover el skin del rail izquierdo.
- `RightSidebar.tsx` absorbió la excepción de `prefers-reduced-motion` del rail derecho como variantes `motion-reduce` en el propio nodo React, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque media query equivalente.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 456 líneas y 82 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos volvieron a pasar sin regresiones visibles tras mover la excepción de motion-reduce.
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó los media queries compactos redundantes de `left-sidebar-compact` y `stage[data-left-sidebar-variant="compact"]`, dejando el clamp final como fuente única para el ancho compacto del shell.
- `scripts/css-selector-duplicates.mjs` se volvió a ejecutar y regeneró `reports/tailwind-migration/selector-duplicates-current.md` con el estado actualizado del CSS activo.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 387 líneas y 68 apariciones de `@apply` tras esta validación.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts`; ambos pasaron sin regresiones visibles.
- `index.tsx` ya resolvía el ancho compacto del rail derecho en TSX y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el último selector residual `stage[data-left-sidebar-variant="compact"][data-sidebar-open="true"] .sisad-pdfme-designer-canvas`, dejando el reporte de duplicados solo con contratos `KEEP_GEOMETRY`.
- `LeftSidebar.tsx` absorbió el skin de drag source y el hide-state del favorito en el propio botón del catálogo; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` retiró el selector residual del favorito drag. Se corrigió un `ReferenceError` transitorio en runtime al mover el estado de arrastre al render prop correcto.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 369 líneas y 63 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/e2e/left-sidebar-view-modes.spec.ts tests/playwright/right-sidebar-visual-polish.spec.ts`; ambos volvieron a pasar sin regresiones visibles.
- `CanvasOverlayManager.tsx` absorbió el skin base del contenedor de overlays del canvas y `Mask.tsx` absorbió la superficie de bloqueo; `src/sisad-pdfme/ui/styles/sisad-pdfme.css` retiró ambos selectores residuales.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 363 líneas y 61 apariciones de `@apply` tras este corte.
- Validado este slice con `npm run build` y `npx playwright test tests/playwright/canvas-interactions.spec.ts tests/playwright/right-sidebar-visual-polish.spec.ts`; ambos volvieron a pasar sin regresiones visibles.
- `GroupOptionFloatingAction.tsx` ya resolvía el skin del botón flotante con Tailwind inline y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque residual de visibilidad para `option-group-floating-action`, dejando la ocultación de drag/resize/rotate como responsabilidad del propio componente.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 357 líneas y 60 apariciones de `@apply` tras este corte.
- Pendiente de validar: build + Playwright smoke y regeneración del reporte de duplicados activo.
- `CanvasOverlayManager.tsx` ya resolvía el skin del contenedor de overlays y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el selector redundante `.sisad-pdfme-ui-canvas-overlay-manager`, dejando la posición/pointer-events del overlay como contrato local del componente.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 352 líneas y 59 apariciones de `@apply` tras este corte.
- Pendiente de validar: build + Playwright smoke y regeneración del reporte de duplicados activo.
- `Canvas.tsx` movió la ocultación de `Mask` a una clase inline basada en `interactionState.phase`, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` eliminó el bloque residual de visibilidad por fase para `Mask`.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 346 líneas y 58 apariciones de `@apply` tras este corte.
- Pendiente de validar: build + Playwright smoke y regeneración del reporte de duplicados activo.
- `CanvasStateOverlay.tsx` ya absorbía el skin del empty state y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` retiró el selector huérfano `.sisad-pdfme-designer-canvas-empty-state`, dejando el overlay como contrato puro del componente.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 341 líneas y 57 apariciones de `@apply` tras este corte.
- Pendiente de validar: build + Playwright smoke y regeneración del reporte de duplicados activo.
- `LeftSidebar.tsx` absorbió el skin del shell arrastrable y la ocultación del favorito durante drag en el propio JSX, y `src/sisad-pdfme/ui/styles/sisad-pdfme.css` retiró los selectores residuales del shell draggable, dejando esos contratos como skin local del componente.
- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` quedó en 335 líneas y 56 apariciones de `@apply` tras este corte.
- Pendiente de validar: build + Playwright smoke y regeneración del reporte de duplicados activo.
- Slice 2026-07-16u: se retiraron de `sisad-pdfme.css` los bloques legacy del shell `sisad-pdfme-page/header/grid/workspace/canvas`, que no tenían consumidores activos en el árbol React actual. Validado con `npm run build`, `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/right-sidebar-docs-tab.spec.ts` y el reporte de duplicados regenerado. CSS activo actual: 310 líneas y 47 apariciones de `@apply`.
- Slice 2026-07-16x: `Item.tsx` dejó el delete del ListView visible y detectable por Playwright sin depender de opacidad cero, `DocumentsRail.tsx` alineó el delete de documentos en la misma fila de la tarjeta y `DetailSectionCard.tsx` subió el contraste del título de acordeón para mantener la jerarquía del inspector. Validado con `npm run build`, `npx playwright test tests/playwright/right-sidebar-visual-polish.spec.ts`, `tests/playwright/right-sidebar-docs-tab.spec.ts` y `tests/playwright/list-view-regression.spec.ts`.

## Criterio de parada

Detenerse si la recuperación exige más de 5 archivos de producto o si aparece una regresión funcional fuera del shell/tokens; abrir tarjeta separada en ese caso.
