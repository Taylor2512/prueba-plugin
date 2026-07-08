# Designer

El Designer es el runtime visual para crear y configurar campos sobre documentos PDF.

Incluye:

- LeftSidebar: catálogo de fields.
- Canvas/Paper: superficie PDF.
- RightSidebar: inspector, lista, documentos y comentarios.
- Toolbars y overlays.
- Moveable/Selecto.
- CommandBus.

## Dueño de responsabilidades

El Designer controla UI interna. El host no debe duplicar sidebars, inspector, zoom o selección.
