# Skill: PDFME Integration

## Enfoque
Integrar y extender `pdfme` modificado de forma controlada.

## Recordatorios
- Preferir adaptadores en lugar de modificar el runtime directamente.
- Encapsular APIs internas y centralizar eventos.
- No mezclar integración de `pdfme` con decisiones de layout de la app.

## Buenas prácticas
- Añadir adaptadores o puentes en `src/pdfme` cuando sea necesario.
- Mantener las pruebas que cubran conversiones y serialización.

## Ejemplos de tareas
- Añadir un adapter para nueva propiedad de exportación.
- Crear pruebas para la serialización de estado del canvas.
