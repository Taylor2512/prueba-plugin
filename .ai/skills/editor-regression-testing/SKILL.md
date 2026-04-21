# SKILL: Editor Regression Testing

## Intención
Asegurar que la evolución del editor no reintroduzca fallos en interacción, layout o surface pública.

## Cuándo usar esta skill
- refactors del editor
- arreglos delicados
- bugs difíciles de reproducir

## Archivos y zonas típicas
- `tests/unit`
- `tests/playwright`

## Procedimiento recomendado
1. Entender el estado actual del componente o subsistema.
2. Identificar contratos de entrada, salida y persistencia.
3. Verificar si hay coupling con selección, geometría, schema config, runtime o estilos.
4. Proponer cambios pequeños y testeables.
5. Validar impacto en accesibilidad, responsive, performance y regresiones.
6. Actualizar documentación si el patrón cambió.

## Checklist
- reproducir bug
- escribir test mínimo útil
- nombrar regresión
- evitar snapshots frágiles

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
