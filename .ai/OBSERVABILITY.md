# Observabilidad

Cada tarea registra solo métricas útiles para reproducir y revisar el trabajo:

```text
provider/model class/effort
input context y archivos abiertos
skills/subagents usados
búsquedas y tool calls relevantes
patch attempts
gates ejecutados
cycle time/rework
context checkpoints
memory/trace delta
```

No registrar chain-of-thought, prompts privados, secretos ni transcripciones
completas.

La evidencia vive en la ruta declarada por cada task-card. Para la campaña
Runtime Platform la convención actual es `reports/runtime-platform/evidence/`.
Los reportes agregados son cold storage y no reemplazan `STATE-SOURCES.md`,
la task-card ni el ledger.
