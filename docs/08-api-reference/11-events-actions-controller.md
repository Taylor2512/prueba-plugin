# Eventos y controller

Obtenga el controller mediante `onControllerReady`.

## Dominios

- template y snapshot;
- config y capabilities;
- selección;
- CRUD de schemas;
- recipients y assignments;
- documento activo;
- zoom;
- validación;
- save.

Use `onEvent` como observabilidad canónica y callbacks `onX` como adapters
directos del host. No cree otro event bus.
