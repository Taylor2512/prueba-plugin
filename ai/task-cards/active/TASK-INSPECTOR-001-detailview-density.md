# TASK-INSPECTOR-001 — Compactar el DetailView

## Objetivo
Reducir densidad visual del `RightSidebar` DetailView sin cambiar el contrato funcional ni las secciones canónicas ya definidas.

## Alcance
- Header del inspector
- Tarjetas de sección
- Widgets del DetailView con skin/densidad
- Descripciones y espaciado

## Fuera de alcance
- Canvas
- Moveable
- Selecto
- Paper
- Drag/drop
- Coordenadas de schema
- SnapshotAdapter
- Generator
- pdf-lib

## Archivos candidatos
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeaderCard.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailViewContent.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailHeaderUtils.ts`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailWidgets.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorPrimitives.tsx`
- `src/styles/sisad-tailwind-bridge.css`

## Archivos prohibidos
- `src/sisad-pdfme/ui/components/Designer/Canvas/**`
- `src/sisad-pdfme/ui/components/Paper.tsx`
- `src/sisad-pdfme/shared/snapshotAdapter.ts`
- `src/sisad-pdfme/generator/**`
- `src/sisad-pdfme/pdf-lib/**`

## Pasos
1. Compactar header y subtítulo.
2. Reducir padding/altura de cards.
3. Ajustar descripciones y jerarquía visual.
4. Aligerar widgets sin cambiar lógica.

## Validación
- `contract_stage` muestra un inspector más compacto.
- La densidad visual baja sin perder secciones.
- No se rompe selección ni interacción del canvas.

## Criterio de parada
- Si hace falta tocar canvas o geometría, detenerse.

## Entrega final
- Resumen corto de archivos modificados
- Confirmación de build/lint
