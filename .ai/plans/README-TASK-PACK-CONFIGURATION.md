# Instalación del task pack de configuración

Este ZIP reproduce la estructura del repositorio `prueba-plugin`.

## Aplicación

Copiar o fusionar la carpeta `prueba-plugin/` sobre la raíz real del proyecto.

## Archivos existentes tratados con cuidado

- `CONFIG-001-repair-public-config-api.md`: se conserva con estado `review`.
- `SPRINT-CURRENT.md`: conserva el contenido actual y agrega `CONFIG-002` como Ready.
- `PRODUCT-BACKLOG.md`: conserva las tareas existentes y agrega el bloque CONFIG.
- `.ai/tasks/ACTIVE.md`: se convierte en puntero; no duplica estado.
- El plan canónico se conserva en `.ai/plans/`.

## No incluye

- cambios de código TypeScript/React;
- archivos CSS;
- modificaciones de Moveable/Selecto;
- resultados falsos de pruebas;
- tareas fuera del plan de configuración unificada.
