# TASK-CSS-025 — Migrar @apply de context-summary y guides desde CSS a JSX

- Estado: completed
- Fecha: 2026-07-15
- Responsable: Claude
- Área: `sisad-pdfme` / continuidad Tailwind (reducción de @apply en hoja CSS)

## Objetivo

Continuar la reducción de Tailwind dentro de `src/sisad-pdfme/ui/styles/sisad-pdfme.css`
llevando el skin de element-selector (las clases que se forman concatenando
`DESIGNER_CLASSNAME` + sufijo) a su JSX/TSX dueño, dejando en CSS solo lo que el
componente no puede expresar como className estático.

## Componentes migrados (no contendidos por el trabajo paralelo)

### DesignerContextSummary.tsx
- Eliminadas del CSS las reglas element de `.context-summary`, `-top`, `-meta`,
  `-title`, `-chip`, `-status-dot`, `.meta.is-inline`, las variantes
  `[data-placement="sidebar"]`/`[data-density="compact"]` y su padding agrupado.
- El JSX ya tenía Tailwind inline en cada nodo (redundante y en conflicto por
  orden de carga); ahora es la fuente ÚNICA. Se añadieron `chipClass`/`titleClass`
  (DRY) que absorben las variantes density/placement.
- Nota: el componente está actualmente SIN montar en el repo (0 usos), así que la
  migración no tiene impacto visual, pero queda autocontenido y correcto.

### Guides.tsx (reglas/esquina de guías)
- Eliminadas del CSS `.guides-corner`, `.guides-ruler`, `-horizontal`, `-vertical`
  (bg, borde, overflow, pointer-events) → migradas al className del JSX.
- Permanecen en CSS solo las reglas descendientes `.guides-ruler .scena-guides-*`
  que estilizan elementos generados por `@scena/react-guides` (el JSX no los
  produce y no puede darles className).

## Hallazgo importante (preflight desactivado)

`tailwind.config.js` tiene `corePlugins.preflight: false`. Por eso las utilidades
de lado (`border-b`/`border-r`) fijan el ANCHO pero no el `border-style`, y el
borde se colapsa a 0 (used width = 0 cuando style = none). El shorthand CSS previo
(`[border-bottom:1px_solid_...]`) incluía el estilo. **Regla para futuros pases:**
al migrar `[border-X:1px solid var]` usar `border-X border-solid` (no solo
`border-X`). La utilidad `border` de todos los lados sí rinde solid en este repo.

## Resultado

- `@apply` en `sisad-pdfme.css`: 588 → 574 (−14 reglas).
- Verificación en vivo: reglas claras con `1px solid` (corner border-right 1px,
  ruler border-bottom 1px), `pointer-events-none`, overflow hidden; números
  legibles. Captura confirma paridad con el diseño previo.
- `npm run build` → dist OK; `eslint` → 0; canvas specs en verde
  (`canvas-overflow-regression`, `canvas-interactions` incl. guides/padding).

## Pendiente (multi-pasada, coordinar con REGRESSION-021)

El grueso de los 574 `@apply` restantes es geometría de canvas/stage (prohibida)
o DetailView/RightSidebar (zona activa de Copilot). Migrar por componente en
slices no contendidos, aplicando la regla `border-solid`.

### ErrorScreen.tsx (pase 2)
- Migrado el layout+skin de `.error-screen` (grid centering, w/h full) y
  `.error-screen-body` (width/max-width) al className del JSX; eliminadas del CSS
  esas reglas element y las dos de padding en conflicto
  (`p-[0.7rem]` agrupado + `p-[0.9rem]`). `border` (todos los lados) rinde solid
  sin `border-solid`. `@apply`: 574 → 571.

## Muro de contención alcanzado (2026-07-15)

Tras context-summary + guides + error-screen (588 → 571), el resto del skin de
element migrable vive en componentes que los otros agentes están reescribiendo
AHORA (git status: LeftSidebar*, PluginIcon, CatalogLayoutToggle, DetailView/*,
RightSidebar*, ListView* — todos dirty) o es geometría de canvas/stage
(prohibida). Continuar migrando esos bloques colisionaría con el trabajo
paralelo. **Siguiente pase: esperar a que los agentes hagan commit/land y
retomar por componente, aplicando la regla `border-solid`.**

### SelectionContextToolbar.tsx (pase 3) — mayor reducción
- El componente fue reescrito a una estructura mínima con Tailwind inline; el
  bloque CSS `.selection-context-toolbar*` (≈46 reglas) estaba MUERTO o
  redundante: estilizaba hijos que ya no se renderizan (`-summary/-chip/-section/
  -state/-action-*/-toggle`) y variantes `[data-toolbar-mode]`/`[data-toolbar-density]`
  que el componente ya no fija; las reglas `.toolbar button` sobre-especificaban
  el skin inline del JSX.
- Migrado al className del JSX solo lo que la base aportaba y el JSX necesitaba:
  `absolute` (posicionamiento del overlay con top/left), `pointer-events-auto` y
  la animación de reveal. Eliminado todo el bloque; se conservó la regla mixta
  `.stage[data-schema-dragging] .toolbar, .moveable-control-box, .inline-edit-overlay`
  (hide-during-drag compartida por 3 overlays).
- 2º matiz de `border-solid`: los `<button>` traen `border-style: outset` del UA
  (preflight off) → `border` da un borde biselado; se añadió `border-solid` a los
  botones del toolbar. (Los `<div>` por defecto son `border-style: none`.)
- `@apply`: 571 → 525. Verificado en vivo: toolbar posicionado (absolute),
  botones `1px solid` limpios (captura), canvas-interactions/overflow en verde.

## Acumulado de la migración (sesión): @apply 588 → 525 (−63)

Componentes con skin migrado a JSX y CSS reducido: context-summary, guides,
error-screen, selection-context-toolbar. El resto sigue bloqueado por
contención (DetailView/sidebars/ListView los reescribe Copilot) o es geometría.

### Pase 4 — eliminación de reglas MUERTAS (riesgo cero)
- Detección: para cada clase, grep de las TRES formas de construcción
  (`+ 'suf'`, template `${...}suf`, literal completo). Se descartan falsos
  positivos del detector ingenuo (p. ej. `stage` es LIVE vía template literal).
- Eliminadas reglas cuyas clases no renderiza ningún .tsx (verificado 0 refs):
  `.ui-context-menu`, `.list-view-empty` (+ `-title`,`-hint`), `.list-view-title`,
  `.list-view-counter`, `.list-view-subtitle`. Sin cambio de JSX ni impacto
  visual (nada las monta). `@apply`: ~523 → 514; llaves balanceadas; build OK.
- Omitidos por contención/DetailView: `inspector-summary-card*`,
  `detail-header-card*` (Copilot los reescribe); no tocados aunque parezcan
  muertos, para no clobbear su trabajo sobre el mismo archivo.

## Nota de método para próximos pases
El CSS lo edita Copilot en paralelo (el conteo de @apply baja solo). Editar el
mismo archivo concurrentemente arriesga clobber. Estrategias seguras: (1) migrar
componentes cuyo .tsx NO esté dirty; (2) borrar reglas MUERTAS verificadas con
las 3 formas de grep. El bulk-delete automático por detector ingenuo NO es
seguro (falsos positivos rompen estilos vivos).
