# Política de calidad

## Gates por capa

### Siempre

- diff dentro del alcance;
- lint/typecheck focal;
- tests afectados;
- revisión de imports públicos;
- verificación de no duplicidad evidente.

### Canvas/snapshot/runtime

- pruebas de identidad, owner, documentId y page;
- selección, move, resize y roundtrip cuando aplique;
- Playwright focal;
- revisión independiente.

### UI/UX

- viewports móvil, tablet y escritorio;
- teclado y focus;
- contraste y labels;
- estados empty/loading/error/disabled;
- captura antes/después;
- sin pérdida de scroll o interacción.

### Librería

- build;
- exports;
- tree-shaking/side effects;
- host independence;
- compatibilidad browser/SSR cuando aplique.

Un gate puede quedar pendiente solo con razón, riesgo y owner.
