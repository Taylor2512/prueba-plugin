# TASK-ARCH-003 — Respetar arquitectura real de carpetas IA

## Estado

active

## Objetivo

Corregir cualquier paquete, documentación o prompt que cree carpetas paralelas fuera de la arquitectura real del repositorio.

## Contexto

El repo ya contiene una arquitectura IA formal:

```txt
ai/start
ai/router
ai/memory
ai/task-cards
ai/agents
ai/subagents
ai/skills
ai/playbooks
ai/rules
ai/context
ai/checklists
ai/prompts
ai/reports
docs
reports
scripts
src
tests
```

No se deben crear carpetas como `architecture/`, `migration/`, `repo-patch/`, `01-resumen/`, `02-inventarios/`.

## Archivos foco

- `AGENTS.md`
- `CLAUDE.md`
- `.github/copilot-instructions.md`
- `ai/start/START.md`
- `ai/router/ROUTER.md`
- `ai/router/CONTEXT_BUDGET.md`
- `ai/router/TASK_INTAKE.md`
- `ai/memory/*.md`
- `ai/task-cards/**/*.md`
- `ai/rules/*.md`
- `ai/playbooks/*.md`
- `ai/context/*.md`

## Tareas

- [ ] Auditar referencias a carpetas paralelas.
- [ ] Eliminar de prompts cualquier instrucción que cree estructuras fuera del repo real.
- [ ] Confirmar que completed no se trate como active.
- [ ] Confirmar que docs públicas no contengan prompts operativos.
- [ ] Confirmar que ai no duplique documentación pública extensa.
- [ ] Crear reporte en `ai/reports/architecture-correction-YYYY-MM-DD.md`.

## Criterios de aceptación

- No hay nueva carpeta raíz no reconocida.
- `ai/**` conserva su función operativa.
- `docs/**` conserva su función pública.
- `reports/**` queda como evidencia, no contexto activo.
- Completed no se reabre.
