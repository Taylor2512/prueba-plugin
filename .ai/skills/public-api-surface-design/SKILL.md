# SKILL: Public API Surface Design

## Intención
Diseñar y proteger exports públicos del proyecto sin filtrar internals innecesarios.

## Cuándo usar esta skill
- se quieren exportar helpers nuevos
- hay imports profundos
- hay surface difusa

## Archivos y zonas típicas
- `src/sisad-pdfme/ui/index.ts`
- `src/sisad-pdfme/common/index.ts`
- `src/sisad-pdfme/generator/index.ts`
- `src/sisad-pdfme/converter/index.ts`

## Procedimiento recomendado
1. Entender el estado actual del componente o subsistema.
2. Identificar contratos de entrada, salida y persistencia.
3. Verificar si hay coupling con selección, geometría, schema config, runtime o estilos.
4. Proponer cambios pequeños y testeables.
5. Validar impacto en accesibilidad, responsive, performance y regresiones.
6. Actualizar documentación si el patrón cambió.

## Checklist
- definir qué es público
- evitar leaks
- documentar migración
- mantener nombres estables

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
