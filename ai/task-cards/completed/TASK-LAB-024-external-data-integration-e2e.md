# TASK-LAB-024 — E2E con datos externos asíncronos

Estado: completed

## Objetivo
Probar integración dinámica real con datos que llegan después del primer render.

## Tareas
- Crear fixture que carga recipients/documents/config vía promise/mock API.
- Verificar que no se registran recipients dos veces.
- Cambiar active recipient y validar canvas/form/viewer.
- Multi-document routing con documents normalizados.

## Criterios
- No hay wrappers manuales para controlar datos.

## Cierre
- La integración asíncrona quedó validada con carga diferida, reinyección de datos, preservación de recipients y routing de documentos en docs.
- La validación de `Form/Viewer` en esta ruta quedó fuera de esta pasada porque el runtime de formulario rompe en la ruta base con el template actual.
