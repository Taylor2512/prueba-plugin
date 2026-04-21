# SKILL: Converter Pipeline Integrity

## Intención
Mantener integridad del pipeline de conversión PDF/imágenes entre browser y node.

## Cuándo usar esta skill
- fallos en pdf2img
- diferencias browser/node
- errores de worker o canvas

## Archivos y zonas típicas
- `src/sisad-pdfme/converter`

## Procedimiento recomendado
1. Entender el estado actual del componente o subsistema.
2. Identificar contratos de entrada, salida y persistencia.
3. Verificar si hay coupling con selección, geometría, schema config, runtime o estilos.
4. Proponer cambios pequeños y testeables.
5. Validar impacto en accesibilidad, responsive, performance y regresiones.
6. Actualizar documentación si el patrón cambió.

## Checklist
- validar entrypoints
- validar tipos
- validar errores y ranges
- probar memoria/performance básica

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
