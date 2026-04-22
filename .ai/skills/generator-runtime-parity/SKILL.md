# SKILL: Generator Runtime Parity

## Intención
Reducir diferencias entre render visual en el editor y salida final del generator.

## Cuándo usar esta skill
- UI y PDF no coinciden
- helpers duplicados
- bugs por font/layout

## Archivos y zonas típicas
- `src/sisad-pdfme/generator`
- `src/sisad-pdfme/schemas`

## Procedimiento recomendado
1. Entender el estado actual del componente o subsistema.
2. Identificar contratos de entrada, salida y persistencia.
3. Verificar si hay coupling con selección, geometría, schema config, runtime o estilos.
4. Proponer cambios pequeños y testeables.
5. Validar impacto en accesibilidad, responsive, performance y regresiones.
6. Actualizar documentación si el patrón cambió.

## Checklist
- comparar helpers
- validar defaults
- cubrir caso mínimo y complejo
- documentar limitaciones

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
