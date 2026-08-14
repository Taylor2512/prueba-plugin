# ADR RTP-008 — Execution shapes outside Form

## Decision

Single, sequential, parallel, mixed y massive fan-out se modelan como combinaciones
de `ExecutionPlan` y scopes de runtime.

`Form` no recibe un `routingMode` y los schemas no implementan scheduling.
