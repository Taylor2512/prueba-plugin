# Topología de worktrees embebidos

| Rol | Carpeta | Rama | Puerto |
|---|---|---|---:|
| Main | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin` | `main` | — |
| Integración | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/merge` | `ai/integration` | 5174 |
| Codex | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/codex` | `ai/codex` | 5181 |
| Claude | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/claude` | `ai/claude` | 5182 |
| Copilot | `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.worktrees/copilot` | `ai/copilot` | 5183 |

## Decisión

El modelo vigente usa el checkout principal como coordinador y rehidrata los
worktrees dentro de `.worktrees/`. Las carpetas hermanas `prueba-plugin-*`
quedaron fuera del flujo normal. Si aparecen como `prunable`, deben eliminarse
o recrearse únicamente dentro de este repositorio.

## Visualización unificada

Abrir:

```txt
SISAD-PDFME-MULTIAGENT.code-workspace
```

El workspace muestra main, integration, codex, claude y copilot como raíces separadas.

## Ciclo

```txt
trabajo aislado → commits → handoff local → integration → gate → ff-only main → realineación → rehidratar .worktrees/
```
