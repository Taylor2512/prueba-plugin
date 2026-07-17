# ai/ — Fuente de verdad para asistentes IA

Esta carpeta centraliza la arquitectura de trabajo asistido de SISAD PDFME.

## Principios

- Una sola fuente de verdad documental.
- Una task-card por ejecución.
- Contexto modular y limitado.
- Aislamiento de implementación mediante worktrees.
- Ownership exclusivo por archivo y wave.
- Integración serializada en `ai/integration`.
- `main` solo recibe resultados validados mediante fast-forward.
- Memoria y riesgos actualizados después de cada wave.

## Orden de lectura

```txt
1. start/START.md
2. project/worktree-topology.md
3. project/git-operating-model.md
4. router/ROUTER.md
5. router/CONTEXT_BUDGET.md
6. memory/project-memory.md
7. coordination/worktrees/WAVE-<n>.md
8. task-cards/active/<task>.md
9. context/<context>.md
10. rules/<rule>.md
11. playbooks/<playbook>.md
```

## Capas

| Carpeta | Responsabilidad |
|---|---|
| `start/` | Entrada y quickstarts por proveedor |
| `project/` | Contratos estables de arquitectura y Git |
| `router/` | Selección de dominio, agente lógico y contexto |
| `agents/` | Responsabilidades lógicas del producto |
| `coordination/` | Protocolos versionados; la coordinación viva es externa |
| `task-cards/` | Trabajo actual, backlog e histórico |
| `context/` | Qué debe conocer el agente |
| `rules/` | Qué no debe romper |
| `playbooks/` | Cómo ejecutar |
| `memory/` | Decisiones, riesgos, estado y handoff |
| `checklists/` | Gates manuales y automáticos |
| `prompts/` | Prompts reutilizables, no sustituyen task-cards |
| `reports/` | Evidencia producida por auditorías o ejecución |
| `docs-migration/` | Cambios de arquitectura documental |

## Coordinación viva

Los archivos mutables de una wave no se guardan dentro de un worktree porque divergirían entre ramas.

Ruta canónica local:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/ai-coordination/sisad-pdfme
```

## Nunca cargar por defecto

```txt
todos los archivos ai/**
reports históricos completos
unificados/**
test-results/**
dist/**
node_modules/**
.tailwind-migration-backups/**
```
