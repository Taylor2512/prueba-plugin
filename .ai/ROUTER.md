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
