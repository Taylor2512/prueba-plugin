# Ciclo de tareas

El repositorio actual no usa como autoridad `backlog.jsonl`,
`task-cards/ready/active` ni `SPRINT-CURRENT.md`.

## Flujo vigente

```text
ledger/backlog existente
→ elegir task-card materializada
→ verificar status/dependencias
→ registrar trabajo activo en la fuente vigente
→ reproducir/caracterizar
→ implementar slice focal
→ ejecutar gates
→ escribir evidence en la ruta de la task
→ actualizar task/ledger
→ actualizar continuidad y memoria durable solo cuando corresponda
```

Para Runtime Platform:

```text
.ai/scrum/RUNTIME-PLATFORM-LEDGER.md
→ .ai/scrum/task-cards/runtime-platform/RTP-*.md
→ reports/runtime-platform/evidence/
```

Los scripts legacy de materialización/archive solo pueden volver a ser
canónicos cuando sus inputs y directorios existan y estén cubiertos por gates.
