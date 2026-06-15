# AGENTS.md — Router IA compacto

| Tipo de tarea | Agente |
|---|---|
| Arquitectura/refactor | `frontend-architect-agent` |
| Canvas/coordenadas/multipágina | `canvas-runtime-agent` |
| Moveable/Selecto/shortcuts | `moveable-selecto-agent` |
| Snapshot/import/export | `snapshot-agent` |
| Form/Viewer/Generator | `form-viewer-generator-agent` |
| DetailView/Inspector | `right-sidebar-inspector-agent` |
| CSS/visual compact | `css-agent` |
| Standard schemas | `standard-fields-agent` |
| ExternalForms/host | `external-forms-agent` |
| Reducción legacy | `legacy-cleanup-agent` |
| Testing/regresión | `testing-regression-agent` |

## Regla de carga

Cada agente carga solo:

```txt
1 contexto principal
2 reglas máximo
1 prompt máximo
```

Usar `root-orchestrator-agent` solo si afecta 3 o más áreas: Designer, Canvas, Renderer, Selecto, Moveable, CommandBus, Snapshot, Form, Viewer, Generator, externalForms o CSS.
