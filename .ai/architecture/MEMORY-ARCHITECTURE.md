# Arquitectura de memoria

## Memoria durable existente

- `.ai/memory/PROJECT.md`: hechos estables del proyecto.
- `.ai/memory/INDEX.md`: router corto hacia memoria temática.
- `.ai/memory/topics/*.md`: detalles por dominio bajo demanda.
- `.ai/memory/RTP-MEMORY-DELTA.md`: delta de la campaña Runtime Platform.
- `.ai/brain/30-decisions/*.md`: decisiones/ADR durables.

## Continuidad operativa existente

- `.ai/brain/70-memory/CURRENT.md`: estado técnico resumido de la campaña.
- `.ai/brain/70-memory/HANDOFF.md`: continuidad inmediata.
- `.ai/brain/80-work/ACTIVE.md`: puntero de trabajo activo.

No crear una segunda copia en `.ai/memory/CURRENT.md` o
`.ai/memory/HANDOFF.md` mientras esas rutas no hayan sido migradas
explícitamente.

## Reglas

- delta, no append infinito;
- source vivo y tests ejecutados prevalecen;
- task-card/ledger poseen estado de ejecución;
- evidence posee logs y resultados;
- provider auto-memory es auxiliar;
- una migración de memoria debe actualizar referencias y validadores en el mismo cambio.

<!-- SISAD-PDFME-CONSOLIDATION:.ai/architecture/MEMORY-ARCHITECTURE.md:START -->
## Same-repo provider memory

Claude, Codex and Copilot do not own separate canonical memories.

Provider memory is auxiliary only.
Canonical continuation remains CURRENT/HANDOFF/task/evidence.

Agent interruption must not turn a partial implementation into durable memory.
<!-- SISAD-PDFME-CONSOLIDATION:.ai/architecture/MEMORY-ARCHITECTURE.md:END -->
