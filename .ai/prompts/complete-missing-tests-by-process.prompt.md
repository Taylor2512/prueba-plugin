# Prompt — Completar tests faltantes por proceso

Objetivo: crear cobertura real por proceso, no tests superficiales.

## Entrada requerida

- `docs/12-behavior-contract/03-regression-matrix.md`
- `tests/application-behavior-regression-matrix.md`
- `tests/detail-view-coverage-matrix.md`

## Método

1. Elegir un proceso con `missing-test`.
2. Crear o actualizar unit test para lógica pura.
3. Crear Playwright si involucra canvas/interacción.
4. Evitar `test.skip` y `test.only`.
5. Actualizar matriz.

## Prioridad

- Selection/shortcuts/commandBus.
- No-overlap multi-page.
- checkboxGroup/radioGroup.
- Snapshot/Form/Viewer/Generator.
- DetailView/ListView.
