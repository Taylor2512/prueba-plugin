---
id: NAME-002
status: BACKLOG
---

# NAME-002 — Crear política y gate preventivo

**Owner sugerido:** quality  
**Riesgo:** bajo  
**Dependencias:** NAME-001

## Objetivo

Agregar la política de naming y el auditor que impida nuevas apariciones ambiguas.

## Alcance

Governance, script, allowlist y package script propuesto.

## No alcance

- No modificar Canvas, Moveable, Selecto ni geometría.
- No reescribir reportes históricos.
- No hacer reemplazo global.
- No eliminar compatibilidad pública sin evidencia.

## Evidencia requerida

- Baseline antes/después.
- Archivos modificados.
- Renames y aliases.
- Tests ejecutados.
- Riesgos y pendientes.

## Criterios de aceptación

- Gate report funciona.
- `--strict` falla solo por deuda activa.
- PDF.js queda permitido por string exacto.

## Condición de parada

Detenerse si aparece un export público, valor persistido o dependencia de tercero no cubierto por la task-card.
