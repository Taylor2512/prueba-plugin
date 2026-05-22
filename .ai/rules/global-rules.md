# Global Rules — `sisad-pdfme`

## Principios

1. `sisad-pdfme` es un fork aislado, genérico y configurable.
2. `.ai/` es la fuente de verdad para asistentes IA.
3. Cada cambio debe ser pequeño, testeable y reversible.
4. No se deben crear variantes rígidas por cliente, proveedor o flujo externo.
5. Si cambia un contrato público, deben actualizarse tests y docs.

## Reglas recipient color

- Todo destinatario/usuario debe tener `id`, `name`, `color` y opcionalmente `groupId`.
- Los colores en fixtures de prueba deben ser únicos.
- El color activo se expone como `activeRecipientColor` o CSS var `--active-recipient-color`.
- El catálogo de schemas usa el color del destinatario activo para iconos y acentos.
- El schema creado conserva `ownerId` y `ownerColor`.
- Cambiar destinatario activo no debe reescribir el color de schemas existentes.

## Reglas transform

- Drag, resize y rotate son interacciones mutuamente controladas por estado.
- Moveable y Selecto no deben competir por el mismo pointer event.
- Inline edit no debe abrirse durante drag/resize/rotate.
- Context menu no debe abrirse durante transform activo.
- Shortcuts no deben ejecutarse dentro de inputs, textareas, selects o contenteditable.

## CSS

- Mantener estilos bajo `.sisad-pdfme-root`.
- No alterar globalmente `.moveable-*` ni `.selecto-*`.
- Usar tokens y variables existentes.
- No hardcodear colores de destinatarios en CSS global.
