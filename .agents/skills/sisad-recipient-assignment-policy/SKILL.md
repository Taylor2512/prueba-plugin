---
name: sisad-recipient-assignment-policy
description: Valida recipients asignables, ownership, locks y reasignación segura.
---

# sisad-recipient-assignment-policy

## Trigger

Valida recipients asignables, ownership, locks y reasignación segura.

## Workflow

1. Leer task-card y route.
2. Formular una sola pregunta.
3. Revisar símbolos/índices antes de archivos completos.
4. Producir evidence packet.
5. Aplicar cambio mínimo o recomendar parada.
6. Registrar trace IDs, gates y memory delta.

## Budget

- un skill principal;
- máximo una referencia grande;
- salida ≤1.200 tokens;
- no editar fuera del claim.

## Stop

Detener ante cambio de dominio, fuente duplicada, falta de evidencia o
presupuesto agotado.
