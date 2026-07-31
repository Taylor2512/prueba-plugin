# ADR — Arquitectura de superficies del Designer

**Estado:** Propuesto

## Superficies

```txt
catalog
canvas
fields
detail
documents
comments
```

## Estado

Un reducer/state machine posee:

```txt
leftExpanded
rightExpanded
rightPanel
presentation
focusMode
activeSurface
previousSurface
```

## Políticas

- desktop: múltiples paneles;
- tablet: un panel completo + rail opuesto;
- compact/mobile: overlay o single-surface;
- Canvas permanece montado;
- cambiar panel preserva selection, zoom, scroll y documento;
- rails comparten primitive y tokens.
