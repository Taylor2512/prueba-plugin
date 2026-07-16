
## Cierre (2026-07-15, Claude)

Causa raíz corregida: `isAntDPopupOpen()` contaba popups AntD montados-pero-
ocultos (`.ant-tooltip` del botón Reasignar tras el hover, dropdowns con
`ant-*-hidden`, wrap del modal con display:none) → `shouldSuppressCanvasRegion
Selection`/shortcuts quedaban true para siempre. Ahora la detección es
consciente de visibilidad (`isHiddenAntDPopupElement`).

Implementado además:
- [x] `requestClose(reason)` único (cancel/x/escape/mask/confirm/unmount) en
      SchemaAssignmentDialog; Escape a nivel documento dentro del mismo
      lifecycle (el foco puede quedar fuera del wrap por el preventDefault del
      botón Reasignar); safety de unmount; logs `[assignment-modal-lifecycle]`
      solo con debug.enabled.
- [x] modalRender con markers + stops en bubble (capture rompería Radio/Input
      internos; doubleclick sí se detiene en capture fuera de inputs).
- [x] Familia modal completa en `DESKTOP_INTERACTIVE_EXCLUDED_SELECTORS`.
- [x] `resetDesignerTransientInteractionState` con `keepSelection` (default
      true, NUNCA limpia activeElements), `clearPointerState`,
      `releaseModalLock`, blur solo con foco huérfano en modal oculto,
      limpieza de body pointerEvents/overflow.
- [x] `isModalOpen` no queda pegado (lifecycle único de ListView en todas las
      salidas + popups ocultos ya no cuentan).
- [x] Bonus: shift-click acumulativo en click (selectionPolicy 'add' — paridad
      con la región de Selecto y el docblock del Canvas); null-target contract
      de los guards de policy alineado con sus tests.

Validación (todo en verde):
- `assignment-modal-selection-freeze-regression.spec.ts` (4 tests, caso
  obligatorio completo: cancel/X/Escape/confirm + Cmd/Ctrl click + click vacío
  + doble click sin doble modal + selección preservada al cancelar).
- Unit: interactionTargetSelectors (4), designerInteractionReset (6),
  interactionGuards (8), selectionPolicy (2).
- Regresión: canvas-interactions (3), drag-preview, canvas-overflow,
  detail-view suite, checkbox-group, parity, rail, smoke, zoom, lock-state.
- `npm run build` exit 0.
