# TASK-UI-015 — Right/Left rail collapse y controles visibles

- Estado: active
- Agente principal: visual-baseline-agent
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Corregir los estados visuales colapsados de sidebars y garantizar que cada icono visible tenga acción, tooltip, aria-label, testId y estado activo claro.

## Archivos foco

```txt
src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx
src/sisad-pdfme/ui/components/Designer/shared/SidebarRail.tsx
src/sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle.tsx
src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx
src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx
```

## Pasos

```txt
1. Auditar estado expanded/collapsed de ambos sidebars.
2. Confirmar que el rail colapsado no renderiza botones sin panel/handler.
3. Agregar tooltips estables:
   - Campos
   - Propiedades
   - Comentarios
   - Documentos
   - Expandir panel
   - Contraer panel
4. Usar estado activo uniforme:
   - barra azul del lado interno
   - fondo blanco
   - ring suave
5. Corregir ubicación de `Guardar` respecto al rail.
6. Eliminar botones duplicados de collapse si hay handle y rail con la misma función.
7. Agregar Playwright smoke para colapsar/expandir.
```

## Criterios de aceptación

```txt
[ ] Al colapsar right sidebar solo quedan iconos accionables.
[ ] No hay iconos sin tooltip/aria/testId.
[ ] Guardar no se solapa con rail.
[ ] Expandir vuelve al panel correcto.
[ ] LeftSidebar y RightSidebar no compiten por shortcuts/selection.
```

## Validación

```bash
npx playwright test tests/playwright/sidebar-rail-collapse-actions.spec.ts
npm run build
```

## Notas / guardrails

No modificar lógica de panels ni selection; solo wiring visual/accionable.

## Cierre (2026-07-15, Claude)

- [x] Rail colapsado solo con iconos accionables (modos visibles por config,
      handler garantizado por construcción de `collapsedRailItems`).
- [x] Tooltips + aria-label + `data-testid` en rail
      (`sidebar-rail-<side>-<modo>`) y handles (`sidebar-collapse-<side>`).
- [x] Estado activo uniforme: barra azul interna + fondo blanco + ring suave
      (ya existente, verificado).
- [x] Guardar no se solapa con el rail (assert de bounding boxes en spec).
- [x] Expandir desde el rail vuelve al panel correcto (tab aria-selected).
- Validación: `sidebar-rail-collapse-actions.spec.ts` (2 tests) +
  `sidebar-collapse-parity.spec.ts` en verde. Build exit 0.
