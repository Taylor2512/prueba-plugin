# Mapa del sistema de conocimiento IA

```text
hot
  AGENTS · START · STATE-SOURCES · active pointer · task-card

warm authored
  ROUTER · routes · skills · Brain de dominio · contratos · decisiones

cold
  análisis · knowledge histórico · research · reports · evidence · task-cards no activas

generated / lookup
  .ai/index/** · context packs · vistas derivadas

provider adapters
  CLAUDE · CODEX · Copilot · provider agents
```

La optimización consiste en evitar que todo el conocimiento compita por el
contexto de cada sesión. `src/` y los tests ejecutados conservan prioridad sobre
cualquier snapshot documental.
