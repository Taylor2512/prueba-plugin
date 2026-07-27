# Política de memoria V6

## Capas

- `PROJECT.md`: hechos estables;
- `CURRENT.md`: estado vigente;
- `DECISIONS.md`: decisiones y supersesiones;
- `RISKS.md`: riesgos activos;
- `METRICS.md`: tendencias;
- `HANDOFF.md`: continuidad inmediata;
- task-card: estado operativo;
- evidence: salidas temporales.

## Campos de cada memoria

- hecho;
- procedencia;
- confianza;
- fecha de verificación;
- vigencia/TTL;
- owner;
- relación con decisiones.

## No persistir

- chain-of-thought;
- logs;
- transcripciones;
- hipótesis descartadas;
- secretos;
- tareas duplicadas;
- detalles efímeros de una sesión.

## Actualización

Solo por delta. La nueva información reemplaza, enlaza o marca como obsoleta; no se apila indefinidamente.
