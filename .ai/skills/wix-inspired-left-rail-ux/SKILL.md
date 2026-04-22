# SKILL: Wix Inspired Left Rail UX

## Intención
Aplicar patrones de rail compacto, discovery mode y progressive disclosure inspirados en Wix.

## Cuándo usar esta skill
- catálogo ocupa demasiado espacio
- colapsado inútil
- mala jerarquía visual

## Archivos y zonas típicas
- `src/sisad-pdfme/ui/components/Designer/LeftSidebar*`
- `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css`

## Procedimiento recomendado
1. Entender el estado actual del componente o subsistema.
2. Identificar contratos de entrada, salida y persistencia.
3. Verificar si hay coupling con selección, geometría, schema config, runtime o estilos.
4. Proponer cambios pequeños y testeables.
5. Validar impacto en accesibilidad, responsive, performance y regresiones.
6. Actualizar documentación si el patrón cambió.

## Checklist
- priorizar canvas
- hacer visible lo mínimo
- usar tooltips y chips con intención
- no saturar rail colapsado

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
