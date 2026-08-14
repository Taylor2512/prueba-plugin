# Router

El router selecciona una sola superficie propietaria. Devuelve `routeId`,
`owner`, `skillIds`, `risk`, `contextBudget`, `protectedPaths`, `gates` y
`stopConditions`.

| Intención | Route | Skill principal |
|---|---|---|
| usuarios, colores, asignación | recipients-ownership | recipient-assignment |
| catálogo y drag | left-sidebar | left-sidebar |
| Canvas y selección | canvas | canvas-safety |
| DetailView | inspector | inspector-contract |
| familia de schema | schemas | schema-family |
| eventos/efectos/comandos | runtime-contracts | event-effect |
| configuración/actions | configuration | configuration |
| documentos/snapshot | persistence | snapshot |
| Form/Viewer/Generator | runtimes | runtime-parity |
| responsive/a11y/Tailwind | ux | responsive-ux |
| IA, memoria, tokens | ai-architecture | context-engineering |
| tests/calidad | quality | quality-evidence |

Las routes viven en `.ai/routes/`. Una sola route posee el parche; las demás
aportan contratos de lectura cuando exista una dependencia demostrada.

<!-- runtime-execution:router:start -->
## Execution/runtime routes

- multi-user / sequential / parallel / massive -> `.ai/routes/execution-orchestration.md`
- touched / dirty / completed / schema completion -> `.ai/routes/schema-completion.md`
- PDF merge / append / composition -> `.ai/routes/pdf-composition.md`
<!-- runtime-execution:router:end -->

<!-- autonomous-runtime:router:start -->
## Runtime capability routes

- dynamic JSON / capability graph -> `.ai/plans/PLAN_SISAD_PDFME_DYNAMIC_CAPABILITIES.md`
- grid / snap / guides -> `.ai/plans/PLAN_SISAD_PDFME_GRID_GEOMETRY.md`
- schema manifest / codec -> `.ai/plans/PLAN_SISAD_PDFME_SCHEMA_REGISTRY.md`
- legacy / dead code / dedup -> `.ai/plans/PLAN_SISAD_PDFME_LEGACY_CLEANUP.md`
- autonomous completion -> `.ai/plans/PLAN_SISAD_PDFME_AUTONOMOUS_COMPLETION.md`
<!-- autonomous-runtime:router:end -->
