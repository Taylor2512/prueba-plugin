# Testing y regresión

> Documentación generada para consumo externo de `sisad-pdfme`.

## Cobertura recomendada
- Unit: engine, registry, commands, assignments, comments, collaboration, schemas.
- Component: detail widgets, list view, comments rail, sidebars.
- Playwright: Designer, Form, Viewer, multi-document, multi-user, firma, canvas, geometry.

## Tests críticos
- Viewer mantiene tamaño al hacer scroll.
- Designer muestra schemas en documento activo.
- Cambio Designer/Form/Viewer no pierde template.
- Selecto funciona con zoom y scroll.
- Acciones de toolbar/context menu/shortcut producen mismo resultado.
- Multiusuario limpia selección oculta.
- Firma provider no persiste secretos.

## Runtime guard
Debe fallar ante warnings de React, errores de render, unmount síncrono y errores de ResizeObserver no controlados.
