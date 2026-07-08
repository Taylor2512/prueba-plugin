# Principios de arquitectura

## SOLID aplicado a documentación y código

### SRP — Single Responsibility

Cada archivo Markdown tiene una responsabilidad:

- `context`: qué saber.
- `rules`: qué no romper.
- `playbooks`: cómo ejecutar.
- `task-cards`: qué hacer ahora.
- `memory`: qué recordar.
- `reports`: qué se evidenció.

### OCP — Open/Closed

Agregar nuevos agentes, skills o task-cards sin editar archivos base. El router referencia categorías, no hardcodea todo.

### LSP — Sustitución

Codex, Claude y Copilot deben poder usar el mismo flujo con adaptadores delgados.

### ISP — Interface Segregation

No dar a todos los agentes todo el contexto. Cada agente recibe solo el contexto necesario.

### DIP — Dependency Inversion

Las instrucciones dependen de contratos (`task-card`, `rules`, `context`) y no de un modelo específico.

## Principio anti-duplicidad

No duplicar reglas en `AGENTS.md`, `CLAUDE.md` y Copilot. Esos archivos solo apuntan a `ai/start/START.md`.
