# SKILL: Designer Selection Lifecycle

## Intención
Entender selección simple, múltiple, edición y transición entre estados del canvas.

## Cuándo usar esta skill
- interactionState ambiguo
- toolbar aparece cuando no debe
- selection commands raros

## Archivos y zonas típicas
- `src/sisad-pdfme/ui/components/Designer/shared/interactionState.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/selectionCommands.ts`

## Procedimiento recomendado
1. Entender el estado actual del componente o subsistema.
2. Identificar contratos de entrada, salida y persistencia.
3. Verificar si hay coupling con selección, geometría, schema config, runtime o estilos.
4. Proponer cambios pequeños y testeables.
5. Validar impacto en accesibilidad, responsive, performance y regresiones.
6. Actualizar documentación si el patrón cambió.

## Checklist
- mapear fases
- distinguir hover/active/editing
- evitar side effects ocultos

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
