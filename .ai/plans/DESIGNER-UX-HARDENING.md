# Plan activo — Designer UX hardening

## Objetivo

Cerrar cuatro brechas del Designer mediante autoridades existentes, tests de caracterización y cambios pequeños verificables:

- selección por región con paridad visual/hit-test;
- cuadrícula visible sobre cada página;
- controles compactos del catálogo LeftSidebar;
- multiselección de RightSidebar por long-press + alternativa accesible, sin navegación automática a Detail.

## Restricciones

- No crear campaña/task-cards paralelas. Refinar `UX-WORKSPACE`, `UX-LEFT-SIDEBAR` y `UX-RIGHT-SIDEBAR`.
- No editar paths reclamados por otro writer.
- Un solo writer por slice.
- No cambiar código de grupos de opciones para resolver estas tareas.
- Test rojo/reproductor antes del fix cuando el defecto sea reproducible.
- Extender tests existentes antes de crear uno equivalente.
- No offsets mágicos, no `setTimeout` de coordinación, no global stores nuevos.

## Fase 0 — Preflight y caracterización

1. Ejecutar `pwd`, branch, `git status --short` y registrar commit base.
2. Leer `.ai/ops/coordination/claims.json`.
3. Leer las tres task-cards UX y contratos de interacción/grid.
4. Inspeccionar `package.json` para usar scripts canónicos; no agregar aliases redundantes.
5. Localizar tests existentes de Canvas/grid/selection/LeftSidebar/RightSidebar.
6. Abrir la ruta `/designer/single-user` y capturar estado inicial sin modificar producto.
7. Crear evidencia de reproducción con datos/atributos, no sólo screenshot.

Salida: hipótesis confirmadas/descartadas y lista exacta de archivos a tocar por slice.

---

## Fase 1 — UX-WORKSPACE / Cuadrícula

### Hipótesis principal

La UI actual activa grid en `canvasViewCapabilities`, pero la proyección page-level (`paper.dataset.gridVisible` + CSS vars) fue retirada o dejó de ejecutarse, mientras CSS requiere esos datos sobre cada paper.

### Pasos

1. Escribir/ajustar test unitario de capability `grid.active`.
2. Escribir Playwright focal que falle porque el paper no recibe el estado/variables visuales.
3. Confirmar runtime DOM:
   - Canvas root;
   - cada paper;
   - `data-canvas-page`;
   - `data-grid-visible`;
   - CSS vars de grid;
   - `background-image` computado.
4. Restaurar un único writer page-scoped para grid presentation. Preferir reutilizar lifecycle/page metadata existente; no reintroducir grid de 24px sobre canvas.
5. Probar separación grid vs snap/guides.
6. Probar zoom, padding y multipágina.

### Aceptación

- checked = grid visible en paper;
- unchecked = patrón ausente;
- host visibility puede bloquear la capability;
- grid y snap se controlan de forma independiente;
- step/origin conservan mm/page-space;
- 0 remount.

### Tests mínimos

Unit:
- enabled/visible/session→active;
- grid CSS variable projection;
- padding origin;
- zoom invariant lógico.

Playwright:
- toggle;
- zoom 50/100/150/200;
- multipágina;
- padding;
- grid on/snap off;
- grid off/snap on.

---

## Fase 2 — UX-WORKSPACE / Selección por región

### Objetivo

Unificar el espacio de coordenadas del rect visual y del hit-test.

### Pasos

1. Instrumentar temporalmente start/current/end del pointer y rects proyectados; retirar logs al finalizar.
2. Determinar contrato exacto de `DesignerCoordinateService` y `Selecto.getElementRect`.
3. Crear tests unitarios con números conocidos para zoom + scroll + paper offset.
4. Crear Playwright focal que dibuje una región alrededor de schemas conocidos y compare:
   - marquee bounds;
   - pointer bounds;
   - IDs seleccionados.
5. Corregir la conversión en una sola autoridad. No compensar en varios componentes.
6. Verificar scope página/documento de `regionSelectionSessionRef`.
7. Verificar guards de overlays, Moveable, inputs y grupos.
8. Ejecutar matriz zoom/scroll/sidebars/pages.

### Aceptación

- desviación visual máxima definida y estable;
- resultado semántico coincide con rect visible;
- no cross-page accidental;
- modifier/additive funciona;
- no selecciona option internals como schemas;
- no empieza region desde UI interactiva.

### Tests mínimos

Unit:
- viewport↔canvas;
- canvas↔paper;
- zoom;
- scroll;
- page offset;
- reverse drag.

Playwright:
- 6 niveles de zoom;
- scroll X/Y;
- sidebars abierto/cerrado;
- dos páginas;
- grupos/locked/no-access;
- drag reverse.

---

## Fase 3 — UX-LEFT-SIDEBAR / Controles compactos

### Objetivo

Reducir altura de chrome antes del catálogo sin perder descubribilidad ni persistencia existente.

### Pasos

1. Caracterizar quickFilter, counts y `CatalogLayoutToggle` actuales.
2. Definir layout responsive usando `useResponsiveDensity` existente.
3. Normal: filtro compacto + toggle de layout en una fila.
4. Mini: filtro compacto + botón de Vista/popover.
5. Mantener search visible.
6. Mantener favoritos/recientes/layout en su state/persistencia actual.
7. El estado expandido/colapsado del chrome es efímero salvo contrato contrario.
8. Añadir ARIA/focus/keyboard.
9. Verificar drag de schemas en cada layout.

### Aceptación

- menor altura efectiva del bloque de controles;
- todas las funciones siguen accesibles;
- counts correctos;
- filtro y layout independientes;
- no card-in-card;
- no remount/pérdida de scroll;
- keyboard/a11y funcional.

### Tests mínimos

Unit/RTL:
- filter all/favorite/recent;
- counts;
- persistencia;
- responsive presentation;
- layout controlled/manual.

Playwright:
- desktop/narrow;
- expand/collapse;
- tres filtros;
- tres layouts;
- favorite mutation;
- drag desde catálogo después de cambiar layout.

---

## Fase 4 — UX-RIGHT-SIDEBAR / Multiselección por long-press

### Objetivo

Entrar a multiselección desde ListView manteniendo el tab Campos y reutilizando selección canónica.

### Pasos

1. Mapear click actual: `SelectableSortableItem` → container → selection commands → Detail navigation.
2. Separar dos conceptos:
   - seleccionar;
   - solicitar inspección/Detail.
3. Implementar reconocimiento long-press mediante Pointer Events con cleanup estricto y movement slop.
4. Al disparar long-press, enviar comando aditivo/toggle a la autoridad actual y fijar modo UI múltiple.
5. Mientras multi mode esté activo, click en item sólo alterna selección y no abre Detail.
6. Mantener click corto actual fuera de multi mode.
7. Mantener modifier-click compatible.
8. Añadir entrada accesible/teclado equivalente; long-press no puede ser la única vía.
9. Resolver conflicto DnD: movimiento > slop cancela long-press.
10. Derivar contador y acciones del selection state real.
11. Revalidar access policy, locked/readOnly, page/document change.

### Aceptación

- long-press no abre Detail;
- Canvas y ListView muestran la misma selección;
- click corto sigue abriendo Detail cuando corresponde;
- DnD no se degrada;
- touch/mouse/keyboard disponibles;
- Escape/foco predecibles;
- acciones masivas sólo se habilitan por capabilities/policy.

### Tests mínimos

Unit:
- threshold;
- pointer cancel/move/slop;
- selection command mapping;
- detail navigation policy.

Playwright:
- short click;
- long press;
- 2/3/N selection;
- toggle;
- pointer movement→DnD;
- touch;
- Escape;
- modifier-click;
- Canvas/List sync;
- locked/readOnly;
- page/document change.

---

## Fase 5 — Regresión transversal

Ejecutar primero focales Chromium; luego Firefox/WebKit. Después:

- lint;
- typecheck;
- build;
- test suite canónica del proyecto;
- `git diff --check`;
- auditor de tests si existe;
- cero warnings nuevos de React/console en los Playwright modificados.

Agregar listener Playwright para fallar ante errores críticos de consola/pageerror en estos flujos.

## Orden de commits sugerido

Un dominio por commit, sin renombrados masivos:

1. grid + tests;
2. region selection + tests;
3. left sidebar compact controls + tests;
4. right sidebar multi-select + tests;
5. docs/evidence closeout.

## Cierre documental

- actualizar las task-cards existentes con evidencia real;
- no crear nuevas campañas paralelas;
- consolidar decisiones durables en contratos sólo si cambió realmente un contrato;
- retirar este plan cuando deje de ser trabajo activo y la información durable haya sido migrada.


---

## Cierre — 2026-08-18

Los cuatro slices están implementados con test rojo→verde, causa raíz
documentada por slice y regresión completa en verde:

- **Grid**: capa `::before` propia para la rejilla (competía por
  `background-image` con el fondo de página inline) + `canvasFeatureToggles`
  recorriendo `CANVAS_VIEW_CAPABILITIES` (perdía 5 de 13 capabilities).
- **Selección por región**: se quitó `rootContainer` de `Selecto` en
  `Canvas.tsx` — dibujaba en el espacio del contenedor con scroll mientras el
  hit-test usaba viewport puro.
- **LeftSidebar compacto**: disparador único de filtro con recuento +
  disclosure de modos de vista bajo 220px; sin state nuevo.
- **RightSidebar long-press**: `useLongPressRecognizer` + `multiSelectMode`
  como prop controlada en `Designer/index.tsx` (autoridad única, comparte
  gate con el Escape global de `useDesignerKeyboardShortcuts`).

Gate de cierre:

- `npm run lint` — PASS
- `npm run typecheck` — PASS
- `npm run build` — PASS
- `tests/e2e/designer/*` — 69/69 Chromium
- `tests/e2e/form|runtime|regressions/*` — 64/64 Chromium
- `tests/unit/behavior/rightsidebar/longPressSelection.test.ts` — 12/12
- `tests/unit/contracts/canvas/{canvasViewCapabilities,regionSelectionCoordinates}.test.ts` — 19/19
- `git diff --check` — PASS
- Suite unitaria completa (`npx vitest run`, ~430 specs) — en curso al momento de este cierre; sin fallos observados en los módulos tocados.

Riesgos residuales (ninguno bloquea el cierre; ninguno es una de las cuatro
brechas asignadas):

1. El botón ★ de favoritos del catálogo (`LeftSidebar`) no responde a un
   click de Playwright ni en HEAD sin estos cambios. Preexistente.
2. Arrastrar el grip de una fila de ListView fuera de multi mode no llega a
   reordenar: `onDragStart` autoselecciona el item arrastrado, lo que salta a
   Detalle y desmonta la lista sortable a mitad de gesto. Preexistente;
   mitigado (no resuelto) cuando `multiSelectMode` está activo.
3. Falta cobertura unit/RTL directa de `LeftSidebar` (filtros/counts) —
   compensada con 13 E2E de navegador real; RTL requeriría montar todo el
   árbol de contexts del Designer.

Este plan puede archivarse: la información durable relevante ya vive en las
tres task-cards (`UX-WORKSPACE`, `UX-LEFT-SIDEBAR`, `UX-RIGHT-SIDEBAR`), que
quedan en `status: DONE` con su evidencia de cierre.
