# Router por intención

| Intención | Ruta | Agente principal | Skill |
|---|---|---|---|
| bug de selección, drag o geometría | `routes/canvas.md` | Canvas Specialist | `sisad-canvas-interaction` |
| comportamiento de panel derecho | `routes/right-sidebar.md` | UX/Inspector | `sisad-responsive-ux` |
| catálogo o DnD del panel izquierdo | `routes/left-sidebar.md` | UX/Schema | `sisad-schema-plugin` |
| propiedad o widget DetailView | `routes/inspector.md` | Inspector Specialist | `sisad-inspector-contract` |
| schema nuevo o familia | `routes/schemas.md` | Schema Specialist | `sisad-schema-plugin` |
| flags/configuración | `routes/configuration.md` | Config Specialist | `sisad-configuration-service` |
| snapshot/persistencia | `routes/snapshot.md` | Runtime Reviewer | `sisad-snapshot-compatibility` |
| Form/Viewer/Generator | `routes/runtime.md` | Runtime Architect | `sisad-public-api-compatibility` |
| UI responsive/visual | `routes/ux-design.md` | UX Designer | `sisad-responsive-ux` |
| Tailwind/tokens | `routes/css-tailwind.md` | Design System | `sisad-tailwind-design-system` |
| accesibilidad | `routes/accessibility.md` | Accessibility | `sisad-accessibility` |
| rendimiento | `routes/performance.md` | Performance | `sisad-react-performance` |
| pruebas | `routes/testing.md` | QA | `sisad-testing-pyramid` |
| duplicidad/dead code | `routes/quality.md` | DRY Analyst | `sisad-dry-refactor` |
| memoria/tareas | `routes/docs-memory.md` | Memory Steward | `sisad-memory-delta` |

Una tarea puede consultar varias rutas, pero solo una es propietaria del parche.
