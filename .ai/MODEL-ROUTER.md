# Router de modelos Codex — 2026-07-22

## Modelos recomendados actuales

| Modelo | Uso en SISAD PDFME | Esfuerzo recomendado |
|---|---|---|
| `gpt-5.6-sol` | arquitectura, refactor transversal, bugs ambiguos, revisión final de alto riesgo | medium; high/xhigh solo cuando existe complejidad real |
| `gpt-5.6-terra` | implementación diaria, debugging, integración, pruebas y PRs | low o medium |
| `gpt-5.6-luna` | auditorías repetibles, clasificación de clones, extracción, documentación delta, reportes estructurados | low |
| `gpt-5.5` | fallback de generación anterior si 5.6 no está disponible | medium |
| `gpt-5.3-codex-spark` | iteración textual casi instantánea y cambios pequeños; preview para Pro | low; no usar para juicio final |

## Compatibilidad

`gpt-5.4` y `gpt-5.4-mini` pueden seguir visibles en algunas superficies. Úsalos solo como fallback: 5.4 para coordinación/implementación y 5.4 mini para exploración o subagentes de bajo costo. No diseñes el sistema alrededor de modelos deprecados.

## Decisión por tarea

- Reglas claras + resultado mecánico → Luna low.
- Implementación con contexto estable → Terra medium.
- Ambigüedad, tradeoffs, arquitectura o riesgo de regresión → Sol medium/high.
- Revisión final independiente → Sol medium o Terra high según impacto.
- Ultra → únicamente cuando hay subtareas verdaderamente independientes y el ahorro de tiempo compensa el costo multiagente.

## Reglas de ahorro

1. Usa el menor esfuerzo que pase los gates.
2. No repitas análisis con Sol si Luna ya produjo un inventario verificable.
3. No uses subagentes para trabajos secuenciales sobre los mismos archivos.
4. Separa exploración read-only de implementación write.
5. Finaliza con evidencia, no con razonamiento adicional innecesario.

## Estado de versiones

`GPT-5.3-Codex` y `GPT-5.2` fueron deprecados como modelos seleccionables para sesiones Codex autenticadas con ChatGPT; no confundirlos con `5.3 Codex Spark`.
