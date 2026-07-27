# Prompt: MEMORY.prompt.md

## Objetivo

Crear memory delta.

## Entradas

handoff y decisiones

## Reglas

- usar únicamente evidencia disponible;
- etiquetar confirmado, inferido y desconocido;
- no ampliar alcance silenciosamente;
- aplicar presupuesto y condiciones de parada;
- no afirmar gates no ejecutados;
- no inventar rutas o símbolos;
- resumir outputs grandes;
- producir una sola recomendación principal y alternativas solo cuando cambien una decisión humana.

## Salida

add/update/resolve/no-change
