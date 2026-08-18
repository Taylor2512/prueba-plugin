# START

## Hot path

```text
AGENTS.md
→ .ai/STATE-SOURCES.md
→ active work / campaign ledger
→ task-card
→ .ai/ROUTER.md
→ one route + one skill
→ source/tests
```

Objetivo de arranque: ≤2.500 tokens y ≤5 archivos de documentación antes de
entrar al source, salvo que la task-card justifique más contexto.

## Secuencia

```text
orientar
→ verificar worktree/HEAD/status
→ resolver tarea y autoridad
→ construir contexto focal
→ reproducir/caracterizar
→ cambio mínimo
→ gates
→ review
→ evidence/trace delta
→ memory delta solo si cambió conocimiento durable
```

## No cargar al inicio

Consolidados completos, todos los task-cards, todos los skills, logs completos,
backups, coverage, reportes históricos, índices JSONL completos o adapters de
todos los proveedores.

<!-- autonomous-runtime:start -->
## Autonomous runtime completion

For full runtime/capability completion use:

`.ai/prompts/PROMPT_SISAD_PDFME_AUTONOMOUS_START.md`

The coordinator continues through unblocked RTP tasks automatically and stops only at final
release or a true external blocker.
<!-- autonomous-runtime:end -->

<!-- SISAD-PDFME-PORTABLE-INTEGRATION:.ai/START.md:START -->
## Portable integrations and interrupted runtime resume

Para continuar una sesión runtime interrumpida, usar primero:

`.ai/prompts/PROMPT_SISAD_PDFME_RESUME_AND_INTEGRATE.md`

La regla es reconciliar source/evidence/ledger antes de confiar en el status de una task.
PokeAPI es sólo fixture; la arquitectura HTTP debe ser transport-neutral y permitir clientes
inyectados por el host.
<!-- SISAD-PDFME-PORTABLE-INTEGRATION:.ai/START.md:END -->

<!-- SISAD-PDFME-CONSOLIDATION:.ai/START.md:START -->
## Consolidation entry

Primary production-completion authority:

`.ai/brain/30-decisions/ADR-PREPRODUCTION-CANONIZATION.md` plus the active
task-cards and executed evidence.

When three providers are active, read `.ai/architecture/SAME-REPO-MULTI-AGENT.md` before any write.
<!-- SISAD-PDFME-CONSOLIDATION:.ai/START.md:END -->

<!-- SISAD-MD-REPAIR:.ai/START.md:START -->
## Markdown architecture maintenance

Canonical maintenance commands:

```bash
npm run architecture -- audit
npm run architecture -- plan
npm run architecture -- apply
npm run architecture -- verify
```

Task execution state is evidence + dependency driven. Views are generated.
<!-- SISAD-MD-REPAIR:.ai/START.md:END -->

<!-- AI-STRUCTURE-CLEANUP:START -->
## AI structure maintenance

For `.ai/**` cleanup use:

`npm run architecture -- structure:audit` → `npm run architecture -- structure:plan` → `npm run architecture -- structure:apply` → `npm run architecture -- structure:verify`.

Do not recreate manual Scrum ledgers/views removed by the cleanup.
<!-- AI-STRUCTURE-CLEANUP:END -->
