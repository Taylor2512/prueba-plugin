---
id: UX-RIGHT-SIDEBAR
campaign: SISAD-PDFME-UX
status: DONE
priority: P1
depends_on: []
---
# UX-RIGHT-SIDEBAR — Navegación, ListView, DetailView, comments y documents

## Objective
Unificar panel registry, header contextual, scroll owner, ListView, reasignación, DetailView,
CommentsRail, DocumentsRail y estados empty/loading/error/disabled.

## Absorbs
VISUX-018..027 y COREUX-024..030 relacionados con el sidebar.

## Acceptance
- un panel registry;
- un scroll owner por panel;
- assignment != lock != audit;
- disabled siempre con reason;
- ListView/DetailView/Canvas no contradicen identidad o selección;
- comments/documents con lifecycle único.

<!-- designer-ux-hardening:start -->
## Refinamiento activo — multiselección desde ListView

Agregar entrada a multiselección por long-press sin redirección automática a Detalle y sin crear un state paralelo de selected IDs.

### Dirección

- usar `SelectionCommandSet`/selection authority existente;
- separar `selection intent` de `open Detail intent`;
- click corto conserva Detail fuera de multi mode;
- long-press entra a multi mode y togglea selección permaneciendo en Campos;
- movimiento > slop cancela long-press y preserva DnD;
- modifier click sigue disponible;
- equivalente accesible/teclado obligatorio;
- contador/acciones derivados de selection + access/capabilities.

### DoD

- unit: recognizer threshold/slop/cancel + selection/detail policy;
- Playwright: short click, long press, 2/3/N, toggle, DnD cancel, touch, Escape, modifier, Canvas↔List sync, locked/readOnly y page/document switch;
- no remount ni IDs huérfanos.
<!-- designer-ux-hardening:end -->
### Evidencia de cierre — 2026-08-18

Arquitectura: nuevo `useLongPressRecognizer`
(`RightSidebar/ListView/longPressSelection.ts`) — hook puro sobre Pointer
Events con umbral de 500ms, tolerancia de movimiento de 6px (por debajo del
`distance:10` de activación de dnd-kit) y limpieza completa en
unmount/pointerup/pointercancel; sin `setTimeout` de coordinación fuera del
propio reconocedor. `SelectableSortableItem` lo consume y compone el `onClick`
para no repetir la selección cuando el long-press ya la resolvió
(`consumeLongPress()`). Espacio en el hit-target dispara el mismo camino
(`onToggleSelectionKey`) como equivalente de teclado obligatorio — Enter
conserva el click corto.

El modo de multiselección es una prop CONTROLADA, no un state nuevo por
componente: vive en `Designer/index.tsx` (`multiSelectMode`), la única
autoridad que también gobierna el atajo global Escape
(`useInitEvents`/`useDesignerKeyboardShortcuts`). `RightSidebar` sólo lo lee
para suprimir el salto automático a Detalle (`effectiveAutoFocusDetail =
autoFocusDetail && !multiSelectMode`) y sigue usando `selectSchemasByIds`
(`SelectionCommandSet`) para todo cambio de selección — no hay un segundo
store de ids. `hooks.ts` ganó `onClearSelectionShortcut` (override opcional,
por defecto `onEditEnd`) para que Escape, mientras el modo está activo, sólo
salga de él en vez de vaciar la selección completa; un segundo Escape (modo ya
cerrado) sigue limpiando la selección como siempre.

Causa raíz de una falsa alarma durante la caracterización: la ruta
`/designer/single-user` fija `sidebars.right.defaultPanel: "detail"` como
config deliberada del host (arranca en Detalle sin selección); no es un bug.
Los tests que verifican "no salta a Detalle" parten explícitamente de la
pestaña Campos (`volverACampos`) antes de ejercer el long-press, igual que
haría un usuario real de esa ruta.

Tests: `tests/unit/behavior/rightsidebar/longPressSelection.test.ts` (12/12,
temporizadores falsos: umbral, tolerancia, cancelación, pointerId cruzado,
desmontaje, doble gesto) + `tests/e2e/designer/multiselect-rightsidebar.spec.ts`
(12/12: long-press, Espacio, movimiento cancela, click corto normal, toggle en
modo activo, reducir a 1 sin saltar a Detalle, Escape en dos niveles, salida
automática al vaciar, modifier-click y click corto fuera de modo, grip no
interfiere, sincronía Canvas↔ListView).

**Riesgo residual, ajeno a este slice, hallado durante la caracterización**:
en HEAD (sin estos cambios) arrastrar el grip de una fila no llega a
reordenar — `onDragStart` selecciona el elemento arrastrado si no lo estaba,
lo que en modo normal salta a Detalle y desmonta la lista sortable a mitad de
gesto. Con `multiSelectMode` activo el salto queda suprimido, así que el
long-press mitiga el síntoma para ese caso, pero el bug de fondo (grip drag
fuera de multi mode) sigue sin corregirse y no forma parte de las cuatro
brechas de este prompt.

