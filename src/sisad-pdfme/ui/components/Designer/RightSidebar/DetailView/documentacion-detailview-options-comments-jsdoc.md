# Documentación agregada — DetailView comments/options widgets

## Archivos incluidos

### SchemaFieldCommentsWidget.tsx
Widget de comentarios por campo del inspector. Se documentaron:

- props del widget;
- normalización de comentarios;
- timestamp y formateo;
- creación de respuestas;
- persistencia mediante `changeSchemas`;
- responsabilidades y restricciones del componente.

### SchemaOptionsEditor.tsx
Editor único para opciones de `select`, `radioGroup` y `checkboxGroup`. Se documentaron:

- resolución del tipo de editor;
- modelos de fila;
- límites de selección múltiple;
- commits específicos para select/radio/checkbox;
- operaciones de fila: agregar, renombrar, eliminar, mover y marcar default;
- contrato de aislamiento respecto a canvas, Moveable y Selecto.

### WidgetRenderer.tsx
Wrapper de compatibilidad para widgets imperativos de plugins. Se documentaron:

- contrato `rootElement`;
- limpieza del contenedor;
- marcado como zona interactiva del inspector;
- restricciones para evitar acoplamiento con canvas o plugins concretos.

## Recomendaciones de QA

- Validar que agregar/responder/resolver/eliminar comentarios siga emitiendo `changeSchemas([{ key: 'comments', ... }])`.
- Probar select/radioGroup/checkboxGroup con 0, 1 y N opciones.
- Probar reordenamiento y eliminación preservando default/selección válida.
- Confirmar que clicks dentro del inspector no disparen Selecto, Moveable ni drag/drop del canvas.
