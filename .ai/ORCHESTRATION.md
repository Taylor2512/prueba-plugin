# Orquestación

## Topología por defecto

```text
Main owner (write)
├── Explorer (read-only, opcional)
└── Reviewer/QA (read-only, opcional)
```

## Delegación permitida

- buscar callers y contratos;
- clasificar clones;
- ejecutar tests independientes;
- revisar documentación versionada;
- revisar un diff ya producido.

## Delegación no recomendada

- dos agentes editando el mismo archivo;
- refactor y migración de snapshot en paralelo;
- agentes que abren nuevas tareas sin autorización;
- “equipo” de agentes para una tarea de menos de tres archivos;
- subagentes que devuelven logs sin síntesis.

## Worktrees

Cada escritor paralelo usa una rama y worktree propios. El coordinador registra en la task-card: worktree, rama, archivos, commit y gates. La integración se hace por commits revisables, nunca copiando directorios completos.

## WIP

Máximo tres task-cards activas en el sprint; una por dominio sensible. Si el WIP está lleno, termina o bloquea antes de comenzar otra.
