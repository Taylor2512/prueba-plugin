# common-comentado — SISAD PDFME

Este ZIP contiene los archivos `.ts` del paquete `common` con comentarios de arquitectura, JSDoc y notas de responsabilidad agregadas sin modificar la lógica funcional.

## Archivos incluidos

- `collaboration.ts`: colaboración, comentarios base y assignments.
- `comments.ts`: comentarios por schema y top-level del template.
- `constants.ts`: unidades, PDF A4 vacío y fuente fallback.
- `dynamicTemplate.ts`: reflujo de schemas dinámicos y tablas multipágina.
- `expression.ts`: reemplazo de placeholders con evaluación segura de AST.
- `helper.ts`: validaciones Zod, conversión de unidades, PDF base64 y fuentes.
- `index.ts`: barrel público de `@sisad-pdfme/common`.
- `pluginRegistry.ts`: registry de plugins y resolución de inspector/familia.
- `schema.ts`: contratos Zod runtime.
- `types.ts`: tipos TypeScript públicos.
- `version.ts`: versión pública del paquete.

## Reglas de mantenimiento

1. `common` no debe importar React, CSS, Canvas, Moveable, Selecto ni componentes UI.
2. `schema.ts` y `types.ts` deben mantenerse alineados.
3. `index.ts` debe usar exports explícitos para no exponer APIs internas accidentalmente.
4. `expression.ts` no debe reemplazarse por `eval` ni `new Function` sin validación estricta de AST.
5. `dynamicTemplate.ts` requiere pruebas con multipágina y tablas antes de cualquier refactor.

## Observaciones técnicas pendientes

- Revisar si `dynamicTemplate.ts` debe preservar metadata completa del template al retornar el resultado.
- Revisar si `comments.ts` incrementa `commentsCount` aunque se reemplace un comentario existente.
- Revisar si `collaboration.ts` debe preservar author desde overrides cuando identity viene vacío.
- Revisar estrategia de cache en `expression.ts` para evitar crecimiento indefinido.
- Revisar alineación de `ownerRecipientIds` entre Zod (`string[]`) y utilidades que aceptan `string | string[]`.

<!-- project-tools:navigation:start -->
## Navegación generada

### Notas

- [Índice técnico de `@sisad-pdfme/common`](./documentacion-common-sisad-pdfme.md)
<!-- project-tools:navigation:end -->
