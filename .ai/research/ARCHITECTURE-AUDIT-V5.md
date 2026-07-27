# Auditoría V5

## Fortalezas

- progressive disclosure;
- model routing;
- one writer/many readers;
- memory delta;
- task-cards;
- owned/vendor/generated;
- domain routes.

## Debilidades

- anti-loop demasiado breve;
- ausencia de política anti-alucinación;
- sin protocolo de overflow;
- prompts operativos demasiado cortos;
- duplicidad de skills y documentos de patrones;
- tareas separadas en dos jerarquías;
- memoria sin procedencia, confianza o TTL;
- falta de evals de prompts/agentes;
- poca cobertura de UX, accesibilidad, performance, configuración y API de librería;
- adaptadores de proveedor demasiado mínimos;
- gates mayormente documentales, no ligados a claim ledger.

## Decisión

Evolucionar, no reemplazar: conservar el control plane y añadir grounding, observabilidad, evals y especialización frontend.
