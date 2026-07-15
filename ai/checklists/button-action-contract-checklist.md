# Checklist — contrato de botones y acciones

## Por cada botón

- [ ] Tiene label o aria-label.
- [ ] Tiene data-testid.
- [ ] Tiene tooltip si es icon-only.
- [ ] Tiene handler real.
- [ ] Usa ActionRegistry/CommandBus o handler central aprobado.
- [ ] Tiene estado disabled con razón.
- [ ] Respeta visibility config.
- [ ] Respeta permissions.
- [ ] No duplica lógica de otro botón.
- [ ] Tiene test Playwright o unitario.

## Botones críticos

### Topbar
- [ ] Guardar
- [ ] Más
- [ ] Usuario activo
- [ ] Estado
- [ ] Configuración

### LeftSidebar
- [ ] Collapse
- [ ] Search
- [ ] Filter chips
- [ ] Layout tabs
- [ ] Schema cards

### RightSidebar
- [ ] Collapse
- [ ] Panel switcher
- [ ] Search
- [ ] Type filter
- [ ] More
- [ ] Reasignar
- [ ] Abrir propiedades

### Canvas
- [ ] Eliminar
- [ ] Duplicar
- [ ] Más
- [ ] Context menu
- [ ] Bloquear posición
- [ ] Desbloquear posición
- [ ] Liberar edición
- [ ] Abrir propiedades

### Bottom toolbar
- [ ] Undo
- [ ] Redo
- [ ] Fit
- [ ] Zoom out
- [ ] Zoom select
- [ ] Zoom in
