# SKILL — Standard Fields Regression Testing

## Intención

Define pruebas unitarias y Playwright para standard fields.

## Cuándo usar

Usa esta skill cuando una tarea afecte schemas estándar, grupos, botón `+`, DetailView/ListView, snapshot, Form/Viewer/Generator o comportamiento visual inspirado en editores documentales profesionales.

## Procedimiento

1. Leer el contexto principal en `.ai/context/`.
2. Identificar si el cambio afecta contrato público, snapshot o data attributes.
3. Buscar implementación actual con `rg`.
4. Corregir producto antes de ajustar tests.
5. Agregar test unitario para lógica pura.
6. Agregar Playwright para interacción visual.
7. Actualizar docs si cambia API, CSS vars, data attributes o snapshot.

## Checklist

- [ ] No hay acoplamiento a proveedor externo.
- [ ] No se pierde ownerColor ni recipientColor.
- [ ] No se pierde schemaUid/documentId/pageNumber.
- [ ] No se rompe canvas, zoom, scroll ni paper geometry.
- [ ] No hay colisiones Moveable/Selecto.
- [ ] No hay superposición de schemas del mismo owner.
- [ ] Tests cubren el caso.
- [ ] Docs actualizadas si aplica.

## Anti patrones

- Reescribir coordenadas sin test.
- Duplicar lógica de radio y checkbox group.
- Usar labels como IDs.
- Renderizar metadata técnica en PDF.
- Tapar fallos con delays arbitrarios.
