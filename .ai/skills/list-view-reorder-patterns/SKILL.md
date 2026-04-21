# SKILL: List View Reorder Patterns

## Intención
Diseñar reorder, bulk edit y selección en list view sin romper claridad ni precisión.

## Cuándo usar esta skill
- drag overlay raro
- reorder frágil
- acciones de hover confusas

## Archivos y zonas típicas
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView`

## Procedimiento recomendado
1. Entender el estado actual del componente o subsistema.
2. Identificar contratos de entrada, salida y persistencia.
3. Verificar si hay coupling con selección, geometría, schema config, runtime o estilos.
4. Proponer cambios pequeños y testeables.
5. Validar impacto en accesibilidad, responsive, performance y regresiones.
6. Actualizar documentación si el patrón cambió.

## Checklist
- hacer hit targets claros
- separar reorder de acciones
- validar multi selección
- cuidar keyboard

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
