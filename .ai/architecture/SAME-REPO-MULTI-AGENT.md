# Same-repo multi-agent architecture

## Restricción del proyecto

Todos los asistentes comparten:

```text
same repository
same branch
same working tree
no worktrees
```

La concurrencia segura se obtiene mediante ownership de archivos, no mediante aislamiento Git.

## Roles

```text
Coordinator
  ├── Writer A
  ├── Writer B
  └── Reviewer/Scout
```

Los roles son provider-neutral. Claude/Codex/Copilot pueden intercambiarlos.

## Invariantes

1. un path productivo tiene máximo un writer activo;
2. ningún agente revierte una modificación que no creó;
3. un diff ajeno es input, no basura;
4. commits/push se serializan mediante lease `integrator`;
5. full-suite/build se ejecuta bajo validation barrier cuando los writers estén estables;
6. un agente que encuentra claim conflict cambia de task/superficie o pasa a read-only;
7. todos leen live source antes de actuar;
8. no se usa worktree como salida automática.

## Tipos de claim

- `write`: edición exclusiva de paths;
- `review`: lectura/revisión, no bloquea writers;
- `integrator`: único agente que puede commit/push;
- `validation`: congelación temporal para full gates.

## Estrategia recomendada con 3 agentes

### Agente A — P0 writer

Una única autoridad productiva crítica, por ejemplo runtime access.

### Agente B — tests/tooling

Caracterización, E2E, stress harness o quality tooling en paths separados.

### Agente C — reviewer/UX/docs

Auditoría, contratos, VISUX, documentación, tests nuevos no solapados.

Cuando A termina, B puede reclamar la siguiente superficie productiva.
