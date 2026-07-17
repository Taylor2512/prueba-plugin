# Topología de worktrees reutilizables

## Mapa

| Rol | Carpeta | Rama | Puerto |
|---|---|---|---:|
| Main/coordinador | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin` | `main` | — |
| Integración | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-merge` | `ai/integration` | 5174 |
| Codex | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-codex` | `ai/codex` | 5181 |
| Claude | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-claude` | `ai/claude` | 5182 |
| Copilot | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin-copilot` | `ai/copilot` | 5183 |

## Fuente

Todos son worktrees del mismo repositorio Git. No son clones independientes.

## Coordinación viva

```txt
/Users/desarrollo1/Documents/Taylor/frontend/ai-coordination/sisad-pdfme
```

Esta ruta es externa porque los archivos dentro de una rama no son visibles automáticamente en las otras hasta integrar.

## Reutilización

Las mismas ramas y carpetas se reutilizan en todas las waves:

```txt
trabajo aislado
→ commits
→ handoffs externos
→ cherry-pick en ai/integration
→ gate
→ fast-forward main
→ realineación controlada
```

## Regla de identidad

Un proveedor se detiene si `pwd` y `git branch --show-current` no coinciden con su fila.
