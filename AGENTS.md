# AGENTS.md — SISAD-PDFME

## Inicio

1. Lee `.ai/START.md`.
2. Lee `.ai/STATE-SOURCES.md`.
3. Resuelve la tarea activa desde la fuente de estado que realmente exista.
4. Carga una sola route y una skill principal.
5. Abre únicamente el Brain, índices, source y tests necesarios para esa tarea.

## Frontera

`src/sisad-pdfme` es reusable y host-independent. El host entrega configuración,
datos, adapters y callbacks. No introduzcas reglas de DigitalAgreements,
Uanataca ni rutas de negocio dentro del core.

## Contrato

```text
Intent → Policy → Command → Mutation → Event → Effect → Snapshot
```

## Estado y evidencia

No asumas `SPRINT-CURRENT.md`, `CLAIMS.md`, `.ai/catalogs` ni `.ai/evidence`
si no existen en el worktree. `.ai/STATE-SOURCES.md` define las autoridades
vigentes.

Usa `CONFIRMADO`, `INFERIDO`, `HIPÓTESIS` o `DESCONOCIDO`. No declares gates
verdes sin ejecutarlos. Revalida `pwd`, branch, HEAD y `git status` antes de
editar y al reanudar una sesión.
