# AGENTS.md — Router neutral IA para SISAD PDFME Designer

## Inicio obligatorio

1. Leer `.ai/INDEX.md`.
2. Leer `.ai/ROUTER.md`.
3. Leer `.ai/CONTEXT_BUDGET.md`.
4. Leer `.ai/memory/project-memory.md`.
5. Seleccionar exactamente 1 task-card.
6. Cargar máximo 1 contexto + 1 regla + 1 playbook.
7. Inspeccionar código real con `rg`.

## Agentes

| Agente | Uso |
|---|---|
| `designer-runtime-agent` | Designer general, estado, composición |
| `canvas-runtime-agent` | Canvas, páginas, coordenadas, drop |
| `moveable-selecto-agent` | Moveable, Selecto, guards, shortcuts |
| `schema-architecture-agent` | schemas, families, registry, factories |
| `inspector-agent` | DetailView, ListView, widgets, inspector contracts |
| `commandbus-agent` | command bus, selectionCommands, undo/redo |
| `snapshot-designer-agent` | snapshot del diseñador, import/export metadata |
| `css-visual-agent` | CSS scoped, field chrome, visual compact |
| `solid-refactor-agent` | SOLID, OOP, type safety, reducción any |
| `docusign-process-agent` | análisis funcional DocuSign-like ya resumido |

## Regla

Un agente no puede cambiar de dominio durante la tarea. Si detecta otro dominio, debe reportar nueva task-card.
