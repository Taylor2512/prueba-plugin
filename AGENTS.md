# AGENTS.md — SISAD PDFME V8 Lean

## Inicio

1. Lee `.ai/START.md`.
2. Lee `.ai/scrum/SPRINT-CURRENT.md`.
3. Trabaja sobre una sola task-card activa.
4. Carga una route y una skill.
5. Consulta catálogos por ID, dominio o símbolo; no los abras completos.

## Frontera

`src/sisad-pdfme` es reusable y host-independent. El host entrega configuración,
datos, adapters y callbacks. No introduzcas reglas de DigitalAgreements,
Uanataca, examples o rutas de negocio dentro del core.

## Contrato

```txt
Intent → Policy → Command → Mutation → Event → Effect → Snapshot
```

## Evidencia

Usa `CONFIRMADO`, `INFERIDO`, `HIPÓTESIS` o `DESCONOCIDO`. No declares gates
verdes sin ejecutarlos. Detente ante conflicto de claim, presupuesto agotado,
cambio de dominio o frontera protegida.
