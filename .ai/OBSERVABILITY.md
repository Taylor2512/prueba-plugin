# Observabilidad V7

Cada task-card registra métricas mínimas:

```txt
provider/model class/effort
input context files/tokens estimados
skills activadas
subagents y sus outputs
búsquedas y archivos abiertos
tool calls relevantes
patch attempts
gates
cycle time
rework
context checkpoints
memory delta
trace coverage
```

No registrar chain-of-thought, prompts privados, secretos ni transcripciones.

Los datos crudos viven en `.ai/evidence/<task>/`; `.ai/memory/METRICS.md`
conserva tendencias agregadas.
