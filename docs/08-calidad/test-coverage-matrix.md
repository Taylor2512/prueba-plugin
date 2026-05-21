# Matriz de cobertura real (auditoría QA profunda)

Fecha: 2026-05-21  
Repositorio: `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin`  
Ruta E2E principal: `http://localhost:5174/lab/multiuser-collaboration`

## Escala de prioridad
- `P0`: rompe diseño, snapshot, command bus, locks, schemas, generación, firma o persistencia.
- `P1`: rompe UX crítica (inspector, selección, shortcuts, overlays, comments, grupos).
- `P2`: rompe consistencia visual, responsive, a11y o edge cases.
- `P3`: documentación, hardening auxiliar o deuda menor.

## Fase 1 — Matriz Área/Archivo/Cobertura

| Área | Archivo | Funciones/métodos/exportaciones | Tests existentes | Tests débiles | Casos faltantes | Prioridad |
|---|---|---|---|---|---|---|
| Config | `package.json` | scripts `build/test/test:e2e` | smoke por ejecución manual | no smoke de scripts en CI matrix | split `test:unit`/`test:e2e:headed` + perfiles por ruta | P1 |
| Config | `vitest.config.ts` | aliases + include + setup | cobertura indirecta | no test de resolución de alias | test de contrato de aliases críticos | P2 |
| Config | `playwright.config.ts` | baseURL/proyectos/retries | cobertura indirecta | single project chromium únicamente | matrix viewports + projects por engine si aplica | P2 |
| Setup | `tests/unit/setupTests.ts` | patch `getComputedStyle` | indirecta | no assertions de fallback | test explícito de pseudo/normal style | P3 |
| Runtime guard E2E | `tests/playwright/runtime-guard.ts` | guard de `console/pageerror` | usado en spec principal | allowlist amplia no versionada | suite dedicada con inyección de errores esperados/no esperados | P1 |
| E2E actual | `tests/playwright/pdfme-editor.spec.ts` | rutas lab, sidebars, runtime, shortcuts | 1 suite grande (múltiples casos) | varios asserts de liveness (`stage visible`, `no crash`) | dividir en 9 specs por dominio + asserts funcionales duros | P0 |
| Shared identity | `src/sisad-pdfme/shared/schemaDesignerMeta.ts` | create/duplicate/paste metadata | `sisad-schemaDesignerMeta`, `schemaIdentity`, `sisad-v3Contract` | parcial en collisions/version | colisión `schemaUid`, defaults incompletos, unknown props preservation | P0 |
| Shared migration | `src/sisad-pdfme/shared/schemaMigration.ts` | migrate/flatten/isV3 | `sisad-schemaIdentity`, `sisad-v3Contract` | happy-path bias | idempotencia profunda + legado corrupto | P0 |
| Shared snapshot | `src/sisad-pdfme/shared/snapshot.ts`, `snapshotAdapter.ts` | serialize/deserialize/validate | `sisad-snapshotAdapter` + helper roundtrip | falta contrato e2e import/export | locks efímeros, comments/assignments complejos, multi-doc/page, uid dedupe | P0 |
| Validator | `src/sisad-pdfme/shared/templateValidator.ts` | validación de template | `sisad-templateValidator` | faltan paths navegables e2e | panel de validación, focus al campo con error, warning/error split | P0 |
| Guards | `src/sisad-pdfme/shared/interactionGuards.ts` | validate bulk/single interaction | `interactionGuards`, `sisad-guards` | matriz por source incompleta | source (`canvas/toolbar/keyboard/api/collab`) + reason mapping exhaustivo | P0 |
| Keyboard shared | `src/sisad-pdfme/shared/keyboardShortcuts.ts` | normalización combos | `sisad-keyboardShortcuts` | parcial en inputs/contenteditable | no-disparo en input/textarea/select/modal, cross-platform completa | P1 |
| Command types | `src/sisad-pdfme/shared/commandTypes.ts` | mapa comandos/payloads | `sisad-commandTypes` | drift no protegido completamente | cobertura 100% de todos los comandos listados en Fase 5 | P0 |
| Local stores | `localFormStorage.ts`, `localSnapshotStore.ts` | persist/read/remove | cobertura limitada/indirecta | sin test de corrupción de storage | recovery de JSON inválido + version mismatch | P1 |
| Signature registry | `signatureRegistry.ts` | providers/policies | `signatureSchema`, `sisad-signaturePolicy` | existe test “no crash” | provider inválido, allowed/default/forceProvider por recipient/schema | P0 |
| Canvas state | `canvas/canvasRenderState.ts`, `useCanvasRenderState.ts` | derive estados render | `sisad-canvasRenderState`, `sisad-useCanvasRenderState` | no cubre todos estados objetivo | `loadingDocument/loadingPage/empty/noSchemas/renderError/pdfLoadError/encrypted/unsupported/switching` | P0 |
| Overlay manager | `src/sisad-pdfme/canvas/overlayManager.ts` | stack/viewport/portal math | sin test directo | n/a | unit completa + e2e clipping/safe-area/escape/outside click | P1 |
| Canvas component | `Canvas.tsx`, `Moveable.tsx`, `Selecto.tsx`, `Guides.tsx`, `SnapLines.tsx`, `Mask.tsx` | drag/select/resize/snap | cobertura e2e parcial, unit indirecta | varias validaciones solo visual-live | zoom/scroll exact coords, clamp, locked blocking real | P0 |
| Coordinate math | `coordinateMath.ts`, `designerCoordinateService.ts` | transforms/clamp/reversible | `designerCoordinateService.test.ts` | faltan pruebas de reversibilidad E2E | multi-page/doc con scroll+zoom sin drift | P0 |
| Schema auto place | `schemaAutoPlace.ts` | placement rules | sin test directo | n/a | auto-place por página/doc/recipient y colisiones | P1 |
| Overlays UI | `CanvasOverlayManager.tsx`, `SelectionContextToolbar.tsx`, `InlineEditOverlay.tsx`, etc. | posicionamiento/acciones | `inlineEditOverlay.test.tsx` parcial | falta viewport assertions robustas | suite de overlays (toolbar/context/comments/preview/flash/snap) | P1 |
| Right sidebar | `RightSidebar/*` | context/detail/widgets/forms | `detail*`, `schemaConnections*`, `schemaCollaborationWidget` | gaps en flows combinados | locked/readonly/recipient/group/radiogroup/signature/table contexts | P1 |
| Left sidebar | `LeftSidebar*`, `schemaRegistry.ts`, `useLeftSidebarCatalogState.ts` | catálogo/drag/filter | cobertura parcial (lab/e2e) | faltan asserts de payload creado | recipient color propagation + custom field modal + mobile overflow | P1 |
| Command bus | `ui/commands/commandBus.ts` | execute/undo/redo/guards | `commandBus`, `sisad-commandBusGuards` | metadata coverage parcial | metadata obligatoria por command + rechazo lock/readonly/conflict/permission | P0 |
| Designer commands | `designerCommands.ts` | builders command payload | indirecta limitada | n/a | unit directa por cada comando crítico listado en Fase 5 | P0 |
| Action registry | `actionRegistry.ts` | register/filter/resolve | `actionRegistry.test.ts` | no contrato cross-source | consistencia toolbar/context/inspector sin duplicidad | P1 |
| Selection commands | `selectionCommands.ts`, `schemaClipboard.ts` | copy/cut/paste/dup/delete/group/move | `selectionCommands`, `sisad-schemaClipboard`, `sisad-schemaGroups` | edge cases incompletos | lock+readonly+hidden+multi-doc/page + offset y UID uniqueness | P0 |
| Collaboration core | `collaboration/lockManager.ts`, `schemaLockGuard.ts` | ttl/heartbeat/cleanup/guard | `sisad-lockManager`, `sisad-lockSystem`, `schemaLockEvents`, `sisad-schemaLockGuard` | falta e2e multi-actor duro | lock owner visible + bloqueo real drag/resize/delete + unmount cleanup | P0 |
| Collaboration UI | `ui/collaboration.ts`, `ui/collaborationContext.ts`, `common/collaboration.ts` | participants/view/comments/ownership | `collaboration*` múltiples | duplicación y solapamiento de suites | consolidar suites por dominio + escenarios de conflicto remoto | P1 |
| Assignments/comments | `assignments/index.ts`, `comments/index.ts`, `common/comments.ts` | visibilidad/permisos/comentarios | `collaborationAssignmentsAndComments`, `commentModel`, `commentsRail` | faltan casos hidden/resolve/reopen | snapshot preservation + hidden schema comment stability | P1 |
| Schemas registry | `schemas/index.ts`, `schemaBuilder.ts`, `schemaFamilies.ts`, `utils.ts` | registration/build/family rules | `schemaFamilies*`, `schemaRegistryAllFunctions` | coverage desigual por schema | matriz completa por tipo + validator+runtime parity | P0 |
| Schemas text | `schemas/text/*` | defaults/render/validation | `textSchema.test.ts` | missing min/max/regex matrix | Form/Viewer/Generator parity completa | P0 |
| Schemas checkbox | `schemas/checkbox/index.ts` | checked states | `checkboxSchema.test.ts` | falta readonly+assignment matrix | generator checked/unchecked + snapshot | P0 |
| Schemas radioGroup | `schemas/radioGroup/index.ts` | options/group behavior | `radioGroupSchema.test.ts` | falta group clone identity exhaustiva | groupId/optionId uniqueness, required, duplicate value errors | P0 |
| Schemas select | `schemas/select/index.ts` | options/default | cobertura parcial | faltan defaults inválidos y data connections | Form/Viewer/Generator + validator paths | P0 |
| Schemas signature | `schemas/signature/*` | modes/providers/policy | `signatureSchema`, `sisad-signaturePolicy` | un test “no crash” detectado | p12 cleanup, provider policy, external runner compatibility | P0 |
| Schemas date/barcode/graphics/multiVariable/shapes/tables | varios | render/validation | cobertura baja/fragmentada | muchos faltantes | matriz por schema (unit/component/e2e/generator/viewer/snapshot) | P0 |
| Runtime UI | `ui/Designer.tsx`, `Form.tsx`, `Viewer.tsx`, `designerEngine.ts` | runtime contracts | `designerEngine*`, `dynamicTemplate`, `staticSchema` | falta flujo completo por snapshot real | paridad visual y funcional Form/Viewer/Designer | P0 |
| External forms | `externalForms/externalFormRunner.ts` | filtering+persist by `schemaUid` | sin cobertura directa | n/a | P0 completo: recipient/doc/page filters + required/readonly | P0 |
| Generator | `generator/*` | render final PDF | `generatorHelper.test.ts` parcial | no paridad por schema amplia | text/checkbox/radio/signature/multi-doc/page + empty handling | P0 |
| Converter | `converter/*` | `pdf2size/pdf2img/img2pdf` | cobertura mínima | n/a | corrupt/encrypted/worker error/cancel/retry/memory | P0 |
| CSS/responsive | estilos globales/canvas/sidebars | layout/viewport | e2e parcial | asserts laxos | matrix 390/412/768/1280/1440 + overlays in viewport/no blank canvas | P1 |
| Accesibilidad | roles/focus/aria | parcial vía RTL/E2E incidental | casi sin suite dedicada | falta suite a11y formal | dialog/focus return/keyboard nav/labels/contrast announcers | P2 |

## Detecciones explícitas (Fase 1 solicitada)

1. Métodos sin pruebas directas: `overlayManager.ts`, `externalFormRunner.ts`, `schemaAutoPlace.ts`, parte de `designerCommands.ts`, `keyboardShortcutRegistry.ts`, `useDesignerKeyboardShortcuts.ts`.
2. Métodos con pruebas superficiales: varios shortcuts/collab E2E con asserts de liveness.
3. Tests “no crashea”: detectados en `tests/playwright/pdfme-editor.spec.ts` y uno en `tests/unit/sisad-signaturePolicy.test.ts`.
4. Tests duplicados/solapados: familia `collaboration*.test.ts` y `schemaIdentity`/`sisad-schemaIdentity`/`sisad-v3Contract`.
5. Tests frágiles por texto: varios `getByText` rígidos en E2E para labels de UI.
6. Tests que deberían usar `data-testid/roles/helpers`: overlays/context toolbar/context menu/drag placeholders.
7. Flujos E2E no cubiertos: import/export snapshot end-to-end, lock duro multiusuario, validator navigation, external runner parity.
8. Casos DocuSign/Wix no cubiertos completamente: tab-order, apply-all-pages/docs, approval/decline/payment conceptual fields, conditional hidden enforcement.
9. Funciones críticas sin edge cases: UID collision recovery, lock orphan cleanup with network loss, converter failure recovery.
10. Visuales sin validación robusta: clipping/viewport safe-area/zoom+scroll offset invariants.

## Plan de ejecución por fases (implementación incremental)

- `Sprint P0-A`: Identity/migration/snapshot/validator + command bus hard assertions.
- `Sprint P0-B`: canvas interactions + locks multiusuario + schema matrix base (text/checkbox/radio/select/signature).
- `Sprint P0-C`: runtime Form/Viewer/Generator/ExternalRunner + converter failures.
- `Sprint P1`: overlays, right/left sidebar profundas, shortcuts cross-platform completas.
- `Sprint P2`: responsive y accesibilidad.

## Comandos de validación (estado requerido)

```bash
npm run build
npm run test
npm run test:e2e
```
