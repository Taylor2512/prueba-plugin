# Route — Schema families

## Owner question

¿Qué evidencia mínima decide el cambio en este dominio?

## Load

- task-card activa
- skill `sisad-schema-behavior-matrix`
- `.ai/memory/topics/schemas.md` solo si responde una incógnita

## Output

Evidence packet, decisión, máximo cinco archivos candidatos, test focal,
trace IDs y condición de parada.

## Guardrail

Una sola ruta posee el parche. No cargar catálogos completos cuando un índice o
consulta al registro es suficiente.
