# SKILL: Fork Safe PDF Evolution

## Intención
Evolucionar el fork con criterio propio sin reintroducir dependencias mentales del upstream.

## Cuándo usar esta skill
- comparativas con pdfme original
- migraciones del fork
- renames y divergencia

## Archivos y zonas típicas
- `src/sisad-pdfme`
- `docs/37-platform-pdf-migration-plan.md`

## Procedimiento recomendado
1. Entender el estado actual del componente o subsistema.
2. Identificar contratos de entrada, salida y persistencia.
3. Verificar si hay coupling con selección, geometría, schema config, runtime o estilos.
4. Proponer cambios pequeños y testeables.
5. Validar impacto en accesibilidad, responsive, performance y regresiones.
6. Actualizar documentación si el patrón cambió.

## Checklist
- evaluar si el upstream aún aplica
- favorecer naming propio
- documentar divergencia útil

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
