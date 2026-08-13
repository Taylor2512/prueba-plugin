# Router de modelos

La arquitectura usa clases de capacidad. Los adapters traducen a modelos
disponibles en cada proveedor.

| Clase | Trabajo | Esfuerzo |
|---|---|---|
| Extractor | inventario, clasificación, índices, memory delta | bajo |
| Implementer | parche focal, tests, documentación | bajo/medio |
| Diagnostician | bug ambiguo o visual reproducible | medio/alto |
| Architect | API, Canvas, snapshot, migración | alto |
| Reviewer | diff independiente y riesgos | medio/alto |

## Mapeo orientativo actual

- Codex Luna: extracción y tareas mecánicas.
- Codex Terra: implementación diaria y diagnóstico acotado.
- Codex Sol: contratos y alto riesgo.
- Claude rápido: búsqueda/logs/subagentes lectores.
- Claude avanzado: arquitectura o diagnóstico difícil.
- Copilot: implementación focal, revisión y tareas issue-driven.

## Escalamiento

Escala cuando haya al menos dos señales: hipótesis incompatibles, tres dominios,
contrato público, migración, fallo no reproducido o tres intentos distintos.

Desescala inmediatamente al aislar la causa. No mantengas un modelo caro para
renames, tablas, documentación o ejecución mecánica.
