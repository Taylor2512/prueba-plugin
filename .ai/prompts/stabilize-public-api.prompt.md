# Prompt: Stabilize Public API

## Rol
Actúa como arquitecto y ejecutor senior para este fork de SISAD PDF editor.

## Contexto
El proyecto tiene un engine propio, overlays de canvas, catálogo izquierdo compacto, inspector derecho contextual, registry de schemas, generator, converter y una estrategia de UX compacta inspirada en Wix y en flujos documentales tipo DocuSign. El objetivo no es parecerse al pdfme original, sino evolucionar una plataforma propia manteniendo compatibilidad razonable donde sí convenga.

## Objetivo
Auditar exports y contratos públicos para estabilizar la surface externa del editor, del generator y del converter, marcando claramente qué es público y qué es interno.

## Archivos candidatos
- `src/sisad-pdfme/ui/index.ts`
- `src/sisad-pdfme/common/index.ts`
- `src/sisad-pdfme/generator/index.ts`
- `src/sisad-pdfme/converter/index.ts`

## Restricciones
- Mantener compatibilidad con React, Vite, Vitest y Playwright actuales.
- No introducir dependencias innecesarias.
- No mover archivos por gusto si el beneficio no es claro.
- Mantener nombres semánticos y contratos estables cuando sea posible.
- Si un contrato cambia, documentar migración.
- Todo debe ser compatible con múltiples proveedores de IA consumiendo `.ai/` como fuente neutral.

## Entregables
1. Diagnóstico breve
2. Plan paso a paso
3. Cambios concretos en código
4. Riesgos y mitigaciones
5. Casos de prueba
6. Notas de documentación o migración

## Criterios de aceptación
- exports claros
- menos leaks internos
- documentación de migración si algo cambia

## Verificación mínima
- `npm run lint`
- `npm run test`
- `npm run test:e2e` cuando el cambio afecte interacción real del editor
