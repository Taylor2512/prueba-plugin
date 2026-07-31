# Route — Context/token optimization

## Owner question

¿Qué evidencia mínima decide el cambio en este dominio?

## Load

- task-card activa
- skill `sisad-context-packet`
- `.ai/CONTEXT-BUDGET.md` solo si responde una incógnita
- `.ai/CONTEXT-POLICY.md` solo si responde una incógnita

## Output

Evidence packet, decisión, máximo cinco archivos candidatos, test focal,
trace IDs y condición de parada.

## Guardrail

Una sola ruta posee el parche. No cargar catálogos completos cuando un índice o
consulta al registro es suficiente.
