# Plan maestro actualizado — Migración completa CSS puro → Tailwind para SISAD PDFME

Fecha de actualización: 2026-07-09 03:30



## 1. Propósito

Este documento actualiza el plan de migración CSS puro → Tailwind tomando en cuenta:

- El contexto completo de código React/Vite (`codigo-frontend-sisad—pdmfe.md`).
- La documentación y arquitectura AI/docs (`documentacion-sisad—pdmfeweb.md`).
- El inventario CSS/Tailwind y candidatos (`styles-sisad—pdmfe.md`).
- Las regresiones visuales vistas durante la migración: header, rightSlot, RightSidebar, LeftSidebar, canvas-first, resultados y overlays.
- La necesidad de seguir migrando **cada componente JSX/TSX** sin afectar la visualización ni romper canvas, Moveable, Selecto, snapshot, runtime ni PDF.

El objetivo no es “pasar todo a Tailwind” de forma mecánica. El objetivo es **reducir CSS legacy de manera medible, conservar el baseline visual y aplicar Tailwind por capas seguras**.


## 2. Fuentes analizadas

| Archivo subido | Perfil | Fecha | Archivos incluidos | Observación |
|---|---:|---:|---:|---|
| `codigo-frontend-sisad—pdmfe.md` | React/Vite código | 2026-07-09T03:22:40.019Z | 481 | Base para matriz de JSX/TSX/JS/TS. Incluye 481 candidatos y marca varios como omitidos por presupuesto. |
| `documentacion-sisad—pdmfeweb.md` | Markdown/docs/IA | 2026-07-09T03:22:39.516Z | 217 | Base para actualizar plan, task-cards, memoria, reglas y separación `docs/` vs `ai/`. |
| `styles-sisad—pdmfe.md` | CSS/Tailwind | 2026-07-09T03:22:40.398Z | 18 | Base para decisiones CSS: Tailwind entry, bridge, candidatos, CSS activo y legacy. |


### 2.1 Métrica de acciones detectadas en código

| Acción | Cantidad de archivos |
|---|---:|
| `NO_VISUAL_MIGRATION` | 170 |
| `DO_NOT_MIGRATE` | 160 |
| `NO_VISUAL_OR_SPLIT` | 24 |
| `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | 22 |
| `MIGRATE_SCHEMA_VISUAL_SAFE` | 13 |
| `SPLIT_RULE_MIGRATE_SKIN_ONLY` | 13 |
| `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | 7 |
| `MIGRATE_VISUAL_SAFE` | 7 |
| `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | 7 |
| `MIGRATE_LEFT_SIDEBAR_VISUAL` | 6 |
| `MIGRATE_JSX` | 5 |
| `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | 5 |
| `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | 5 |
| `KEEP_LEGACY_GEOMETRY` | 5 |
| `STABILIZE_AND_MIGRATE_JSX` | 4 |
| `MIGRATE_RUNTIME_UI_SKIN` | 4 |
| `DO_NOT_VISUAL_MIGRATE_NOW` | 3 |
| `REVIEW_BEFORE_MIGRATE` | 3 |
| `CONFIG_OR_SCRIPT_ONLY` | 2 |
| `CONFIG_VERIFY_OR_FIX` | 1 |
| `SPLIT_RULE_NEEDS_TASK_CARD` | 1 |


### 2.2 Métrica por capa

| Capa | Cantidad de archivos |
|---|---:|
| PDF/Generator | 158 |
| Core library | 56 |
| Schemas registry | 52 |
| Designer shared logic | 27 |
| Schemas logic/pdf | 24 |
| RightSidebar DetailView | 22 |
| UI logic/theme | 17 |
| Schemas visual/runtime | 13 |
| Canvas overlay skins | 13 |
| Lab data/builders | 8 |
| Converter | 8 |
| Runtime/Paper/Renderer | 7 |
| Designer dialogs/tools | 7 |
| RightSidebar ListView | 7 |
| LeftSidebar visual | 6 |
| Lab landing/host | 5 |
| Canvas core/chrome | 5 |
| RightSidebar shell/rails | 5 |
| Canvas overlay logic | 5 |
| Lab shell canvas-first | 4 |
| Runtime/UI chrome | 4 |
| Public UI entrypoints | 3 |
| Config/scripts/tests | 2 |
| Runtime component | 2 |
| Canvas Moveable/Selecto | 2 |
| Infra Tailwind | 1 |
| Designer shell | 1 |
| Designer other | 1 |
| LeftSidebar state | 1 |
| RightSidebar helpers | 1 |



## 3. Hallazgos críticos que faltaban cubrir

### 3.1 El plan anterior era fuerte en fases, pero débil en ledger por archivo

Faltaba una matriz viva que diga para cada `jsx/tsx/js/ts`:

- si se migra a Tailwind JSX;
- si se migra al bridge;
- si se conserva en CSS legacy;
- si se prohíbe tocar;
- qué test/captura valida ese cambio.

Este documento agrega la matriz completa en el apéndice.

### 3.2 Los candidatos CSS no son implementación directa

Los archivos `reports/tailwind-migration/candidates/*.candidate.css` son útiles para auditoría, pero no deben reemplazar CSS real sin revisión porque contienen declaraciones `Unsupported/manual` y algunas estructuras generadas. La migración debe usar esos candidatos como mapa, no como parche automático.

### 3.3 El bridge debe seguir a nivel raíz

`src/styles/sisad-tailwind-bridge.css` debe mantener `@apply` a nivel raíz. No envolverlo en `@layer components` porque muchas clases se generan dinámicamente o dependen de `data-*`. Si Tailwind no detecta esas clases, puede purgar reglas necesarias.

### 3.4 El Header ya fue parcialmente corregido, pero requiere estabilización visual

Se reubicó la colaboración al `PageHeader`, pero falta:

- visual del select/botones como sistema soft UI;
- validación responsive en 1366/1440/1600;
- que no reaparezcan controles nativos con borde negro;
- que `PageHeader` no supere 52px salvo navegación del navegador.

### 3.5 RightSidebar sigue siendo el siguiente bloqueo visual

Las capturas muestran que `RightSidebar` tiene header/list toolbar roto o comprimido. Es el siguiente foco antes de tocar overlays/canvas.

### 3.6 No se debe volver a pedir “continúa con todo”

A partir de ahora cada intervención debe tener una task-card única. Pedir “no pares hasta terminar todo” aumenta el riesgo de que Codex toque canvas, CSS legacy y sidebars en un solo diff.



## 4. Contrato de capas

| Capa | Migración permitida | Prohibido |
|---|---|---|
| `features/pdfcomponent` landing | Tailwind JSX directo | tocar editor core |
| `features/pdfcomponent` canvas-first shell | Tailwind JSX + `labRoutes.css` para layout complejo | wrappers que roben espacio al canvas |
| `LeftSidebar` | Tailwind JSX/bridge para tabs/search/cards | romper drag/drop/data attrs |
| `RightSidebar` | Tailwind JSX/bridge para tabs/list/detail skins | romper selección, rename, filtros, command updates |
| Canvas core | solo skin mínimo validado | overflow, transform, zoom, page geometry |
| Canvas overlays | split skin vs geometry | position/transform/z-index arbitrario |
| Schemas visual | uiRender/propPanel skin seguro | metadata, values, pdfRender |
| Runtime Form/Viewer | skin limpio por modo | chrome de diseñador en PDF |
| Generator/pdf-lib | no migrar | cualquier Tailwind |
| Tokens | conservar/tokenizar | borrar variables runtime |


## 5. CSS: estado actual y decisión por archivo

| Archivo CSS | Líneas | Estado | Decisión |
|---|---:|---|---|
| `src/styles/tailwind.css` | 11 | completo | `KEEP_SINGLE_TAILWIND_ENTRY` |
| `src/style.css` | 11 | completo | `KEEP_NEUTRALIZED` |
| `src/styles/sisad-tailwind-bridge.css` | 502 | completo | `MIGRATE_BRIDGE_TOP_LEVEL` |
| `reports/tailwind-migration/candidates/features__pdfcomponent__labRoutes.tailwind.candidate.css` | 1600 | completo | `REFERENCE_ONLY_DO_NOT_APPLY_BLINDLY` |
| `reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__canvas-interactions.tailwind.candidate.css` | 1547 | completo | `REFERENCE_ONLY_DO_NOT_APPLY_BLINDLY` |
| `reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-global.tailwind.candidate.css` | 6417 | truncado 75.1 KB | `REFERENCE_ONLY_DO_NOT_APPLY_BLINDLY` |
| `reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__sisad-pdfme-runtime.tailwind.candidate.css` | 443 | completo | `REFERENCE_ONLY_DO_NOT_APPLY_BLINDLY` |
| `reports/tailwind-migration/candidates/sisad-pdfme__ui__styles__tokens.tailwind.candidate.css` | 8 | completo | `REFERENCE_ONLY_DO_NOT_APPLY_BLINDLY` |
| `src/features/pdfcomponent/labRoutes.css` | 1684 | completo | `SPLIT_LAB_LAYOUT_AND_MIGRATE_BY_COMPONENT` |
| `src/sisad-pdfme/ui/styles/canvas-interactions.css` | 1492 | completo | `SPLIT_SKIN_VS_GEOMETRY` |
| `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css` | 6390 | truncado 75.6 KB | `ACTIVE_LEGACY_SPLIT_BY_DOMAIN` |
| `src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css` | 240 | completo | `KEEP_RUNTIME_RULES_SPLIT_SKIN_ONLY` |
| `src/sisad-pdfme/ui/styles/tokens.css` | 374 | completo | `KEEP_TOKENS` |



## 6. Reglas de decisión por tipo de archivo

### MIGRATE_JSX

Usar en componentes visuales aislados:

- landing;
- cards;
- botones;
- filtros;
- popovers simples;
- empty states;
- headers internos no geométricos.

### MIGRATE_BRIDGE

Usar para classNames existentes que aparecen en muchos sitios:

- sidebars;
- list rows;
- control bar visual;
- inspector sections;
- runtime controls;
- Ant Design skin overrides.

### KEEP_LEGACY

Mantener en CSS legacy:

- paper geometry;
- page stacking;
- scroll canvas;
- transform/zoom;
- Moveable/Selecto;
- keyframes críticos;
- `color-mix` con variables runtime;
- `data-*` complejos;
- print/PDF.

### SPLIT_RULE

Aplicar cuando un selector mezcla:

- layout + visual;
- position + skin;
- z-index + shadow;
- pointer-events + border;
- geometry + typography.


## 7. Prompt de arranque actualizado para Codex/Claude/Copilot

```txt
Actúa como arquitecto frontend senior experto en React, Vite, Tailwind CSS, CSS cascade, editores PDF/canvas, pdfme, Moveable, Selecto, Ant Design, baseline visual y migración incremental segura.

Proyecto:
```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
```

Plan obligatorio:
```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/plan-maestro-migracion-tailwind-sisad-pdfme.md
```

Baseline visual obligatorio:
```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/public/img-version
```

## Reglas de arranque obligatorias

1. Antes de editar, ejecuta:
```bash
git status --short
sed -n '1,240p' plan-maestro-migracion-tailwind-sisad-pdfme.md
find public/img-version -maxdepth 2 -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.webp" \) | sort
```

2. Carga contexto mínimo:
```bash
test -f ai/start/START.md && sed -n '1,180p' ai/start/START.md
test -f ai/router/ROUTER.md && sed -n '1,180p' ai/router/ROUTER.md
test -f ai/router/CONTEXT_BUDGET.md && sed -n '1,180p' ai/router/CONTEXT_BUDGET.md
test -f reports/tailwind-migration/line-by-line-style-audit.md && sed -n '1,260p' reports/tailwind-migration/line-by-line-style-audit.md
```

3. Selecciona exactamente una task-card. No mezcles fases. No “continúes con todo”.
4. Usa `rg` para localizar clases y componentes reales. No asumas nombres.
5. Si tocas JSX/TSX, decide si el estilo va a:
   - `className` Tailwind directo;
   - `src/styles/sisad-tailwind-bridge.css`;
   - CSS legacy con comentario `KEEP`;
   - o task-card separada.
6. No tocar Canvas/Moveable/Selecto/generator/pdf-lib salvo task-card explícita.
7. Genera captura antes/después cuando el cambio sea visual.
8. Ejecuta build/lint si aplica.
9. Responde con `git status --short` y lista solo archivos realmente modificados.

## Contratos no negociables

No tocar:
```txt
src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx
src/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.ts
src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaCollision.ts
src/sisad-pdfme/shared/snapshotAdapter.ts
src/sisad-pdfme/generator/**
src/sisad-pdfme/pdf-lib/**
```

No migrar a Tailwind:
```txt
x/y/width/height/rotation
zoom/transform/scale
paper geometry/page stacking
getBoundingClientRect
Moveable/Selecto selectors
data-schema-id/data-option-id hit-testing
snapshot metadata
pdfRender
```

## Formato de cierre

```md
# Resultado

## Task-card ejecutada
## Archivos modificados reales
## Decisión Tailwind por archivo
## CSS legacy conservado y motivo
## Validación DOM
## Capturas generadas
## Build/Lint
## Riesgos residuales
## Siguiente task-card recomendada
```
```


## 8. Task-cards actualizadas para continuar la migración

### TC-CSS-00 — Baseline, ledger e infraestructura viva
**Objetivo:** mantener congelado el baseline visual y crear un registro por componente antes de seguir migrando.  
**Archivos:** `public/img-version`, `reports/tailwind-migration/*`, `src/style.css`, `src/styles/tailwind.css`, `tailwind.config.js`, `postcss.config.*`, `src/main.jsx`.  
**Salida requerida:**
- `reports/tailwind-migration/component-migration-ledger.md`
- `reports/tailwind-migration/current-screenshots/*`
- Confirmación de `preflight:false`, una sola fuente Tailwind y bridge importado una vez.

### TC-CSS-01A — Header canvas-first estabilizado
**Estado:** iniciado.  
**Objetivo:** el header no debe robar altura ni mostrar controles nativos.  
**Archivos:** `PageHeader.jsx`, `PdfmeLabPage.jsx`, `CompactControls.jsx`, `labRoutes.css`.  
**Pendiente:** pulir `rightSlot` visual, quitar bordes negros nativos, validar 1366/1440/1600 px.

### TC-CSS-01B — ResultsPanel como drawer no invasivo
**Objetivo:** que `Resultados` no tape toolbar ni canvas.  
**Archivos:** `ResultsPanel.jsx`, `labRoutes.css`.  
**Regla:** cerrado = pill; abierto = drawer compacto `max-height:min(300px,38dvh)`.

### TC-CSS-02 — Landing/CaseCard/Primitives Tailwind JSX
**Objetivo:** completar migración segura del catálogo sin tocar editor.  
**Archivos:** `LabLandingPage.jsx`, `CaseCard.jsx`, `LabExampleDownloadButton.jsx`, `PopoverMenu.jsx`, `ui/primitives.jsx`.  
**Regla:** Tailwind JSX directo permitido.

### TC-CSS-03 — Bridge base sin `@layer`
**Objetivo:** consolidar skins comunes en `src/styles/sisad-tailwind-bridge.css`.  
**Regla:** bridge a nivel raíz, no dentro de `@layer components`, para evitar purge sobre clases dinámicas/data-*.

### TC-CSS-04 — LeftSidebar baseline
**Objetivo:** restaurar estética de `public/img-version`: panel blanco flotante, tabs cápsula, search pill, filtros, categorías uppercase, cards con icono centrado.  
**Archivos:** `LeftSidebar*.tsx`, `PluginIcon.tsx`, `sisad-tailwind-bridge.css`, CSS legacy relacionado.  
**Validación:** drag/drop, filtros, favoritos, recientes, vista compact/rich.

### TC-CSS-05 — RightSidebar ListView
**Objetivo:** corregir header superior roto/cortado, tabs, búsqueda, filtro, rows, selección y badges.  
**Archivos:** `RightSidebar/ListView/**`, `RightSidebar/layout.tsx`, `RightSidebar/RightSidebar.tsx`, `SidebarSurfacePrimitives.tsx`.  
**Regla:** no romper selección, rename, filtro, dnd.

### TC-CSS-06 — RightSidebar DetailView/Inspector
**Objetivo:** migrar cards, secciones, inputs, alineadores y widgets a skin compacta.  
**Archivos:** `RightSidebar/DetailView/**`.  
**Regla:** preservar command updates y contratos de inspector.

### TC-CSS-07 — Rails de documentos/comentarios
**Objetivo:** `DocumentsRail` y `CommentsRail` consistentes con baseline.  
**Archivos:** `DocumentsRail.tsx`, `CommentsRail.tsx`, `RightSidebar.tsx`.  
**Validación:** documentos, comentarios, empty states.

### TC-CSS-08 — Control bar y toolbar contextual
**Objetivo:** migrar visual de `CtlBar`, `SelectionContextToolbar`, `CanvasContextMenu` sin tocar posición crítica.  
**Archivos:** `CtlBar.tsx`, `Canvas/overlays/*Toolbar*`, `CanvasContextMenu.tsx`, `canvasContextMenuActions.tsx`, `canvas-interactions.css`.  
**Regla:** position/transform/z-index legacy/tokens; solo skin en Tailwind/bridge.

### TC-CSS-09 — Canvas overlay skins
**Objetivo:** drag preview, drop placeholder, commit flash, snap feedback, inline edit y comments pins.  
**Regla:** no tocar `pointerGeometry`, `floatingSurfaceGeometry`, `smartPlacement`, ni `useFloatingToolbarPosition`.

### TC-CSS-10 — Field chrome por modo
**Objetivo:** separar Designer/Form/Viewer/PDF para que PDF no imprima chrome.  
**Archivos:** `fieldChrome.ts`, `renderSchemaWithChrome.ts`, `schemaDom.ts`, `schemas/**/uiRender.ts`.  
**Regla:** no tocar `pdfRender` salvo bug separado.

### TC-CSS-11 — Schemas visual parity
**Objetivo:** text, number, checkbox, groups, select, signing, action, media, table y shapes con visual consistente.  
**Archivos:** `schemas/**/uiRender.ts`, `schemas/options/*.tsx`, `schemas/*/propPanel.ts(x)`.  
**Regla:** metadata y values intactos.

### TC-CSS-12 — Runtime Form/Viewer
**Objetivo:** runtime limpio, sin chrome de diseñador, con Tailwind seguro en skins.  
**Archivos:** `Form.tsx`, `Viewer.tsx`, `Preview.tsx`, `Renderer.tsx`, `StaticSchema.tsx`, `sisad-pdfme-runtime.css`.

### TC-CSS-13 — Limpieza legacy medible
**Objetivo:** eliminar CSS duplicado solo con evidencia.  
**Criterios:** `rg`, screenshot aprobado, tests, comentario `MIGRATED/KEEP/TODO`.



## 9. Secuencia recomendada de ejecución

### Sprint A — estabilización visual obligatoria

1. `TC-CSS-01A` Header visual polish.
2. `TC-CSS-05` RightSidebar ListView.
3. `TC-CSS-06` RightSidebar DetailView.
4. `TC-CSS-04` LeftSidebar baseline.
5. `TC-CSS-01B` ResultsPanel.

### Sprint B — migración visual controlada

6. `TC-CSS-02` Landing completa.
7. `TC-CSS-03` Bridge base.
8. `TC-CSS-08` Control bar/toolbar/context menu.
9. `TC-CSS-09` Canvas overlay skins.

### Sprint C — runtime/schema parity

10. `TC-CSS-10` Field chrome por modo.
11. `TC-CSS-11` Schema visual parity.
12. `TC-CSS-12` Runtime Form/Viewer.

### Sprint D — limpieza legacy

13. `TC-CSS-13` Eliminación medible.
14. Actualizar docs de theming.
15. Actualizar memoria IA y checklist.



## 10. Validación obligatoria por task-card

### 10.1 Comandos base

```bash
npm run build
npm run lint
```

Si existe:

```bash
npm run typecheck
npm run test
```

### 10.2 Capturas obligatorias

```txt
reports/tailwind-migration/current-screenshots/
```

Mínimo por cada task visual:

- antes;
- después;
- viewport 1366x900;
- viewport 1440x900;
- viewport 1600x1200 si aplica.

### 10.3 Rutas base

```txt
http://localhost:5174
http://localhost:5174/lab/basic-designer
http://localhost:5174/lab/multi-document-routing
http://localhost:5174/lab/generator-runtime
```

### 10.4 DOM checks clave

```js
document.querySelector('.sisad-pdfme-lab-page-hero + .sisad-pdfme-lab-collaboration-bar') === null
document.querySelector('.sisad-pdfme-lab-header-collaboration') !== null
```

Para RightSidebar:

```js
Array.from(document.querySelectorAll('.sisad-pdfme-designer-right-sidebar input, .sisad-pdfme-designer-right-sidebar select, .sisad-pdfme-designer-right-sidebar button'))
  .filter(el => {
    const r = el.getBoundingClientRect()
    const visible = r.width > 0 && r.height > 0
    const iconOnly = el.getAttribute('aria-label') && r.width <= 40
    return visible && !iconOnly && (r.height < 24 || r.width < 40)
  })
```

Debe devolver `[]` o justificar cada caso.



## 11. Archivos nuevos recomendados para control de migración

Crear o mantener:

```txt
reports/tailwind-migration/component-migration-ledger.md
reports/tailwind-migration/visual-regression-checkpoints.md
reports/tailwind-migration/current-screenshots/README.md
ai/task-cards/active/
ai/memory/changelog.md
ai/memory/pending-checklist.md
```

### 11.1 Formato de ledger

```md
| Archivo | Estado | Última task | Tailwind JSX | Bridge | Legacy KEEP | Captura | Build | Riesgo |
|---|---|---|---|---|---|---|---|---|
```



## 12. Criterio de salida de la migración completa

La migración se considera terminada cuando:

1. Cada archivo visual JSX/TSX tiene estado en ledger.
2. Cada selector legacy tiene comentario `MIGRATED`, `KEEP`, `TODO` o `DELETE`.
3. No hay doble emisión Tailwind.
4. No hay `@layer components` en bridge crítico dinámico.
5. No se toca Moveable/Selecto.
6. Canvas page 2+ funciona.
7. Multi-recipient no muta ownerColor.
8. Form/Viewer/Generator no imprimen chrome de diseñador.
9. Capturas comparadas contra `public/img-version`.
10. Build/lint/tests focales ejecutados.
11. Documentación `docs/09-theming` actualizada.
12. Memoria IA y checklist actualizados.


# Apéndice A — Matriz prioritaria de archivos visuales

| Archivo | Capa | Acción | Prioridad | Riesgo | Validación |
|---|---|---|---|---|---|
| `src/features/pdfcomponent/CaseCard.jsx` | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo | landing + screenshots |
| `src/features/pdfcomponent/CompactControls.jsx` | Lab shell canvas-first | `STABILIZE_AND_MIGRATE_JSX` | P0/P1 | Medio | DOM + screenshot multi-document-routing |
| `src/features/pdfcomponent/LabExampleDownloadButton.jsx` | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo | landing + screenshots |
| `src/features/pdfcomponent/LabLandingPage.jsx` | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo | landing + screenshots |
| `src/features/pdfcomponent/PageHeader.jsx` | Lab shell canvas-first | `STABILIZE_AND_MIGRATE_JSX` | P0/P1 | Medio | DOM + screenshot multi-document-routing |
| `src/features/pdfcomponent/PdfmeLabPage.jsx` | Lab shell canvas-first | `STABILIZE_AND_MIGRATE_JSX` | P0/P1 | Medio | DOM + screenshot multi-document-routing |
| `src/features/pdfcomponent/PopoverMenu.jsx` | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo | landing + screenshots |
| `src/features/pdfcomponent/ResultsPanel.jsx` | Lab shell canvas-first | `STABILIZE_AND_MIGRATE_JSX` | P0/P1 | Medio | DOM + screenshot multi-document-routing |
| `src/features/pdfcomponent/ui/primitives.jsx` | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo | landing + screenshots |
| `src/sisad-pdfme/schemas/barcodes/propPanel.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/barcodes/uiRender.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/multiVariableText/propPanel.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/multiVariableText/uiRender.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/options/OptionListWidget.tsx` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/options/optionPropPanel.tsx` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/propPanel/commonInspectorFields.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/propPanel/index.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/signature/propPanel.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/tables/propPanel.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/tables/uiRender.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/text/propPanel.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/schemas/text/uiRender.ts` | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto | form/viewer/generator parity |
| `src/sisad-pdfme/ui/components/CtlBar.tsx` | Runtime/UI chrome | `MIGRATE_RUNTIME_UI_SKIN` | P6 | Medio | viewer/designer smoke |
| `src/sisad-pdfme/ui/components/ErrorScreen.tsx` | Runtime/UI chrome | `MIGRATE_RUNTIME_UI_SKIN` | P6 | Medio | viewer/designer smoke |
| `src/sisad-pdfme/ui/components/Paper.tsx` | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto | form/viewer/generator parity |
| `src/sisad-pdfme/ui/components/Preview.tsx` | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto | form/viewer/generator parity |
| `src/sisad-pdfme/ui/components/Renderer.tsx` | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto | form/viewer/generator parity |
| `src/sisad-pdfme/ui/components/Root.tsx` | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto | form/viewer/generator parity |
| `src/sisad-pdfme/ui/components/Spinner.tsx` | Runtime/UI chrome | `MIGRATE_RUNTIME_UI_SKIN` | P6 | Medio | viewer/designer smoke |
| `src/sisad-pdfme/ui/components/StaticSchema.tsx` | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto | form/viewer/generator parity |
| `src/sisad-pdfme/ui/components/UnitPager.tsx` | Runtime/UI chrome | `MIGRATE_RUNTIME_UI_SKIN` | P6 | Medio | viewer/designer smoke |
| `src/sisad-pdfme/ui/components/usePreviewRuntime.ts` | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto | form/viewer/generator parity |
| `src/sisad-pdfme/ui/components/Designer/index.tsx` | Designer shell | `SPLIT_RULE_NEEDS_TASK_CARD` | P0/P6 | Alto | all editor smoke tests |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx` | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio | drag/drop + screenshot |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomFieldModal.tsx` | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio | drag/drop + screenshot |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomPanel.tsx` | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio | drag/drop + screenshot |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx` | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio | drag/drop + screenshot |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarSearch.tsx` | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio | drag/drop + screenshot |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx` | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio | drag/drop + screenshot |
| `src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx` | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio | interaction smoke |
| `src/sisad-pdfme/ui/components/Designer/SchemaDropSetupModal.tsx` | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio | interaction smoke |
| `src/sisad-pdfme/ui/components/shared/usePaperRefRegistry.ts` | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto | form/viewer/generator parity |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx` | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto | scroll/page2+/select |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Guides.tsx` | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto | scroll/page2+/select |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Mask.tsx` | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto | scroll/page2+/select |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Padding.tsx` | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto | scroll/page2+/select |
| `src/sisad-pdfme/ui/components/Designer/Canvas/SnapLines.tsx` | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto | scroll/page2+/select |
| `src/sisad-pdfme/ui/components/Designer/Comments/CommentDialog.tsx` | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio | interaction smoke |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx` | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio | documents/comments/list/detail screenshots |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx` | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio | documents/comments/list/detail screenshots |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx` | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio | documents/comments/list/detail screenshots |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx` | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio | documents/comments/list/detail screenshots |
| `src/sisad-pdfme/ui/components/Designer/shared/keyboardShortcuts.ts` | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio | interaction smoke |
| `src/sisad-pdfme/ui/components/Designer/shared/useDesignerKeyboardShortcuts.ts` | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio | interaction smoke |
| `src/sisad-pdfme/ui/components/Designer/Shortcuts/ShortcutHelpButton.tsx` | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio | interaction smoke |
| `src/sisad-pdfme/ui/components/Designer/Shortcuts/ShortcutHelpPanel.tsx` | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio | interaction smoke |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/canvasContextMenuActions.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasOverlayManager.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasStateOverlay.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CommentsOverlay.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/GroupOptionFloatingAction.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineMetricsOverlay.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDragPreview.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropPlaceholder.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SnapFeedbackOverlay.tsx` | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto | hit-testing + screenshots |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/ButtonGroupWidget.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/CompactConfigPanel.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailFormSection.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailHeaderUtils.ts` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorContracts.ts` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorPrimitives.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaCollaborationUtils.ts` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsShared.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaConnectionsValidation.ts` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsWidget.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaFieldCommentsWidget.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/WidgetRenderer.tsx` | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto | detail screenshot + inspector tests |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx` | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio | DOM + list screenshot |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListView.tsx` | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio | DOM + list screenshot |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewDragOverlay.tsx` | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio | DOM + list screenshot |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewFooter.tsx` | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio | DOM + list screenshot |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx` | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio | DOM + list screenshot |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableContainer.tsx` | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio | DOM + list screenshot |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableItem.tsx` | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio | DOM + list screenshot |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarSurfacePrimitives.tsx` | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio | documents/comments/list/detail screenshots |


# Apéndice B — Matriz completa de archivos `src/**/*.js|jsx|ts|tsx`

> Esta matriz permite continuar la migración sin alucinaciones. Antes de tocar un archivo, revisar su fila.

| Archivo | Lenguaje | Líneas | Capa | Acción | Prioridad | Riesgo |
|---|---:|---:|---|---|---|---|
| `src/main.jsx` | jsx | 13 | Infra Tailwind | `CONFIG_VERIFY_OR_FIX` | P0 | Medio |
| `src/App.jsx` | jsx | 25 | Config/scripts/tests | `CONFIG_OR_SCRIPT_ONLY` | P3 | Bajo |
| `src/features/pdfcomponent/CaseCard.jsx` | jsx | 123 | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo |
| `src/features/pdfcomponent/CompactControls.jsx` | jsx | 282 | Lab shell canvas-first | `STABILIZE_AND_MIGRATE_JSX` | P0/P1 | Medio |
| `src/features/pdfcomponent/LabExampleDownloadButton.jsx` | jsx | 74 | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo |
| `src/features/pdfcomponent/LabLandingPage.jsx` | jsx | 242 | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo |
| `src/features/pdfcomponent/PageHeader.jsx` | jsx | 420 | Lab shell canvas-first | `STABILIZE_AND_MIGRATE_JSX` | P0/P1 | Medio |
| `src/features/pdfcomponent/PdfmeLabPage.jsx` | jsx | 650 | Lab shell canvas-first | `STABILIZE_AND_MIGRATE_JSX` | P0/P1 | Medio |
| `src/features/pdfcomponent/PopoverMenu.jsx` | jsx | 114 | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo |
| `src/features/pdfcomponent/ResultsPanel.jsx` | jsx | 248 | Lab shell canvas-first | `STABILIZE_AND_MIGRATE_JSX` | P0/P1 | Medio |
| `src/features/pdfcomponent/domain/labPresentation.js` | javascript | 192 | Lab data/builders | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/features/pdfcomponent/domain/labState.js` | javascript | 18 | Lab data/builders | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/features/pdfcomponent/ui/primitives.jsx` | jsx | 103 | Lab landing/host | `MIGRATE_JSX` | P2 | Bajo |
| `src/features/pdfcomponent/labs/builders/exampleTemplate.ts` | typescript | 199 | Lab data/builders | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/features/pdfcomponent/labs/builders/schemaFactory.ts` | typescript | 91 | Lab data/builders | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/features/pdfcomponent/labs/builders/schemaShowcase.ts` | typescript | 220 | Lab data/builders | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/features/pdfcomponent/labs/examples/labExamples.js` | javascript | 885 | Lab data/builders | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/features/pdfcomponent/labs/export/buildExampleBundle.ts` | typescript | 78 | Lab data/builders | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/features/pdfcomponent/labs/export/downloadExampleBundle.ts` | typescript | 25 | Lab data/builders | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/types/custom.d.ts` | typescript | 23 | Config/scripts/tests | `CONFIG_OR_SCRIPT_ONLY` | P3 | Bajo |
| `src/sisad-pdfme/assignments/index.ts` | typescript | 612 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/browser/downloads.ts` | typescript | 44 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/browser/objectUrls.ts` | typescript | 32 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/canvas/canvasRenderState.ts` | typescript | 146 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/canvas/overlayManager.ts` | typescript | 249 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/canvas/useCanvasRenderState.ts` | typescript | 171 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/collaboration/appearance.ts` | typescript | 55 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/collaboration/index.ts` | typescript | 459 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/collaboration/lockManager.ts` | typescript | 253 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/collaboration/recipientPalette.ts` | typescript | 69 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/collaboration/schemaLockGuard.ts` | typescript | 96 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/collaboration/schemaOwnershipAppearance.ts` | typescript | 157 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/commands/index.ts` | typescript | 52 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/comments/index.ts` | typescript | 199 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/collaboration.ts` | typescript | 364 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/comments.ts` | typescript | 280 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/constants.ts` | typescript | 31 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/dynamicTemplate.ts` | typescript | 319 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/expression.ts` | typescript | 460 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/helper.ts` | typescript | 284 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/index.ts` | typescript | 121 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/pluginRegistry.ts` | typescript | 63 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/schema.ts` | typescript | 300 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/types.ts` | typescript | 250 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/common/version.ts` | typescript | 1 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/context/RecipientContext.ts` | typescript | 111 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/contracts/assignments.ts` | typescript | 3 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/contracts/commands.ts` | typescript | 33 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/contracts/comments.ts` | typescript | 46 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/contracts/index.ts` | typescript | 71 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/contracts/plugins.ts` | typescript | 48 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/contracts/schema.ts` | typescript | 32 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/converter/img2pdf.ts` | typescript | 113 | Converter | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/converter/index.browser.ts` | typescript | 56 | Converter | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/converter/index.node.ts` | typescript | 35 | Converter | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/converter/index.ts` | typescript | 7 | Converter | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/converter/modules.d.ts` | typescript | 9 | Converter | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/converter/pdf2img.ts` | typescript | 64 | Converter | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/converter/pdf2size.ts` | typescript | 33 | Converter | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/converter/types.d.ts` | typescript | 1 | Converter | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/devtools/index.ts` | typescript | 68 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/documents/index.ts` | typescript | 188 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/editor/index.ts` | typescript | 24 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/externalForms/externalFormRunner.ts` | typescript | 173 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/generator/constants.ts` | typescript | 1 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/generator/generate.ts` | typescript | 167 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/generator/helper.ts` | typescript | 171 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/generator/index.ts` | typescript | 27 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/generator/preflight.ts` | typescript | 447 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/generator/types.ts` | typescript | 5 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/integration/index.ts` | typescript | 102 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/integration/schemaController.ts` | typescript | 73 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/pdf-lib/index.ts` | typescript | 4 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/runtime/options.ts` | typescript | 74 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/runtime/runtimeModes.ts` | typescript | 59 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/runtime/usePdfmeArtifacts.ts` | typescript | 213 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/runtime/usePdfmeRuntimeInstance.ts` | typescript | 227 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/schemas/constants.ts` | typescript | 2 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/groupSchemaRender.ts` | typescript | 288 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/index.ts` | typescript | 407 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/modules.d.ts` | typescript | 32 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/schemaBuilder.ts` | typescript | 167 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/schemaFamilies.ts` | typescript | 364 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/utils.ts` | typescript | 294 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/shared/commandTypes.ts` | typescript | 129 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/index.ts` | typescript | 121 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/interactionGuards.ts` | typescript | 167 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/keyboardShortcuts.ts` | typescript | 339 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/localFormStorage.ts` | typescript | 243 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/localMode.ts` | typescript | 187 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/localSnapshotStore.ts` | typescript | 198 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/schemaDesignerMeta.ts` | typescript | 318 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/schemaMigration.ts` | typescript | 124 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/signatureRegistry.ts` | typescript | 166 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/snapshot.ts` | typescript | 182 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/snapshotAdapter.ts` | typescript | 378 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/shared/templateValidator.ts` | typescript | 323 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/templates/createDefaultTemplate.ts` | typescript | 37 | Core library | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/class.ts` | typescript | 299 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/collaboration.ts` | typescript | 1497 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/collaborationContext.ts` | typescript | 256 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/constants.ts` | typescript | 21 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/contexts.ts` | typescript | 14 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/Designer.tsx` | tsx | 348 | Public UI entrypoints | `DO_NOT_VISUAL_MIGRATE_NOW` | P0 guard | Alto |
| `src/sisad-pdfme/ui/designerEngine.ts` | typescript | 1433 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/Form.tsx` | tsx | 130 | Public UI entrypoints | `DO_NOT_VISUAL_MIGRATE_NOW` | P0 guard | Alto |
| `src/sisad-pdfme/ui/helper.ts` | typescript | 601 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/hooks.ts` | typescript | 495 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/i18n.ts` | typescript | 903 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/index.ts` | typescript | 25 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/theme.ts` | typescript | 63 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/types.ts` | typescript | 147 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/Viewer.tsx` | tsx | 54 | Public UI entrypoints | `DO_NOT_VISUAL_MIGRATE_NOW` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/colors.ts` | typescript | 109 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/Embeddable.ts` | typescript | 7 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/errors.ts` | typescript | 118 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/index.ts` | typescript | 20 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/objects.ts` | typescript | 10 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/operations.ts` | typescript | 873 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/operators.ts` | typescript | 335 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFDocument.ts` | typescript | 1389 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFDocumentOptions.ts` | typescript | 45 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFEmbeddedFile.ts` | typescript | 87 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFEmbeddedPage.ts` | typescript | 100 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFFont.ts` | typescript | 149 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFImage.ts` | typescript | 143 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFJavaScript.ts` | typescript | 75 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFPage.ts` | typescript | 1604 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/PDFPageOptions.ts` | typescript | 175 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/rotations.ts` | typescript | 84 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/sizes.ts` | typescript | 52 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/StandardFonts.ts` | typescript | 16 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/svg.ts` | typescript | 891 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/svgPath.ts` | typescript | 460 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/crypto.ts` | typescript | 1845 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/errors.ts` | typescript | 219 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/index.ts` | typescript | 63 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/PDFContext.ts` | typescript | 274 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/PDFObjectCopier.ts` | typescript | 142 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/types/fontkit.ts` | typescript | 643 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/types/index.ts` | typescript | 30 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/types/matrix.ts` | typescript | 22 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/arrays.ts` | typescript | 157 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/async.ts` | typescript | 8 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/base64.ts` | typescript | 98 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/Cache.ts` | typescript | 28 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/errors.ts` | typescript | 3 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/index.ts` | typescript | 11 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/intersections.ts` | typescript | 237 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/maths.ts` | typescript | 96 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/numbers.ts` | typescript | 55 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/objects.ts` | typescript | 13 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/pdfDocEncoding.ts` | typescript | 69 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/png.ts` | typescript | 70 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/rng.ts` | typescript | 21 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/strings.ts` | typescript | 191 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/unicode.ts` | typescript | 373 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/validators.ts` | typescript | 200 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/schemas/actions/actionSchemaFactory.ts` | typescript | 93 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/actions/approve.ts` | typescript | 156 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/actions/attachment.ts` | typescript | 211 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/actions/decline.ts` | typescript | 145 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/actions/note.ts` | typescript | 121 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/barcodes/constants.ts` | typescript | 20 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/barcodes/helper.ts` | typescript | 187 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/barcodes/index.ts` | typescript | 23 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/barcodes/pdfRender.ts` | typescript | 37 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/barcodes/propPanel.ts` | typescript | 258 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/barcodes/types.ts` | typescript | 12 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/barcodes/uiRender.ts` | typescript | 97 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/checkbox/index.ts` | typescript | 159 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/checkboxGroup/index.ts` | typescript | 445 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/date/date.ts` | typescript | 16 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/date/dateTime.ts` | typescript | 16 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/date/helper.ts` | typescript | 523 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/date/time.ts` | typescript | 16 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/date/types.ts` | typescript | 21 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/graphics/image.ts` | typescript | 209 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/graphics/imagehelper.ts` | typescript | 156 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/graphics/svg.ts` | typescript | 123 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/multiVariableText/helper.ts` | typescript | 89 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/multiVariableText/index.ts` | typescript | 23 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/multiVariableText/pdfRender.ts` | typescript | 21 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/multiVariableText/propPanel.ts` | typescript | 166 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/multiVariableText/types.ts` | typescript | 6 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/multiVariableText/uiRender.ts` | typescript | 170 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/number/index.ts` | typescript | 86 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/options/index.ts` | typescript | 8 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/options/optionGroupEditorFactory.ts` | typescript | 121 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/options/optionGroupFactory.ts` | typescript | 432 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/options/optionGroupLayout.ts` | typescript | 76 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/options/optionGroupPdfRender.ts` | typescript | 59 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/options/optionGroupRenderer.ts` | typescript | 218 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/options/OptionListWidget.tsx` | tsx | 14 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/options/optionModel.ts` | typescript | 76 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/options/optionPropPanel.tsx` | tsx | 33 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/options/optionSelectionBehavior.ts` | typescript | 124 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/options/optionTypes.ts` | typescript | 19 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/options/optionValueAdapter.ts` | typescript | 15 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/propPanel/commonInspectorFields.ts` | typescript | 341 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/propPanel/index.ts` | typescript | 1 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/radioGroup/index.ts` | typescript | 392 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/select/index.ts` | typescript | 278 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/shapes/line.ts` | typescript | 100 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/shapes/rectAndEllipse.ts` | typescript | 161 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/shared/fieldChrome.ts` | typescript | 275 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/shared/renderSchemaWithChrome.ts` | typescript | 80 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/shared/schemaDom.ts` | typescript | 116 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/shared/schemaGuards.ts` | typescript | 167 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/shared/schemaTypes.ts` | typescript | 171 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/signature/dateSigned.ts` | typescript | 136 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/signature/index.ts` | typescript | 312 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/signature/initials.ts` | typescript | 44 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/signature/propPanel.ts` | typescript | 697 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/signature/providerRegistry.ts` | typescript | 217 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/signature/signingSchemaFactory.ts` | typescript | 119 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/signature/types.ts` | typescript | 325 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/signature/validation.ts` | typescript | 70 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/tables/cell.ts` | typescript | 152 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/tables/classes.ts` | typescript | 402 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/tables/dynamicTemplate.ts` | typescript | 88 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/tables/helper.ts` | typescript | 216 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/tables/index.ts` | typescript | 22 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/tables/pdfRender.ts` | typescript | 144 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/tables/propPanel.ts` | typescript | 122 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/tables/tableHelper.ts` | typescript | 278 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/tables/types.ts` | typescript | 87 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/tables/uiRender.ts` | typescript | 437 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/text/constants.ts` | typescript | 104 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/text/extraFormatter.ts` | typescript | 83 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/text/helper.ts` | typescript | 550 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/text/index.ts` | typescript | 23 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/text/pdfRender.ts` | typescript | 240 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/text/propPanel.ts` | typescript | 210 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/text/types.ts` | typescript | 30 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/text/uiRender.ts` | typescript | 314 | Schemas visual/runtime | `MIGRATE_SCHEMA_VISUAL_SAFE` | P5 | Medio/Alto |
| `src/sisad-pdfme/schemas/textLike/textLikePresets.ts` | typescript | 44 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/schemas/textLike/textLikeSchemaFactory.ts` | typescript | 82 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/schemas/values/schemaValueAdapter.ts` | typescript | 49 | Schemas logic/pdf | `NO_VISUAL_OR_SPLIT` | P3 | Medio |
| `src/sisad-pdfme/ui/collaboration/schemaRuntimeAccess.ts` | typescript | 153 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/commands/commandBus.ts` | typescript | 163 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/commands/designerCommands.ts` | typescript | 123 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/components/AppContextProvider.tsx` | tsx | 86 | Runtime component | `REVIEW_BEFORE_MIGRATE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/CtlBar.tsx` | tsx | 349 | Runtime/UI chrome | `MIGRATE_RUNTIME_UI_SKIN` | P6 | Medio |
| `src/sisad-pdfme/ui/components/ErrorScreen.tsx` | tsx | 26 | Runtime/UI chrome | `MIGRATE_RUNTIME_UI_SKIN` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Paper.tsx` | tsx | 222 | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Preview.tsx` | tsx | 220 | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Renderer.tsx` | tsx | 311 | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Root.tsx` | tsx | 45 | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Spinner.tsx` | tsx | 22 | Runtime/UI chrome | `MIGRATE_RUNTIME_UI_SKIN` | P6 | Medio |
| `src/sisad-pdfme/ui/components/StaticSchema.tsx` | tsx | 61 | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/UnitPager.tsx` | tsx | 100 | Runtime/UI chrome | `MIGRATE_RUNTIME_UI_SKIN` | P6 | Medio |
| `src/sisad-pdfme/ui/components/usePreviewRuntime.ts` | typescript | 602 | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/types/customSchemaRegistry.ts` | typescript | 24 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/ui/utils/cn.ts` | typescript | 3 | UI logic/theme | `NO_VISUAL_MIGRATION` | P3 | Bajo/Medio |
| `src/sisad-pdfme/pdf-lib/api/form/appearances.ts` | typescript | 655 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/index.ts` | typescript | 10 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFButton.ts` | typescript | 242 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFCheckBox.ts` | typescript | 247 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFDropdown.ts` | typescript | 637 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFField.ts` | typescript | 491 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFForm.ts` | typescript | 842 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFOptionList.ts` | typescript | 555 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFRadioGroup.ts` | typescript | 455 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFSignature.ts` | typescript | 44 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/form/PDFTextField.ts` | typescript | 811 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/text/alignment.ts` | typescript | 5 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/text/index.ts` | typescript | 2 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/api/text/layout.ts` | typescript | 328 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/flags.ts` | typescript | 162 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/index.ts` | typescript | 15 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroButton.ts` | typescript | 104 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroCheckBox.ts` | typescript | 48 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroChoice.ts` | typescript | 143 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroComboBox.ts` | typescript | 21 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroField.ts` | typescript | 167 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroForm.ts` | typescript | 96 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroListBox.ts` | typescript | 19 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroNonTerminal.ts` | typescript | 33 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroPushButton.ts` | typescript | 21 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroRadioButton.ts` | typescript | 57 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroSignature.ts` | typescript | 9 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroTerminal.ts` | typescript | 70 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/PDFAcroText.ts` | typescript | 76 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/acroform/utils.ts` | typescript | 129 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/annotation/AppearanceCharacteristics.ts` | typescript | 133 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/annotation/BorderStyle.ts` | typescript | 31 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/annotation/flags.ts` | typescript | 90 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/annotation/index.ts` | typescript | 4 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/annotation/PDFAnnotation.ts` | typescript | 148 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/annotation/PDFWidgetAnnotation.ts` | typescript | 111 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/document/PDFCrossRefSection.ts` | typescript | 161 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/document/PDFHeader.ts` | typescript | 48 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/document/PDFTrailer.ts` | typescript | 48 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/document/PDFTrailerDict.ts` | typescript | 39 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/CMap.ts` | typescript | 65 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/CustomFontEmbedder.ts` | typescript | 237 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/CustomFontSubsetEmbedder.ts` | typescript | 89 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/FileEmbedder.ts` | typescript | 77 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/FontFlags.ts` | typescript | 45 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/JavaScriptEmbedder.ts` | typescript | 34 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/JpegEmbedder.ts` | typescript | 118 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/PDFPageEmbedder.ts` | typescript | 139 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/PngEmbedder.ts` | typescript | 69 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/embedders/StandardFontEmbedder.ts` | typescript | 121 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/interactive/ViewerPreferences.ts` | typescript | 565 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFArray.ts` | typescript | 179 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFBool.ts` | typescript | 53 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFDict.ts` | typescript | 220 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFHexString.ts` | typescript | 94 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFInvalidObject.ts` | typescript | 34 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFName.ts` | typescript | 152 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFNull.ts` | typescript | 30 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFNumber.ts` | typescript | 44 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFObject.ts` | typescript | 22 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFRawStream.ts` | typescript | 41 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFRef.ts` | typescript | 51 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFStream.ts` | typescript | 87 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/objects/PDFString.ts` | typescript | 118 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/operators/PDFOperator.ts` | typescript | 72 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/operators/PDFOperatorNames.ts` | typescript | 92 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/parser/BaseParser.ts` | typescript | 119 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/parser/ByteStream.ts` | typescript | 76 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/parser/PDFObjectParser.ts` | typescript | 302 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/parser/PDFObjectStreamParser.ts` | typescript | 65 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/parser/PDFParser.ts` | typescript | 363 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/parser/PDFXRefStreamParser.ts` | typescript | 129 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/Ascii85Stream.ts` | typescript | 97 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/AsciiHexStream.ts` | typescript | 77 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/decode.ts` | typescript | 70 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/DecodeStream.ts` | typescript | 170 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/DecryptStream.ts` | typescript | 49 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/FlateStream.ts` | typescript | 397 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/LZWStream.ts` | typescript | 157 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/RunLengthStream.ts` | typescript | 55 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/streams/Stream.ts` | typescript | 126 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/structures/PDFCatalog.ts` | typescript | 81 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/structures/PDFContentStream.ts` | typescript | 58 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/structures/PDFCrossRefStream.ts` | typescript | 238 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/structures/PDFFlateStream.ts` | typescript | 40 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/structures/PDFObjectStream.ts` | typescript | 91 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/structures/PDFPageLeaf.ts` | typescript | 244 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/structures/PDFPageTree.ts` | typescript | 192 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/syntax/CharCodes.ts` | typescript | 62 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/syntax/Delimiters.ts` | typescript | 14 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/syntax/Irregular.ts` | typescript | 10 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/syntax/Keywords.ts` | typescript | 57 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/syntax/Numeric.ts` | typescript | 26 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/syntax/Whitespace.ts` | typescript | 10 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/writers/PDFStreamWriter.ts` | typescript | 114 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/core/writers/PDFWriter.ts` | typescript | 146 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/Arc.ts` | typescript | 97 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/Circle.ts` | typescript | 47 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/Ellipse.ts` | typescript | 117 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/GraphElement.ts` | typescript | 14 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/index.ts` | typescript | 9 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/Line.ts` | typescript | 83 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/Plot.ts` | typescript | 50 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/Point.ts` | typescript | 37 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/Rectangle.ts` | typescript | 65 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/pdf-lib/utils/elements/Segment.ts` | typescript | 81 | PDF/Generator | `DO_NOT_MIGRATE` | P0 guard | Alto |
| `src/sisad-pdfme/schemas/text/icons/index.ts` | typescript | 30 | Schemas registry | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/ui/components/Designer/index.tsx` | tsx | 3755 | Designer shell | `SPLIT_RULE_NEEDS_TASK_CARD` | P0/P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx` | tsx | 1530 | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomFieldModal.tsx` | tsx | 365 | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarCustomPanel.tsx` | tsx | 111 | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx` | tsx | 98 | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarSearch.tsx` | tsx | 36 | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio |
| `src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx` | tsx | 57 | LeftSidebar visual | `MIGRATE_LEFT_SIDEBAR_VISUAL` | P4 | Medio |
| `src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx` | tsx | 125 | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Designer/SchemaDropSetupModal.tsx` | tsx | 94 | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Designer/schemaRegistry.ts` | typescript | 212 | Designer other | `REVIEW_BEFORE_MIGRATE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Designer/useLeftSidebarCatalogState.ts` | typescript | 155 | LeftSidebar state | `NO_VISUAL_MIGRATION` | P4 | Bajo |
| `src/sisad-pdfme/ui/components/shared/pageMetadata.ts` | typescript | 52 | Runtime component | `REVIEW_BEFORE_MIGRATE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/shared/usePaperRefRegistry.ts` | typescript | 20 | Runtime/Paper/Renderer | `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx` | tsx | 1589 | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Guides.tsx` | tsx | 100 | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Mask.tsx` | tsx | 33 | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx` | tsx | 127 | Canvas Moveable/Selecto | `DO_NOT_MIGRATE` | P0 guard | Crítico |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Padding.tsx` | tsx | 82 | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx` | tsx | 110 | Canvas Moveable/Selecto | `DO_NOT_MIGRATE` | P0 guard | Crítico |
| `src/sisad-pdfme/ui/components/Designer/Canvas/SnapLines.tsx` | tsx | 349 | Canvas core/chrome | `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | P6/P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Comments/CommentDialog.tsx` | tsx | 59 | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx` | tsx | 250 | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/contextHeader.ts` | typescript | 19 | RightSidebar helpers | `NO_VISUAL_MIGRATION` | P3 | Bajo |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx` | tsx | 250 | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx` | tsx | 66 | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx` | tsx | 432 | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts` | typescript | 495 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/canvasDropPipeline.ts` | typescript | 112 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/className.ts` | typescript | 17 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts` | typescript | 145 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/DesignerContextSummary.tsx` | tsx | 83 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.ts` | typescript | 182 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/designerExtensions.ts` | typescript | 98 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/designerLabels.ts` | typescript | 98 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/interactionGuards.ts` | typescript | 298 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/interactionState.ts` | typescript | 62 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/interactionTargetPolicy.ts` | typescript | 62 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/interactionTargetSelectors.ts` | typescript | 68 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/keyboardShortcutRegistry.ts` | typescript | 290 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/keyboardShortcuts.ts` | typescript | 568 | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Designer/shared/objectGuards.ts` | typescript | 12 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/passiveTouchListeners.ts` | typescript | 38 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/recipientColor.ts` | typescript | 143 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/schemaAutoPlace.ts` | typescript | 96 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/schemaClipboard.ts` | typescript | 426 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/schemaCollision.ts` | typescript | 101 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/schemaInteractionCapabilities.ts` | typescript | 115 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/schemaTone.ts` | typescript | 90 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/schemaVariableName.ts` | typescript | 49 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/selectableTargetGuards.ts` | typescript | 34 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/selectionCommands.ts` | typescript | 885 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/selectionIdentityResolver.ts` | typescript | 115 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/transformTargetGuards.ts` | typescript | 29 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/shared/useDesignerKeyboardShortcuts.ts` | typescript | 546 | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Designer/shared/useResponsiveDensity.ts` | typescript | 81 | Designer shared logic | `NO_VISUAL_MIGRATION` | P0/P3 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/Shortcuts/ShortcutHelpButton.tsx` | tsx | 43 | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Designer/Shortcuts/ShortcutHelpPanel.tsx` | tsx | 163 | Designer dialogs/tools | `MIGRATE_VISUAL_SAFE` | P6 | Medio |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasContextMenu.tsx` | tsx | 242 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/canvasContextMenuActions.tsx` | tsx | 921 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasOverlayManager.tsx` | tsx | 141 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CanvasStateOverlay.tsx` | tsx | 158 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/CommentsOverlay.tsx` | tsx | 271 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/floatingSurfaceGeometry.ts` | typescript | 97 | Canvas overlay logic | `KEEP_LEGACY_GEOMETRY` | P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/GroupOptionFloatingAction.tsx` | tsx | 103 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineEditOverlay.tsx` | tsx | 204 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/InlineMetricsOverlay.tsx` | tsx | 23 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/overlayState.ts` | typescript | 40 | Canvas overlay logic | `KEEP_LEGACY_GEOMETRY` | P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/pointerGeometry.ts` | typescript | 133 | Canvas overlay logic | `KEEP_LEGACY_GEOMETRY` | P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDragPreview.tsx` | tsx | 41 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash.tsx` | tsx | 49 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropPlaceholder.tsx` | tsx | 57 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SelectionContextToolbar.tsx` | tsx | 217 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/smartPlacement.ts` | typescript | 196 | Canvas overlay logic | `KEEP_LEGACY_GEOMETRY` | P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/SnapFeedbackOverlay.tsx` | tsx | 42 | Canvas overlay skins | `SPLIT_RULE_MIGRATE_SKIN_ONLY` | P6 | Alto |
| `src/sisad-pdfme/ui/components/Designer/Canvas/overlays/useFloatingToolbarPosition.ts` | typescript | 69 | Canvas overlay logic | `KEEP_LEGACY_GEOMETRY` | P0 guard | Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/AlignWidget.tsx` | tsx | 67 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/ButtonGroupWidget.tsx` | tsx | 83 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/CompactConfigPanel.tsx` | tsx | 99 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailFormSection.tsx` | tsx | 55 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx` | tsx | 136 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailHeaderUtils.ts` | typescript | 85 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts` | typescript | 430 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx` | tsx | 177 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts` | typescript | 405 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView.tsx` | tsx | 417 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx` | tsx | 63 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgetRegistry.tsx` | tsx | 141 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx` | tsx | 108 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorContracts.ts` | typescript | 366 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorPrimitives.tsx` | tsx | 217 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaCollaborationUtils.ts` | typescript | 18 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx` | tsx | 485 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsShared.tsx` | tsx | 146 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaConnectionsValidation.ts` | typescript | 83 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaConnectionsWidget.tsx` | tsx | 825 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaFieldCommentsWidget.tsx` | tsx | 314 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/WidgetRenderer.tsx` | tsx | 32 | RightSidebar DetailView | `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | P1/P5 | Medio/Alto |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx` | tsx | 341 | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListView.tsx` | tsx | 345 | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewDragOverlay.tsx` | tsx | 58 | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewFooter.tsx` | tsx | 56 | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx` | tsx | 238 | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableContainer.tsx` | tsx | 217 | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableItem.tsx` | tsx | 119 | RightSidebar ListView | `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | P1/P5 | Medio |
| `src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarSurfacePrimitives.tsx` | tsx | 112 | RightSidebar shell/rails | `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | P1/P5 | Medio |



# Apéndice C — Definición de acciones

| Acción | Significado |
|---|---|
| `CONFIG_VERIFY_OR_FIX` | Verificar config/entrypoint. Solo cambios mínimos. |
| `STABILIZE_AND_MIGRATE_JSX` | Corregir regresión visual y migrar Tailwind seguro. |
| `MIGRATE_JSX` | Tailwind directo en `className`. |
| `MIGRATE_LEFT_SIDEBAR_VISUAL` | Migrar visual LeftSidebar preservando drag/drop. |
| `MIGRATE_RIGHT_SIDEBAR_LIST_VISUAL` | Migrar ListView/toolbar/rows preservando selección. |
| `MIGRATE_RIGHT_SIDEBAR_DETAIL_VISUAL` | Migrar inspector/cards/widgets preservando commands. |
| `MIGRATE_RIGHT_SIDEBAR_SHELL_VISUAL` | Migrar tabs/rails/superficies. |
| `MIGRATE_RUNTIME_UI_SKIN` | Skin de controles runtime sin tocar geometría. |
| `MIGRATE_SCHEMA_VISUAL_SAFE` | Skin schema ui/propPanel preservando metadata y pdfRender. |
| `SPLIT_RULE_MIGRATE_SKIN_ONLY` | Separar visual de posición/geometry antes de migrar. |
| `KEEP_GEOMETRY_MIGRATE_SKIN_ONLY` | No tocar geometría; solo piel visual mínima. |
| `KEEP_GEOMETRY_MIGRATE_MINIMAL_SKIN` | Canvas: skin mínimo si es inevitable. |
| `KEEP_LEGACY_GEOMETRY` | Mantener legacy por geometría/posición. |
| `NO_VISUAL_MIGRATION` | Archivo lógico; no aplica Tailwind. |
| `NO_VISUAL_OR_SPLIT` | No visual salvo sub-sección muy concreta. |
| `DO_NOT_MIGRATE` | Prohibido migrar en esta iniciativa. |
| `DO_NOT_VISUAL_MIGRATE_NOW` | Entrada pública o API: no tocar sin task-card. |
| `SPLIT_RULE_NEEDS_TASK_CARD` | Archivo grande/riesgoso, requiere task-card propia. |
