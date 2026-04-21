# SKILL: Schema Identity Persistence

## Intención
Mantener identidad estable y persistencia confiable para schemas a través de rename, reorder y sync.

## Cuándo usar esta skill
- bugs de identity
- persistencia rota
- sincronización inconsistente

## Archivos y zonas típicas
- `src/sisad-pdfme/common/schema.ts`
- `src/sisad-pdfme/ui/designerEngine.ts`

## Procedimiento recomendado
1. Entender el estado actual del componente o subsistema.
2. Identificar contratos de entrada, salida y persistencia.
3. Verificar si hay coupling con selección, geometría, schema config, runtime o estilos.
4. Proponer cambios pequeños y testeables.
5. Validar impacto en accesibilidad, responsive, performance y regresiones.
6. Actualizar documentación si el patrón cambió.

## Checklist
- preservar id estable
- separar id técnico y label
- validar matcher y storage key

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
