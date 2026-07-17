# Principios de arquitectura

## Fuente única

- acciones: ActionRegistry/CommandBus;
- ownership: resolvers;
- snapshot: snapshot adapter;
- config: config resolver;
- skin: Tailwind en JSX/TSX;
- CSS técnico: runtimeStyles;
- coordinación: ruta externa;
- estado: task-cards y memory.

## Separación

```txt
Agente lógico ≠ proveedor ≠ rol Git
```

## Orden

```txt
funcionalidad → interacción → layout → accesibilidad → polish → limpieza
```

## Tailwind-first

El skin estático vive en `className`. `style` se reserva para valores dinámicos, variables CSS o cálculos.

## Preservación

No cambiar Moveable, Selecto, geometría, snapshot, generator o pdf-lib sin ownership y pruebas focales.
