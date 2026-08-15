# DetailView comments/options widgets — JSDoc

Este paquete contiene copias documentadas de tres archivos del inspector del diseñador SISAD PDFME:

- `SchemaFieldCommentsWidget.tsx`: comentarios por campo dentro del inspector.
- `SchemaOptionsEditor.tsx`: editor React directo para opciones de select, radioGroup y checkboxGroup.
- `WidgetRenderer.tsx`: puente para widgets imperativos de plugins usando `rootElement`.

## Criterios aplicados

- Se conservaron imports, exports y comportamiento funcional.
- Se agregó JSDoc en props, tipos, helpers y componentes principales.
- Se añadieron comentarios de intención en zonas sensibles de render/commit.
- No se modificó la arquitectura de canvas, Moveable, Selecto ni persistencia.

## Notas técnicas

- `SchemaOptionsEditor` sigue usando `changeSchemas` como única vía de persistencia.
- `SchemaFieldCommentsWidget` mantiene comentarios embebidos en `activeSchema.comments`.
- `WidgetRenderer` conserva el render imperativo en cada render para no cambiar el contrato heredado.

<!-- project-tools:navigation:start -->
## Navegación generada

### Notas

- [Documentación aplicada — DetailView / Inspector](./documentacion-detailview-inspector-jsdoc.md)
- [Documentación agregada — DetailView comments/options widgets](./documentacion-detailview-options-comments-jsdoc.md)
<!-- project-tools:navigation:end -->
