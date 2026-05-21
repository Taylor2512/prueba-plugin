# Matriz final de funcionalidades y estado de pruebas

Fecha: 2026-05-21  
Estados: `covered` | `partial` | `weak` | `missing` | `blocked` | `not implemented`

## Cobertura funcional consolidada (Fases 2–18)

| Funcionalidad | Existe | Test unitario | Test componente | Test E2E | Estado | Prioridad | Acción |
|---|---|---|---|---|---|---|---|
| Canvas base render | sí | parcial | parcial | sí | partial | P0 | endurecer asserts de estado visual y errores PDF |
| Drag/drop campo | sí | parcial | parcial | sí | partial | P0 | validar coordenadas con zoom/scroll y clamp |
| Move/resize/selecto | sí | parcial | parcial | parcial | partial | P0 | cobertura E2E robusta por interacción |
| Snaplines/guides/grid | sí | bajo | bajo | bajo | weak | P1 | suite dedicada canvas-interactions |
| Suite dedicada canvas (`tests/playwright/canvas-interactions.spec.ts`) | sí | n/a | n/a | sí | partial | P0 | ampliar drag/resize con zoom+scroll, clamps, lock/no-move, multi-page |
| Command bus con metadata completa | parcial | parcial | n/a | parcial | weak | P0 | tests por comando y metadata/source/actor |
| Undo/redo robusto | sí | parcial | n/a | débil | weak | P0 | validar outcome, no solo “no crash” |
| Suite dedicada de shortcuts (`tests/playwright/shortcuts.spec.ts`) | sí | n/a | n/a | sí | partial | P0 | completar redo/cut/copy/paste/flechas/zoom y negativos de modal-contenteditable |
| Clipboard copy/cut/paste/duplicate | sí | sí | parcial | parcial | partial | P0 | casos multi-doc/page + UID uniqueness |
| Group/ungroup/align/distribute | parcial | parcial | parcial | débil | weak | P1 | suites selection + shortcuts + e2e |
| Guards lock/readonly/recipient/conflict | sí | sí | parcial | parcial | partial | P0 | matrix por `source` y razones de bloqueo |
| Lock TTL/heartbeat/release | sí | sí | parcial | no | partial | P0 | e2e multiusuario con lock owner visible |
| Comments por schema | sí | sí | sí | parcial | partial | P1 | resolve/reopen + hidden schema stability |
| Ruta principal `/lab/multiuser-collaboration` (vista/user/global, selección, participantes) | sí | n/a | n/a | sí | partial | P0 | ampliar con locks duros, snapshot import/export y comments anclados |
| Overlay manager (viewport safe area) | parcial | no | parcial | no | missing | P1 | unit overlay geometry + e2e clipping |
| Floating toolbar/context menu/inline edit | sí | parcial | parcial | parcial | partial | P1 | asserts de posición y no captura indebida |
| Right sidebar context-aware | sí | sí | sí | parcial | partial | P1 | locked/readonly/group/radio/signature/table contexts |
| Left sidebar catálogo y búsqueda | sí | parcial | parcial | parcial | partial | P1 | filtro+highlight+drag payload + recipient color |
| Schema identity `__designer` | sí | sí | n/a | no | partial | P0 | casos de colisión + migración idempotente |
| Snapshot export/import oficial | sí | sí | n/a | no | partial | P0 | E2E export→import→round-trip assert |
| Legacy migration | sí | sí | n/a | no | partial | P0 | fixtures corruptos + unknown prop preservation |
| Validator panel + navegación a error | parcial | sí | parcial | no | missing | P0 | click en error centra campo en E2E |
| Signature modes/providers | sí | parcial | parcial | parcial | partial | P0 | allowed/default/force provider + p12 cleanup |
| Text schema full matrix | sí | parcial | parcial | parcial | partial | P0 | min/max/regex/inline edit/shortcut isolation |
| Checkbox schema full matrix | sí | parcial | parcial | parcial | partial | P0 | required+readonly+pdf render verified |
| RadioGroup full matrix | sí | parcial | parcial | no | partial | P0 | groupId/optionId, duplicate values, one-answer |
| Select schema full matrix | sí | parcial | parcial | no | partial | P0 | default inválido/options required + runtime parity |
| Date/Time schemas | parcial | bajo | bajo | no | missing | P1 | valid/default/min-max/timezone |
| Barcode/QR schemas | parcial | bajo | bajo | no | missing | P1 | value validation + render |
| Image/SVG schemas | parcial | bajo | bajo | no | missing | P1 | src invalid/base64/url/fit policies |
| Table schema | parcial | bajo | bajo | no | missing | P0 | rows/cols ops + render + snapshot |
| Shapes schemas | parcial | bajo | bajo | no | missing | P1 | line/rect/ellipse resize/render |
| Runtime Form | sí | parcial | parcial | parcial | partial | P0 | required/readonly/filter by recipient/doc/page |
| Runtime Viewer | sí | parcial | parcial | parcial | partial | P0 | read-only parity y valores seleccionados |
| Generator | sí | parcial | n/a | parcial | partial | P0 | multi-doc/page + empty fields + parity |
| ExternalFormRunner | sí | no | no | no | missing | P0 | suite unitaria completa |
| Converter (`pdf2size/pdf2img/img2pdf`) | sí | bajo | n/a | no | missing | P0 | corrupt/encrypted/worker/cancel/retry |
| Responsive breakpoints | sí | bajo | parcial | parcial | weak | P2 | spec `responsive.spec.ts` |
| Accesibilidad teclado/roles/dialogs | parcial | bajo | bajo | bajo | missing | P2 | suite a11y dedicada |
| DocuSign/Wix parity avanzada (approval/payment/decline/conditional hidden) | parcial | no | no | no | not implemented | P1 | documentar gap + tests pendientes bloqueados |

## Especificación de suites Playwright objetivo (Fase 17)

- `tests/playwright/multiuser-collaboration.spec.ts`
- `tests/playwright/shortcuts.spec.ts`
- `tests/playwright/canvas-interactions.spec.ts`
- `tests/playwright/inspector.spec.ts`
- `tests/playwright/schemas.spec.ts`
- `tests/playwright/snapshot.spec.ts`
- `tests/playwright/responsive.spec.ts`
- `tests/playwright/documents.spec.ts`
- `tests/playwright/comments-locks.spec.ts`

## Backlog mínimo de implementación de tests

1. P0 inmediato: `externalFormRunner`, `overlayManager`, `designerCommands`, `keyboardShortcutRegistry`, `useDesignerKeyboardShortcuts`.
2. P0 inmediato: reforzar `schema identity` con colisiones, idempotencia, preservation de unknowns.
3. P0 inmediato: dividir E2E actual y eliminar asserts “no crash” por asserts funcionales.
4. P1: microinteracciones de overlays y sidebar states complejos.
5. P2: responsive + accesibilidad completa.

## Observaciones DocuSign/Wix (Fase 2)

- Funcionalidades con cobertura parcial: recipient assignment, signature provider configuration, multiuser visibility.
- Funcionalidades faltantes o no demostradas en tests: approval/decline reason/payment conceptual field, apply-to-all-pages/docs, tab-order manual, validation panel click-to-focus robusto.
- Para funcionalidades no implementadas aún, marcar `not implemented` y crear tests pendientes con estado `blocked` hasta que exista API/UI estable.
