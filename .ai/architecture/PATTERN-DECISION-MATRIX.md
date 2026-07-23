# Matriz de patrones para React y SISAD PDFME

| Problema | Patrón | Ejemplo SISAD PDFME |
|---|---|---|
| layout o UI repetida | composición | sidebars, headers, cards, preview shell |
| lógica React repetida con estado/efectos | custom hook | recipients runtime, preview, upload |
| lógica separable de presentación | container–presentational | Rails, dialogs, lists |
| muchos `if` por comportamiento | Strategy | validación, firma, rendering mode |
| creación por tipo | Factory | schemas, acciones approve/decline |
| lookup extensible por tipo | Registry | plugins, providers, widgets inspector |
| backend/modelo externo diferente | Adapter | documentos, recipients, persistence |
| subsistema complejo con una acción | Facade/use case | guardar/generar/exportar |
| estados incompatibles | Reducer/State Machine | canvas interaction, firma, finalización |
| contexto por dominio | Provider limitado | Designer, Recipients, Runtime |
| componentes coordinados | Compound Components | tabs, sidebar surface, inspector sections |
| acciones desde múltiples superficies | Command | delete, duplicate, assign, align |

## Orden de preferencia en React

Composición → funciones puras → custom hooks → reducers/state machines → patrones de dominio.

## Antipatrones

- Hook que solo renombra una función.
- Factory genérica sin semántica.
- Provider global con todo el estado.
- Singleton mutable.
- God component.
- Barrel que oculta ciclos o APIs internas.
- Wrapper sin comportamiento, accesibilidad o reutilización real.
