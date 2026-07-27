# Evaluaciones de agentes y prompts

## Niveles

1. **Contrato:** respeta formato, alcance y prohibiciones.
2. **Grounding:** afirmaciones con evidencia correcta.
3. **Ejecución:** diff mínimo y funcional.
4. **Regresión:** gates focales y globales pertinentes.
5. **Eficiencia:** archivos, turnos, tokens y reintentos.
6. **Mantenibilidad:** no introduce duplicidad o capas innecesarias.

## Dataset mínimo

Mantén casos para:

- bug Canvas;
- cambio RightSidebar;
- schema plugin;
- configuración de componente;
- migración Tailwind;
- snapshot;
- API pública;
- análisis UX con capturas;
- deduplicación;
- tarea bloqueada.

## Métricas

- precisión de causa raíz;
- claims confirmados vs no verificados;
- intentos de parche;
- loops detectados;
- contexto máximo;
- tests omitidos;
- rework posterior;
- tiempo y costo relativo.
