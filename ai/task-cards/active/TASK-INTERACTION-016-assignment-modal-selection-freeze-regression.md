# TASK-INTERACTION-016 — Freeze de selección tras modal "Reasignar responsable"

- Estado: active
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme` (capa de interacción + lifecycle del modal)
- Tipo: corrección de regresión

## Síntoma

Después de abrir/cerrar el modal Reasignar (Cancelar/X/Escape/Confirmar), el
diseñador queda bloqueado: no se puede seleccionar, deseleccionar ni cambiar
schemas.

## Causa raíz encontrada

`shouldSuppressCanvasRegionSelection` (Selecto `dragCondition`/`onDragStart`) y
`shouldSuppressDesignerShortcuts` (teclado) consultan `isAntDPopupOpen()`, que
hace `document.querySelector('.ant-modal, .ant-tooltip, .ant-dropdown, …')`.
AntD **mantiene los popups montados pero ocultos** después de cerrarlos
(`.ant-tooltip` del propio botón Reasignar queda con clase `ant-tooltip-hidden`
tras el hover; dropdowns cerrados quedan con `ant-dropdown-hidden`; el wrap del
modal queda `display:none` durante la animación de salida). Resultado:
`isAntDPopupOpen()` devuelve `true` para siempre → todo el canvas queda
congelado aunque `isAssignmentDialogOpen` sí vuelva a `false`.

Secundario: el lifecycle del modal ya era único en ListView
(`closeAssignmentDialog` en onClose/onAfterClose/confirm), pero el cierre no
distinguía razón, el wrapper del modal no detenía eventos hacia el árbol React
padre, y el reset transitorio hacía `blur()` incondicional.

## Reglas respetadas

Sin tocar Moveable.tsx/Selecto.tsx/zoom/geometry/SnapshotAdapter/Generator/
pdf-lib; sin modal paralelo; sin limpiar activeElements al cancelar; sin mutar
template al cancelar; sin setTimeout; cierre por lifecycle único
(`requestClose(reason)` → `onClose` → `closeAssignmentDialog` → reset).

## Cambios

1. `interactionGuards.ts`: detección de popups consciente de visibilidad
   (`isHiddenAntDPopupElement`): ignora `ant-*-hidden`, `display:none` inline
   (self/wrap), `aria-hidden`. `isAntDPopupOpen()` solo cuenta popups visibles.
2. `interactionTargetSelectors.ts`: familia modal completa en
   `DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS` (data markers, .ant-modal-*,
   .ant-dropdown*, [role=dialog], [role=button], button).
3. `designerInteractionReset.ts`: contrato extendido — `keepSelection` (default
   true; NUNCA limpia activeElements salvo pedirlo explícito),
   `clearPointerState`, `releaseModalLock`, blur solo si el foco quedó en un
   modal desmontado/oculto o desconectado; limpia body pointerEvents/overflow.
4. `SchemaAssignmentDialog.tsx`: `requestClose(reason)` único
   (cancel/x/escape/mask/confirm/unmount), wrapper `modalRender` con markers +
   stops de pointer/mouse/click/doubleclick (bubble en wrapper: los stops en
   capture romperían los controles internos del modal — ver nota), safety de
   unmount, logs `[assignment-modal-lifecycle]` solo con `debug.enabled`.
5. Tests unitarios + spec Playwright
   `assignment-modal-selection-freeze-regression.spec.ts` con el caso
   obligatorio completo.

### Nota sobre "stops en capture"

Detener `click/pointerdown` en fase capture sobre el wrapper del modal detiene
la propagación ANTES de llegar a los hijos (React sintético incluido), lo que
rompe Radio/Input/botones internos del propio modal. El contrato se implementa
en bubble sobre el wrapper (corta la fuga hacia el árbol React padre) — la
fuga hacia listeners nativos de documento ya la cubren los guards por target
(`isAntDPopupTarget`). El doubleclick sí se detiene en capture porque no hay
interacción interna de doble click.

## Validación

npx vitest run tests/unit/sisad-pdfme/ui/components/Designer/shared/interactionTargetSelectors.test.ts
npx vitest run tests/unit/sisad-pdfme/ui/components/Designer/shared/designerInteractionReset.test.ts
npx vitest run tests/unit/sisad-pdfme/ui/components/Designer/shared/interactionGuards.test.ts
npx playwright test tests/playwright/assignment-modal-selection-freeze-regression.spec.ts
npm run build
