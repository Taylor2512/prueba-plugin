# START — Entrada única para cualquier asistente IA

Antes de modificar código, sigue este flujo.

## 1. Identifica el tipo de tarea

Usa:

```txt
ai/router/ROUTER.md
```

## 2. Aplica presupuesto

Usa:

```txt
ai/router/CONTEXT_BUDGET.md
```

## 3. Carga memoria mínima

Usa:

```txt
ai/memory/project-memory.md
ai/memory/decisions.md
ai/memory/session-handoff.md
```

## 4. Selecciona solo una task-card

Usa:

```txt
ai/task-cards/active/<task>.md
```

Si no existe, créala desde:

```txt
ai/templates/task-card-template.md
```

## 5. Carga contexto, regla y playbook focal

Ejemplo para migración Tailwind visual:

```txt
context/css-tailwind-context.md
rules/css-migration-rules.md
playbooks/pb-css-tailwind-migration.md
```

## 6. Declara antes de editar

```md
## Router decision
- Task-card:
- Contexto:
- Regla:
- Playbook:
- Archivos candidatos:
- Archivos prohibidos:
- Presupuesto:
```

## 7. Criterio de parada

Detente si necesitas:

- más de 5 archivos modificados;
- más de 8 archivos abiertos;
- tocar un proceso distinto;
- tocar `Moveable`, `Selecto`, snapshot, generator o pdf-lib sin task-card explícita;
- resolver por CSS un problema de permisos, metadata o geometría.
