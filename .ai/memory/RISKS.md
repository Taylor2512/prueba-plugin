# Riesgos activos

| Riesgo | Señal | Mitigación |
|---|---|---|
| abstracción DRY excesiva | helper con modes/booleans crecientes | matriz de patrones + review |
| regresión de canvas | cambio en coords/scroll/transform | AGENTS local + Playwright |
| snapshot incompatible | pérdida de ids/owner/groups | round-trip focal |
| ruido de vendor | clones dominan métricas | perfiles separados |
| contexto inflado | agentes leen consolidaciones | context policy + parser |
| memoria divergente | varios archivos repiten estado | memory delta + owner único |
| conflictos multiagente | dos writers en mismos archivos | worktrees + WIP |
