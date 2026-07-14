# TASK-SCHEMA-001 — Option indicators DocuSign-like

## Objetivo
Unificar el indicador visual y el comportamiento de checkbox, checkboxGroup y radioGroup para Designer/Form/Viewer/PDF sin duplicar DOM o lógica.

## Alcance
- `optionIndicator.ts` como fuente visual central.
- `optionGroupRenderer.ts` para click/double click por modo.
- `checkbox/index.ts` para checkbox individual.
- CSS de option groups para evitar paneles o franjas internas.

## Fuera de alcance
- `SnapshotAdapter`
- `Generator` global
- `Moveable.tsx`
- `Selecto.tsx`
- Coordenadas globales x/y/width/height/rotation salvo sincronía existente de altura de grupo.

## Archivos candidatos
- `src/sisad-pdfme/schemas/options/optionIndicator.ts`
- `src/sisad-pdfme/schemas/options/optionGroupRenderer.ts`
- `src/sisad-pdfme/schemas/checkbox/index.ts`
- `src/sisad-pdfme/ui/styles/sisad-pdfme-global.css`
- `src/styles/sisad-tailwind-bridge.css`

## Archivos prohibidos
- `src/sisad-pdfme/ui/components/Designer/Moveable.tsx`
- `src/sisad-pdfme/ui/components/Designer/Selecto.tsx`
- `SnapshotAdapter`
- `Generator` global

## Pasos
1. Centralizar visual en `optionIndicator.ts`.
2. Ajustar render de grupo para designer/form/viewer/pdf.
3. Hacer checkbox individual consistente con el helper común.
4. Reforzar CSS para eliminar paneles/fondos extra.

## Validación
- `npm run build`
- `npm run lint` si existe y no está roto por configuración
- Verificación manual en `http://localhost:5174/lab/multi-document-routing`

## Criterio de parada
Detenerse si para cumplir el objetivo hay que tocar Moveable/Selecto, snapshot, generator o geometría global.

## Entrega final
- Resumen de archivos modificados.
- Confirmación de límites respetados.
- Resultado de build/lint.

## Cierre (2026-07-14, Claude)

Implementación previamente commiteada (ed26f5f): `optionIndicator.ts` como fuente
visual central y `renderOptionGroupUi` unificando designer/form/viewer sobre los
mismos marcadores runtime (sin DOM duplicado por modo).

Ajuste de esta sesión: la unificación había perdido el marcador raíz estable;
se restauró en `applyOptionGroupRootRuntime` (`data-checkbox-group-root` /
`data-radio-group-root`), contrato DOM usado por tests y hosts.

Validación ejecutada:
- [x] `npm run build` → exit 0; `npm run lint` → exit 0.
- [x] `checkbox-group-docusign-behavior.spec.ts` → 2 passed (grupo con contenedor,
      opciones con ids estables, affordance de agregar opción).
- [x] Límites respetados: sin tocar Moveable/Selecto/snapshot/generator/geometría.
