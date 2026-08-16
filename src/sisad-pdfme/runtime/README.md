# Runtime comentado — SISAD PDFME

Este paquete contiene una versión comentada de los helpers/hooks de runtime enviados.

## Archivos

- `options.ts`: builders de opciones para Designer/Form/Viewer.
- `runtimeModes.ts`: helpers de modos runtime, errores y estado de página.
- `usePdfmeArtifacts.ts`: hook para generación PDF y conversiones derivadas.
- `usePdfmeRuntimeInstance.ts`: hook que monta/sincroniza/destroza Designer/Form/Viewer.
- `documentacion-runtime-sisad-pdfme.md`: resumen arquitectónico y riesgos técnicos.

## Regla de arquitectura

Estos archivos deben vivir como capa de runtime/adaptador. No deben contener reglas de negocio del host, manipulación de canvas, CSS, Moveable, Selecto ni detalles de workflows externos.

<!-- project-tools:navigation:start -->
## Navegación generada

### Notas

- [Documentación técnica — Runtime SISAD PDFME](./documentacion-runtime-sisad-pdfme.md)
<!-- project-tools:navigation:end -->
