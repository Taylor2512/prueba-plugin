# Seguridad de agentes, hooks y MCP

- Usa sandbox y mínimo privilegio.
- Mantén red deshabilitada cuando no sea necesaria.
- Revisa y confía explícitamente en hooks antes de habilitarlos.
- No envíes código, credenciales o snapshots a MCP desconocidos.
- Los MCP con escritura requieren autenticación, autorización, validación, timeout y registro.
- Confirma operaciones sensibles: push, publicación, borrado, migración, cambios de permisos y acceso a secretos.
- Los agentes read-only no reciben herramientas de escritura.
- Los scripts incluidos no ejecutan comandos del payload; solo inspeccionan y devuelven decisiones.
