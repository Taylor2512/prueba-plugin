# SKILL: Moveable Selecto Integration

## Intención
Guiar cambios seguros cuando Moveable y Selecto comparten selección, drag, resize y bounds dentro del canvas.

## Cuándo usar esta skill
- bugs de selección
- handles fuera de lugar
- drag interrumpido
- resize inconsistente

## Archivos y zonas típicas
- `src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx`

## Procedimiento recomendado
1. Entender el estado actual del componente o subsistema.
2. Identificar contratos de entrada, salida y persistencia.
3. Verificar si hay coupling con selección, geometría, schema config, runtime o estilos.
4. Proponer cambios pequeños y testeables.
5. Validar impacto en accesibilidad, responsive, performance y regresiones.
6. Actualizar documentación si el patrón cambió.

## Checklist
- confirmar ownership del estado
- validar keyboard + mouse
- probar multi selección
- agregar regresión si aplica

## Anti patrones
- Cambiar lógica y estilos sin aislar responsabilidades.
- Duplicar helpers geométricos o reglas de selección.
- Añadir flags temporales sin dueño claro.
- Dejar side effects sin test.
- Romper API pública por una mejora local.

## Salida esperada
- diagnóstico
- propuesta técnica
- diff lógico por archivos
- validación manual
- validación automática
- riesgos residuales
