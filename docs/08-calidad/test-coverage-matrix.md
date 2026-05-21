# Matriz de cobertura real (Fase 1)

Fecha de auditoría: 2026-05-21  
Scope: `sisad-pdfme` core + tests unit/e2e actuales.

## Resumen ejecutivo

- El proyecto ya tiene base sólida de tests unitarios en P0: identidad, migración, snapshot, validator, command bus, lock manager, lock guard, clipboard, shortcuts y canvas state.
- Hay cobertura E2E funcional en `tests/playwright/pdfme-editor.spec.ts` con 28 casos pasando para rutas de lab, incluyendo `/lab/multiuser-collaboration`.
- Riesgo actual: varias áreas críticas todavía tienen cobertura parcial o ausente a nivel método (especialmente `overlayManager`, `externalFormRunner`, `designerCommands`, `useDesignerKeyboardShortcuts`, `coordinateMath`, `schemaAutoPlace`).
- Riesgo de calidad: existe un subconjunto de tests débiles basados en “estado vivo/no crash” y asserts muy laxos (regresión silenciosa posible).

## Matriz Área → Método → Pruebas

| Área | Archivo | Métodos/exportaciones | Tests existentes | Casos cubiertos | Casos faltantes | Prioridad |
|---|---|---|---|---|---|---|
| Identity/meta | `src/sisad-pdfme/shared/schemaDesignerMeta.ts` | `createDesignerConfigV3`, `createSchemaDesignerMeta`, `duplicateSchemaDesignerMeta`, `pasteSchemaDesignerMeta` | `sisad-schemaDesignerMeta.test.ts`, `sisad-v3Contract.test.ts`, `schemaIdentity.test.ts` | v3 contract, uid, duplicate/paste identity, invariantes | cobertura fina de timestamps/monotonicidad por edición masiva | P0 |
| Migration | `src/sisad-pdfme/shared/schemaMigration.ts` | `migrateSchemaToV3`, `flattenV3ToLegacy`, `isDesignerConfigV3` | `sisad-v3Contract.test.ts`, `sisad-schemaIdentity.test.ts` | migration happy path, flatten, detector v3 | edge cases de campos desconocidos y estructuras corruptas profundas | P0 |
| Snapshot | `src/sisad-pdfme/shared/snapshotAdapter.ts` | `serialize`, `deserialize`, `validate` | `sisad-snapshotAdapter.test.ts`, `assertSnapshotRoundTrip` helper | round-trip principal, validación base, legacy import | locks efímeros, comments/assignments complejos multi-doc+recipient y errores granulares | P0 |
| Validator | `src/sisad-pdfme/shared/templateValidator.ts` | `validateTemplate`, `isTemplateValid` | `sisad-templateValidator.test.ts` | errores/warnings/infos principales | paths navegables + combinaciones de recipient/comments/visibility avanzadas | P0 |
| Guards | `src/sisad-pdfme/shared/interactionGuards.ts` | `validateInteraction`, `validateBulkInteraction`, `getBlockedSchemas`, `getAllowedSchemas` | `interactionGuards.test.ts`, `sisad-guards.test.ts` | readonly/locked/permisos base | matrices completas por acción + reason mapping exhaustivo | P0 |
| Command types | `src/sisad-pdfme/shared/commandTypes.ts` | tipos + sets `MUTATING_ACTIONS`, `READ_ONLY_SAFE_ACTIONS` | `sisad-commandTypes.test.ts` | clasificación principal de comandos | drift entre comandos nuevos y sets no detectado por test parametrizado completo | P0 |
| Command bus | `src/sisad-pdfme/ui/commands/commandBus.ts` | `buildCommandMeta`, `CommandBus` (`execute`, `undo`, `redo`, guards/listeners) | `commandBus.test.ts`, `sisad-commandBusGuards.test.ts`, `sisad-v3Contract.test.ts` | execute/undo/redo base y guards | trazabilidad de metadatos por fuente + errores transaccionales | P0 |
| Locks | `src/sisad-pdfme/collaboration/lockManager.ts` | `acquire`, `release`, `releaseOwnedLocks`, `renew`, heartbeat, cleanup, status helpers | `sisad-lockManager.test.ts`, `sisad-lockSystem.test.ts`, `schemaLockEvents.test.ts` | TTL, expiración, ownership, lifecycle principal | escenarios de contención multi-actor con heartbeat intercalado | P0 |
| Lock guard | `src/sisad-pdfme/collaboration/schemaLockGuard.ts` | `createSchemaLockGuard` | `sisad-schemaLockGuard.test.ts` | passthrough/blocked base | resolución compleja multi-schema+group commands | P0 |
| Clipboard | `src/sisad-pdfme/ui/components/Designer/shared/schemaClipboard.ts` | sanitize/copy/cut/paste/duplicate + policy | `sisad-schemaClipboard.test.ts` | ids nuevos, offsets, policy, metadata principal | políticas recipient/global con combinaciones de locks/comments complejas | P0 |
| Selection commands | `src/sisad-pdfme/ui/components/Designer/shared/selectionCommands.ts` | set completo de comandos de selección/edición | `selectionCommands.test.ts`, `sisad-schemaGroups.test.ts` | delete/duplicate/group/ungroup/alignment base | matriz completa por comando + readonly/lock guard para todos | P0 |
| Keyboard shared | `src/sisad-pdfme/shared/keyboardShortcuts.ts` | normalize/find/platform + catálogo | `sisad-keyboardShortcuts.test.ts` | combos cross-platform base | conflictos de layout internacional + colisiones de shortcuts | P1 |
| Keyboard registry | `.../keyboardShortcutRegistry.ts` | register/get/resolve/format | cobertura indirecta parcial | parcial | faltan tests dedicados exhaustivos del matcher y alias | P1 |
| use shortcuts hook | `.../useDesignerKeyboardShortcuts.ts` | `shouldIgnoreShortcutEvent`, hook runtime | cobertura indirecta parcial | parcial | faltan tests directos del hook (focus/modal/IME/input guarding) | P1 |
| Action registry | `.../actionRegistry.ts` | register/get/filter/context/sort | `actionRegistry.test.ts` | registro y sort básico | cobertura de visibilidad por permisos reales de lock/readonly | P1 |
| Coordinate service | `.../designerCoordinateService.ts` | clase completa conversiones/clamp | `designerCoordinateService.test.ts` | casos base | zoom/scroll/page switching multi-doc más profundo | P1 |
| Coordinate math | `.../coordinateMath.ts` | conversión y selection region | cobertura indirecta parcial | parcial | faltan tests directos exhaustivos de `resolveSelectionRegion` | P1 |
| Canvas state | `canvas/canvasRenderState.ts`, `canvas/useCanvasRenderState.ts` | config/selectores + derive state | `sisad-canvasRenderState.test.ts`, `sisad-useCanvasRenderState.test.ts` | prioridad de estados y helpers | coberturas de transiciones con entradas inválidas combinadas | P1 |
| Overlay manager | `canvas/overlayManager.ts` | `OverlayManager` lifecycle/geometry/stack | sin test directo | muy bajo | faltan tests unitarios completos | P1 |
| External forms | `externalForms/externalFormRunner.ts` | visibility rules, required completeness, storage | sin test directo | muy bajo | faltan tests unitarios e integración | P0 |
| Designer commands | `ui/commands/designerCommands.ts` | snapshot/comment command builders | cobertura indirecta limitada | parcial | faltan tests directos payload/metadata invariants | P1 |
| Schema auto place | `.../schemaAutoPlace.ts` | descriptor/rules extraction | sin test directo | bajo | faltan tests | P2 |
| E2E lab | `tests/playwright/pdfme-editor.spec.ts` | flujos ruta, sidebars, docs, colaboración, shortcuts | sí (28 casos) | flujo principal multiuser y shortcuts cubierto | faltan suites separadas para snapshot import/export, locks duros, visual-regression | P0 |

## Métodos/exportaciones sin tests directos (high-impact)

- `src/sisad-pdfme/canvas/overlayManager.ts`: clase `OverlayManager` y `createOverlayManager`.
- `src/sisad-pdfme/externalForms/externalFormRunner.ts`: `getSchemaVisibility`, `areAllRequiredFieldsComplete`, `InMemoryExternalFormStorage`.
- `src/sisad-pdfme/ui/components/Designer/shared/keyboardShortcutRegistry.ts`: resolver/formatter.
- `src/sisad-pdfme/ui/components/Designer/shared/useDesignerKeyboardShortcuts.ts`: hook + `shouldIgnoreShortcutEvent`.
- `src/sisad-pdfme/ui/commands/designerCommands.ts`: builders de comandos/snapshots.
- `src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts`: cobertura directa insuficiente.
- `src/sisad-pdfme/ui/components/Designer/shared/schemaAutoPlace.ts`.

## Tests débiles detectados

- Casos con assert de “sigue visible/no crashea” sin validar outcome de negocio real.
- E2E con ramas condicionales `if (...) return` que degradan señal de regresión.
- Assertions de geometría muy permisivas (`width > 0`) en escenarios donde debería validarse estabilidad de viewport/zoom.

## Tests con patrón “solo no crashea”

- Subconjunto en `tests/playwright/pdfme-editor.spec.ts`:
  - shortcuts undo/group/ungroup/delete (validan liveness más que resultado).
  - algunos casos de runtime/viewer/canvas ajustados recientemente a resiliencia.
- Subconjunto en unit (plugins de schemas) con asserts muy genéricos de `innerHTML` o `Uint8Array`.

## Duplicidades probables

- `collaboration.test.ts` vs `collaborationAllFunctions.test.ts` vs `collaborationRuntimeAllFunctions.test.ts` (solapamiento funcional).
- `schemaIdentity.test.ts` + `sisad-schemaIdentity.test.ts` + parte de `sisad-v3Contract.test.ts`.
- `sisad-guards.test.ts` + `interactionGuards.test.ts` con intersección.

## Flujos E2E no cubiertos (P0/P1)

- Export/import snapshot completo con verificación de identity/assignments/comments.
- Locks duros multi-actor (movimiento/resize/delete bloqueados con feedback reason).
- Validación/errores navegables desde panel al canvas.
- Paridad runtime `form/viewer/generator` para datos persistentes por `schemaUid`.
- Suite responsive dedicada por breakpoints con aserciones de overlays en viewport.

## Factories/fixtures faltantes o incompletos (estado antes de Fase 2)

- Multi-document input factory explícita.
- Snapshot fixtures con variantes v3 válido/inválido y legacy migrable etiquetadas.
- Aliases explícitos para locks activos/expirados TTL.

## Helpers de testing recomendados

- Unit:
  - helper `assertGuardRejectionReason`.
  - helper `assertCommandMetaConsistency`.
  - helper `assertOverlayWithinViewport`.
- Playwright:
  - page object dedicado para `/lab/multiuser-collaboration`.
  - helper para console/runtime assertions por test-step.
  - helper de gestures (selecto rectangle / moveable drag/resize con coordenadas robustas).

