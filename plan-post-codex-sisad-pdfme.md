# Plan post-Codex — SISAD PDFME Designer

**Fecha:** 2026-07-12
**Proyecto:** `~/Documents/Taylor/frontend/prueba-plugin`
**Ruta de validación principal:** `http://localhost:5174/lab/multi-document-routing`
**Objetivo:** consolidar lo que Codex ya implementó y continuar con una hoja de ruta ordenada para mejorar sidebars, inspector, catálogo, propagación de color, comportamiento por schema, densidad visual y pruebas Playwright, sin tocar canvas, geometría ni generación PDF.

---

## 0. Resumen ejecutivo

Codex ya realizó una tercera pasada enfocada en **owner color** y **collapse parity** entre sidebars. Esa pasada dejó una base importante:

- Se creó `SidebarCollapseHandle` como componente compartido.
- `LeftSidebar` ya usa el handle compartido.
- `RightSidebar` ya no desaparece al colapsar; ahora conserva un rail compacto.
- Se reforzó la propagación de `ownerColor`, `userColor`, `recipientColor` y `__designer.*`.
- `PluginIcon` normaliza `stroke/fill` hacia `currentColor` para que el color activo no quede bloqueado por SVGs fijos.
- Se corrigieron labels de ayuda del inspector a `Ayuda del campo`.
- Se agregaron pruebas Playwright para paridad de collapse.
- Build, lint y specs críticas quedaron en verde.

La siguiente fase no debe repetir lo mismo. Debe enfocarse en:

1. Validar que lo hecho por Codex no introduzca regresiones visuales o semánticas.
2. Separar definitivamente `CatalogLayout` de `SidebarDensity`.
3. Compactar realmente el LeftSidebar sin romper `drag`, favoritos, recientes ni modos.
4. Normalizar el RightSidebar como inspector profesional por tipo de schema.
5. Corregir editor de opciones para `select`, `radioGroup` y `checkboxGroup`.
6. Eliminar acciones duplicadas y secciones vacías.
7. Garantizar que todo schema muestre solo funcionalidades proporcionales a su tipo.
8. Fortalecer Playwright por caso de uso real.

---

## 1. Estado actual detectado en la pasada de Codex

### 1.1 Cambios realizados por Codex

#### Owner color / schema tone

Archivos tocados:

```txt
src/sisad-pdfme/collaboration/schemaOwnershipAppearance.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaTone.ts
src/sisad-pdfme/schemas/shared/fieldChrome.ts
src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx
```

Cambios principales:

- `schemaOwnershipAppearance.ts` amplió las fuentes de color:

```txt
schema.ownerColor
schema.userColor
schema.recipientColor
schema.__designer.collaboration.recipientColor
schema.__designer.ownerColor
schema.__designer.recipientColor
fallback.actorColor
recipient.color
```

- `schemaTone.ts` ahora revisa más fuentes antes de caer en `borderColor`, `strokeColor` o `color`.
- `fieldChrome.ts` agregó `resolveSchemaOwnerStyleVars` para estandarizar variables CSS.
- `PluginIcon.tsx` normaliza SVGs del catálogo para que `stroke` y `fill` usen `currentColor`, salvo `none`, `transparent`, `url(...)` o `currentColor`.

#### Collapse parity

Archivos tocados:

```txt
src/sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle.tsx
src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
src/sisad-pdfme/ui/components/Designer/index.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
src/sisad-pdfme/ui/styles/sisad-pdfme-global.css
```

Cambios principales:

- Se creó `SidebarCollapseHandle` con props:

```ts
type SidebarCollapseHandleProps = {
  side: 'left' | 'right';
  expanded: boolean;
  presentation: 'docked' | 'overlay';
  density?: 'full' | 'comfortable' | 'compact' | 'mini';
  labelExpanded: string;
  labelCollapsed: string;
  onToggle: () => void;
  className?: string;
};
```

- `LeftSidebar` reemplazó su botón propio por `SidebarCollapseHandle`.
- `Designer/index.tsx` reemplazó el toggle derecho por `SidebarCollapseHandle`.
- `RightSidebar` introdujo:

```txt
data-sidebar-collapsed
data-right-sidebar-expanded
right-sidebar-collapsed-rail
right-sidebar-collapsed-rail-btn
```

- El CSS del botón izquierdo dejó de usar offset negativo:

```css
right: 0.5rem;
top: 0.875rem;
```

#### Inspector labels

Archivos tocados:

```txt
src/sisad-pdfme/schemas/propPanel/commonInspectorFields.ts
src/sisad-pdfme/schemas/signature/propPanel.ts
```

Cambio:

```txt
Texto de ayuda / Texto de ayuda (tooltip) → Ayuda del campo
```

#### Tests agregados o ejecutados

Archivo agregado:

```txt
tests/e2e/sidebar-collapse-parity.spec.ts
```

Specs ejecutadas:

```bash
npm run build
npm run lint
npx playwright test tests/e2e/schema-owner-color.spec.ts tests/e2e/left-sidebar-view-modes.spec.ts tests/e2e/schema-options-editor.spec.ts tests/e2e/schema-lock-state-consistency.spec.ts tests/e2e/sidebar-collapse-parity.spec.ts --project=chromium
npx playwright test tests/e2e/inspector-detailview-profiles.spec.ts --project=chromium
```

Resultado reportado:

```txt
build OK
lint OK
7 passed
3 passed
```

---

## 2. Restricciones que deben mantenerse

### 2.1 Archivos que NO deben tocarse en esta hoja de ruta

Esta línea de trabajo no debe modificar:

```txt
src/sisad-pdfme/ui/components/Designer/Canvas/**
src/sisad-pdfme/ui/components/Paper.tsx
src/sisad-pdfme/ui/components/Renderer.tsx salvo validación de variables ya existentes
src/sisad-pdfme/ui/components/Moveable*.tsx
src/sisad-pdfme/ui/components/Selecto*.tsx
src/sisad-pdfme/pdf-lib/**
src/sisad-pdfme/generator/**
src/sisad-pdfme/**/SnapshotAdapter*
```

### 2.2 Temas fuera de alcance

No mezclar esta hoja de ruta con:

```txt
- drag/drop profundo;
- coordenadas;
- zoom;
- no-overlap;
- generator/pdf-lib;
- externalForms;
- Uanataca/OneShot;
- StepOne;
- lógica de negocio de SISAD Web;
- refactor general del repository.
```

### 2.3 Regla de implementación

Cada fase debe cerrar con:

```bash
npm run build
npm run lint
npx playwright test <spec-relacionado> --project=chromium
```

Si una fase requiere tocar más de 6 archivos productivos, detenerse y dividirla en otra task-card.

---

## 3. Problemas residuales después de Codex

### 3.1 El worktree tiene cambios previos no controlados

Codex reportó:

```txt
D SEPARATION-CONTRACT.md
D plan-tailwind-completo-actualizado-sisad-pdfme.md
?? tests/e2e/sidebar-drag-scroll-guard.spec.ts
?? unificados/
```

Acción obligatoria:

```bash
git status --short
git diff --stat
git diff --name-only
```

Antes de continuar, clasificar cambios:

| Estado                  | Acción                           |
| ----------------------- | --------------------------------- |
| Cambios de esta fase    | mantener                          |
| Cambios previos útiles | mover a commit separado           |
| Cambios accidentales    | revertir                          |
| Archivos`unificados/` | revisar si son generados o basura |
| Docs eliminados         | confirmar si deben restaurarse    |

### 3.2 `SidebarCollapseHandle` todavía usa `title` nativo

Codex creó un componente compartido, pero mantiene:

```tsx
title={label}
```

Esto contradice el diagnóstico previo: los tooltips nativos negros cubren la UI y no son controlables.

Acción:

- Reemplazar `title` por `Tooltip` controlado o prop opcional.
- Si se decide mantener `title` por accesibilidad mínima, no usarlo en iconos que ya tengan tooltip visual.
- Mantener `aria-label` siempre.

### 3.3 El rail derecho funciona pero no está completamente alineado visualmente con el izquierdo

Codex dejó un rail compacto funcional, pero el mismo reporte indica que todavía falta afinar densidad y miniatura de tabs.

Acción:

- Sustituir el placeholder `RS` por icono contextual.
- Alinear tamaño, borde, radio, hover y active state con rail izquierdo.
- Evitar que el rail derecho parezca un componente distinto.

### 3.4 `CatalogLayout` y `SidebarDensity` siguen siendo conceptos mezclados

Aún debe resolverse el problema principal del LeftSidebar:

```ts
type CatalogLayout = 'list' | 'tiles' | 'icons';
type SidebarDensity = 'comfortable' | 'compact' | 'narrow';
```

La vista es elección del usuario. La densidad es respuesta al ancho. No se deben convertir mutuamente.

### 3.5 El selector de vista sigue siendo ambiguo

El ciclo `rich → compact → mini → rich` debe reemplazarse por control segmentado o menú explícito.

### 3.6 El catálogo mantiene superficies anidadas

Debe revisarse:

```txt
left-sidebar-plugin-wrap
Button
PluginIcon container
favorite button
```

La meta es una sola superficie interactiva por item.

### 3.7 Riesgo en `PluginIcon` al normalizar SVGs

La normalización de `stroke/fill` a `currentColor` es útil para owner color, pero debe validarse que no rompa iconos semánticos o multicolor en catálogo.

Acciones:

- Agregar tests visuales o snapshots de iconos críticos.
- Confirmar que approve/decline mantienen su color semántico cuando aplica.
- Confirmar que el catálogo sí toma `activeRecipientColor`.

### 3.8 Inspector todavía requiere limpieza por perfil de schema

Debe verificarse que cada schema muestre solo secciones útiles.

Problemas a evitar:

```txt
- Options en schemas sin opciones.
- Formato en schemas no visuales.
- Técnico abierto por defecto.
- Secciones vacías.
- Switches que requieren doble click.
- Editor de opciones que crea otro schema accidentalmente.
- Labels artificiales: Caja, Comportamiento, Datos conectados, Avanzado.
```

---

## 4. Hoja de ruta por fases

## Fase 0 — Congelar estado y separar cambios previos

### Objetivo

Evitar que la siguiente pasada mezcle cambios de Codex con cambios previos del worktree.

### Comandos

```bash
git status --short
git diff --stat
git diff --name-only
git diff -- src/sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle.tsx
git diff -- src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
git diff -- src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
git diff -- src/sisad-pdfme/ui/components/Designer/index.tsx
git diff -- src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx
git diff -- src/sisad-pdfme/collaboration/schemaOwnershipAppearance.ts
git diff -- src/sisad-pdfme/schemas/shared/fieldChrome.ts
git diff -- src/sisad-pdfme/ui/components/Designer/shared/schemaTone.ts
```

### Acciones

1. Crear un branch limpio si no existe:

```bash
git checkout -b chore/sisad-pdfme-post-codex-plan
```

2. Separar commits:

```txt
commit 1: owner color resolvers + PluginIcon
commit 2: SidebarCollapseHandle + LeftSidebar/RightSidebar parity
commit 3: inspector labels + tests
commit 4: documentación/plan
```

3. No continuar si hay archivos eliminados sin explicación:

```txt
SEPARATION-CONTRACT.md
plan-tailwind-completo-actualizado-sisad-pdfme.md
```

### Criterio de aceptación

- `git status --short` entendido y documentado.
- No hay cambios accidentales mezclados con la siguiente fase.
- Existe una lista de archivos previos no tocados.

---

## Fase 1 — Validar y endurecer owner color

### Objetivo

Asegurar que todos los schemas consuman el mismo contrato de color del usuario/destinatario sin confundirlo con color semántico.

### Archivos a revisar

```txt
src/sisad-pdfme/collaboration/schemaOwnershipAppearance.ts
src/sisad-pdfme/ui/components/Designer/shared/schemaTone.ts
src/sisad-pdfme/schemas/shared/fieldChrome.ts
src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx
src/sisad-pdfme/ui/components/Renderer.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx
src/sisad-pdfme/schemas/**/index.ts
src/sisad-pdfme/schemas/actions/*.ts
src/sisad-pdfme/schemas/signature/*.ts
src/sisad-pdfme/schemas/options/*.ts
```

### Fuente de verdad

Usar un solo orden:

```txt
1. schema.ownerColor
2. schema.userColor
3. schema.recipientColor
4. schema.__designer?.collaboration?.recipientColor
5. schema.__designer?.ownerColor
6. schema.__designer?.recipientColor
7. fallback.actorColor / activeRecipientColor
8. recipient.color
9. #2563EB
```

### Acciones

1. Revisar si existen resolvers paralelos:

```bash
rg "ownerColor|userColor|recipientColor|__designer.*recipientColor|resolveSchemaOwner|schemaTone|schema-owner-color|--schema-owner-color" src/sisad-pdfme
```

2. Eliminar o redirigir helpers duplicados hacia el facade central.
3. Asegurar que `resolveSchemaOwnerStyleVars` retorne variables estables:

```ts
{
  '--schema-owner-color': tone,
  '--schema-tone': tone,
  '--schema-border-tone': tone,
  '--schema-text-tone': tone,
}
```

4. Validar por schema:

| Schema         | Owner color               | Semantic color     | Reglas                                |
| -------------- | ------------------------- | ------------------ | ------------------------------------- |
| text           | borde, fondo sutil, label | ninguno            | debe heredar owner tone               |
| number         | borde, fondo sutil, label | ninguno            | debe heredar owner tone               |
| select         | borde, chevron/focus      | ninguno            | no usar color fijo                    |
| checkbox       | borde/indicador           | check visual       | owner tone en contorno/chrome         |
| checkboxGroup  | root/borde/indicadores    | selección interna | opciones no son schemas               |
| radioGroup     | root/borde/indicadores    | punto seleccionado | opciones no son schemas               |
| signature      | borde/placeholder         | firma/provider     | no hardcodear provider                |
| initials       | borde/placeholder         | firma/provider     | mismo contrato que signature          |
| dateSigned     | borde/texto               | fecha automática  | readOnly                              |
| approve        | owner accent externo      | verde              | no reemplazar verde                   |
| decline        | owner accent externo      | rojo               | no reemplazar rojo                    |
| attachment     | owner accent/borde        | icono archivo      | reglas archivo aparte                 |
| note           | owner accent/borde        | color informativo  | no mezclar con comentario             |
| image/svg      | selección/borde          | contenido visual   | no recolorear imagen                  |
| barcode/qr     | selección/borde          | barras/código     | color del código es propiedad propia |
| table          | selección/borde          | estilo tabla       | owner solo chrome                     |
| rectangle/line | selección/borde          | forma visual       | color de forma separado               |

### Tests

Actualizar o crear:

```txt
tests/e2e/schema-owner-color.spec.ts
```

Casos mínimos:

```txt
- Usuario A crea text, checkbox, checkboxGroup, radioGroup, select, signature, initials, approve, decline, attachment, note.
- Cambiar a Usuario B.
- Los schemas existentes conservan color A.
- Schema nuevo usa color B.
- Canvas wrapper, ListView item y DetailHeader muestran el mismo owner color.
- approve/decline mantienen verde/rojo semántico, pero owner accent coincide.
```

Comandos:

```bash
npm run build
npm run lint
npx playwright test tests/e2e/schema-owner-color.spec.ts --project=chromium
```

---

## Fase 2 — Corregir `PluginIcon` con política segura de color

### Objetivo

Evitar que iconos del catálogo bloqueen el color del destinatario sin romper iconos semánticos o multicolor.

### Problema

Codex normalizó `stroke/fill` a `currentColor`. Es correcto para la mayoría del catálogo, pero puede ser peligroso para iconos que usan colores semánticos.

### Acciones

1. Crear una política explícita:

```ts
type PluginIconColorMode = 'owner' | 'semantic' | 'original';
```

2. Para catálogo de schemas estándar usar:

```txt
owner
```

3. Para iconos semánticos de acciones usar:

```txt
semantic
```

4. Para SVGs externos o imágenes usar:

```txt
original
```

5. Evitar normalización global sin perfil.

### Archivos candidatos

```txt
src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx
src/sisad-pdfme/schemas/schemaFamilies.ts
src/sisad-pdfme/schemas/**/index.ts
src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
```

### Tests

Agregar en `left-sidebar-view-modes.spec.ts`:

```txt
- iconos del catálogo cambian con activeRecipientColor.
- approve/decline conservan semántica cuando el schema lo requiere.
- SVG con fill="none" no se rompe.
- SVG con url(...) no se transforma.
```

---

## Fase 3 — Unificar definitivamente collapse de sidebars

### Objetivo

Completar lo iniciado por Codex: ambos laterales deben compartir comportamiento, diseño, accesibilidad y modo rail.

### Estado actual

Codex ya creó:

```txt
SidebarCollapseHandle
LeftSidebar usa handle
RightSidebar usa handle
RightSidebar colapsado muestra rail
```

### Pendientes

#### 3.1 Eliminar `title` nativo del handle

Archivo:

```txt
src/sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle.tsx
```

Cambiar:

```tsx
title={label}
```

Por una estrategia controlada:

```tsx
<Tooltip title={label} placement={side === 'left' ? 'right' : 'left'}>
  <button ... />
</Tooltip>
```

Si no se desea Ant Design aquí, crear:

```txt
SidebarTooltip
```

pero mantenerlo genérico.

#### 3.2 Normalizar rail izquierdo y derecho

Crear contrato:

```ts
type SidebarRailItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  badge?: number | string;
  onClick: () => void;
};
```

Crear componente compartido:

```txt
src/sisad-pdfme/ui/components/Designer/shared/SidebarRail.tsx
```

Usar para:

```txt
LeftSidebar collapsed rail
RightSidebar collapsed rail
```

#### 3.3 Reemplazar placeholder `RS`

El rail derecho no debe mostrar `RS`. Debe mostrar el modo activo:

```txt
Campos
Propiedades
Comentarios
Documentos
```

con iconos y tooltips.

#### 3.4 Alinear atributos

Ambos sidebars deben exponer:

```txt
data-sidebar-side="left|right"
data-sidebar-expanded="true|false"
data-sidebar-collapsed="true|false"
data-sidebar-density="comfortable|compact|narrow"
data-sidebar-presentation="docked|overlay"
aria-expanded="true|false"
```

### Archivos a modificar

```txt
src/sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle.tsx
src/sisad-pdfme/ui/components/Designer/shared/SidebarRail.tsx
src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
src/sisad-pdfme/ui/components/Designer/index.tsx
src/sisad-pdfme/ui/styles/sisad-pdfme-global.css
```

### Tests

Actualizar:

```txt
tests/e2e/sidebar-collapse-parity.spec.ts
```

Casos:

```txt
- LeftSidebar expandido muestra handle completo y no cortado.
- LeftSidebar colapsado muestra rail y handle.
- RightSidebar expandido muestra handle equivalente.
- RightSidebar colapsado muestra rail, no desaparece totalmente.
- Ambos tienen aria-expanded correcto.
- No existen tooltips nativos negros por title.
- No hay overflow horizontal.
- El canvas sigue visible.
- El rail derecho permite reabrir modo fields/detail/comments/docs.
```

---

## Fase 4 — Separar `CatalogLayout` de `SidebarDensity`

### Objetivo

Resolver la causa raíz del LeftSidebar: los nombres actuales mezclan vista, densidad y ancho.

### Problema actual

Conceptos mezclados:

```txt
CatalogViewMode: rich | compact | mini
Densidad: full | comfortable | compact | mini
Ancho real del sidebar
```

Mapeo real:

```txt
rich    → list
compact → tiles
mini    → icons
```

### Nuevo contrato

```ts
export type CatalogLayout = 'list' | 'tiles' | 'icons';
export type SidebarDensity = 'comfortable' | 'compact' | 'narrow';
```

### Reglas

`CatalogLayout` define:

```txt
list   → fila horizontal con icono + texto
tiles  → tarjeta compacta con icono arriba + texto
icons  → solo iconos
```

`SidebarDensity` define:

```txt
comfortable → padding/gap mayor
compact     → padding/gap medio
narrow      → padding/gap mínimo
```

La densidad nunca debe cambiar:

```txt
- orientación;
- visibilidad del texto;
- número semántico de columnas;
- significado del tooltip;
- selección del usuario.
```

### Acciones

1. Crear alias de compatibilidad temporal:

```ts
type LegacyCatalogViewMode = 'rich' | 'compact' | 'mini';

function normalizeCatalogLayout(value: LegacyCatalogViewMode | CatalogLayout): CatalogLayout {
  if (value === 'rich') return 'list';
  if (value === 'compact') return 'tiles';
  if (value === 'mini') return 'icons';
  return value;
}
```

2. Reemplazar `viewMode` interno por `catalogLayout`.
3. Mantener compatibilidad de props públicas durante una fase:

```txt
viewMode deprecated
catalogLayout recomendado
```

4. Persistir la elección:

```txt
sisad-pdfme:catalog-layout
```

5. No persistir densidad.

### Archivos candidatos

```txt
src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
src/sisad-pdfme/ui/components/Designer/SidebarButtons.tsx
src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx
src/sisad-pdfme/ui/components/Designer/types.ts
src/sisad-pdfme/ui/styles/sisad-pdfme-sidebar.css
src/sisad-pdfme/ui/styles/sisad-pdfme-global.css
src/styles/sisad-tailwind-bridge.css
```

### CSS a eliminar o transformar

Buscar:

```bash
rg "data-view-mode|left-sidebar-density|compact|mini|rich" src/sisad-pdfme/ui/styles src/styles/sisad-tailwind-bridge.css
```

Eliminar reglas como:

```css
[data-left-sidebar-density='mini'] [data-view-mode='compact'] {
  grid-template-columns: minmax(0, 1fr);
}
```

### Tests

Actualizar:

```txt
tests/e2e/left-sidebar-view-modes.spec.ts
```

Casos:

```txt
- list mantiene filas horizontales en density comfortable/compact/narrow.
- tiles mantiene tarjetas en dos columnas cuando hay ancho suficiente.
- icons mantiene solo iconos.
- resize no cambia layout elegido por el usuario.
- density solo cambia spacing, no orientación.
```

---

## Fase 5 — Rediseñar selector de vista del catálogo

### Objetivo

Eliminar el botón cíclico ambiguo.

### Estado actual

Hay un botón que cambia:

```txt
rich → compact → mini → rich
```

y muestra el icono de la próxima vista, no la actual.

### Nuevo diseño

Control segmentado:

```txt
[Lista] [Tarjetas] [Iconos]
```

En UI compacta:

```txt
[≡] [▦] [⠿]
```

con tooltip controlado.

### Acciones

1. Crear componente:

```txt
src/sisad-pdfme/ui/components/Designer/shared/CatalogLayoutToggle.tsx
```

Props:

```ts
type CatalogLayoutToggleProps = {
  value: CatalogLayout;
  onChange: (layout: CatalogLayout) => void;
  density: SidebarDensity;
};
```

2. Reemplazar botón cíclico en `LeftSidebar`.
3. Eliminar `title` nativo.
4. Usar `aria-pressed` por botón.
5. Soportar teclado con flechas.

### Tests

```txt
- Click en Lista cambia a list.
- Click en Tarjetas cambia a tiles.
- Click en Iconos cambia a icons.
- La vista seleccionada se conserva tras resize.
- La vista seleccionada se conserva al colapsar/expandir sidebar.
```

---

## Fase 6 — Compactar LeftSidebar sin perder funciones

### Objetivo

Hacer el catálogo más compacto, predecible y consistente con estilo tipo DocuSign/Wix, usando Tailwind/bridge existente.

### Problemas actuales

```txt
- Header alto.
- Tabs sin texto pero con tooltips nativos.
- Filtros grandes.
- Categorías como tarjetas pesadas.
- Items con superficie dentro de superficie.
- Favoritos duplicados.
- Resultados flotante invade el catálogo.
```

### Nuevo layout del header

Altura objetivo: `124–140px`.

```txt
Fila 1: Campos · ● Cliente principal                    [collapse]
Fila 2: [Estándar] [Personalizados] [Prefill]
Fila 3: Buscar campo...
Fila 4: Todos | ★ Favoritos | Recientes                 [Vista]
```

### Diseño de `list`

```txt
Altura: 36–40 px
Icono: 20–22 px
Gap: 8 px
Padding horizontal: 8–10 px
Label: 11.5–12 px
Sombra: ninguna
Borde: hover/active solamente
```

### Diseño de `tiles`

```txt
Altura: 52–58 px
Columnas: auto-fill minmax(96px, 1fr) o 2 columnas según ancho
Icono: 22–24 px
Label: una línea
Padding: 6–8 px
Sin card interna del icono
```

### Diseño de `icons`

```txt
Botón: 38–42 px
Icono: 18–22 px
Grid: repeat(auto-fill, minmax(38px, 1fr))
Gap: 5–6 px
Tooltip obligatorio
Sin estrella flotante
```

### Acciones por componente

#### `LeftSidebarGroup`

- Añadir chevron visible.
- Reducir padding del header.
- Eliminar card pesada en modo icons.
- Mantener contador compacto.

#### `SidebarButtons` / item del catálogo

- Una sola superficie visible.
- Wrapper sin fondo/borde/sombra.
- Button controla hover/focus/drag.
- `PluginIcon` sin tarjeta interna.
- Favorito integrado según layout:
  - list: estrella al final.
  - tiles: visible en hover o si activo.
  - icons: oculto o en menú contextual.

#### Filtros

Cambiar:

```txt
Todos, Favoritos (0), Recientes (1)
```

por:

```txt
Todos | ★ 0 | Recientes 1
```

### Archivos candidatos

```txt
src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx
src/sisad-pdfme/ui/components/Designer/SidebarButtons.tsx
src/sisad-pdfme/ui/components/Designer/PluginIcon.tsx
src/sisad-pdfme/ui/styles/sisad-pdfme-sidebar.css
src/sisad-pdfme/ui/styles/sisad-pdfme-global.css
src/styles/sisad-tailwind-bridge.css
```

### Tests

```txt
- list muestra al menos 14 items en 700px útiles.
- tiles muestra 10–14 items.
- icons muestra 24–36 items.
- favoritos funciona igual en los tres layouts.
- recientes no queda colapsado accidentalmente.
- drag bloquea scroll del sidebar durante arrastre.
```

---

## Fase 7 — Corregir inserción por click/double click del catálogo

### Objetivo

Evitar inserciones duplicadas de schemas.

### Problema

Si `onClick` y `onDoubleClick` ejecutan `onSchemaClick`, el navegador puede disparar:

```txt
click
click
dblclick
```

Resultado posible: 2 o 3 schemas creados.

### Decisión recomendada

Contrato simple:

```txt
Click simple: insertar una vez
Drag: colocar con precisión
Doble click: sin acción adicional
```

### Acciones

1. Buscar handlers duplicados:

```bash
rg "onDoubleClick|onClick.*onSchemaClick|onSchemaClick" src/sisad-pdfme/ui/components/Designer
```

2. Eliminar `onDoubleClick` si duplica inserción.
3. Si se mantiene doble click, implementar guard:

```ts
const clickGuard = useRef<number | null>(null);
```

pero preferir no hacerlo.

4. Agregar telemetría opcional solo en dev para detectar doble inserción.

### Tests

```txt
- doble click sobre item del catálogo crea solo un schema.
- click simple crea solo un schema.
- drag crea un schema en coordenada esperada.
```

---

## Fase 8 — Reubicar “Resultados · Colapsado”

### Objetivo

Evitar que el panel de resultados tape el LeftSidebar o el canvas.

### Problema

Está fijado al viewport con:

```txt
position: fixed
bottom: 12px
left: 12px
z-index: 70
```

### Opciones

#### Opción A — Barra inferior del laboratorio

```txt
Resultados 0 · Sin errores · Última validación: OK
```

#### Opción B — Pill dentro del canvas workspace

Anclado al workspace, no al viewport.

#### Opción C — Drawer inferior

Se abre solo cuando hay resultados, warnings o errores.

### Recomendación

Implementar Opción A para laboratorio y Opción C para producción si aplica.

### Archivos a buscar

```bash
rg "Resultados|Colapsado|results|collapsed|bottom: 12|z-index: 70" src tests
```

### Tests

```txt
- Resultados no tapa últimos items del LeftSidebar.
- Resultados no tapa zoom toolbar.
- Resultados no genera overflow horizontal.
```

---

## Fase 9 — Inspector: taxonomía final por tipo de schema

### Objetivo

El DetailView debe mostrar solo lo que corresponde al tipo de schema, sin duplicidades ni secciones vacías.

### Labels oficiales

| Key               | Label visible          | Contenido                             |
| ----------------- | ---------------------- | ------------------------------------- |
| `identity`      | Información del campo | nombre, tipo, label visible           |
| `content`       | Contenido              | valor/texto principal                 |
| `options`       | Opciones               | select/radio/checkboxGroup            |
| `validation`    | Reglas de llenado      | requerido, validación, mensaje error |
| `fileRules`     | Reglas del archivo     | max files, tipos, tamaño, reemplazo  |
| `signature`     | Firma                  | tipo/proveedor si aplica              |
| `action`        | Acción                | approve/decline/note actions          |
| `behavior`      | Interacción           | readonly, hidden, editable            |
| `box`           | Ubicación y tamaño   | x, y, ancho, alto, rotación          |
| `appearance`    | Formato                | font, color, opacity                  |
| `dataBindings`  | Datos y conexiones     | fieldKey, API, JSON, persistencia     |
| `comments`      | Comentarios            | comentarios del campo                 |
| `collaboration` | Asignación y acceso   | owner, lock, permisos                 |
| `advanced`      | Técnico               | IDs y metadata debug                  |

### Labels prohibidos

| Evitar              | Usar                                             |
| ------------------- | ------------------------------------------------ |
| Caja                | Ubicación y tamaño                             |
| Comportamiento      | Interacción                                     |
| Validación         | Reglas de llenado                                |
| Avanzado            | Técnico                                         |
| Datos conectados    | Datos y conexiones                               |
| Colaboración       | Asignación y acceso                             |
| Bloqueado genérico | En edición / Bloqueado por / Bloquear posición |

### Política de secciones vacías

Crear o reforzar:

```ts
export function shouldRenderDetailSection(
  section: InspectorSectionKey,
  profile: InspectorProfile,
  schema: SchemaForUI,
  context: InspectorContext,
): boolean;
```

Reglas:

```txt
- No renderizar sección sin widgets visibles.
- No renderizar sección con solo guiones o placeholders.
- Técnico colapsado por defecto.
- Datos y conexiones oculto si no hay configuración ni soporte.
- Formato oculto si no hay propiedades visuales reales.
- Opciones oculto si el schema no soporta opciones.
```

### Perfiles por schema

#### `text`

Secciones:

```txt
identity
content
validation
behavior
box
appearance
dataBindings
comments
collaboration
advanced
```

Abiertas por defecto:

```txt
identity
content
validation
```

#### `number`

Secciones:

```txt
identity
content
validation
numberFormat
behavior
box
appearance
dataBindings
collaboration
advanced
```

#### `select`

Secciones:

```txt
identity
options
validation
behavior
box
appearance
dataBindings
collaboration
advanced
```

Abiertas por defecto:

```txt
identity
options
```

#### `checkbox`

Secciones:

```txt
identity
validation
behavior
box
appearance
collaboration
advanced
```

No mostrar `options`.

#### `checkboxGroup`

Secciones:

```txt
identity
options
validation
behavior
box
appearance
collaboration
advanced
```

Abiertas por defecto:

```txt
identity
options
```

#### `radioGroup`

Igual a `checkboxGroup`, pero selección única.

#### `signature`

Secciones:

```txt
identity
signature
behavior
box
appearance
dataBindings
comments
collaboration
advanced
```

No mostrar `options`.

#### `initials`

Mismo perfil que signature, con `signatureKind = initials`.

#### `dateSigned`

```txt
identity
content/date format
box
appearance
dataBindings
collaboration
advanced
```

Debe ser readOnly.

#### `attachment`

```txt
identity
fileRules
behavior
box
appearance
dataBindings
comments
collaboration
advanced
```

#### `approve` / `decline`

```txt
identity
action
behavior
box
appearance
dataBindings
collaboration
advanced
```

Designer no ejecuta acción; solo representa.

#### `note`

```txt
identity
content
behavior
box
appearance
comments
collaboration
advanced
```

#### `image` / `svg`

```txt
identity
media
box
appearance
collaboration
advanced
```

#### `barcode` / `qr`

```txt
identity
code
box
appearance
dataBindings
collaboration
advanced
```

#### `table`

```txt
identity
table
box
appearance
dataBindings
collaboration
advanced
```

### Archivos candidatos

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaDisplayInfo.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaInteractionState.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/widgets/*.tsx
src/sisad-pdfme/schemas/**/propPanel.ts
```

### Tests

```txt
tests/e2e/inspector-detailview-profiles.spec.ts
```

Casos:

```txt
- text no muestra options.
- select muestra options principal.
- checkbox individual no muestra options.
- checkboxGroup muestra options y selection rules.
- radioGroup muestra options y selección única.
- signature muestra signature y no options.
- attachment muestra fileRules.
- approve/decline muestra action.
- no hay secciones vacías.
- Técnico siempre colapsado por defecto.
```

---

## Fase 10 — Corregir editor de opciones

### Objetivo

Evitar que al agregar opciones se cree accidentalmente un schema de imagen, firma u otro tipo.

### Problema reportado

En el inspector, al agregar una opción nueva, por alguna razón se crea un schema de imagen o firma. Esto indica conflicto de eventos, foco, submit o command bus.

### Archivos candidatos

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/widgets/InspectorOptionEditor.tsx
src/sisad-pdfme/schemas/options/optionModel.ts
src/sisad-pdfme/schemas/options/optionSelectionBehavior.ts
src/sisad-pdfme/schemas/options/optionValueAdapter.ts
src/sisad-pdfme/schemas/select/index.ts
src/sisad-pdfme/schemas/checkboxGroup/index.ts
src/sisad-pdfme/schemas/radioGroup/index.ts
src/sisad-pdfme/ui/components/Designer/commandBus*
```

### Diagnóstico técnico

Buscar:

```bash
rg "Agregar opción|addOption|options|onSubmit|preventDefault|stopPropagation|command|insertSchema|createSchema|onKeyDown" src/sisad-pdfme
```

Hipótesis:

1. Botón dentro de `<form>` sin `type="button"` dispara submit.
2. `Enter` en input burbujea y activa handler global de inserción.
3. El editor comparte `onSchemaClick` o command de catálogo.
4. El foco queda en catálogo izquierdo y no en inspector.
5. `onKeyDown` global interpreta tecla como shortcut.

### Reglas de corrección

```tsx
<button type="button" ...>
```

En acciones internas del option editor:

```ts
event.preventDefault();
event.stopPropagation();
```

Solo si se confirma que el evento burbujea al canvas/command bus.

### Contrato de datos

```ts
type SchemaOption = {
  id: string;
  optionId?: string;
  label: string;
  value: string;
  disabled?: boolean;
  order?: number;
};
```

### Reglas por tipo

```txt
select:
- selectedValue/defaultValue
- una opción activa por valor

radioGroup:
- selectedOptionId/defaultSelectedOptionId
- selección única

checkboxGroup:
- selectedOptionIds/defaultSelectedOptionIds
- selección múltiple
```

### Tests

```txt
tests/e2e/schema-options-editor.spec.ts
```

Casos:

```txt
- agregar opción en select no crea schema nuevo.
- agregar opción en radioGroup no crea schema nuevo.
- agregar opción en checkboxGroup no crea schema nuevo.
- eliminar opción no elimina schema root.
- renombrar opción actualiza canvas/form/viewer.
- reordenar opción conserva ids.
- Enter en input no inserta schema.
- Botón Agregar opción tiene type button.
```

---

## Fase 11 — Switches de inspector con un solo click

### Objetivo

Corregir switches que a veces requieren doble click.

### Hipótesis

```txt
- Overlay/pointer-events sobre el switch.
- Label capturando evento y luego switch lo recibe en segundo click.
- Remount del DetailView reseteando estado local.
- onChange actualiza schema pero el componente vuelve a montar con valor anterior.
- Switch mezclando checked/defaultChecked.
```

### Archivos candidatos

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/widgets/InspectorSwitch.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/widgets/InspectorField.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/schemaInteractionState.ts
```

### Acciones

1. Verificar controlled component:

```tsx
checked={Boolean(value)}
onChange={(next) => update(next)}
```

2. No usar `defaultChecked`.
3. No renderizar switch dentro de label si el label genera doble evento.
4. Agregar `data-testid` para switches críticos.
5. Verificar que no haya overlay absoluto encima.

### Tests

```txt
- solo lectura cambia con un click.
- obligatorio cambia con un click.
- mostrar nombre en attachment cambia con un click.
- reemplazo en attachment cambia con un click.
- checked en checkbox cambia con un click en Form y no en Designer si aplica.
```

---

## Fase 12 — Reducir duplicidad de acciones entre toolbar, context menu e inspector

### Objetivo

Cada acción debe vivir en un lugar claro.

### Regla de ownership de acciones

| Acción                       | Lugar principal               | También permitido                    |
| ----------------------------- | ----------------------------- | ------------------------------------- |
| Eliminar                      | toolbar/context menu          | inspector footer si hay confirmación |
| Duplicar                      | toolbar/context menu          | lista campos menú fila               |
| Agregar comentario            | context menu / comments panel | toolbar si schema seleccionado        |
| Bloquear                      | Asignación y acceso          | context menu rápido                  |
| Ocultar                       | Interacción                  | context menu rápido                  |
| Traer al frente/enviar atrás | context menu                  | toolbar si multiselect                |
| Renombrar campo               | Información del campo        | lista de campos                       |
| Editar opciones               | Opciones                      | no en canvas                          |
| Configurar archivo            | Reglas del archivo            | no en canvas                          |
| Configurar firma              | Firma                         | no en canvas                          |

### Acciones

1. Auditar duplicidades:

```bash
rg "Eliminar|Duplicar|Agregar comentario|Bloquear|Ocultar|Traer al frente|Enviar atrás|Renombrar|Abrir propiedades" src/sisad-pdfme/ui/components/Designer
```

2. Crear mapa central:

```ts
type SchemaActionKey =
  | 'delete'
  | 'duplicate'
  | 'comment'
  | 'lock'
  | 'hide'
  | 'bringForward'
  | 'sendBackward'
  | 'rename'
  | 'openProperties';
```

3. Deshabilitar acciones si schema está bloqueado por otro usuario.
4. El inspector no debe duplicar botones rápidos salvo que cambien configuración persistente.

### Tests

```txt
- schema bloqueado por otro usuario no permite eliminar ni mover.
- schema bloqueado por mí permite editar si política lo permite.
- toolbar y context menu reflejan mismo disabled state.
- inspector muestra estado coherente.
```

---

## Fase 13 — Comentarios con coordenadas y anclas tipo Office/PDF

### Objetivo

Implementar comentarios anclados a coordenadas del PDF y a schemas, mostrando ícono lateral según la posición.

### Estado de contexto

Ya existen módulos de comentarios/anclas en core:

```txt
src/sisad-pdfme/comments/index.ts
src/sisad-pdfme/common/comments.ts
```

Se debe usar esa capa core, no inventar otra estructura.

### Contrato funcional

Cuando el usuario hace click en `Agregar comentario`:

1. Capturar coordenada del click en sistema del documento:

```txt
documentId
pageNumber
x
y
schemaUid opcional
```

2. Crear comentario top-level o de schema:

```ts
createSchemaComment(text, identity, overrides)
createSchemaCommentAnchor(anchor, identity)
```

3. Mostrar ícono lateral junto al PDF, alineado verticalmente con `y`.
4. Al hacer click en el ícono, abrir hilo del comentario.
5. Permitir mover ancla.
6. Permitir resolver/reabrir.
7. Guardar en snapshot.

### Archivos candidatos

```txt
src/sisad-pdfme/comments/index.ts
src/sisad-pdfme/common/comments.ts
src/sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail.tsx
src/sisad-pdfme/ui/components/Designer/Canvas/overlays/*Comment*.tsx
src/sisad-pdfme/ui/components/Designer/contextMenu*
src/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.ts
```

### Reglas de seguridad

- No usar coordenadas viewport como fuente final.
- Convertir a coordenadas del documento/página.
- Preservar `documentId`, `pageNumber`, `schemaUid`.
- No guardar comentarios dentro de `formData`.
- No mezclar comentarios con schemas.

### Tests

```txt
tests/e2e/schema-comments-anchors.spec.ts
```

Casos:

```txt
- click derecho/agregar comentario guarda documentId/pageNumber/x/y.
- ícono lateral aparece en la página correcta.
- click en ícono abre comentario.
- mover comentario actualiza x/y.
- comentario asociado a schema aparece en CommentsRail.
- resolver comentario cambia estado.
- snapshot round-trip conserva comentarios.
```

---

## Fase 14 — Modal de campos personalizados

### Objetivo

No mostrar controles que no persisten y reducir densidad visual.

### Problema

`CustomFieldDef` contiene muchas propiedades, pero `createSchemaFromCustomField` solo copia algunas. Esto rompe confianza.

### Regla inmediata

```txt
No mostrar controles que no persisten.
```

### Acciones

1. Buscar definición:

```bash
rg "CustomFieldDef|createSchemaFromCustomField|custom field|Campo personalizado|Guardar campo" src/sisad-pdfme src
```

2. Crear matriz:

| Control visible | Se guarda en schema | Se guarda en __designer | Se usa en Form | Se usa en Viewer/PDF |
| --------------- | ------------------- | ----------------------- | -------------- | -------------------- |
| font            | pendiente           | pendiente               | pendiente      | pendiente            |
| validation      | pendiente           | pendiente               | pendiente      | pendiente            |
| helpText        | pendiente           | pendiente               | pendiente      | pendiente            |
| collaborative   | pendiente           | pendiente               | pendiente      | pendiente            |

3. Ocultar controles no persistidos.
4. Agregar `defaultSchema` para controles reales.
5. Reducir modal:

```txt
Header: 48px
Footer sticky: 52px
Body scroll interno
Secciones con divisores, no cards anidadas
Inputs 32–34px
Labels 11–12px
```

### Tests

```txt
- crear campo personalizado text con font/color/validation si están visibles.
- guardar y volver a abrir conserva valores.
- crear select/radioGroup permite options[].
- controles ocultos no aparecen si no persisten.
```

---

## Fase 15 — Refactor CSS/Tailwind controlado

### Objetivo

Reducir colisiones entre:

```txt
sisad-pdfme-global.css
sisad-pdfme-sidebar.css
sisad-tailwind-bridge.css
```

### Reglas

- No crear CSS disperso.
- Preferir Tailwind en JSX para nuevos componentes.
- CSS solo para:
  - tokens globales;
  - estados complejos data-attributes;
  - compat legacy;
  - estilos que Tailwind no puede expresar bien.
- No usar `!important` nuevo salvo justificación.
- No tocar `.moveable-*` ni `.selecto-*`.

### Acciones

1. Inventario:

```bash
rg "left-sidebar|right-sidebar|detail-view|schema-owner|catalog|data-view-mode|data-left-sidebar-density|sidebar-toggle" src/sisad-pdfme/ui/styles src/styles/sisad-tailwind-bridge.css
```

2. Clasificar reglas:

| Regla | Mantener | Migrar a Tailwind | Eliminar | Motivo |
| ----- | -------- | ----------------- | -------- | ------ |

3. Mover diseños nuevos de sidebars a componentes con Tailwind.
4. Dejar CSS únicamente para transiciones y data states.

### Tests visuales

```txt
- laboratorio y SISAD Web se ven consistentes.
- no hay colisión de line-height/font-size en catálogo.
- no hay overflow horizontal.
- botones del inspector conservan tamaño.
```

---

## 5. Plan de commits recomendado

### Commit 1

```txt
refactor(theme): consolidate schema owner tone resolution
```

Incluye:

```txt
schemaOwnershipAppearance.ts
schemaTone.ts
fieldChrome.ts
PluginIcon.tsx
schema-owner-color.spec.ts
```

### Commit 2

```txt
refactor(sidebars): share collapse handle and right rail behavior
```

Incluye:

```txt
SidebarCollapseHandle.tsx
SidebarRail.tsx si se crea
LeftSidebar.tsx
RightSidebar.tsx
Designer/index.tsx
sidebar-collapse-parity.spec.ts
```

### Commit 3

```txt
refactor(catalog): separate layout from responsive density
```

Incluye:

```txt
CatalogLayout types
LeftSidebar.tsx
SidebarButtons.tsx
LeftSidebarGroup.tsx
CSS relacionado
left-sidebar-view-modes.spec.ts
```

### Commit 4

```txt
fix(catalog): prevent duplicate insertions on double click
```

Incluye:

```txt
SidebarButtons.tsx
left-sidebar-view-modes.spec.ts o catalog-insertion.spec.ts
```

### Commit 5

```txt
refactor(inspector): apply schema-specific detail profiles
```

Incluye:

```txt
detailSchemas.ts
detailSectionTaxonomy.ts
DetailViewContent.tsx
widgets
inspector-detailview-profiles.spec.ts
```

### Commit 6

```txt
fix(options): isolate option editor events from schema insertion
```

Incluye:

```txt
InspectorOptionEditor.tsx
optionModel.ts
optionValueAdapter.ts
schema-options-editor.spec.ts
```

### Commit 7

```txt
feat(comments): add coordinate-based comment anchors
```

Incluye:

```txt
comments core
comments overlay
CommentsRail
schema-comments-anchors.spec.ts
```

### Commit 8

```txt
docs(designer): document post-codex sidebar and inspector roadmap
```

Incluye:

```txt
.ai/task-cards/*
docs/03-designer/*
plan-post-codex-sisad-pdfme.md
```

---

## 6. Prompt recomendado para la siguiente sesión de Codex

```txt
Actúa como arquitecto frontend senior experto en React, TypeScript, Tailwind, pdfme, editores PDF tipo DocuSign/Wix, Moveable, Selecto, sidebars, inspector, command bus y Playwright.

Proyecto:
~/Documents/Taylor/frontend/prueba-plugin

Ruta principal:
http://localhost:5174/lab/multi-document-routing

Contexto:
Codex ya realizó una tercera pasada donde:
- creó SidebarCollapseHandle;
- conectó LeftSidebar y RightSidebar al handle compartido;
- hizo que RightSidebar colapsado muestre rail compacto;
- amplió ownerColor/userColor/recipientColor/__designer.*;
- normalizó PluginIcon para currentColor;
- corrigió labels de ayuda del inspector;
- agregó sidebar-collapse-parity.spec.ts;
- build, lint y Playwright críticos quedaron OK.

Tu tarea NO es rehacer eso. Tu tarea es continuar desde ese estado y cerrar la siguiente fase definida en la task-card seleccionada.

Restricciones absolutas:
- No tocar Canvas/**.
- No tocar Moveable.
- No tocar Selecto.
- No tocar Paper.
- No tocar SnapshotAdapter.
- No tocar Generator ni pdf-lib.
- No tocar coordenadas, zoom, drag/drop profundo ni no-overlap.
- No tocar StepOne ni negocio SISAD Web.
- No introducir !important nuevo salvo justificación.
- No usar z-index arbitrario para tapar problemas.
- No crear CSS disperso; usar Tailwind/bridge existente.

Antes de modificar:
1. Ejecuta git status --short.
2. Revisa diff de archivos tocados por Codex.
3. Confirma que no hay cambios previos mezclados.
4. Escoge una sola fase/task-card.
5. No abras más de 8 archivos productivos.
6. No modifiques más de 6 archivos productivos por pasada.

Fase recomendada inmediata:
Separar CatalogLayout de SidebarDensity.

Implementar:
- CatalogLayout = list | tiles | icons.
- SidebarDensity = comfortable | compact | narrow.
- rich -> list.
- compact -> tiles.
- mini -> icons.
- density nunca cambia orientación ni visibilidad de texto.
- resize no cambia layout elegido por el usuario.
- reemplazar botón cíclico por control segmentado o menú explícito.
- eliminar title nativo en tooltips del catálogo.
- mantener favoritos, recientes y drag en los tres layouts.

Archivos candidatos:
- src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
- src/sisad-pdfme/ui/components/Designer/SidebarButtons.tsx
- src/sisad-pdfme/ui/components/Designer/LeftSidebarGroup.tsx
- src/sisad-pdfme/ui/components/Designer/shared/CatalogLayoutToggle.tsx
- src/sisad-pdfme/ui/styles/sisad-pdfme-sidebar.css
- src/sisad-pdfme/ui/styles/sisad-pdfme-global.css
- src/styles/sisad-tailwind-bridge.css
- tests/e2e/left-sidebar-view-modes.spec.ts

Validación obligatoria:
- npm run build
- npm run lint
- npx playwright test tests/e2e/left-sidebar-view-modes.spec.ts --project=chromium
- npx playwright test tests/e2e/sidebar-collapse-parity.spec.ts --project=chromium

Entrega final:
- Diagnóstico corto.
- Causa raíz.
- Archivos modificados.
- Archivos prohibidos no tocados.
- Contratos preservados.
- Tests ejecutados.
- Riesgos residuales.
```

---

## 7. Checklist final por fase

### Antes de cada fase

```txt
[ ] git status revisado.
[ ] cambios previos clasificados.
[ ] una sola task-card seleccionada.
[ ] archivos prohibidos identificados.
[ ] tests relacionados definidos.
```

### Durante cada fase

```txt
[ ] no tocar Canvas/Moveable/Selecto/Paper/Snapshot/Generator/pdf-lib.
[ ] no tocar geometría ni coordenadas.
[ ] no mezclar UI con lógica de negocio.
[ ] no crear helpers paralelos si ya existe facade.
[ ] no introducir labels artificiales.
[ ] no mostrar controles que no persisten.
[ ] no dejar secciones vacías.
```

### Después de cada fase

```txt
[ ] npm run build OK.
[ ] npm run lint OK.
[ ] Playwright específico OK.
[ ] screenshots antes/después si es cambio visual.
[ ] tabla de archivos modificados.
[ ] riesgos residuales documentados.
[ ] commit pequeño y semántico.
```

---

## 8. Orden recomendado de ejecución

```txt
0. Congelar estado y limpiar worktree.
1. Validar owner color y PluginIcon.
2. Completar paridad visual de sidebars y eliminar title nativo.
3. Separar CatalogLayout de SidebarDensity.
4. Rediseñar selector de layout.
5. Compactar catálogo.
6. Corregir click/double click de inserción.
7. Reubicar Resultados.
8. Reperfilar DetailView por schema.
9. Corregir editor de opciones.
10. Corregir switches de un click.
11. Normalizar acciones rápidas vs persistentes.
12. Implementar comentarios con coordenadas.
13. Revisar modal de campos personalizados.
14. Consolidar CSS/Tailwind.
15. Documentar task-cards finales.
```

---

## 9. Conclusión técnica

La pasada de Codex fue correcta como base, pero todavía no cierra la deuda principal de UX/UI. Ya resolvió dos cimientos importantes: color de owner y collapse compartido. Ahora el riesgo es seguir agregando parches visuales. La siguiente etapa debe ser más estructural:

```txt
Estado visual único
→ Contratos de layout claros
→ Densidad independiente
→ Inspector por perfil de schema
→ Acciones sin duplicidad
→ Pruebas Playwright por caso de uso
```

El objetivo final no es que el diseñador “se vea más bonito”, sino que sea:

```txt
predecible
compacto
genérico
autoconfigurable
proporcional al tipo de schema
seguro para multiusuario
estable entre laboratorio y SISAD Web
```
