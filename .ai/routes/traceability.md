# Route — Traceability

## Owner question

¿Qué evidencia mínima decide el cambio en este dominio?

## Load

- task-card activa
- skill `sisad-behavior-traceability`
- `.ai/architecture/KNOWLEDGE-GRAPH.md` solo si responde una incógnita
- `.ai/knowledge/USE-CASE-INDEX.md` solo si responde una incógnita

## Output

Evidence packet, decisión, máximo cinco archivos candidatos, test focal,
trace IDs y condición de parada.

## Guardrail

Una sola ruta posee el parche. No cargar catálogos completos cuando un índice o
consulta al registro es suficiente.
