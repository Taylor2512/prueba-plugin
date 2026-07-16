# PROMPT — Finalizar la migración Tailwind sin perder el diseño anterior

Actúa como arquitecto frontend senior experto en React, TypeScript, Tailwind CSS 3, Vite, Ant Design, dnd-kit, Moveable, Selecto y Playwright.

Repositorio:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
```

Ruta:

```txt
http://localhost:5174/lab/multi-document-routing
```

## Objetivo exacto

Completar la migración de Tailwind que todavía vive dentro de hojas CSS hacia JSX/TSX sin perder el diseño ni el comportamiento de la versión anterior.

La meta es:

```txt
0 @apply en todas las hojas CSS
```

La meta NO es:

```txt
0 líneas CSS
```

CSS técnico residual está permitido y debe escribirse como CSS plano.

## Estado vigente

Mide antes de modificar. El último consolidado reporta:

```txt
sisad-pdfme.css: 509 líneas / 90 @apply
tokens.css: 150 líneas / 0 @apply
labRoutes.css: eliminado
bridge: vacío
```

No uses cifras históricas de 2000–6000 líneas.

## Primera decisión obligatoria

Actualmente existen dos task-cards activas:

```txt
TASK-CSS-026
TASK-REGRESSION-021
```

Antes de editar:

```txt
1. determina cuál debe cerrarse;
2. deja una sola activa;
3. detén agentes que editen los mismos archivos;
4. crea commit/checkpoint;
5. no trabajes con 200 archivos dirty;
6. no actualices dos ledgers distintos por cada microcambio.
```

## Baseline visual obligatorio

Usa las capturas anteriores como contrato:

```txt
- título Multidocumento integral;
- selector de usuario visible;
- controles Usuario activo / Estado;
- LeftSidebar compacto;
- canvas con grid;
- papel centrado;
- RightSidebar con lista/detalle/docs/comentarios;
- modal de conexión;
- modal de comentarios;
- modal Reasignar;
- CtlBar centrado;
- ResultsPanel inferior.
```

No copies el DOM antiguo. Mantén la arquitectura actual.

## Diferencia entre regresión CSS y cambio estructural

No intentes corregir con CSS:

```txt
PageHeader no montado;
selector de usuario no montado;
panel default cambiado;
controlled state incorrecto;
tabs eliminados;
callback desconectado;
wrapper público sin prop.
```

Estos casos se corrigen en React.

## Clasificación de cada `@apply`

Cada aparición debe terminar en una de estas categorías:

### MIGRATE_TO_TSX

```txt
layout local
padding/gap
border/radius
background
shadow
typography
hover/focus/selected
responsive local
scroll del componente
```

### CONVERT_TO_PLAIN_TECHNICAL_CSS

```txt
paper/canvas geometry
Moveable/Selecto/Scena descendants
stage→canvas/sidebar coordination
pointer-events cross-tree
drag/resize/rotate global state
print
portal/third-party selectors
```

Ejemplo:

```css
/* antes */
@apply absolute inset-0 pointer-events-none;

/* después */
position: absolute;
inset: 0;
pointer-events: none;
```

### DELETE_DUPLICATE_OR_ORPHAN

Solo con:

```txt
0 consumidores por clase completa;
0 consumidores por suffix concatenado;
0 referencias en tests;
0 referencias en Tailwind config;
0 referencias en strings dinámicos.
```

### KEEP_GLOBAL_PLAIN_CSS

```txt
box-sizing local
scrollbars del paquete
font/reset local
custom properties
```

## Contratos que no deben romperse

Conserva:

```ts
DESIGNER_CLASSNAME
UI_CLASSNAME
SELECTABLE_CLASSNAME
RULER_HEIGHT
PAGE_GAP
LEFT_SIDEBAR_WIDTH
RIGHT_SIDEBAR_WIDTH
BACKGROUND_COLOR
DEFAULT_MAX_ZOOM
```

Nunca sustituyas:

```tsx
DESIGNER_CLASSNAME + 'suffix'
```

por una cadena Tailwind sin hook semántico.

## Orden de ejecución

### BATCH-01 — eliminación segura

Audita y elimina en un solo lote:

```txt
media queries vacías
root font duplicado
keyframes sin consumidores
comentarios obsoletos
reglas exactas duplicadas
```

Buscar:

```bash
rg -n "rs-slide-in|rs-panel-switch|rs-stagger-in|schema-drag-preview-enter|schema-drop-commit-flash-enter|toolbar-reveal" src tests tailwind.config.js
```

No ejecutes build por cada keyframe.

### BATCH-02 — root y shell

Archivos máximos:

```txt
Root.tsx
Designer/index.tsx
Preview.tsx
PdfmeLabPage.jsx
RegisteredUsersSelector.tsx
```

Migrar:

```txt
page
header
grid
workspace
designer root/background/workspace/stage skin
lab-runtime-host
```

No tocar paper geometry.

### BATCH-03 — LeftSidebar

Archivos:

```txt
LeftSidebar.tsx
LeftSidebarTabs.tsx
LeftSidebarSearch.tsx
LeftSidebarGroup.tsx
CatalogLayoutToggle.tsx
```

Restaurar:

```txt
neutral state
hover
focus
drag
selected
densidad
scroll
layout list/tiles/icons
```

No pintar todos los schemas con borde azul.

### BATCH-04 — RightSidebar

Archivos:

```txt
RightSidebar.tsx
layout.tsx
SidebarRail.tsx
SidebarCollapseHandle.tsx
SidebarSurfacePrimitives.tsx
```

Migrar root surface y responsive local.

Mantener como CSS técnico plano:

```txt
stage[data-sidebar-open] canvas padding-right
stage[data-sidebar-open] control-bar right
compact variant cross-tree offsets
```

### BATCH-05 — Canvas/Preview/Paper

Separar fuentes de verdad:

```txt
Canvas.tsx → visual del canvas
Preview.tsx → visual del preview
Paper.tsx → nodos paper
CSS plano → geometry/scale/grid/third-party
```

Resolver duplicaciones de:

```txt
designer-canvas
data-grid-visible
data-paper-page
data-canvas-page
```

No cambiar coordenadas.

### BATCH-06 — interacción técnica

Convertir `@apply` a CSS plano en:

```txt
dragging
drop-valid
Moveable visibility
selection toolbar visibility
inline edit visibility
mask visibility
option group actions
plugin drag state
```

No duplicar estado React para evitar CSS.

### BATCH-07 — QA final

Ejecutar:

```bash
npm run build
npx playwright test
```

Validar manualmente:

```txt
usuario activo
global view
LeftSidebar
list/detail/docs/comments
connection modal
comment modal
reassign modal
drag/drop
selection
page 2+
zoom
ResultsPanel
Form/Viewer
```

## Ritmo de validación

Durante batch:

```bash
npx tsc --noEmit
```

Al cerrar batch:

```bash
npm run build
```

Playwright una vez por dominio.

Prohibido repetir:

```txt
1 selector → build → Playwright → ledger
```

Mínimo por batch:

```txt
10–25 reglas relacionadas
o
3–5 componentes
```

## Áreas protegidas

No modificar salvo regresión demostrada:

```txt
Moveable.tsx
Selecto.tsx
coordinateMath.ts
designerCoordinateService.ts
snapshot
generator
pdf-lib
zoom math
document routing
schema persistence
```

## `preflight: false`

En JSX/TSX:

```txt
usar border-solid cuando se define borde;
usar appearance-none en botones/selects que lo requieran;
no agregar reset global;
no habilitar preflight.
```

## Criterios de cierre

```txt
[ ] sisad-pdfme.css tiene 0 @apply.
[ ] tokens.css tiene 0 @apply.
[ ] CSS residual es plano y técnico.
[ ] no hay keyframes huérfanos.
[ ] no hay media queries vacías.
[ ] no hay duplicación canvas/preview/paper.
[ ] selector de usuario visible.
[ ] baseline visual comparable.
[ ] build pasa.
[ ] suite pasa.
```

## Formato de salida

```md
# Batch cerrado

## Métricas
- líneas antes/después
- @apply antes/después

## Migrado a TSX
- ...

## Convertido a CSS técnico plano
- ...

## Eliminado
- ...

## Validación
- typecheck
- build
- Playwright
- capturas

## Siguiente batch
- ...
```

No declares que la migración terminó solo porque bajaron las líneas. Termina cuando `@apply = 0`, el residual técnico está documentado y el baseline funcional/visual pasa.
