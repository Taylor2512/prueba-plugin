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

- dynamic JSON / capability graph -> `sisad-dynamic-capabilities` skill + capability contracts
- grid / snap / guides -> `sisad-grid-geometry` skill + grid contract
- schema manifest / codec -> schema task-card + schema runtime contracts
- legacy / dead code / dedup -> `sisad-safe-legacy-retirement` skill + active task-card
- autonomous completion -> active queue + `sisad-autonomous-runtime` skill
<!-- autonomous-runtime:router:end -->

<!-- SISAD-PDFME-CONSOLIDATION:.ai/ROUTER.md:START -->
## Consolidation routes

- multi-user/access -> `runtime-access-authority` skill + RTP-510
- all-schema/remote options -> `multiuser-form-release` / RTP-515
- inspector/signing UX -> `inspector-capability-profiles` / VISUX
- same-repo concurrency -> `same-repo-coordination`
- release -> `production-closeout`
<!-- SISAD-PDFME-CONSOLIDATION:.ai/ROUTER.md:END -->

<!-- SISAD-MD-REPAIR:.ai/ROUTER.md:START -->
## Markdown architecture route

For topology, task-status drift, archive, broken navigation or provider-doc duplication:
read `brain/20-contracts/MARKDOWN-TOPOLOGY-CONTRACT.md` and run `npm run architecture -- audit`.
<!-- SISAD-MD-REPAIR:.ai/ROUTER.md:END -->

<!-- AI-STRUCTURE-ROUTE:START -->
## Architecture cleanup route

Markdown topology / orphan / duplicate / Scrum / Brain structure:
use `.ai/prompts/PROMPT_AI_STRUCTURE_CLEANUP.md` and the tooling-architecture MDA cards.
<!-- AI-STRUCTURE-ROUTE:END -->
