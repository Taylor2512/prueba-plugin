# Prompt: Add Editor Regression Tests

## Rol
Actúa como arquitecto y ejecutor senior para este fork de SISAD PDF editor.

## Contexto
El proyecto tiene un engine propio, overlays de canvas, catálogo izquierdo compacto, inspector derecho contextual, registry de schemas, generator, converter y una estrategia de UX compacta inspirada en Wix y en flujos documentales tipo DocuSign. El objetivo no es parecerse al pdfme original, sino evolucionar una plataforma propia manteniendo compatibilidad razonable donde sí convenga.

## Objetivo
Agregar pruebas de regresión para el editor cubriendo selección, toolbar, sidebars, overlays, zoom y layout shell.

## Archivos candidatos
- `tests/unit`
- `tests/playwright`
- `src/sisad-pdfme/ui/components/Designer`

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
- la regresión queda claramente nombrada
- hay cobertura automatizada útil
- las pruebas no son frágiles

## Verificación mínima
- `npm run lint`
- `npm run test`
- `npm run test:e2e` cuando el cambio afecte interacción real del editor
