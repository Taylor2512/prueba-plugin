# Canvas

El canvas contiene las páginas PDF y overlays de schemas.

## Reglas críticas

- No modificar geometría con CSS host.
- No asumir página 1.
- No usar `setTimeout` para coordenadas.
- No forzar z-index arbitrario.
- Respetar scroll y zoom.

## Validación mínima

- Drop en página 2.
- Selección en página 2.
- Move/resize/rotate en página 2.
