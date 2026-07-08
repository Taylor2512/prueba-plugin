# ai/ — Fuente de verdad para asistentes IA

Esta carpeta centraliza todo lo que un asistente necesita para trabajar sin alucinar ni gastar tokens de más.

## Filosofía

- Una sola fuente de verdad.
- Un proceso por tarea.
- Documentación modular.
- Memoria actualizable.
- Agentes con responsabilidades separadas.
- Task-cards pequeñas y verificables.

## Orden de lectura recomendado

```txt
1. start/START.md
2. router/ROUTER.md
3. router/CONTEXT_BUDGET.md
4. memory/project-memory.md
5. project/scope.md
6. task-cards/<task>.md
7. context/<context>.md
8. rules/<rule>.md
9. playbooks/<playbook>.md
```

## Nunca cargar por defecto

```txt
- todos los archivos ai/**
- reportes históricos largos
- candidates generados completos
- screenshots completos
- código completo del proyecto
- node_modules
- dist/build
```
