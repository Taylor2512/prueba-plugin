# Router de modelos por capacidad

No fijes la arquitectura a nombres comerciales. Selecciona la capacidad mínima que cumple el criterio de éxito.

## Clases

| Clase | Uso | Razonamiento |
|---|---|---|
| Extractor | inventario, clasificación, summaries, memory delta | bajo |
| Implementador | cambios claros, tests, documentación | bajo/medio |
| Diagnóstico | bugs ambiguos, visuales o transversales | medio/alto |
| Arquitecto | contratos públicos, snapshot, canvas, migraciones | alto |
| Revisor independiente | diff de alto riesgo | medio/alto |

## Ejemplos actuales

- GPT-5.6 Luna: Extractor.
- GPT-5.6 Terra: Implementador y diagnóstico acotado.
- GPT-5.6 Sol: Arquitectura y revisión de alto riesgo.
- Claude rápido/medio: exploración o implementación delimitada.
- Claude avanzado: diagnóstico complejo, no tareas mecánicas.
- Copilot: edición focal con instrucciones de ruta y tests.

## Escalamiento

Escala solo cuando existan dos señales:

- hipótesis incompatibles;
- más de tres dominios;
- falta de caracterización;
- contrato público o migración;
- comportamiento visual no reproducido;
- tres fallos diferentes.

Desescala inmediatamente después de aislar la causa.
