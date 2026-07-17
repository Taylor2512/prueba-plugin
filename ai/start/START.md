# START — Entrada única

## 1. Validar identidad

```bash
pwd
git branch --show-current
git status --short
```

Compara con `project/worktree-topology.md`. Si no coincide, detente.

## 2. Identificar wave y task-card

```txt
coordination/worktrees/WAVE-<n>.md
task-cards/active/<task>.md
```

Una ejecución trabaja sobre una sola task-card.

## 3. Enrutar dominio

```txt
router/ROUTER.md
router/TASK_INTAKE.md
```

Ejemplo:

```txt
Proveedor: Claude
Agente lógico: inspector-agent
Rol Git: implementador
```

## 4. Aplicar presupuesto

```txt
router/CONTEXT_BUDGET.md
```

- 2 búsquedas globales.
- 8 archivos fuente.
- 5 archivos productivos por commit.
- Tests directos adicionales.
- Un dominio principal.

## 5. Cargar memoria

```txt
memory/project-memory.md
memory/decisions.md
memory/known-risks.md
memory/session-handoff.md
```

## 6. Cargar contexto focal

La task-card declara context, rules, playbook, owned paths, forbidden paths y tests.

## 7. Reclamar lock externo

```bash
mkdir /Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin/.ai-coordination/sisad-pdfme/locks/<TASK-ID>.lock
```

## 8. Declarar decisión

```md
## Router decision
- Proveedor:
- Rol:
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
- Tests:
```

## 9. Implementar

- Cambio mínimo.
- Sin auditoría paralela.
- Sin arreglar rutas ajenas.
- Sin expected falsos.
- Sin CSS global ni `@apply`.
- Sin duplicar wrappers o estados.

## 10. Entregar

1. ESLint focal.
2. Vitest focal.
3. Playwright focal cuando aplique.
4. `git diff --check`.
5. Commit atómico.
6. Handoff externo.
7. Liberar lock.
8. Detenerse.
