# START — Entrada única para cualquier asistente IA

## 1. Valida tu topología antes de leer código

Ejecuta:

```bash
pwd
git branch --show-current
git status --short
```

Compara el resultado con:

```txt
ai/project/worktree-topology.md
```

Si carpeta y rama no coinciden con tu rol, detente sin editar.

## 2. Identifica la wave y task-card

Lee:

```txt
ai/coordination/worktrees/WAVE-1.5.md
ai/task-cards/active/<task>.md
```

Solo una task-card por ejecución.

## 3. Enruta el dominio

Usa:

```txt
ai/router/ROUTER.md
ai/router/TASK_INTAKE.md
```

El agente de proveedor —Codex, Claude o Copilot— ejecuta un agente lógico del dominio. No sustituye el contrato del agente lógico.

## 4. Aplica presupuesto

Usa:

```txt
ai/router/CONTEXT_BUDGET.md
```

Por slice:

- máximo 2 consultas globales `rg`;
- máximo 8 archivos inspeccionados;
- máximo 5 archivos productivos modificados;
- tests directos adicionales permitidos.

## 5. Carga memoria mínima

```txt
ai/memory/project-memory.md
ai/memory/decisions.md
ai/memory/known-risks.md
ai/memory/session-handoff.md
```

## 6. Carga contexto focal

La task-card debe declarar:

```txt
context
rules
playbook
owned paths
forbidden paths
tests focales
```

No cargues todos los Markdown.

## 7. Reclama lock externo

Ruta:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/ai-coordination/sisad-pdfme/locks
```

Ejemplo:

```bash
mkdir /Users/desarrollo1/Documents/Taylor/frontend/ai-coordination/sisad-pdfme/locks/<TASK-ID>.lock
```

Si existe, no comiences.

## 8. Declara antes de editar

```md
## Router decision
- Proveedor:
- Worktree:
- Rama:
- Wave:
- Task-card:
- Agente lógico:
- Contexto:
- Reglas:
- Playbook:
- Owned paths:
- Forbidden paths:
- Tests focales:
```

## 9. Implementa y valida

El agente puede ejecutar:

- ESLint focal;
- Vitest focal;
- Playwright focal en su puerto asignado;
- build solo cuando la task-card lo exige y no existe otro proceso pesado.

No puede ejecutar integración, merge o cambios sobre `main`.

## 10. Commit y handoff

- Commits atómicos en la rama del agente.
- Máximo 5 archivos productivos por commit.
- Escribir handoff en la coordinación externa.
- Liberar lock.
- Detenerse.

## 11. Integración

Solo el integrador sigue:

```txt
ai/start/QUICKSTART-INTEGRATOR.md
ai/coordination/worktrees/INTEGRATION-PROTOCOL.md
```
