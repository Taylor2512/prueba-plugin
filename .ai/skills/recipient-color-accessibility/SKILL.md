# SKILL: Recipient Color Accessibility

## Intención

Valida contraste, foco visible y no depender solo del color.

## Cuándo usar

Usa esta skill cuando el cambio afecte colores de destinatario, iconos de schema, ownership visual, resize, rotación, selección, tests o documentación relacionada.

## Procedimiento recomendado

1. Leer `.ai/context/recipient-transform-context.md`.
2. Identificar el contrato afectado.
3. Buscar implementación actual y tests existentes.
4. Corregir el producto antes de ajustar tests.
5. Agregar regresión unitaria o Playwright.
6. Actualizar docs si cambia API, data attributes o CSS vars.

## Checklist

- [ ] No hay acoplamiento externo.
- [ ] El comportamiento es configurable.
- [ ] El color activo y el color owner no se mezclan.
- [ ] No se rompe canvas, zoom, scroll ni paper geometry.
- [ ] No hay colisiones Moveable/Selecto.
- [ ] Tests cubren el caso.
- [ ] Docs actualizadas si aplica.

## Anti patrones

- Hardcodear colores por índice sin validador.
- Usar DOM query externo para cambiar iconos.
- Recalcular ownerColor de schemas existentes al cambiar destinatario activo.
- Duplicar lógica de geometría.
- Tapar fallos con delays arbitrarios.
