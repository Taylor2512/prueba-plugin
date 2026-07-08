# Plan maestro de migración CSS → Tailwind — SISAD PDFME

**Proyecto:** `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin`  

**Fecha:** 2026-07-08  

**Objetivo:** migrar progresivamente de CSS puro a Tailwind sin degradar la visualización ni romper comportamiento del diseñador PDF.

> Este documento está diseñado para ser usado por Codex/Claude como plan de implementación por fases. No es un prompt corto: es una guía operativa con inventario, reglas, riesgos, task-cards, validación y matriz por archivo.

## 1. Fuentes investigadas

Se analizó el paquete consolidado subido por el usuario, compuesto por código React/Vite, documentación `.ai`/docs y CSS/Tailwind. Los hallazgos principales son:

| Fuente | Contenido | Métrica relevante |
| --- | --- | --- |
| `codigo-frontend-sisad—pdmfe.md` | Código React/Vite consolidado | 481 archivos candidatos incluidos; tabla con rutas, líneas, estado y estructura. |
| `documentacion-sisad—pdmfeweb.md` | Documentación `.ai`, reglas, task-cards, reportes | 78 documentos incluidos; define presupuesto, límites, router y reglas del diseñador. |
| `styles-sisad—pdmfe.md` | CSS, Tailwind, bridge y candidatos | 18 archivos CSS/Tailwind incluidos; incluye `labRoutes`, `global`, `canvas-interactions`, `runtime`, `tokens`, bridge y candidatos. |
| `public/img-version` | Baseline visual externo al archivo | Debe inventariarse en repo real; contiene capturas de la versión previa a Tailwind. |

**Conclusión de investigación:** el proyecto ya no está en estado inicial de migración. Tailwind está instalado/configurado, `src/style.css` aparece neutralizado, existe `src/styles/tailwind.css`, existe `src/styles/sisad-tailwind-bridge.css`, hay candidatos generados y un reporte `line-by-line-style-audit.md`. La tarea correcta ahora es **consolidar, corregir regresiones y migrar por capas**, no reiniciar ni reemplazar todo.

## 2. Restricciones arquitectónicas obligatorias

La documentación del proyecto limita el alcance al diseñador: Designer, Canvas, Schemas, LeftSidebar, RightSidebar, DetailView, ListView, Toolbar contextual, Moveable, Selecto, CommandBus, Snapshot, CSS visual y compatibilidad Form/Viewer/Generator. No incluye negocio SISAD, Uanataca, StepOne/StepTwo ni firma backend.

| Regla | Implicación en migración Tailwind |
| --- | --- |
| PDF/canvas es protagonista | El lab host no debe encajonar el editor ni robar alto útil. |
| No tocar geometría por estética | `x/y/width/height/rotation/zoom/transform/paper scale` no se convierten a utilidades Tailwind. |
| Moveable/Selecto protegidos | No tocar `.moveable-*`, `.selecto-*`, guards, coordenadas ni hit-testing desde CSS host. |
| CSS scoped | Todo core visual debe vivir bajo `.sisad-pdfme-root` o clases del lab; no reset global `body/html`. |
| Snapshot estable | No perder `schemaUid`, `documentId`, `pageNumber`, owner/recipient metadata, group/options, selected values ni `__designer`. |
| Form/Viewer/PDF limpios | La migración del designer no debe imprimir chrome en PDF ni contaminar runtime. |
| Baseline visual | Las imágenes de `public/img-version` son fuente de verdad visual para restaurar intención previa. |
## 3. Estado actual detectado

### 3.1 Infraestructura Tailwind

| Archivo | Estado | Riesgo | Acción requerida |
| --- | --- | --- | --- |
| `tailwind.config.js` | Existe; `content` incluye index/src/tests; `preflight:false`; tokens `colors.sisad` mapeados. | Bajo si solo hay un config activo. | Validar que no exista `tailwind.config.cjs` activo o editar solo uno. |
| `postcss.config.js` y `postcss.config.mjs` | Ambos aparecen en inventario. | Medio: toolchain/IA puede editar el equivocado. | Confirmar cuál lee Vite y eliminar/neutralizar duplicado si no hace falta. |
| `src/styles/tailwind.css` | Entrada canónica con `@tailwind base/components/utilities`. | Bajo. | Mantener como única fuente. |
| `src/style.css` | Neutralizado; conserva comentario para `<link>` de `index.html`. | Bajo si no reintroduce `@tailwind`. | No volver a poner directivas Tailwind aquí. |
| `src/styles/sisad-tailwind-bridge.css` | Bridge top-level `@apply`, no `@layer components`. | Medio si se copia a `@layer` y Tailwind purga clases runtime. | Mantener top-level para selectores dinámicos/data-*. |

### 3.2 Contadores de candidatos CSS

El reporte de migración generó candidatos que sirven como mapa, no como reemplazo automático. La propia auditoría muestra muchas declaraciones manuales no convertibles:

| CSS origen | Bloques candidatos | Declaraciones manuales/unsupported | Interpretación |
| --- | --- | --- | --- |
| `src/sisad-pdfme/ui/styles/tokens.css` | 0 | 0 | No migrar a className; mantener como fuente de verdad. |
| `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css` | 772 | 1814 | Archivo masivo: migrar por secciones, alto riesgo. |
| `src/sisad-pdfme/ui/styles/canvas-interactions.css` | 176 | 508 | Overlays/transform/pointer-events: migrar solo skins. |
| `src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css` | 65 | 88 | Migrar skins runtime; conservar Ant/data attrs/PDF. |
| `src/features/pdfcomponent/labRoutes.css` | 203 | 435 | Migrar host visual; conservar canvas-first y drawer geometry. |

### 3.3 Riesgo principal

El error más probable no está en Tailwind como tecnología, sino en **duplicar la responsabilidad visual**: clases Tailwind directas sobre componentes que ya tenían CSS legacy activo y variables runtime. Por eso el plan evita un reemplazo masivo y exige matriz de equivalencia por selector/componente.

## 4. Principios de migración

| Tipo de regla | Destino correcto | Ejemplos |
| --- | --- | --- |
| Visual puro | Tailwind JSX o bridge | padding, gap, flex, border, bg, text, rounded, shadow, hover. |
| Clase estable compartida | `src/styles/sisad-tailwind-bridge.css` | sidebars, control bar, cards, badges, inspector section skin. |
| Geometría runtime | CSS legacy/tokens | paper, page, scale, transform, top/left runtime, zoom, x/y, rulers. |
| Overlays interactivos | Mixto: skin Tailwind, posición legacy | drag preview, context toolbar, drop placeholder, inline edit. |
| Ant Design | CSS legacy de compatibilidad | .ant-select-selector, .ant-btn, collapse, form item, inputs. |
| Variables/tokens | `tokens.css` + `tailwind.config.js` | color, spacing, radius, shadows, z-index, owner color. |
| CSS muerto/duplicado | Eliminar solo con evidencia | demo huérfano, doble PostCSS/Tailwind, selectores no usados. |
## 5. Baseline visual obligatorio

Antes de migrar otro bloque, Codex debe inventariar y usar las capturas de:

```bash
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/public/img-version
```

### 5.1 Comando de inventario

```bash
find public/img-version -maxdepth 2 -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.webp" \) | sort
```

### 5.2 Reporte requerido

Crear `reports/tailwind-migration/img-version-baseline-inventory.md` con:

| Imagen | Vista inferida | Componentes visibles | Reglas visuales a preservar |
| --- | --- | --- | --- |
| `<archivo>` | LEFT_SIDEBAR / RIGHT_SIDEBAR / CANVAS / etc. | Paleta, tabs, campos, panel, documento | Densidad, sombras, bordes, tamaños, spacing. |

### 5.3 Elementos de baseline a preservar

- LeftSidebar blanco flotante, bordes redondeados grandes, sombra suave, título `DISEÑADOR / CAMPOS`, tabs en cápsula, search pill, filtros pill, categorías uppercase y cards de campos con icono centrado.

- Canvas con grilla clara, PDF centrado, rulers oscuros y campos celeste suave con borde punteado azul.

- RightSidebar con tabs superiores en cápsula, documentos/comentarios/lista/detalle; rows compactas e inspector con secciones redondeadas.

- Toolbars flotantes compactas, no invasivas y sin tapar campos.

## 6. Plan general por fases

| Fase | Nombre | Qué hacer | Alcance | Salida |
| --- | --- | --- | --- | --- |
| Fase 0 | Freeze visual y respaldo | Capturar estado actual, inventariar `public/img-version`, crear rama/commit de seguridad. | Sin cambios de código. | Rollback listo. |
| Fase 1 | Infra Tailwind | Confirmar una sola entrada Tailwind, un solo config efectivo, bridge importado una vez, preflight false. | Config/entrypoints. | No hay doble emisión. |
| Fase 2 | Matriz CSS | Actualizar auditoría line-by-line con estado actual post-regresión. | CSS reales + candidatos. | Cada bloque tiene acción: MIGRATE_JSX, BRIDGE, KEEP, SPLIT, DELETE. |
| Fase 3 | Restaurar canvas-first | Corregir `PdfmeLabPage`, `PageHeader`, `ResultsPanel`, `labRoutes` sin tocar core. | Host/lab. | Canvas ocupa máximo espacio y baseline visual vuelve. |
| Fase 4 | Landing y lab host | Migrar landing/cards/filtros/controles a Tailwind JSX directo. | features/pdfcomponent. | Landing moderna sin afectar editor. |
| Fase 5 | Bridge base | Expandir bridge top-level para root/layout/sidebars/control bar/inspector skins. | sisad-tailwind-bridge.css. | ClassNames existentes conservados. |
| Fase 6 | LeftSidebar | Restaurar baseline y migrar visual seguro por componentes. | LeftSidebar*.tsx + CSS skin. | Drag/drop no se rompe. |
| Fase 7 | RightSidebar/ListView/DetailView | Compactar y migrar skin, no selección ni Ant internals. | RightSidebar/**. | Tabs, list rows e inspector consistentes. |
| Fase 8 | Canvas interactions skins | Migrar solo skin de toolbar/context menu/badges; conservar overlays geometry. | canvas-interactions + overlays. | Hit-testing, drag/drop, botón + intactos. |
| Fase 9 | Field chrome/runtime | Separar designer/form/viewer/pdf; migrar skins sin tocar metadata. | fieldChrome, renderSchemaWithChrome, schema uiRender. | PDF no imprime chrome. |
| Fase 10 | Reducción legacy | Eliminar duplicados con evidencia y comentarios KEEP/TODO. | CSS legacy. | Menos CSS sin regressions. |
| Fase 11 | Validación total | Build/typecheck/tests focales/screenshot diff/manual matrix. | Rutas principales. | Aprobación visual y funcional. |
## 7. Plan detallado por archivo CSS

| Archivo | Líneas | Estado | Acción | Plan específico |
| --- | --- | --- | --- | --- |
| src/styles/tailwind.css | 11 | completo | INFRA_CANONICAL | Mantener como única entrada Tailwind; no duplicar directivas. |
| src/style.css | 11 | completo | INFRA_NEUTRALIZE | Debe quedar neutralizado o sin @tailwind para evitar doble emisión. |
| src/styles/sisad-tailwind-bridge.css | 415 | completo | MIGRATE_BRIDGE | Bridge top-level @apply para clases existentes; no usar @layer si purga clases dinámicas. |
| reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css | 1600 | completo | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css | 1547 | completo | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css | 6417 | truncado 75.1 KB | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css | 443 | completo | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css | 8 | completo | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| src/features/pdfcomponent/labRoutes.css | 1550 | completo | SPLIT_LAB_CSS | Migrar visual seguro; conservar canvas-first, drawer fixed, media compleja y gradientes críticos. |
| src/sisad-pdfme/ui/styles/canvas-interactions.css | 1492 | completo | SPLIT_CANVAS_INTERACTIONS | Migrar skins de toolbar/menu; conservar overlays, transform, pointer-events, z-index tokens, botón +. |
| src/sisad-pdfme/ui/styles/sisad-pdfme-global.css | 6383 | truncado 75.6 KB | SPLIT_GLOBAL_CSS | Migrar por sección; conservar paper geometry, Ant, Moveable/Selecto, keyframes, field chrome crítico. |
| src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css | 240 | completo | SPLIT_RUNTIME_CSS | Migrar skins runtime; conservar import global, density attrs, Ant overrides y PDF/print. |
| src/sisad-pdfme/ui/styles/tokens.css | 374 | completo | KEEP_TOKEN_SOURCE | Fuente de verdad de tokens, variables runtime, z-index, paper y owner color; no convertir a clases estáticas. |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css | 1600 | completo | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css | 1547 | completo | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css | 6417 | truncado 75.1 KB | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css | 443 | completo | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css | 8 | completo | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |

### 7.1 `src/sisad-pdfme/ui/styles/tokens.css`

**Decisión:** no migrar a JSX. Este archivo es la fuente de verdad. Solo se amplía el mapa en `tailwind.config.js` cuando haga falta.

Mantener:
- `--color-*`, `--sisad-editor-*`, `--space-*`, `--radius-*`, `--shadow-*`.
- `--sisad-pdfme-rs-width`, `--sisad-pdfme-ls-width`, `--sisad-pdfme-chrome-z`, `--sisad-pdfme-chrome-height`.
- tokens de paper, schema tone, owner color, moveable y z-index.

Prohibido:
- convertir z-index/paper/owner color a clases estáticas.
- borrar dark tokens sin `rg` y task-card.

### 7.2 `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css`

**Decisión:** no migrar completo. Dividir por secciones. Este archivo contiene skins migrables y reglas críticas mezcladas.

Migrar a bridge/JSX:
- chips, badges, cards, panel surfaces, inspector section skins, list item skins, empty state typography.

Conservar legacy:
- scoped reset `.sisad-pdfme-root *`, scrollbars, Ant overrides, keyframes, field chrome mode-specific, option-group roots, paper/canvas geometry, Moveable/Selecto compatibility.

Procedimiento:
1. Localizar sección por comentario real.
2. Crear equivalencia en bridge o JSX.
3. Validar visual.
4. Reemplazar bloque por comentario `MIGRATED` o mantener con `KEEP`.
5. No mezclar migración de inspector con canvas en la misma task-card.

### 7.3 `src/sisad-pdfme/ui/styles/canvas-interactions.css`

**Decisión:** migrar solo piel visual. El motor de interacción debe quedarse en CSS legacy/tokens.

Migrable:
- fondo/borde/radius/shadow de `SelectionContextToolbar`, `CanvasContextMenu`, badges, buttons.

No migrable:
- `position: fixed/absolute` ligado a punteros, `transform: translate3d`, `scale`, `pointer-events`, `z-index`, keyframes, `data-interaction-phase`, `data-role=group-add-option`, ocultamientos durante drag/transform.

Validación obligatoria: drag/drop, selección simple/múltiple, botón `+`, página 2+, context menu, inline edit y snap feedback.

### 7.4 `src/features/pdfcomponent/labRoutes.css`

**Decisión:** migración host-first. Aquí sí se puede usar más Tailwind directo, pero conservar reglas canvas-first.

Migrable:
- landing, cards, filters, toolbar visual, compact controls, hero metrics, popover content.

Conservar:
- `height:100dvh`, `grid-template-rows`, `min-height:0`, drawer `fixed`, media queries complejas, gradientes si mantienen identidad visual, sr-only si ya funciona.

Riesgo: si JSX Tailwind y CSS legacy controlan el mismo `height/overflow/padding`, se rompe el canvas.

### 7.5 `src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css`

**Decisión:** conservar como punto de carga de global y migrar skins de runtime/inspector con cuidado.

Migrable:
- summary cards, chips, panel skins, typography.

Conservar:
- `@import './sisad-pdfme-global.css'`, density data attrs, Ant selectors, variable de chrome, reglas PDF/print.

### 7.6 Archivos candidatos y backups

Los candidatos `reports/tailwind-migration/candidates/*.tailwind.candidate.css` y `.tailwind-migration-backups/**` son **referencias**, no deben importarse en producción. Usarlos para ver qué reglas tienen `@apply` equivalente y qué quedó como manual. No copiarlos ciegamente.

## 8. Plan detallado por componentes React/lab

| Archivo | Líneas | Acción | Plan |
| --- | --- | --- | --- |
| src/features/pdfcomponent/CaseCard.jsx | 123 | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/CompactControls.jsx | 280 | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/LabExampleDownloadButton.jsx | 74 | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/LabLandingPage.jsx | 242 | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/PageHeader.jsx | 415 | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/PdfmeLabPage.jsx | 637 | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/PopoverMenu.jsx | 114 | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/ResultsPanel.jsx | 248 | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/domain/labPresentation.js | 192 | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/domain/labState.js | 18 | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/ui/primitives.jsx | 103 | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/labs/builders/exampleTemplate.ts | 199 | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core. |
| src/features/pdfcomponent/labs/builders/schemaFactory.ts | 91 | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core. |
| src/features/pdfcomponent/labs/builders/schemaShowcase.ts | 220 | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core. |
| src/features/pdfcomponent/labs/examples/labExamples.js | 885 | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core. |
| src/features/pdfcomponent/labs/export/buildExampleBundle.ts | 78 | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core. |
| src/features/pdfcomponent/labs/export/downloadExampleBundle.ts | 25 | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core. |

### 8.1 Orden de ejecución lab

1. `src/features/pdfcomponent/PdfmeLabPage.jsx`: restaurar canvas-first; quitar wrappers/card/padding que reduzcan el área útil. Mantener `commonOptions.collaboration`.

2. `src/features/pdfcomponent/PageHeader.jsx`: compactar topbar y mover acciones secundarias a menú. Quitar botón textual `Controles` como elemento externo grande.

3. `src/features/pdfcomponent/ResultsPanel.jsx`: cerrar como pill y abrir como drawer no invasivo, preferible bottom-left, `max-height:min(300px,38dvh)`.

4. `src/features/pdfcomponent/LabLandingPage.jsx` y `CaseCard.jsx`: Tailwind JSX directo, card `relative`, filtros, buscador, recomendado, acción secundaria en menú.

5. `src/features/pdfcomponent/labRoutes.css`: eliminar duplicados solo después de validar screenshot.

## 9. Plan detallado por core `sisad-pdfme/ui`

| Área | Archivos | Ejemplos | Plan |
| --- | --- | --- | --- |
| MIGRATE_LEFT_SIDEBAR_VISUAL | 7 | src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx, src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomFieldModal.tsx, src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomPanel.tsx, src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx, src/sisad-pdfme/ui/components/Designer/LeftSidebarSearch.tsx... | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop. |
| MIGRATE_RIGHT_SIDEBAR_VISUAL | 36 | src/sisad-pdfme/schemas/propPanel/commonInspectorFields.ts, src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx, src/sisad-pdfme/ui/components/Designer/RightSidebar/contextHeader.ts, src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx, src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx... | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| CONTROL_BAR_REVIEW | 2 | src/sisad-pdfme/ui/components/CtlBar.tsx, src/sisad-pdfme/ui/components/UnitPager.tsx | Compactar y migrar skin; mantener posicionamiento y densidad por tokens. |
| CANVAS_VISUAL_WITH_GUARDS | 6 | src/sisad-pdfme/ui/components/Paper.tsx, src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx, src/sisad-pdfme/ui/components/Designer/Canvas/Guides.tsx, src/sisad-pdfme/ui/components/Designer/Canvas/Mask.tsx, src/sisad-pdfme/ui/components/Designer/Canvas/Padding.tsx... | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens. |
| OVERLAY_SKIN_ONLY | 18 | src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx, src/sisad-pdfme/ui/components/Designer/Canvas/overlays/canvasContextMenuActions.tsx, src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasOverlayManager.tsx, src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasStateOverlay.tsx, src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CommentsOverlay.tsx... | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| RUNTIME_COMPAT_VALIDATE | 5 | src/sisad-pdfme/ui/Form.tsx, src/sisad-pdfme/ui/Viewer.tsx, src/sisad-pdfme/ui/components/Preview.tsx, src/sisad-pdfme/ui/components/Renderer.tsx, src/sisad-pdfme/ui/components/StaticSchema.tsx | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer. |
| UI_CORE_REVIEW | 56 | src/sisad-pdfme/ui/class.ts, src/sisad-pdfme/ui/collaboration.ts, src/sisad-pdfme/ui/collaborationContext.ts, src/sisad-pdfme/ui/constants.ts, src/sisad-pdfme/ui/contexts.ts... | Migrar visual solo por componentes, con bridge y validación. |

### 9.1 LeftSidebar

Restaurar baseline: panel flotante blanco, border-radius grande, sombra suave, `DISEÑADOR / CAMPOS`, tabs en cápsula, search pill, filtros pill, categorías uppercase y field cards con icono centrado. Migración recomendada: componentes TSX para estructura y bridge para clases existentes. No romper `useDraggable`, plugin metadata, `data-*`, owner color ni `canvasDropPipeline`.

### 9.2 RightSidebar/ListView/DetailView

Migrar skin y densidad, no lógica. Rows objetivo 44–52px; tabs 32–38px; inspector inputs 32–36px. Mantener Ant overrides donde apliquen. Evitar borders azules fuertes repetidos por row; usar accent fino para active y hover sutil.

### 9.3 Canvas y overlays

No continuar migrando `Canvas.tsx` si la clase Tailwind toca `overflow`, `position`, `height` o background que el CSS legacy ya controla. Revisar que `.sisad-pdfme-designer-canvas` conserve `overflow:auto` y `min-height:0`. Overlays solo migran skin; z-index/transform/position quedan en CSS/tokens.

### 9.4 Control bar

El control bar puede usar Tailwind para `inline-flex`, `rounded-full`, `border`, `bg-white/95`, `shadow-sm`, pero la ubicación y `--chrome-*` deben quedarse en legacy/tokens. Densidad máxima: `h-8` aproximado; evitar toolbars con padding grande.

## 10. Plan por familias de schemas y runtime

| Acción | Archivos | Interpretación |
| --- | --- | --- |
| SCHEMA_LOGIC_KEEP | 67 | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| SCHEMA_RENDER_VALIDATE | 18 | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| MIGRATE_RIGHT_SIDEBAR_VISUAL | 1 | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| FIELD_CHROME_TASK | 3 | Migrar visual compartido por modo; preservar x/y/size/ownerColor/readonly/required. |

### 10.1 Reglas por familia

| Familia | Archivos guía | Qué migrar | Qué no tocar |
| --- | --- | --- | --- |
| Text-like | `schemas/text`, `number`, `date`, `textLike` | skin input/readonly/invalid por modo | value adapters, pdfRender, formatter. |
| Option-based | `checkbox`, `checkboxGroup`, `radioGroup`, `select`, `schemas/options` | skin visual de markers y options | `options`, `groupId`, `optionId`, `selectedOptionIds`, botón + target policy. |
| Signing | `signature`, `initials`, `dateSigned` | placeholder/skin designer/form/viewer | provider registry, validation, signing data. |
| Actions | `approve`, `decline`, `attachment`, `note` | skin de botones, dashed border, note surface | business state/action semantics. |
| Media | `graphics/image`, `svg`, `barcodes` | placeholder/image/barcode container skin | quiet zone, render value, pdf render. |
| Table | `schemas/tables` | viewer/form skin, toolbar if designer | cell model, dynamic template, PDF render. |

### 10.2 Field chrome

`fieldChrome.ts` y `renderSchemaWithChrome.ts` ya aplican el patrón Template Method: limpiar root, estampar atributos/chrome y renderizar inner schema. La migración debe apoyarse en `data-render-mode`, `data-schema-family`, `data-schema-readonly`, `data-schema-required`, `--schema-tone` y owner color. No modificar `x/y/width/height/rotation` desde ahí.

## 11. Matriz de archivos críticos de alto riesgo

| Archivo | Líneas | Acción | Motivo |
| --- | --- | --- | --- |
| src/sisad-pdfme/ui/Form.tsx | 130 | RUNTIME_COMPAT_VALIDATE | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer. |
| src/sisad-pdfme/ui/Viewer.tsx | 54 | RUNTIME_COMPAT_VALIDATE | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer. |
| src/sisad-pdfme/schemas/propPanel/commonInspectorFields.ts | 341 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/schemas/shared/fieldChrome.ts | 275 | FIELD_CHROME_TASK | Migrar visual compartido por modo; preservar x/y/size/ownerColor/readonly/required. |
| src/sisad-pdfme/schemas/shared/renderSchemaWithChrome.ts | 80 | FIELD_CHROME_TASK | Migrar visual compartido por modo; preservar x/y/size/ownerColor/readonly/required. |
| src/sisad-pdfme/schemas/shared/schemaDom.ts | 116 | FIELD_CHROME_TASK | Migrar visual compartido por modo; preservar x/y/size/ownerColor/readonly/required. |
| src/sisad-pdfme/ui/components/CtlBar.tsx | 349 | CONTROL_BAR_REVIEW | Compactar y migrar skin; mantener posicionamiento y densidad por tokens. |
| src/sisad-pdfme/ui/components/Paper.tsx | 222 | CANVAS_VISUAL_WITH_GUARDS | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens. |
| src/sisad-pdfme/ui/components/Preview.tsx | 220 | RUNTIME_COMPAT_VALIDATE | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer. |
| src/sisad-pdfme/ui/components/Renderer.tsx | 311 | RUNTIME_COMPAT_VALIDATE | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer. |
| src/sisad-pdfme/ui/components/StaticSchema.tsx | 61 | RUNTIME_COMPAT_VALIDATE | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer. |
| src/sisad-pdfme/ui/components/UnitPager.tsx | 100 | CONTROL_BAR_REVIEW | Compactar y migrar skin; mantener posicionamiento y densidad por tokens. |
| src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx | 1530 | MIGRATE_LEFT_SIDEBAR_VISUAL | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop. |
| src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomFieldModal.tsx | 365 | MIGRATE_LEFT_SIDEBAR_VISUAL | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop. |
| src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomPanel.tsx | 111 | MIGRATE_LEFT_SIDEBAR_VISUAL | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop. |
| src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx | 98 | MIGRATE_LEFT_SIDEBAR_VISUAL | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop. |
| src/sisad-pdfme/ui/components/Designer/LeftSidebarSearch.tsx | 36 | MIGRATE_LEFT_SIDEBAR_VISUAL | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop. |
| src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx | 57 | MIGRATE_LEFT_SIDEBAR_VISUAL | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop. |
| src/sisad-pdfme/ui/components/Designer/useLeftSidebarCatalogState.ts | 155 | MIGRATE_LEFT_SIDEBAR_VISUAL | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop. |
| src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx | 1589 | CANVAS_VISUAL_WITH_GUARDS | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens. |
| src/sisad-pdfme/ui/components/Designer/Canvas/Guides.tsx | 100 | CANVAS_VISUAL_WITH_GUARDS | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens. |
| src/sisad-pdfme/ui/components/Designer/Canvas/Mask.tsx | 33 | CANVAS_VISUAL_WITH_GUARDS | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens. |
| src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx | 127 | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests. |
| src/sisad-pdfme/ui/components/Designer/Canvas/Padding.tsx | 82 | CANVAS_VISUAL_WITH_GUARDS | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens. |
| src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx | 110 | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests. |
| src/sisad-pdfme/ui/components/Designer/Canvas/SnapLines.tsx | 349 | CANVAS_VISUAL_WITH_GUARDS | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx | 250 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/contextHeader.ts | 19 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx | 250 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx | 66 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx | 432 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/shared/canvasDropPipeline.ts | 112 | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests. |
| src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts | 145 | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests. |
| src/sisad-pdfme/ui/components/Designer/shared/schemaCollision.ts | 101 | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests. |
| src/sisad-pdfme/ui/components/Designer/shared/selectableTargetGuards.ts | 34 | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests. |
| src/sisad-pdfme/ui/components/Designer/shared/transformTargetGuards.ts | 29 | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx | 242 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/canvasContextMenuActions.tsx | 921 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasOverlayManager.tsx | 141 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasStateOverlay.tsx | 158 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CommentsOverlay.tsx | 271 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/floatingSurfaceGeometry.ts | 97 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/GroupOptionFloatingAction.tsx | 103 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay.tsx | 204 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineMetricsOverlay.tsx | 23 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/overlayState.ts | 40 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/pointerGeometry.ts | 133 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDragPreview.tsx | 41 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash.tsx | 49 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropPlaceholder.tsx | 57 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx | 217 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/smartPlacement.ts | 196 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SnapFeedbackOverlay.tsx | 42 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/useFloatingToolbarPosition.ts | 69 | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx | 67 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/ButtonGroupWidget.tsx | 83 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/CompactConfigPanel.tsx | 99 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailFormSection.tsx | 55 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx | 136 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailHeaderUtils.ts | 85 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts | 430 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx | 177 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts | 405 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView.tsx | 417 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx | 63 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx | 141 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx | 108 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorContracts.ts | 366 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorPrimitives.tsx | 217 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaCollaborationUtils.ts | 18 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx | 485 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsShared.tsx | 146 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaConnectionsValidation.ts | 83 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsWidget.tsx | 825 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaFieldCommentsWidget.tsx | 314 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/WidgetRenderer.tsx | 32 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx | 341 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListView.tsx | 345 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewDragOverlay.tsx | 58 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewFooter.tsx | 56 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx | 238 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableContainer.tsx | 217 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableItem.tsx | 119 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarSurfacePrimitives.tsx | 112 | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
## 12. Estrategia de reducción de CSS legacy

La reducción de CSS debe ser medible y reversible. Cada bloque legacy debe terminar en uno de estos estados:

| Estado | Comentario requerido | Ejemplo |
| --- | --- | --- |
| Migrado | `/* MIGRATED: covered by src/styles/sisad-tailwind-bridge.css */` | skin de card/sidebar ya movido al bridge. |
| Conservado por geometría | `/* KEEP: paper geometry and page stacking. Do not migrate. */` | paper scale, page root, canvas page. |
| Conservado por interacción | `/* KEEP: Moveable/Selecto/hit-testing compatibility. */` | selecto/moveable, target guards, pointer-events. |
| Conservado por Ant | `/* KEEP: Ant Design compatibility override. */` | .ant-select-selector, .ant-btn, collapse. |
| Pendiente | `/* TODO(TAILWIND): migrate in TC-CSS-XX after visual regression coverage. */` | section card animations. |
| Eliminado | Commit message + reporte con `rg` | selector no usado y sin generación runtime. |

Criterios para eliminar:
1. `rg` confirma que el selector no se usa.
2. No es generado por librería, runtime ni `data-*`.
3. No aparece en tests ni visual baseline.
4. Hay equivalente Tailwind/bridge validado.
5. Screenshot antes/después aprobado.

## 13. Task-cards propuestas para Codex

| Task-card | Nombre | Objetivo | Archivos | Restricción |
| --- | --- | --- | --- | --- |
| TC-CSS-00 | Baseline visual e infraestructura | Inventariar `public/img-version`, capturas actuales, confirmar única entrada Tailwind, config/postcss. | style.css, tailwind.css, tailwind.config, postcss, main.jsx | No editar core UI. |
| TC-CSS-01 | Restaurar canvas-first lab shell | Corregir PageHeader/PdfmeLabPage/ResultsPanel/labRoutes para no encajonar canvas. | features/pdfcomponent | No tocar src/sisad-pdfme excepto si falla import. |
| TC-CSS-02 | Landing y CaseCard Tailwind | Migrar landing/cards/filtros a Tailwind JSX directo. | LabLandingPage, CaseCard, primitives | No tocar editor. |
| TC-CSS-03 | Bridge root/layout/control bar | Expandir bridge con tokens `sisad` y clases existentes sin `@layer`. | sisad-tailwind-bridge.css | No tocar geometry. |
| TC-CSS-04 | LeftSidebar baseline | Migrar visual search/tabs/filters/cards manteniendo drag/drop. | LeftSidebar*.tsx, global/bridge | No canvasDropPipeline. |
| TC-CSS-05 | RightSidebar ListView baseline | Compactar tabs, toolbar, rows, badges. | RightSidebar/ListView/** | No romper selección/rename/filter. |
| TC-CSS-06 | RightSidebar DetailView baseline | Migrar section cards/inputs/widgets visual con Ant compat. | DetailView/**, runtime/global | No romper inspector command update. |
| TC-CSS-07 | Canvas toolbar/context menu skins | Migrar skins, conservar z-index/transform/position. | canvas-interactions, overlays | Validar hit-testing y botón +. |
| TC-CSS-08 | Field chrome por modo | Separar designer/form/viewer/pdf visual. | fieldChrome, renderSchemaWithChrome, global/runtime | No tocar geometry/metadata. |
| TC-CSS-09 | Schema family visual parity | Validar text/option/action/media/table/signing visual y runtime. | schemas/**/uiRender/index | No tocar pdfRender salvo bug. |
| TC-CSS-10 | Limpieza legacy | Eliminar duplicados y demo huérfano con evidencia. | CSS legacy/reportes | Solo tras validación visual. |
## 14. Validación requerida

### 14.1 Comandos

```bash
npm run build
npm run typecheck  # si existe
npm run lint       # si existe y no bloquea por reglas externas
```

Tests focalizados sugeridos:
```bash
npx vitest run tests/unit/features/pdfcomponent
npx vitest run tests/unit/sisad-pdfme/ui
npx vitest run tests/unit/sisad-pdfme/schemas
npx playwright test tests/playwright/multi-document-routing-design.spec.ts --project=chromium
npx playwright test tests/playwright/form-viewer-generator-parity.spec.ts --project=chromium
```

### 14.2 Checklist manual

| Ruta | Validaciones mínimas |
| --- | --- |
| / | Landing usa baseline/estética correcta; filtros y búsqueda funcionan; cards abren rutas y descarga plantilla. |
| /lab/multi-document-routing | Header compacto; canvas máximo; LeftSidebar/RightSidebar baseline; drag/drop; selección; move/resize/rotate; página 2+; multi-recipient; Results no tapa toolbar. |
| /lab/generator-runtime | Form limpio; Viewer limpio; generator no rompe; PDF final sin chrome/fondos. |
### 14.3 Screenshot regression

Guardar capturas actuales en `reports/tailwind-migration/current-screenshots` y comparar contra `public/img-version`. No se exige pixel-perfect, sí densidad, jerarquía, tamaño de paneles, espacio de canvas y chrome de campos.

## 15. Criterios de aceptación

- No hay doble emisión Tailwind.

- No hay `preflight` activo.

- El editor conserva o recupera la estética de `public/img-version`.

- El canvas vuelve a ser protagonista y no queda encerrado en una card del host.

- LeftSidebar y RightSidebar mantienen baseline visual y densidad.

- No se tocó Moveable/Selecto/coordinate service/schema collision/snapshot por diseño.

- No hay nuevas reglas globales fuera de `.sisad-pdfme-root` o clases del lab.

- No hay nuevos `as any`.

- Form/Viewer/Generator conservan comportamiento y PDF final no imprime chrome.

- Todo CSS eliminado tiene evidencia `rg` + screenshot + validación.

## 16. Prompt operativo para Codex

```txt
Actúa como arquitecto frontend senior experto en React, Vite, Tailwind, CSS cascade y editores PDF/canvas. Ejecuta la task-card TC-CSS-00 primero. Usa /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/public/img-version como baseline visual obligatorio. No rediseñes desde cero: restaura intención visual previa y corrige regresiones de Tailwind.

Reglas: preflight false, no tocar Moveable/Selecto, no migrar geometry/paper/transform/zoom/x/y/width/height/rotation a Tailwind, no borrar tokens.css, no crear runtime paralelo, no tocar generator/pdf-lib/snapshot. Mantén bridge top-level @apply, no @layer components para clases runtime.

Flujo: inventario visual -> capturas actuales -> infraestructura Tailwind -> canvas-first lab shell -> bridge -> sidebars -> overlays skins -> field chrome -> cleanup legacy. Cada bloque CSS debe clasificarse como MIGRATE_JSX, MIGRATE_BRIDGE, KEEP_LEGACY, TOKENIZE, DELETE_DUPLICATE, SPLIT_RULE o NEEDS_TASK_CARD. Implementa cambios reales por task-card y entrega reporte con validación.
```

## Apéndice A — Inventario completo de archivos de código y decisión de migración

> Esta tabla cubre todos los archivos incluidos en `codigo-frontend-sisad—pdmfe.md`. La decisión no significa que todos deban editarse; marca el rol del archivo durante la migración CSS/Tailwind.


| Archivo | Líneas | Estado | Decisión | Nota |
| --- | --- | --- | --- | --- |
| package.json | 98 | completo | INFRA_VALIDATE | Verificar scripts, dependencias Tailwind, no ejecutar migración destructiva. |
| vite.config.js | 24 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| tailwind.config.js | 80 | completo | INFRA_VALIDATE | Dejar una sola configuración activa; preflight false; tokens sisad mapeados. |
| postcss.config.js | 6 | completo | INFRA_DEDUP | Dejar un solo PostCSS config si el toolchain no requiere ambos. |
| postcss.config.mjs | 6 | completo | INFRA_DEDUP | Dejar un solo PostCSS config si el toolchain no requiere ambos. |
| eslint.config.cjs | 126 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| tsconfig.json | 65 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/main.jsx | 13 | completo | INFRA_ENTRY | Importar tailwind.css y bridge una sola vez; evitar imports duplicados. |
| src/App.jsx | 25 | completo | ROUTING_ONLY | No tocar diseño core; solo rutas de laboratorio. |
| src/features/pdfcomponent/CaseCard.jsx | 123 | completo | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/CompactControls.jsx | 280 | completo | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/LabExampleDownloadButton.jsx | 74 | completo | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/LabLandingPage.jsx | 242 | completo | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/PageHeader.jsx | 415 | completo | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/PdfmeLabPage.jsx | 637 | completo | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/PopoverMenu.jsx | 114 | completo | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/ResultsPanel.jsx | 248 | completo | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/domain/labPresentation.js | 192 | completo | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/domain/labState.js | 18 | completo | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/ui/primitives.jsx | 103 | completo | MIGRATE_LAB_JSX | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| src/features/pdfcomponent/labs/builders/exampleTemplate.ts | 199 | completo | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core. |
| src/features/pdfcomponent/labs/builders/schemaFactory.ts | 91 | completo | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core. |
| src/features/pdfcomponent/labs/builders/schemaShowcase.ts | 220 | completo | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core. |
| src/features/pdfcomponent/labs/examples/labExamples.js | 885 | completo | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core. |
| src/features/pdfcomponent/labs/export/buildExampleBundle.ts | 78 | completo | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core. |
| src/features/pdfcomponent/labs/export/downloadExampleBundle.ts | 25 | completo | KEEP_LAB_DATA_LOGIC | No migrar estilos; mantener fixtures/builders/export fuera del core. |
| .eslintrc.cjs | 49 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| playwright.config.ts | 27 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| test-script.js | 5 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| vite.config copy.js | 487 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| vitest.config.ts | 22 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| scripts/delete-existing-markdown.mjs | 54 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| scripts/migrate-design-to-tailwind.mjs | 864 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/types/custom.d.ts | 23 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/assignments/index.ts | 612 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/browser/downloads.ts | 44 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/browser/objectUrls.ts | 32 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/canvas/canvasRenderState.ts | 146 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/canvas/overlayManager.ts | 249 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/canvas/useCanvasRenderState.ts | 171 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/collaboration/appearance.ts | 55 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/collaboration/index.ts | 459 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/collaboration/lockManager.ts | 253 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/collaboration/recipientPalette.ts | 69 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/collaboration/schemaLockGuard.ts | 96 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/collaboration/schemaOwnershipAppearance.ts | 157 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/commands/index.ts | 52 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/comments/index.ts | 199 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/common/collaboration.ts | 364 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/common/comments.ts | 280 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/common/constants.ts | 31 | omitido minificado | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/common/dynamicTemplate.ts | 319 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/common/expression.ts | 460 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/common/helper.ts | 284 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/common/index.ts | 121 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/common/pluginRegistry.ts | 63 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/common/schema.ts | 300 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/common/types.ts | 250 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/common/version.ts | 1 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/context/RecipientContext.ts | 111 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/contracts/assignments.ts | 3 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/contracts/commands.ts | 33 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/contracts/comments.ts | 46 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/contracts/index.ts | 71 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/contracts/plugins.ts | 48 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/contracts/schema.ts | 32 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/converter/img2pdf.ts | 113 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/converter/index.browser.ts | 56 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/converter/index.node.ts | 35 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/converter/index.ts | 7 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/converter/modules.d.ts | 9 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/converter/pdf2img.ts | 64 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/converter/pdf2size.ts | 33 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/converter/types.d.ts | 1 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/devtools/index.ts | 68 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/documents/index.ts | 188 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/editor/index.ts | 24 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/externalForms/externalFormRunner.ts | 173 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/generator/constants.ts | 1 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/generator/generate.ts | 167 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/generator/helper.ts | 171 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/generator/index.ts | 27 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/generator/preflight.ts | 447 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/generator/types.ts | 5 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/integration/index.ts | 102 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/integration/schemaController.ts | 73 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/pdf-lib/index.ts | 4 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/runtime/options.ts | 74 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/runtime/runtimeModes.ts | 59 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/runtime/usePdfmeArtifacts.ts | 213 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/runtime/usePdfmeRuntimeInstance.ts | 227 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/schemas/constants.ts | 2 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/groupSchemaRender.ts | 288 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/index.ts | 407 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/schemas/modules.d.ts | 32 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/schemaBuilder.ts | 167 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/schemaFamilies.ts | 364 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/utils.ts | 294 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/shared/commandTypes.ts | 129 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/shared/index.ts | 121 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/shared/interactionGuards.ts | 167 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/shared/keyboardShortcuts.ts | 339 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/shared/localFormStorage.ts | 243 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/shared/localMode.ts | 187 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/shared/localSnapshotStore.ts | 198 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/shared/schemaDesignerMeta.ts | 318 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/shared/schemaMigration.ts | 124 | completo | PROTECT_SNAPSHOT | No tocar por CSS; preservar metadata y roundtrip. |
| src/sisad-pdfme/shared/signatureRegistry.ts | 166 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/shared/snapshot.ts | 182 | completo | PROTECT_SNAPSHOT | No tocar por CSS; preservar metadata y roundtrip. |
| src/sisad-pdfme/shared/snapshotAdapter.ts | 378 | completo | PROTECT_SNAPSHOT | No tocar por CSS; preservar metadata y roundtrip. |
| src/sisad-pdfme/shared/templateValidator.ts | 323 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/templates/createDefaultTemplate.ts | 37 | completo | NO_SCOPE_REVIEW | Revisar solo si aparece en dependencias de CSS visual. |
| src/sisad-pdfme/ui/class.ts | 299 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/collaboration.ts | 1497 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/collaborationContext.ts | 256 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/constants.ts | 21 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/contexts.ts | 14 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/Designer.tsx | 348 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/designerEngine.ts | 1433 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/Form.tsx | 130 | completo | RUNTIME_COMPAT_VALIDATE | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer. |
| src/sisad-pdfme/ui/helper.ts | 601 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/hooks.ts | 495 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/i18n.ts | 903 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/index.ts | 25 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/theme.ts | 63 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/types.ts | 147 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/Viewer.tsx | 54 | completo | RUNTIME_COMPAT_VALIDATE | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer. |
| src/sisad-pdfme/pdf-lib/api/colors.ts | 109 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/Embeddable.ts | 7 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/errors.ts | 118 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/index.ts | 20 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/objects.ts | 10 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/operations.ts | 873 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/operators.ts | 335 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/PDFDocument.ts | 1389 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/PDFDocumentOptions.ts | 45 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/PDFEmbeddedFile.ts | 87 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/PDFEmbeddedPage.ts | 100 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/PDFFont.ts | 149 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/PDFImage.ts | 143 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/PDFJavaScript.ts | 75 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/PDFPage.ts | 1604 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/PDFPageOptions.ts | 175 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/rotations.ts | 84 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/sizes.ts | 52 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/StandardFonts.ts | 16 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/svg.ts | 891 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/svgPath.ts | 460 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/crypto.ts | 1845 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/errors.ts | 219 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/index.ts | 63 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/PDFContext.ts | 274 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/PDFObjectCopier.ts | 142 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/types/fontkit.ts | 643 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/types/index.ts | 30 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/types/matrix.ts | 22 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/arrays.ts | 157 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/async.ts | 8 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/base64.ts | 98 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/Cache.ts | 28 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/errors.ts | 3 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/index.ts | 11 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/intersections.ts | 237 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/maths.ts | 96 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/numbers.ts | 55 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/objects.ts | 13 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/pdfDocEncoding.ts | 69 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/png.ts | 70 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/rng.ts | 21 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/strings.ts | 191 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/unicode.ts | 373 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/validators.ts | 200 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/schemas/actions/actionSchemaFactory.ts | 93 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/actions/approve.ts | 156 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/actions/attachment.ts | 211 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/actions/decline.ts | 145 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/actions/note.ts | 121 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/barcodes/constants.ts | 20 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/barcodes/helper.ts | 187 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/barcodes/index.ts | 23 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/schemas/barcodes/pdfRender.ts | 37 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/barcodes/propPanel.ts | 258 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/barcodes/types.ts | 12 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/barcodes/uiRender.ts | 97 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/schemas/checkbox/index.ts | 159 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/schemas/checkboxGroup/index.ts | 445 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/schemas/date/date.ts | 16 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/date/dateTime.ts | 16 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/date/helper.ts | 523 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/date/time.ts | 16 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/date/types.ts | 21 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/graphics/image.ts | 209 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/graphics/imagehelper.ts | 156 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/graphics/svg.ts | 123 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/multiVariableText/helper.ts | 89 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/multiVariableText/index.ts | 23 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/schemas/multiVariableText/pdfRender.ts | 21 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/multiVariableText/propPanel.ts | 166 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/multiVariableText/types.ts | 6 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/multiVariableText/uiRender.ts | 170 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/schemas/number/index.ts | 86 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/schemas/options/index.ts | 8 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/schemas/options/optionGroupEditorFactory.ts | 121 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/options/optionGroupFactory.ts | 432 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/options/optionGroupLayout.ts | 76 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/options/optionGroupPdfRender.ts | 59 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/options/optionGroupRenderer.ts | 218 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/options/OptionListWidget.tsx | 14 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/options/optionModel.ts | 76 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/options/optionPropPanel.tsx | 33 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/options/optionSelectionBehavior.ts | 124 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/options/optionTypes.ts | 19 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/options/optionValueAdapter.ts | 15 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/propPanel/commonInspectorFields.ts | 341 | completo | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/schemas/propPanel/index.ts | 1 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/schemas/radioGroup/index.ts | 392 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/schemas/select/index.ts | 278 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/schemas/shapes/line.ts | 100 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/shapes/rectAndEllipse.ts | 161 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/shared/fieldChrome.ts | 275 | completo | FIELD_CHROME_TASK | Migrar visual compartido por modo; preservar x/y/size/ownerColor/readonly/required. |
| src/sisad-pdfme/schemas/shared/renderSchemaWithChrome.ts | 80 | completo | FIELD_CHROME_TASK | Migrar visual compartido por modo; preservar x/y/size/ownerColor/readonly/required. |
| src/sisad-pdfme/schemas/shared/schemaDom.ts | 116 | completo | FIELD_CHROME_TASK | Migrar visual compartido por modo; preservar x/y/size/ownerColor/readonly/required. |
| src/sisad-pdfme/schemas/shared/schemaGuards.ts | 167 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/shared/schemaTypes.ts | 171 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/signature/dateSigned.ts | 136 | omitido generado | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/signature/index.ts | 312 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/schemas/signature/initials.ts | 44 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/signature/propPanel.ts | 697 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/signature/providerRegistry.ts | 217 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/signature/signingSchemaFactory.ts | 119 | omitido generado | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/signature/types.ts | 325 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/signature/validation.ts | 70 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/tables/cell.ts | 152 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/tables/classes.ts | 402 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/tables/dynamicTemplate.ts | 88 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/tables/helper.ts | 216 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/tables/index.ts | 22 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/schemas/tables/pdfRender.ts | 144 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/tables/propPanel.ts | 122 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/tables/tableHelper.ts | 278 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/tables/types.ts | 87 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/tables/uiRender.ts | 437 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/schemas/text/constants.ts | 104 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/text/extraFormatter.ts | 83 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/text/helper.ts | 550 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/text/index.ts | 23 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/schemas/text/pdfRender.ts | 240 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/text/propPanel.ts | 210 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/text/types.ts | 30 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/text/uiRender.ts | 314 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/schemas/textLike/textLikePresets.ts | 44 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/textLike/textLikeSchemaFactory.ts | 82 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/schemas/values/schemaValueAdapter.ts | 49 | completo | SCHEMA_LOGIC_KEEP | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| src/sisad-pdfme/ui/collaboration/schemaRuntimeAccess.ts | 153 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/commands/commandBus.ts | 163 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/commands/designerCommands.ts | 123 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/AppContextProvider.tsx | 86 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/CtlBar.tsx | 349 | completo | CONTROL_BAR_REVIEW | Compactar y migrar skin; mantener posicionamiento y densidad por tokens. |
| src/sisad-pdfme/ui/components/ErrorScreen.tsx | 26 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Paper.tsx | 222 | completo | CANVAS_VISUAL_WITH_GUARDS | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens. |
| src/sisad-pdfme/ui/components/Preview.tsx | 220 | completo | RUNTIME_COMPAT_VALIDATE | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer. |
| src/sisad-pdfme/ui/components/Renderer.tsx | 311 | completo | RUNTIME_COMPAT_VALIDATE | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer. |
| src/sisad-pdfme/ui/components/Root.tsx | 45 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Spinner.tsx | 22 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/StaticSchema.tsx | 61 | completo | RUNTIME_COMPAT_VALIDATE | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer. |
| src/sisad-pdfme/ui/components/UnitPager.tsx | 100 | completo | CONTROL_BAR_REVIEW | Compactar y migrar skin; mantener posicionamiento y densidad por tokens. |
| src/sisad-pdfme/ui/components/usePreviewRuntime.ts | 602 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/types/customSchemaRegistry.ts | 24 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/utils/cn.ts | 3 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/pdf-lib/api/form/appearances.ts | 655 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/form/index.ts | 10 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/form/PDFButton.ts | 242 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/form/PDFCheckBox.ts | 247 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/form/PDFDropdown.ts | 637 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/form/PDFField.ts | 491 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/form/PDFForm.ts | 842 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/form/PDFOptionList.ts | 555 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/form/PDFRadioGroup.ts | 455 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/form/PDFSignature.ts | 44 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/form/PDFTextField.ts | 811 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/text/alignment.ts | 5 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/text/index.ts | 2 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/api/text/layout.ts | 328 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/acroform/flags.ts | 162 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/acroform/index.ts | 15 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroButton.ts | 104 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroCheckBox.ts | 48 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroChoice.ts | 143 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroComboBox.ts | 21 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroField.ts | 167 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroForm.ts | 96 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroListBox.ts | 19 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroNonTerminal.ts | 33 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroPushButton.ts | 21 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroRadioButton.ts | 57 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroSignature.ts | 9 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroTerminal.ts | 70 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroText.ts | 76 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/acroform/utils.ts | 129 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/annotation/AppearanceCharacteristics.ts | 133 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/annotation/BorderStyle.ts | 31 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/annotation/flags.ts | 90 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/annotation/index.ts | 4 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/annotation/PDFAnnotation.ts | 148 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/annotation/PDFWidgetAnnotation.ts | 111 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/document/PDFCrossRefSection.ts | 161 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/document/PDFHeader.ts | 48 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/document/PDFTrailer.ts | 48 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/document/PDFTrailerDict.ts | 39 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/embedders/CMap.ts | 65 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/embedders/CustomFontEmbedder.ts | 237 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/embedders/CustomFontSubsetEmbedder.ts | 89 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/embedders/FileEmbedder.ts | 77 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/embedders/FontFlags.ts | 45 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/embedders/JavaScriptEmbedder.ts | 34 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/embedders/JpegEmbedder.ts | 118 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/embedders/PDFPageEmbedder.ts | 139 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/embedders/PngEmbedder.ts | 69 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/embedders/StandardFontEmbedder.ts | 121 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/interactive/ViewerPreferences.ts | 565 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/objects/PDFArray.ts | 179 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/objects/PDFBool.ts | 53 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/objects/PDFDict.ts | 220 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/objects/PDFHexString.ts | 94 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/objects/PDFInvalidObject.ts | 34 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/objects/PDFName.ts | 152 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/objects/PDFNull.ts | 30 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/objects/PDFNumber.ts | 44 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/objects/PDFObject.ts | 22 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/objects/PDFRawStream.ts | 41 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/objects/PDFRef.ts | 51 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/objects/PDFStream.ts | 87 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/objects/PDFString.ts | 118 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/operators/PDFOperator.ts | 72 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/operators/PDFOperatorNames.ts | 92 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/parser/BaseParser.ts | 119 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/parser/ByteStream.ts | 76 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/parser/PDFObjectParser.ts | 302 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/parser/PDFObjectStreamParser.ts | 65 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/parser/PDFParser.ts | 363 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/parser/PDFXRefStreamParser.ts | 129 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/streams/Ascii85Stream.ts | 97 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/streams/AsciiHexStream.ts | 77 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/streams/decode.ts | 70 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/streams/DecodeStream.ts | 170 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/streams/DecryptStream.ts | 49 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/streams/FlateStream.ts | 397 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/streams/LZWStream.ts | 157 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/streams/RunLengthStream.ts | 55 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/streams/Stream.ts | 126 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/structures/PDFCatalog.ts | 81 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/structures/PDFContentStream.ts | 58 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/structures/PDFCrossRefStream.ts | 238 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/structures/PDFFlateStream.ts | 40 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/structures/PDFObjectStream.ts | 91 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/structures/PDFPageLeaf.ts | 244 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/structures/PDFPageTree.ts | 192 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/syntax/CharCodes.ts | 62 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/syntax/Delimiters.ts | 14 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/syntax/Irregular.ts | 10 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/syntax/Keywords.ts | 57 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/syntax/Numeric.ts | 26 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/syntax/Whitespace.ts | 10 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/writers/PDFStreamWriter.ts | 114 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/core/writers/PDFWriter.ts | 146 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/elements/Arc.ts | 97 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/elements/Circle.ts | 47 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/elements/Ellipse.ts | 117 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/elements/GraphElement.ts | 14 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/elements/index.ts | 9 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/elements/Line.ts | 83 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/elements/Plot.ts | 50 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/elements/Point.ts | 37 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/elements/Rectangle.ts | 65 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/pdf-lib/utils/elements/Segment.ts | 81 | completo | DO_NOT_TOUCH_VISUAL | Fuera de migración visual; motor PDF/generator/converter. |
| src/sisad-pdfme/schemas/text/icons/index.ts | 30 | completo | SCHEMA_RENDER_VALIDATE | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| src/sisad-pdfme/ui/components/Designer/index.tsx | 3755 | truncado 83.0 KB | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx | 1530 | completo | MIGRATE_LEFT_SIDEBAR_VISUAL | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop. |
| src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomFieldModal.tsx | 365 | completo | MIGRATE_LEFT_SIDEBAR_VISUAL | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop. |
| src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomPanel.tsx | 111 | completo | MIGRATE_LEFT_SIDEBAR_VISUAL | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop. |
| src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx | 98 | completo | MIGRATE_LEFT_SIDEBAR_VISUAL | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop. |
| src/sisad-pdfme/ui/components/Designer/LeftSidebarSearch.tsx | 36 | completo | MIGRATE_LEFT_SIDEBAR_VISUAL | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop. |
| src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx | 57 | completo | MIGRATE_LEFT_SIDEBAR_VISUAL | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop. |
| src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx | 125 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/SchemaDropSetupModal.tsx | 94 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/schemaRegistry.ts | 212 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/useLeftSidebarCatalogState.ts | 155 | completo | MIGRATE_LEFT_SIDEBAR_VISUAL | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop. |
| src/sisad-pdfme/ui/components/shared/pageMetadata.ts | 52 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/shared/usePaperRefRegistry.ts | 20 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx | 1589 | completo | CANVAS_VISUAL_WITH_GUARDS | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens. |
| src/sisad-pdfme/ui/components/Designer/Canvas/Guides.tsx | 100 | completo | CANVAS_VISUAL_WITH_GUARDS | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens. |
| src/sisad-pdfme/ui/components/Designer/Canvas/Mask.tsx | 33 | completo | CANVAS_VISUAL_WITH_GUARDS | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens. |
| src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx | 127 | completo | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests. |
| src/sisad-pdfme/ui/components/Designer/Canvas/Padding.tsx | 82 | completo | CANVAS_VISUAL_WITH_GUARDS | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens. |
| src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx | 110 | completo | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests. |
| src/sisad-pdfme/ui/components/Designer/Canvas/SnapLines.tsx | 349 | completo | CANVAS_VISUAL_WITH_GUARDS | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens. |
| src/sisad-pdfme/ui/components/Designer/Comments/CommentDialog.tsx | 59 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx | 250 | completo | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/contextHeader.ts | 19 | completo | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx | 250 | completo | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx | 66 | completo | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx | 432 | completo | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts | 495 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/canvasDropPipeline.ts | 112 | completo | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests. |
| src/sisad-pdfme/ui/components/Designer/shared/className.ts | 17 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts | 145 | completo | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests. |
| src/sisad-pdfme/ui/components/Designer/shared/DesignerContextSummary.tsx | 83 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.ts | 182 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/designerExtensions.ts | 98 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/designerLabels.ts | 98 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/interactionGuards.ts | 298 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/interactionState.ts | 62 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/interactionTargetPolicy.ts | 62 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/interactionTargetSelectors.ts | 68 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/keyboardShortcutRegistry.ts | 290 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/keyboardShortcuts.ts | 568 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/objectGuards.ts | 12 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/passiveTouchListeners.ts | 38 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/recipientColor.ts | 143 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/schemaAutoPlace.ts | 96 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/schemaClipboard.ts | 426 | completo | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/schemaCollision.ts | 101 | truncado 2.3 KB | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests. |
| src/sisad-pdfme/ui/components/Designer/shared/schemaInteractionCapabilities.ts | 115 | omitido por presupuesto total | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/schemaTone.ts | 90 | omitido por presupuesto total | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/schemaVariableName.ts | 49 | omitido por presupuesto total | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/selectableTargetGuards.ts | 34 | omitido por presupuesto total | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests. |
| src/sisad-pdfme/ui/components/Designer/shared/selectionCommands.ts | 885 | omitido por presupuesto total | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/selectionIdentityResolver.ts | 115 | omitido por presupuesto total | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/transformTargetGuards.ts | 29 | omitido por presupuesto total | PROTECT_GEOMETRY_INTERACTION | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests. |
| src/sisad-pdfme/ui/components/Designer/shared/useDesignerKeyboardShortcuts.ts | 546 | omitido por presupuesto total | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/shared/useResponsiveDensity.ts | 81 | omitido por presupuesto total | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/Shortcuts/ShortcutHelpButton.tsx | 43 | omitido por presupuesto total | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/Shortcuts/ShortcutHelpPanel.tsx | 163 | omitido por presupuesto total | UI_CORE_REVIEW | Migrar visual solo por componentes, con bridge y validación. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx | 242 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/canvasContextMenuActions.tsx | 921 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasOverlayManager.tsx | 141 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasStateOverlay.tsx | 158 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CommentsOverlay.tsx | 271 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/floatingSurfaceGeometry.ts | 97 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/GroupOptionFloatingAction.tsx | 103 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay.tsx | 204 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineMetricsOverlay.tsx | 23 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/overlayState.ts | 40 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/pointerGeometry.ts | 133 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDragPreview.tsx | 41 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash.tsx | 49 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropPlaceholder.tsx | 57 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx | 217 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/smartPlacement.ts | 196 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SnapFeedbackOverlay.tsx | 42 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/Canvas/overlays/useFloatingToolbarPosition.ts | 69 | omitido por presupuesto total | OVERLAY_SKIN_ONLY | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx | 67 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/ButtonGroupWidget.tsx | 83 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/CompactConfigPanel.tsx | 99 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailFormSection.tsx | 55 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx | 136 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailHeaderUtils.ts | 85 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts | 430 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx | 177 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts | 405 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView.tsx | 417 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx | 63 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx | 141 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx | 108 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorContracts.ts | 366 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorPrimitives.tsx | 217 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaCollaborationUtils.ts | 18 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx | 485 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsShared.tsx | 146 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaConnectionsValidation.ts | 83 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsWidget.tsx | 825 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaFieldCommentsWidget.tsx | 314 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/WidgetRenderer.tsx | 32 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx | 341 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListView.tsx | 345 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewDragOverlay.tsx | 58 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewFooter.tsx | 56 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx | 238 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableContainer.tsx | 217 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableItem.tsx | 119 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarSurfacePrimitives.tsx | 112 | omitido por presupuesto total | MIGRATE_RIGHT_SIDEBAR_VISUAL | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |

## Apéndice B — Inventario completo de CSS/Tailwind

| Archivo | Líneas | Estado | Decisión | Nota |
| --- | --- | --- | --- | --- |
| src/styles/tailwind.css | 11 | completo | INFRA_CANONICAL | Mantener como única entrada Tailwind; no duplicar directivas. |
| src/style.css | 11 | completo | INFRA_NEUTRALIZE | Debe quedar neutralizado o sin @tailwind para evitar doble emisión. |
| src/styles/sisad-tailwind-bridge.css | 415 | completo | MIGRATE_BRIDGE | Bridge top-level @apply para clases existentes; no usar @layer si purga clases dinámicas. |
| reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css | 1600 | completo | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css | 1547 | completo | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css | 6417 | truncado 75.1 KB | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css | 443 | completo | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css | 8 | completo | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| src/features/pdfcomponent/labRoutes.css | 1550 | completo | SPLIT_LAB_CSS | Migrar visual seguro; conservar canvas-first, drawer fixed, media compleja y gradientes críticos. |
| src/sisad-pdfme/ui/styles/canvas-interactions.css | 1492 | completo | SPLIT_CANVAS_INTERACTIONS | Migrar skins de toolbar/menu; conservar overlays, transform, pointer-events, z-index tokens, botón +. |
| src/sisad-pdfme/ui/styles/sisad-pdfme-global.css | 6383 | truncado 75.6 KB | SPLIT_GLOBAL_CSS | Migrar por sección; conservar paper geometry, Ant, Moveable/Selecto, keyframes, field chrome crítico. |
| src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css | 240 | completo | SPLIT_RUNTIME_CSS | Migrar skins runtime; conservar import global, density attrs, Ant overrides y PDF/print. |
| src/sisad-pdfme/ui/styles/tokens.css | 374 | completo | KEEP_TOKEN_SOURCE | Fuente de verdad de tokens, variables runtime, z-index, paper y owner color; no convertir a clases estáticas. |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css | 1600 | completo | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css | 1547 | completo | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css | 6417 | truncado 75.1 KB | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css | 443 | completo | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |
| .tailwind-migration-backups/20260708-111736/reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css | 8 | completo | REFERENCE_ONLY | Archivo candidato generado; no copiar ciegamente, usar como mapa de @apply/manual. |

## Apéndice C — Resumen por decisión

| Decisión | Cantidad de archivos | Líneas aprox. | Nota |
| --- | --- | --- | --- |
| DO_NOT_TOUCH_VISUAL | 166 | 27140 | Fuera de migración visual; motor PDF/generator/converter. |
| SCHEMA_LOGIC_KEEP | 67 | 10024 | Mantener lógica de schema; solo validar contratos visuales si aplica. |
| NO_SCOPE_REVIEW | 64 | 10586 | Revisar solo si aparece en dependencias de CSS visual. |
| UI_CORE_REVIEW | 56 | 16789 | Migrar visual solo por componentes, con bridge y validación. |
| MIGRATE_RIGHT_SIDEBAR_VISUAL | 36 | 7596 | Migrar skins de paneles/listas/inspector; conservar Ant y selección. |
| OVERLAY_SKIN_ONLY | 18 | 3004 | Tailwind solo para skin; posición, transform, z-index, pointer-events críticos se conservan. |
| SCHEMA_RENDER_VALIDATE | 18 | 3227 | Revisar visual por familia; no tocar valores, adapters, snapshot ni PDF render. |
| MIGRATE_LAB_JSX | 11 | 2446 | Migrar visual host/landing/cards/header/results con Tailwind directo y mantener acciones. |
| MIGRATE_LEFT_SIDEBAR_VISUAL | 7 | 2352 | Recuperar baseline visual y migrar cards/tabs/search a Tailwind/bridge; no romper drag/drop. |
| PROTECT_GEOMETRY_INTERACTION | 7 | 658 | No migrar geometría/hit-testing; cambios visuales solo con evidencia y tests. |
| CANVAS_VISUAL_WITH_GUARDS | 6 | 2375 | Revisar visual; conservar overflow/scroll/position/transform en CSS/tokens. |
| KEEP_LAB_DATA_LOGIC | 6 | 1498 | No migrar estilos; mantener fixtures/builders/export fuera del core. |
| RUNTIME_COMPAT_VALIDATE | 5 | 776 | No rediseñar; validar que Form/Viewer/PDF no hereden chrome de designer. |
| FIELD_CHROME_TASK | 3 | 471 | Migrar visual compartido por modo; preservar x/y/size/ownerColor/readonly/required. |
| PROTECT_SNAPSHOT | 3 | 684 | No tocar por CSS; preservar metadata y roundtrip. |
| CONTROL_BAR_REVIEW | 2 | 449 | Compactar y migrar skin; mantener posicionamiento y densidad por tokens. |
| INFRA_DEDUP | 2 | 12 | Dejar un solo PostCSS config si el toolchain no requiere ambos. |
| INFRA_VALIDATE | 2 | 178 | Verificar scripts, dependencias Tailwind, no ejecutar migración destructiva. |
| INFRA_ENTRY | 1 | 13 | Importar tailwind.css y bridge una sola vez; evitar imports duplicados. |
| ROUTING_ONLY | 1 | 25 | No tocar diseño core; solo rutas de laboratorio. |

## Apéndice D — Mapa rápido de exclusiones

| Excluir | Motivo |
| --- | --- |
| `src/sisad-pdfme/pdf-lib/**` | Motor PDF; no tiene migración visual. |
| `src/sisad-pdfme/generator/**` | Generación PDF; solo compatibilidad visual final. |
| `src/sisad-pdfme/converter/**` | Conversión PDF/imagen; fuera de UI. |
| `Moveable.tsx`, `Selecto.tsx` | Interacción y hit-testing; no tocar desde migración visual. |
| `designerCoordinateService.ts`, `coordinateMath.ts` | Geometría y conversión coordenadas. |
| `schemaCollision.ts`, `canvasDropPipeline.ts` | Drop/collision; no tocar por estilo. |
| `snapshotAdapter.ts`, `schemaMigration.ts` | Persistencia y roundtrip de metadata. |
| `tokens.css` | Fuente de verdad visual y runtime; no eliminar. |