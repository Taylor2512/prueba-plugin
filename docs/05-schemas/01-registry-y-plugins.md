# Schema Registry y plugins

## Cada plugin debe definir

- `key`.
- Nombre visible.
- Icono.
- Familia.
- Default schema.
- Designer renderer.
- Form renderer.
- Viewer renderer.
- PDF renderer si aplica.
- Prop panel.
- Validaciones.
- Migración.

## Reglas

- No usar label como identidad.
- Preservar `schemaUid`.
- No guardar funciones.
- No guardar datos sensibles.
- Documentar propiedades nuevas.
