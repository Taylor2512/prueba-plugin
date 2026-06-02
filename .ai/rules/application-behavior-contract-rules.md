# Reglas — Contrato maestro de comportamiento

- No corregir por síntoma sin declarar proceso afectado.
- Cada cambio debe identificar componentes, fuente de verdad y datos preservados.
- Si un fix toca más de un proceso, dividir en fases.
- `selectionGroup` y `schemaGroup` son conceptos distintos.
- Todo schema agregado al Designer debe estar cubierto por Snapshot, Form, Viewer y Generator/PDF.
- Todo cambio que afecte API, data attributes o snapshot requiere docs y tests.
- CSS no corrige geometría, page gap, no-overlap ni selección.
- Un test que solo valida render superficial no cubre comportamiento.
