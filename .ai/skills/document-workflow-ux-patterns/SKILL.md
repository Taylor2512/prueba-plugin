# SKILL: Document Workflow UX Patterns

## Intención
Aplicar patrones de UX orientados a flujos documentales: claridad, foco, revisión y configuración contextual.

## Cuándo usar esta skill
- flujo de usuario poco claro
- acciones principales dispersas
- review/document tabs confusas

## Archivos y zonas típicas
- `src/features/sisad-pdfme`
- `src/sisad-pdfme/ui/components/Designer`

## Procedimiento recomendado
1. Entender el estado actual del componente o subsistema.
2. Identificar contratos de entrada, salida y persistencia.
3. Verificar si hay coupling con selección, geometría, schema config, runtime o estilos.
4. Proponer cambios pequeños y testeables.
5. Validar impacto en accesibilidad, responsive, performance y regresiones.
6. Actualizar documentación si el patrón cambió.

## Checklist
- pensar tarea documental
- hacer quick actions visibles
- dejar deep config en inspector

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
