# PROMPT MAESTRO — Migración acelerada de Tailwind desde CSS hacia JSX/TSX en SISAD PDFME

## Rol

Actúa como arquitecto frontend senior especializado en React, TypeScript, Tailwind CSS 3, Vite, Ant Design, dnd-kit, Moveable, Selecto y pruebas visuales con Playwright.

Trabaja directamente en:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin
```

Ruta visual principal:

```txt
http://localhost:5174/lab/multi-document-routing
```

## Estado real del proyecto que debes respetar

El proyecto ya avanzó considerablemente en la migración:

```txt
src/features/pdfcomponent/labRoutes.css
- se encuentra prácticamente neutralizado;
- el inventario más reciente reporta aproximadamente 5 líneas;
- no debe reabrirse como una migración grande sin medir primero su contenido actual.

src/sisad-pdfme/ui/styles/sisad-pdfme.css
- sigue siendo la principal hoja residual;
- el inventario más reciente reporta aproximadamente 2484 líneas;
- contiene mezcla de skin visual, integración con Ant Design, estados, pseudo-elementos y CSS técnico.

src/sisad-pdfme/ui/styles/tokens.css
- el inventario más reciente reporta aproximadamente 323 líneas;
- debe conservar tokens globales realmente compartidos;
- no debe vaciarse por obligación.

src/styles/sisad-tailwind-bridge.css
- se encuentra vacío.

src/style.css
- está neutralizado para evitar doble emisión de Tailwind.

src/styles/tailwind.css
- es la fuente única de:
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
```

Las tareas CSS anteriores `TASK-CSS-012` a `TASK-CSS-019` figuran como completadas. No debes reabrirlas ni repetir sus análisis. La tarea activa más reciente es `TASK-REGRESSION-021-shell-token-visual-recovery`, y existen pendientes específicos de LeftSidebar y poda CSS. Usa lo completado como guardrail y continúa desde el estado actual.

## Objetivo

Migrar a JSX/TSX toda utilidad Tailwind y todo skin visual que todavía pueda vivir correctamente en el nodo React propietario, reduciendo `@apply` y selectores visuales duplicados sin romper:

```txt
canvas
páginas
scroll
zoom
drag and drop
Moveable
Selecto
selección
multi-selección
colaboración
owner color
assignments
Form
Viewer
snapshot
generator
pdf-lib
Ant Design portals
impresión
```

La meta no es dejar cero CSS a cualquier costo.

La meta correcta es:

```txt
JSX/TSX:
- layout de componentes;
- skin;
- densidad;
- estados visuales locales;
- hover/focus/selected/disabled;
- responsive local;
- badges, cards, toolbar y sidebars.

CSS:
- tokens globales;
- geometría;
- integración de terceros;
- portales;
- pseudo-elementos técnicos;
- keyframes;
- print;
- Moveable/Selecto;
- estados globales imposibles de expresar limpiamente en el nodo.
```

## Arquitectura IA obligatoria

Lee una sola vez:

```txt
PROMPT_ARRANQUE_CODEX.md
ai/start/START.md
ai/router/ROUTER.md
ai/router/CONTEXT_BUDGET.md
ai/rules/css-migration-rules.md
ai/context/css-tailwind-context.md
ai/playbooks/pb-css-tailwind-migration.md
ai/memory/known-risks.md
ai/task-cards/active/TASK-REGRESSION-021-shell-token-visual-recovery.md
ai/task-cards/completed/completed-summary.md
```

No cargues de forma masiva:

```txt
ai/task-cards/completed/TASK-*.md
reports completos
backups
dist
test-results
candidates completos
```

Respeta el presupuesto vigente por subpase:

```txt
máximo 2 búsquedas globales;
máximo 8 archivos abiertos;
máximo 5 archivos modificados;
una sola task-card activa;
no tocar geometría protegida sin task-card explícita.
```

### Cómo acelerar sin violar el presupuesto

Trabaja en **paquetes funcionales**.

Cada paquete puede contener entre 2 y 4 subpases. Cada subpase respeta el límite de 5 archivos modificados, pero:

```txt
- no ejecutes build completo después de cada archivo;
- no ejecutes Playwright después de cada subpase;
- no actualices memoria después de cada microcambio;
- valida el paquete completo una sola vez al final;
- actualiza task-card y ledger una sola vez al cerrar el paquete.
```

## Contrato de `src/sisad-pdfme/ui/constants.ts`

Debes analizar todos los consumidores de:

```ts
SELECTABLE_CLASSNAME
RULER_HEIGHT
PAGE_GAP
LEFT_SIDEBAR_WIDTH
RIGHT_SIDEBAR_WIDTH
BACKGROUND_COLOR
DEFAULT_MAX_ZOOM
DESIGNER_CLASSNAME
UI_CLASSNAME
```

No trates todas estas constantes como clases CSS:

```txt
DESIGNER_CLASSNAME y UI_CLASSNAME:
- generan hooks semánticos;
- se concatenan con sufijos;
- deben conservarse.

SELECTABLE_CLASSNAME:
- forma parte de selección/interacción;
- no eliminar ni renombrar sin auditoría explícita.

RULER_HEIGHT, PAGE_GAP, LEFT_SIDEBAR_WIDTH, RIGHT_SIDEBAR_WIDTH:
- son dimensiones runtime;
- no convertir ciegamente a utilidades Tailwind;
- conservar si participan en cálculos JS, geometría o layout coordinado.

BACKGROUND_COLOR:
- es un token runtime;
- conservar su semántica.

DEFAULT_MAX_ZOOM:
- es lógica;
- no pertenece a esta migración visual.
```

Patrón obligatorio:

```tsx
className={mergeClassNames(
  DESIGNER_CLASSNAME + 'list-view-item',
  'relative flex min-w-0 items-center rounded-lg border border-slate-200 bg-white',
)}
```

No reemplazarlo por:

```tsx
className="relative flex min-w-0 items-center rounded-lg border border-slate-200 bg-white"
```

Los nombres semánticos pueden ser usados por:

```txt
CSS técnico residual
tests
plugins
hosts externos
querySelector
data collection
depuración
compatibilidad
```

## Fase 0 — Línea base

Ejecuta:

```bash
cd /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin

git status --short
git rev-parse --abbrev-ref HEAD

mkdir -p reports/tailwind-migration/accelerated
```

Mide el estado real, sin confiar solo en cifras históricas:

```bash
wc -l \
  src/sisad-pdfme/ui/styles/sisad-pdfme.css \
  src/features/pdfcomponent/labRoutes.css \
  src/sisad-pdfme/ui/styles/tokens.css \
  > reports/tailwind-migration/accelerated/css-lines-before.txt

rg -n "@apply" \
  src/sisad-pdfme/ui/styles/sisad-pdfme.css \
  src/features/pdfcomponent/labRoutes.css \
  src/sisad-pdfme/ui/styles/tokens.css \
  > reports/tailwind-migration/accelerated/apply-before.txt

node scripts/css-inventory.mjs
node scripts/css-selector-duplicates.mjs
node scripts/css-active-selector-audit.mjs
```

No ejecutes automáticamente `migrate-design-to-tailwind.mjs` hasta leer su contrato y confirmar que no sobrescribe archivos. Úsalo solo si ofrece un modo de reporte o dry-run seguro.

## Fase 1 — Crear el mapa de migración

Genera:

```txt
reports/tailwind-migration/accelerated/migration-map.csv
reports/tailwind-migration/accelerated/migration-ledger.md
```

Columnas del CSV:

```txt
package
subpass
selector
css_file
line
semantic_suffix
consumer_file
constant_prefix
classification
action
risk
validation
status
```

Busca consumidores por sufijo:

```bash
rg -n "list-view-item" src/sisad-pdfme/ui
rg -n "detail-section-card" src/sisad-pdfme/ui
rg -n "left-sidebar" src/sisad-pdfme/ui
```

No dependas únicamente de la cadena completa porque muchas clases se forman mediante:

```ts
DESIGNER_CLASSNAME + '...'
UI_CLASSNAME + '...'
```

## Clasificación obligatoria

### MIGRATE_TO_TSX

Migrar al componente propietario:

```txt
display
flex/grid
gap
padding/margin
min/max size visual
border visual
radius
background
text
font
shadow
truncate
hover
focus
selected
disabled
responsive local
overflow de panel normal
data-state simple
```

### KEEP_AS_TOKEN

Mantener en `tokens.css`:

```txt
custom properties globales
paleta compartida
owner/recipient colors
z-index contractuales
tipografía global
dimensiones compartidas por varios componentes
variables consumidas por JS
```

### KEEP_AS_TECHNICAL_CSS

Mantener en CSS:

```txt
Moveable
Selecto
paper/page geometry
zoom y transforms
@keyframes
@media print
Ant Design descendant selectors
portals
pseudo-elementos técnicos
drag/drop global
pointer-events coordinados
selectores que dependen de varios ancestros
```

### DELETE_AS_ORPHAN

Eliminar solo si demuestras que:

```txt
no existe consumidor;
no se forma mediante constante;
no aparece en tests;
no lo usa un plugin;
no lo usa un host;
no es selector de portal;
no es contrato técnico.
```

## Paquetes de ejecución

### PACKAGE-01 — Cierre del RightSidebar residual

No repitas componentes ya migrados sin evidencia de CSS residual.

Audita y completa:

```txt
RightSidebar/ListView
RightSidebar/DetailView
DocumentsRail
CommentsRail
SidebarSurfacePrimitives
layout.tsx
RightSidebar.tsx
```

Objetivos:

```txt
eliminar cards anidadas;
eliminar borde negro;
reducir sombras;
unificar densidades;
conservar scroll interno;
conservar acciones;
eliminar selectores visuales ya duplicados en TSX.
```

### PACKAGE-02 — LeftSidebar y catálogo

Integra pendientes equivalentes a:

```txt
TASK-CSS-021-left-sidebar-overflow-tailwind-continuity
TASK-CSS-022-left-sidebar-css-pruning
```

Audita:

```txt
LeftSidebar.tsx
LeftSidebarGroup.tsx
LeftSidebarSearch.tsx
LeftSidebarTabs.tsx
LeftSidebarCustomPanel.tsx
CatalogLayoutToggle.tsx
useLeftSidebarCatalogState.ts
```

No mezclar:

```txt
layout elegido por usuario
densidad responsive
ancho real del panel
```

### PACKAGE-03 — Toolbar, shell y navegación

Audita:

```txt
CtlBar.tsx
Designer/index.tsx
UnitPager.tsx
SidebarRail.tsx
SidebarCollapseHandle.tsx
```

Conserva cálculos basados en:

```txt
RULER_HEIGHT
PAGE_GAP
LEFT_SIDEBAR_WIDTH
RIGHT_SIDEBAR_WIDTH
```

### PACKAGE-04 — Lab host

El inventario reciente indica que `labRoutes.css` está prácticamente vacío. Por ello:

```txt
1. mide;
2. verifica si contiene solo comentarios/import residual;
3. no inventes una migración grande;
4. migra cualquier regla visual restante al componente correspondiente;
5. elimina el import solo si el archivo queda realmente vacío y la build pasa.
```

Audita:

```txt
PdfmeLabPage.jsx
PageHeader.jsx
ResultsPanel.jsx
CompactControls.jsx
PopoverMenu.jsx
CaseCard.jsx
LabLandingPage.jsx
```

### PACKAGE-05 — Form y Viewer

Audita skin visual en:

```txt
Form.tsx
Viewer.tsx
Preview.tsx
RuntimeFormPanel.tsx
Root.tsx
ErrorScreen.tsx
Spinner.tsx
UnitPager.tsx
```

No modificar contratos de inputs, valores, recipient filtering ni generación.

### PACKAGE-06 — Poda final de `sisad-pdfme.css`

Después de migrar componentes:

```txt
- elimina duplicados;
- elimina selectores huérfanos demostrados;
- conserva secciones técnicas claramente comentadas;
- no persigas cero líneas;
- persigue cero skin visual trasladable.
```

Ordena el residual por secciones:

```txt
1. Ant Design integration
2. Canvas/Paper geometry
3. Moveable/Selecto
4. Drag/selection technical states
5. Print
6. Keyframes
7. Runtime cross-component contracts
```

### PACKAGE-07 — Auditoría de `tokens.css`

Clasifica cada token:

```txt
ACTIVE_SHARED
ACTIVE_RUNTIME
ALIAS_REQUIRED
DEPRECATED_WITH_CONSUMERS
ORPHAN
```

Solo elimina `ORPHAN`.

No reemplaces colores dinámicos por utilidades Tailwind estáticas cuando dependen de:

```txt
owner
recipient
theme
runtime config
host config
CSS variables
```

## Reglas de diseño

Puedes corregir durante la migración:

```txt
doble superficie
cards demasiado grandes
bordes oscuros
radios excesivos
sombras permanentes
acciones que cambian el ancho
iconos recortados
headers duplicados
badges en demasiadas líneas
scroll bloqueado
densidad inconsistente
```

No rediseñes completamente el flujo ni cambies comportamiento de negocio.

## Reglas de interacción

No cambies accidentalmente:

```txt
onClick
onPointerDown
onMouseDown
onDoubleClick
listeners de dnd-kit
attributes
data-testid
aria-label
tabIndex
focus management
propagation guards
```

Cuando migres un botón o acción:

```txt
- conserva type="button";
- conserva stopPropagation si existe;
- conserva preventDefault si existe;
- conserva disabled;
- conserva test id;
- conserva tooltip;
- conserva permiso.
```

## Estilos inline

No uses `style` para propiedades estáticas.

`style` se permite para:

```txt
transform de dnd
coordenadas
zoom
rotation
owner color
type color
CSS variables dinámicas
dimensiones calculadas
```

## Ant Design

No borres selectores de:

```txt
.ant-collapse-*
.ant-select-*
.ant-input-*
.ant-input-number-*
.ant-modal-*
.ant-tooltip-*
.ant-dropdown-*
```

hasta demostrar que el componente puede controlarse de forma estable mediante props/className y sin `!important`.

No agregues `!important`.

## Áreas protegidas

No modificar durante esta tarea:

```txt
Moveable.tsx
Selecto.tsx
coordinateMath.ts
designerCoordinateService.ts
Paper.tsx, salvo skin externo demostrado
snapshotAdapter
generator
pdf-lib
schema persistence
document routing
zoom math
```

## Validación acelerada

### Por subpase

Ejecuta solo:

```bash
npx tsc --noEmit
```

o la verificación rápida equivalente.

### Al cerrar cada paquete

Ejecuta:

```bash
npm run build
```

y únicamente las pruebas del dominio.

RightSidebar:

```bash
npx playwright test \
  tests/playwright/right-sidebar-visual-polish.spec.ts \
  tests/playwright/right-sidebar-docs-tab.spec.ts
```

Lab:

```bash
npx playwright test \
  tests/playwright/multi-document-routing-design.spec.ts \
  tests/playwright/lab-designer-visual-baseline-regression.spec.ts
```

Antes de Playwright:

```bash
curl -I http://localhost:5174/lab/multi-document-routing
```

Si el servidor está caído, reinícialo una sola vez:

```bash
npm run dev -- --host 0.0.0.0
```

No diagnostiques una regresión de código cuando el fallo es conexión rechazada.

### Suite amplia

Ejecuta la suite amplia únicamente después de:

```txt
PACKAGE-03
PACKAGE-05
PACKAGE-07
```

## Métricas por paquete

Registra:

```txt
archivos abiertos
archivos modificados
selectores evaluados
selectores migrados
selectores eliminados
selectores conservados
@apply antes/después
líneas CSS antes/después
tests ejecutados
regresiones encontradas
residuales justificados
```

## Criterios de cierre

### `labRoutes.css`

```txt
- cero @apply;
- archivo eliminado o residual mínimo justificado;
- no reintroducir skin del core.
```

### `sisad-pdfme.css`

```txt
- cero skin visual trasladable;
- solo CSS técnico, integración externa y contratos globales;
- cada bloque residual documentado.
```

### `tokens.css`

```txt
- solo tokens activos;
- sin duplicados;
- sin aliases huérfanos;
- variables runtime conservadas.
```

### Componentes

```txt
- conservan DESIGNER_CLASSNAME/UI_CLASSNAME;
- Tailwind vive en el nodo propietario;
- no hay wrappers nuevos solo para estilizar;
- no hay clases conflictivas;
- comportamiento intacto.
```

## Formato de entrega por paquete

No narres cada microedición.

Al cerrar un paquete responde:

```txt
PACKAGE cerrado: <nombre>

Archivos modificados:
- ...

Migración:
- selectores evaluados:
- migrados:
- eliminados:
- conservados:

Métricas:
- @apply antes/después:
- líneas CSS antes/después:

Validación:
- typecheck:
- build:
- Playwright:

Residual:
- ...

Siguiente paquete:
- ...
```

Continúa con el siguiente paquete automáticamente mientras no exista una regresión funcional, una ambigüedad arquitectónica o un selector técnico de alto riesgo.
