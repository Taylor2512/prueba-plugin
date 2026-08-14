# Memory consolidation

## Autoridades

Durable:
- `.ai/memory/PROJECT.md`;
- `.ai/memory/topics/*.md`;
- `.ai/brain/20-contracts/*`;
- `.ai/brain/30-decisions/*`.

Continuidad:
- `.ai/brain/70-memory/CURRENT.md`;
- `.ai/brain/70-memory/HANDOFF.md`;
- `.ai/brain/80-work/ACTIVE.md`.

Estado:
- task cards/queue/ledger.

Evidence:
- `reports/**/evidence/*`;
- `.ai/evidence/*`.

## No duplicación

No crear otra copia de CURRENT/HANDOFF por proveedor.

Claude, Codex y Copilot comparten la misma memoria canónica.

Sus archivos específicos sólo contienen:
- cómo arrancar;
- qué skill cargar;
- qué modelo/perfil preferir;
- cómo respetar claims.

## Regla de actualización

Después de una task:

```text
Evidence
→ task status
→ CURRENT delta
→ HANDOFF si cambia la continuidad
→ durable Brain sólo si apareció una verdad estable
```

No append infinito.

No registrar hipótesis como memory durable.

## Interrupción de agente

Si Claude/Codex/Copilot termina por límite:
- no marcar la task PASS;
- escribir handoff factual;
- liberar claims sólo si no quedan edits parciales que otro writer podría pisar;
- siguiente agente reconcilia source/evidence antes de continuar.
