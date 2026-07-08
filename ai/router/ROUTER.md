# ROUTER — Selección de task-card

## Tabla de enrutamiento

| Señal del usuario | Task-card sugerida | Contexto | Regla | Playbook |
|---|---|---|---|---|
| Tailwind, CSS, diseño, visual | TASK-CSS-* | css-tailwind-context | css-migration-rules | pb-css-tailwind-migration |
| Baseline visual, screenshots | TASK-VISUAL-* | visual-baseline-context | visual-regression-rules | pb-visual-regression |
| Página 2, multipágina, coordenadas | TASK-CANVAS-* | canvas-multipage-context | canvas-rules | pb-canvas-multipage |
| Selección, mover, resize, rotate | TASK-INTERACTION-* | selection-transform-context | moveable-selecto-rules | pb-selection-transform |
| checkboxGroup/radioGroup/select | TASK-SCHEMA-* | schema-families-context | schema-rules | pb-schema-families |
| DetailView/ListView/Inspector | TASK-INSPECTOR-* | inspector-context | inspector-rules | pb-inspector |
| Snapshot/import/export | TASK-SNAPSHOT-* | snapshot-context | snapshot-rules | pb-snapshot |
| Memoria/documentación IA | TASK-DOCS-* | ai-docs-context | ai-docs-rules | pb-ai-docs-refactor |

## Resultado requerido antes de editar

```md
## Router decision
- Task-card:
- Contexto:
- Regla:
- Playbook:
- Archivos candidatos:
- Archivos prohibidos:
- Presupuesto:
```
