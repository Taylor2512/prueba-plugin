# Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Agente usa main | cambios sueltos | pwd/rama |
| Commit invade ownership | conflictos | diff review |
| Handoff en rama | invisible | coordinación externa |
| Scanner incluye worktrees | contexto 5x | exclusiones |
| Tests stale | falsos estados | triage |
| Preflight false | UI inconsistente | resets |
| className + style | doble fuente | Tailwind estático |
| runtimeStyles crece | deuda | wave exclusiva |
| Host usa internals | acoplamiento | boundary |
| Handoff histórico | estado obsoleto | compactar |
