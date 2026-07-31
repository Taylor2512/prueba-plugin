# ADR — Eventos, comandos y efectos del Designer

**Estado:** Propuesto

## Decisión

Separar:

```txt
Intent → Command → Mutation → Event → Effect
```

## Contratos

### Command

Solicita una operación y puede rechazarse por access/action policy.

### Event

Describe un hecho ocurrido. Es inmutable, versionado y serializable.

### Effect

Interactúa con DOM, browser, persistence o callbacks del host.

### Legacy handlers

`config.events.onX` se conserva mediante un adapter sobre eventos canónicos.

## No hacer

- emitir callbacks antes de confirmar mutación;
- usar event hub como command bus;
- modificar estado desde listeners;
- definir eventos distintos en cada superficie;
- tragar errores de listeners sin diagnostics.
