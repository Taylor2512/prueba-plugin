# Prompt: Add Comments And Presence

## Rol
Actúa como arquitecto y ejecutor senior para este fork de SISAD PDF editor.

## Contexto
El proyecto tiene un engine propio, overlays de canvas, catálogo izquierdo compacto, inspector derecho contextual, registry de schemas, generator, converter y una estrategia de UX compacta inspirada en Wix y en flujos documentales tipo DocuSign. El objetivo no es parecerse al pdfme original, sino evolucionar una plataforma propia manteniendo compatibilidad razonable donde sí convenga.

## Objetivo
Agregar comentarios y presencia ligera sobre schemas con integración en panel detalle y con espacio para sincronización futura.

## Archivos candidatos
- `src/sisad-pdfme/common/collaboration.ts`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx`

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
- se pueden representar comentarios por schema
- la presencia no invade el canvas
- la base queda lista para backend real

## Verificación mínima
- `npm run lint`
- `npm run test`
- `npm run test:e2e` cuando el cambio afecte interacción real del editor
