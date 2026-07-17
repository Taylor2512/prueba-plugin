# AGENTS.md — Entrada para agentes

La fuente de verdad se encuentra en `ai/**`.

## Lectura mínima

```txt
ai/start/START.md
ai/project/worktree-topology.md
ai/project/git-operating-model.md
ai/router/ROUTER.md
ai/router/CONTEXT_BUDGET.md
```

## Topología

| Rol | Carpeta | Rama | Puerto |
|---|---|---|---:|
| Coordinador | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin` | `main` | — |
| Integrador | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/merge` | `ai/integration` | 5174 |
| Codex | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/codex` | `ai/codex` | 5181 |
| Claude | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/claude` | `ai/claude` | 5182 |
| Copilot | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/copilot` | `ai/copilot` | 5183 |

Antes de editar:

```bash
pwd
git branch --show-current
git status --short
```

## Reglas duras

1. Una task-card por ejecución.
2. Respetar owned y forbidden paths.
3. Implementadores no trabajan en `main` ni `ai/integration`.
4. No hacer auditoría global salvo tarea explícita.
5. No cambiar expected o snapshots para ocultar defectos.
6. No crear CSS global, `@apply` ni skin ordinario en `runtimeStyles.ts`.
7. No usar merge, cherry-pick, rebase, push, pull, reset, clean o stash.
8. Commits atómicos en la rama del agente.
9. Handoff externo obligatorio.
10. Solo el integrador ejecuta el gate.
11. `main` avanza mediante `git merge --ff-only ai/integration`.

## Coordinación viva

```txt
/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai-coordination/sisad-pdfme
```
