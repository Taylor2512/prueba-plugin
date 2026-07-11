# Documentación agregada — RightSidebar Rails

## Resumen

Se documentó el bloque de composición del sidebar derecho del diseñador SISAD PDFME:

- `RightSidebar.tsx`: orquestación de modos `fields`, `detail`, `docs` y `comments`, responsive presentation, tabs y slots reemplazables.
- `DocumentsRail.tsx`: rail de páginas/documentos, acciones de subir PDF, agregar página y eliminar.
- `CommentsRail.tsx`: rail de hilos de comentarios, respuestas, estado abierto/resuelto y scroll al comentario activo.
- `layout.tsx`: primitivas de frame/header/body/footer del sidebar.
- `contextHeader.ts`: contrato para headers contextuales estáticos o funcionales.

## Nota de arquitectura

Estos archivos deben mantenerse como capa de composición visual y navegación del sidebar. No deberían incorporar reglas internas del canvas, manipulación directa de Moveable/Selecto, ni persistencia de negocio. Las mutaciones deben seguir delegándose a callbacks, bridges o comandos ya recibidos por props.
