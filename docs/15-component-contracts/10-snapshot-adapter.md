# Contrato de componente — SnapshotAdapter

## Responsabilidad

Este componente debe cumplir una responsabilidad única dentro del runtime `sisad-pdfme` y no duplicar lógica de otros módulos.

## Debe proteger

- Identidad de schema.
- Owner/color.
- Document/page scope.
- Snapshot compatibility.
- Interacciones Moveable/Selecto si aplica.
- CSS scoped si aplica.

## No debe hacer

- Manipular DOM externo.
- Crear estado paralelo sin fuente de verdad.
- Resolver problemas de otro componente con hacks locales.
- Romper Form/Viewer/Generator.

## Tests recomendados

- Unitarios para contrato local.
- Playwright si participa en canvas o UX.
- Snapshot si cambia estructura de datos.
