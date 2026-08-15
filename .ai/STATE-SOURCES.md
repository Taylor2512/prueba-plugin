# Fuentes de estado

Esta tabla describe el **worktree actual**. Una ruta inexistente no puede ser
tratada como autoridad solo porque aparezca en documentación histórica.

| Concepto | Fuente canónica actual |
|---|---|
| entrada operativa | `.ai/START.md` |
| trabajo activo resumido | `.ai/brain/80-work/ACTIVE.md` |
| campaña Runtime Platform | `.ai/scrum/views/RUNTIME-PLATFORM.md` |
| task-cards | `.ai/scrum/task-cards/**/*.md` |
| backlog general | `.ai/scrum/views/BACKLOG.md` |
| continuidad inmediata | `.ai/brain/70-memory/HANDOFF.md` |
| estado técnico resumido | `.ai/brain/70-memory/CURRENT.md` |
| memoria durable | `.ai/memory/PROJECT.md`, `.ai/memory/INDEX.md`, `.ai/memory/topics/` |
| decisiones durables | `.ai/brain/30-decisions/*.md` |
| conocimiento de dominio | `.ai/brain/**`, `.ai/contracts/**`, `.ai/knowledge/**` |
| índices generados | `.ai/index/**` |
| evidencia | ruta declarada por la task-card; Runtime Platform usa `reports/runtime-platform/evidence/` |
| reportes | `reports/**`; son cold/evidence, no estado operativo |

## Rutas históricas no canónicas

No inventar ni recrear automáticamente estas fuentes solo para satisfacer
documentación antigua:

```text
.ai/scrum/SPRINT-CURRENT.md
.ai/scrum/CLAIMS.md
.ai/scrum/backlog.jsonl
.ai/scrum/backlog-v8.jsonl
.ai/memory/CURRENT.md
.ai/memory/HANDOFF.md
.ai/catalogs/
.ai/evidence/
```

Si una futura migración decide adoptarlas, debe hacerlo mediante una task
explícita y actualizar esta tabla, scripts, tests y enlaces en el mismo cambio.
