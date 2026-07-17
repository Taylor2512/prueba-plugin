# Task Cards

Una task-card es una unidad cerrada y verificable.

## Carpetas

```txt
active/     trabajo autorizado
backlog/    trabajo propuesto
completed/  trabajo validado
```

## Campos obligatorios

- wave;
- proveedor;
- agente lógico;
- worktree;
- rama;
- objetivo;
- owned paths;
- forbidden paths;
- tests focales;
- criterios de aceptación;
- handoff esperado;
- integración requerida.

## Regla

Una ejecución IA trabaja sobre una sola task-card.

Una task-card no autoriza al agente a cambiar de rama, editar `main`, integrar o ampliar scope.
