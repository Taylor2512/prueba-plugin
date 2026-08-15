# Ledger — Runtime Platform

<!-- effective-runtime-state:start -->
## Effective runtime state

Canonical generated view: [views/RUNTIME-PLATFORM.md](../../scrum/views/RUNTIME-PLATFORM.md)

This block overrides stale status summaries below; historical entries remain provenance.
<!-- effective-runtime-state:end -->

- `RTP-000` — wave 0 — P0 — READY — Live source truth, Git/hash drift y baseline
- `RTP-005` — wave 0 — P0 — BACKLOG — Canonicalizar infraestructura Playwright/Vitest y test authority
- `RTP-010` — wave 0 — P1 — BACKLOG — Fijar identidad SISAD-PDFME y nomenclatura policy
- `RTP-020` — wave 0 — P0 — BACKLOG — Inventario registry-derived + generic runtime characterization harness
- `RTP-030` — wave 1 — P0 — BACKLOG — Motor local-first de transacciones Form
- `RTP-040` — wave 1 — P0 — PASS — Origin/revision y controlled/uncontrolled reconciliation
- `RTP-045` — wave 1 — P0 — PASS — Facade público: props declaradas vs. propagadas
- `RTP-050` — wave 1 — P1 — BACKLOG — Eventos canónicos de input/runtime + adapters legacy
- `RTP-060` — wave 1 — P0 — BACKLOG — Lifecycle, remount, focus, caret, IME y cleanup
- `RTP-070` — wave 2 — P0 — BACKLOG — SchemaRuntimeManifest incremental sobre registry existente
- `RTP-080` — wave 2 — P0 — BACKLOG — SchemaValueCodec por familia
- `RTP-090` — wave 2 — P0 — PASS — Validation, touched, dirty, completion y access boundary
- `RTP-100` — wave 3 — P0 — BACKLOG — Text-like, number, presets y multiVariableText
- `RTP-110` — wave 3 — P0 — BACKLOG — Select/dropdown, checkbox, radioGroup, checkboxGroup
- `RTP-120` — wave 3 — P0 — BACKLOG — Date, time, dateTime y dateSigned
- `RTP-130` — wave 3 — P0 — BACKLOG — Signature, initials, draw/image/P12/provider
- `RTP-140` — wave 3 — P0 — BACKLOG — Attachment, note, approve y decline artifacts/actions
- `RTP-150` — wave 3 — P1 — BACKLOG — Image/SVG/table/shapes/barcodes visual/complex schemas
- `RTP-160` — wave 3 — P1 — BACKLOG — Custom plugin runtime contract and auto-discovery harness
- `RTP-170` — wave 4 — P0 — BACKLOG — Viewer zero-mutation and parity
- `RTP-180` — wave 4 — P0 — BACKLOG — Generator/preflight parity and structured values
- `RTP-190` — wave 4 — P0 — BACKLOG — PDF.js converter loading/render/cancel/cleanup/concurrency
- `RTP-200` — wave 4 — P0 — BACKLOG — Snapshot, bundle, migration and semantic roundtrip
- `RTP-210` — wave 4 — P0 — BACKLOG — Multi-document/multipage routing and active ID isolation
- `RTP-220` — wave 5 — P0 — BACKLOG — Recipients, ownership, colors, locks and runtime access
- `RTP-225` — wave 5 — P1 — BACKLOG — N ejecuciones aisladas sin asumir fan-out masivo
- `RTP-230` — wave 5 — P1 — BACKLOG — Comments, collaboration and conflict-safe state
- `RTP-240` — wave 5 — P0 — BACKLOG — Persistence/save/autosave one-write lifecycle
- `RTP-250` — wave 5 — P0 — BACKLOG — Declarative config profiles and capability resolution
- `RTP-260` — wave 5 — P0 — BACKLOG — Controller/public API/action-state parity
- `RTP-270` — wave 6 — P0 — BACKLOG — Keyboard, accessibility, pointer/touch/pen and responsive runtime
- `RTP-280` — wave 6 — P0 — BACKLOG — Performance/memory/leak campaign for large PDFs/schemas
- `RTP-290` — wave 6 — P0 — BACKLOG — Security/privacy/artifact sanitization and secret boundaries
- `RTP-300` — wave 6 — P1 — BACKLOG — Examples + docs as contract consumers, no demo-runtime duplication
- `RTP-310` — wave 6 — P0 — BACKLOG — All-schema Playwright + integration/release gates
- `RTP-315` — wave 6 — P0 — BACKLOG — Concurrencia real de sesiones con BrowserContext aislados
- `RTP-320` — wave 7 — P0 — BACKLOG — Consumer integration smoke and distribution contract
- `RTP-330` — wave 7 — P1 — BACKLOG — Modernizar nomenclatura legacy Pdfme* sin romper compatibilidad
- `RTP-340` — wave 7 — P1 — BACKLOG — Brain/docs/index/evidence closeout and context regeneration

<!-- runtime-execution:ledger:start -->
## Execution orchestration continuation

| Task | Focus |
|---|---|
| RTP-345 | Brain/context/path reconciliation |
| RTP-350 | execution baseline |
| RTP-355 | schema interaction/completion |
| RTP-360 | User assignments/value scope |
| RTP-365 | RuntimeSession × User × Document |
| RTP-370 | ExecutionPlan |
| RTP-375 | sequential |
| RTP-380 | parallel |
| RTP-385 | mixed/shared conflicts |
| RTP-390 | massive fan-out |
| RTP-395 | execution results/PDF artifacts |
| RTP-400 | canonical PDF merge |
| RTP-405 | append/multi-document/bundle |
| RTP-410 | all-schema harness |
| RTP-415 | browser/performance/privacy/parity |
| RTP-420 | release/closeout |

Status real se determina por source/evidence, no por esta tabla.
<!-- runtime-execution:ledger:end -->

<!-- autonomous-runtime:ledger:start -->
## Autonomous runtime continuation

| Range | Focus |
|---|---|
| RTP-425..445 | source/config/capability authority |
| RTP-450..465 | grid + Designer convergence |
| RTP-470..480 | runtime + schema registry/codec |
| RTP-485..505 | concurrency/completion/merge/result/PDF |
| RTP-510..520 | real multi-user + all-schema + comparator |
| RTP-525..535 | User migration + legacy/dead/dedup |
| RTP-540..545 | production gates + release |

Actual state is source/evidence-driven. This section is not evidence of completion.
<!-- autonomous-runtime:ledger:end -->

## Registro ejecutado — campaña autónoma RTP-425..545

Estado derivado de `reports/runtime-platform/evidence/` y verificado con
`node scripts/ai/runtime-work-queue.mjs status .`. Esta tabla NO es autoridad:
lo es la evidencia.

| Task | Estado | Entregado |
|---|---|---|
| RTP-425 | PASS | baseline reconciliado; `createState` inexistente corregido (P0); `converter/types.d.ts` → `types.ts`; generador único de manifest/tests; `collectChangedInputs` extraído |
| RTP-430 | PASS | inventario de 59 capabilities con ids namespaced sobre 6 registries |
| RTP-435 | PASS | config compiler: `ResolvedConfig` inmutable, revisión monotónica, hash semántico; `cloneDeep` deja de romper con `config.events` |
| RTP-440 | PASS | CapabilityGraph fail-closed; rejilla dejó de ser inalcanzable; `ui.visibility` ya no pisa la canónica |
| RTP-445 | PASS | `ConfigChangeSet` con transiciones por capability y plan de efectos |
| RTP-450 | PASS | `GridGeometry` en mm de página; paridad renderer/snap verificada en 6 zooms × 3 tamaños |
| RTP-455 | PASS | 8 capabilities de canvas independientes; reglas desacopladas de guías; snap-to-grid real |
| RTP-460 | PASS | Designer converge en el grafo; `align`/`distribute`/`match-size`/`show` dejaron de ignorarse; readonly llega al chrome |
| RTP-465 | PASS | retirada la tercera tabla de visibilidad del menú contextual |
| RTP-470 | PASS | `HttpClientAdapter` transport-neutral; cabeceras sensibles same-origin; bundle sin credenciales |
| RTP-475 | PASS | manifest registry-driven; 13 códigos de barras dejaron de exigir relleno; `dataBinding` por familia |
| RTP-480 | PASS | `SchemaValueCodec` por familia; `DataPointer` sin `eval`; `OptionValue` sin fallback a `options[0]` |
| RTP-485 | PASS | compare-and-swap real: un cliente ya no puede inventar revisión |
| RTP-490 | PASS | completitud tri-estado `complete`/`pending`/`invalid` |
| RTP-495 | PASS | merge canónico con igualdad por codec; un conflicto ya no devuelve ganador publicable |
| RTP-500 | PASS | bytes fuera del estado durable; hash calculado, no declarado |
| RTP-505 | PASS | composición PDF acotada, abortable, sin modos no implementados |
| RTP-510 | **BLOCKED** | gate del Form 20/20 en navegador; multi-documento/firma/estados remotos pendientes (ver evidencia) |
| RTP-520 | PASS | auditoría del comparador: 8/9 conceptos cubiertos; campos condicionales es el único hueco |
| RTP-525 | PASS | frontera User/Recipient en autorrelleno; alias legacy aceptado al leer |
| RTP-530 | **BLOCKED** | `RegisteredUsersSelector` retirado con prueba conductual; 4 `fetch()` directos pendientes por colisión de writers |
| RTP-540 | PASS | gate de rejilla en navegador: 8/8, invariancia en 6 zooms |
| RTP-545 | **BLOCKED** | release gates no cerrables: RTP-510/RTP-515 pendientes y 147 errores TypeScript |

Pendientes/bloqueadas: RTP-510, RTP-515, RTP-530, RTP-535, RTP-545.

### Gates medidos

```text
contratos  48 archivos / 1137 tests PASS
e2e        54 PASS / 2 skipped documentados
tsc        147 (baseline 148; un error cerrado, sin regresión)
```

`tsc` NO está en verde: 148 errores preexistentes siguen abiertos y RTP-545
debe reducirlos o registrarlos como deuda explícita.
