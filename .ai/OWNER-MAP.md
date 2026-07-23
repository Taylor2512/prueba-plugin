# Ownership por dominio

| Dominio | Fuente canónica | Gates especiales |
|---|---|---|
| canvas/interacción | `ui/components/Designer/Canvas` | Vitest + Playwright |
| schemas/plugins | `schemas` + registry | Form/Viewer/Generator/snapshot |
| inspector | `RightSidebar/DetailView` | widget contract + UI focal |
| colaboración | `collaboration`, `assignments`, common | ownership/lock tests |
| snapshot/runtime | `shared`, `runtime`, react | round-trip y compatibilidad |
| documentos | adapters/documents | multi-document routing |
| vendor PDF | `pdf-lib` | pruebas PDF y upstream |
| IA/documentación | `.ai`, `.agents`, adapters | validator + markdown dedup |

Una task-card declara un owner de dominio y no cambia de dominio principal durante la ejecución.
