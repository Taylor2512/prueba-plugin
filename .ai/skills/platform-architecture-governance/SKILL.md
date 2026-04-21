# SKILL: Platform Architecture Governance

## Intención
Tomar decisiones transversales de arquitectura sin perder claridad entre realidad actual y roadmap.

## Cuándo usar esta skill
- cambios de packaging
- exports
- modularización
- visión de producto

## Archivos y zonas típicas
- `src/sisad-pdfme`
- `docs`

## Procedimiento recomendado
1. Entender el estado actual del componente o subsistema.
2. Identificar contratos de entrada, salida y persistencia.
3. Verificar si hay coupling con selección, geometría, schema config, runtime o estilos.
4. Proponer cambios pequeños y testeables.
5. Validar impacto en accesibilidad, responsive, performance y regresiones.
6. Actualizar documentación si el patrón cambió.

## Checklist
- marcar realidad vs plan
- separar core e infraestructura
- priorizar contratos
- documentar decisiones

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
