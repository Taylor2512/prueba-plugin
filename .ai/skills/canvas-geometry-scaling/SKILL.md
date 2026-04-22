# SKILL: Canvas Geometry Scaling

## Intención
Trabajar zoom, scale, paper geometry y wrappers sin producir drift visual.

## Cuándo usar esta skill
- saltos al hacer zoom
- paper mal escalado
- offsets inconsistentes

## Archivos y zonas típicas
- `src/sisad-pdfme/ui/components/Paper.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx`

## Procedimiento recomendado
1. Entender el estado actual del componente o subsistema.
2. Identificar contratos de entrada, salida y persistencia.
3. Verificar si hay coupling con selección, geometría, schema config, runtime o estilos.
4. Proponer cambios pequeños y testeables.
5. Validar impacto en accesibilidad, responsive, performance y regresiones.
6. Actualizar documentación si el patrón cambió.

## Checklist
- medir root/page bounds
- revisar transform-origin
- validar scroll
- probar low/high zoom

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
