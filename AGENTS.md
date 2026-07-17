# AGENTS.md — Entrada delgada para asistentes

Este archivo existe para herramientas que leen `AGENTS.md` automáticamente.

La fuente de verdad no está aquí. Antes de modificar código, cualquier agente debe leer:

```txt
ai/start/START.md
ai/router/ROUTER.md
ai/router/CONTEXT_BUDGET.md
ai/project/worktree-topology.md
ai/project/git-operating-model.md
```

## Topología obligatoria

| Rol | Carpeta | Rama |
|---|---|---|
| Coordinador/main | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin` | `main` |
| Integración | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-merge` | `ai/integration` |
| Codex | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-codex` | `ai/codex` |
| Copilot | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-copilot` | `ai/copilot` |
| Claude | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-claude` | `ai/claude` |

Un agente de implementación nunca trabaja en `main` ni en `ai/integration`.

## Inicio obligatorio

Antes de editar:

```bash
pwd
git branch --show-current
git status --short
```

La carpeta y la rama deben coincidir con el rol asignado.

## Reglas duras

1. Seleccionar una sola task-card.
2. Respetar `owned paths` y `forbidden paths`.
3. No hacer auditorías globales salvo task-card explícita.
4. No cambiar `expected`, snapshots o tests para ocultar regresiones.
5. No crear CSS global, `@apply` ni skin visual en `runtimeStyles.ts`.
6. No ejecutar `git merge`, `git cherry-pick`, `git rebase`, `git push`, `git pull`, `git reset --hard`, `git clean` o `git stash`.
7. Cada agente crea commits atómicos únicamente en su rama.
8. Solo el integrador usa `ai/integration`.
9. `main` avanza únicamente mediante `git merge --ff-only ai/integration`.

## Documentación pública

`docs/` documenta SISAD PDFME para consumidores. No debe contener coordinación de agentes, task-cards, prompts ni memoria IA.
