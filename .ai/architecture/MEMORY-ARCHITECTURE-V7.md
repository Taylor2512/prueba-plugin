# Memoria V7

## Canonical durable

- `PROJECT.md`: hechos estables.
- `CURRENT.md`: estado vigente, reemplazable.
- `DECISIONS.md`: ADR resumidas y supersesiones.
- `RISKS.md`: riesgos activos.
- `HANDOFF.md`: continuidad inmediata.
- `METRICS.md`: tendencias.
- `INDEX.md`: índice corto de temas.

## Topic memory

Detalles por dominio bajo `memory/topics/`. No se cargan al inicio; el índice
declara cuándo leerlos.

## Reglas

- delta, no append infinito;
- fuente, confianza, verifiedAt, TTL y owner;
- una afirmación sin fuente no pasa a durable;
- task-card posee estado operativo;
- evidence posee logs;
- provider auto-memory es auxiliar y no canónica;
- GC mensual o al superar límites.
