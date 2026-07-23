# Fuente única de verdad

Antes de extraer código, identifica el dato o decisión que se duplica. La fuente canónica debe:

- tener un owner y una API explícita;
- poder probarse sin la UI cuando sea lógica pura;
- producir view models, no duplicar estado en consumidores;
- persistir solo la forma canónica;
- exponer adapters para legacy en el borde;
- evitar sincronización bidireccional entre copias.

Ejemplos SISAD PDFME: owner color, access state, selected schemas, document/page routing, option values, inspector profiles y snapshot metadata.
