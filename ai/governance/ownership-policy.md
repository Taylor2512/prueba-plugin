# Política de ownership

Cada task-card debe declarar:

```txt
owned paths
shared paths
forbidden paths
external dependencies
```

## Owned paths

El agente puede modificarlos.

## Shared paths

Requieren coordinación explícita y justificación.

## Forbidden paths

No pueden modificarse.

## Dependencias externas

Se documentan en el handoff. No se resuelven invadiendo otro dominio.

## Regla de parada

Si la solución real requiere una ruta prohibida, la tarea pasa a `blocked`.
