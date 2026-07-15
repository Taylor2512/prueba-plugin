# TASK-ARCH-004 — Reducir wrappers innecesarios y endurecer API pública

- Estado: active
- Agente principal: designer-runtime-agent
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Auditar wrappers internos y eliminar/reducir los que solo reenvían props, duplican classNames o esconden acciones sin contrato. Mantener wrappers públicos necesarios para portabilidad.

## Archivos foco

```txt
src/sisad-pdfme/react/**
src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/**
src/sisad-pdfme/ui/components/Designer/shared/**
src/sisad-pdfme/ui/components/Designer/LeftSidebar*.tsx
src/sisad-pdfme/ui/components/Designer/RightSidebar/**/*.tsx
src/sisad-pdfme/integration/index.ts
```

## Pasos

```txt
1. Clasificar wrappers:
   - PUBLIC_API_KEEP
   - CONTEXT_PROVIDER_KEEP
   - VISUAL_PRIMITIVE_KEEP
   - PASS_THROUGH_REMOVE
   - DUPLICATED_WITH_EXISTING_PRIMITIVE
   - HOST_SPECIFIC_REMOVE
2. No eliminar `SisadPdfmeDesigner/Form/Viewer/Provider`.
3. Revisar wrappers de RightSidebar shared.
4. Unificar componentes repetidos de button/card/pill si ya existe primitivo.
5. Reemplazar wrappers pasivos por componentes directos o utility class.
6. Validar exports públicos.
7. Documentar cambios en `reports/designer-deep-audit/wrapper-reduction.md`.
```

## Criterios de aceptación

```txt
[ ] No se elimina API pública.
[ ] Menos wrappers pasivos internos.
[ ] No hay imports host dentro de src/sisad-pdfme.
[ ] No se duplica SchemaAssignmentDialog.
[ ] No se duplican recipients/adapters.
```

## Validación

```bash
npm run build
npx vitest run tests/unit/sisad-pdfme/react
```

## Notas / guardrails

Reducir wrappers no significa colapsar toda la arquitectura. Mantener fronteras públicas y providers.

## Cierre (2026-07-15, Claude)

Clasificación completa en `reports/designer-deep-audit/wrapper-reduction.md`:
PUBLIC_API_KEEP (react/*), CONTEXT_PROVIDER_KEEP (Provider),
VISUAL_PRIMITIVE_KEEP (SidebarRail/CollapseHandle/SurfacePrimitives),
DUPLICATED_WITH_EXISTING_PRIMITIVE (SidebarEmptyState ↔
SidebarSurfaceEmptyState — plan de convergencia documentado, no aplicado por
trabajo en paralelo en RightSidebar), PASS_THROUGH_REMOVE = 0,
HOST_SPECIFIC_REMOVE = 0.

- [x] No se elimina API pública.
- [x] Sin wrappers pasivos internos (verificado; el par duplicado documentado).
- [x] Sin imports host en src/sisad-pdfme (grep = 0).
- [x] SchemaAssignmentDialog único; recipients/adapters sin duplicar.
- Validación: build exit 0 + `tests/unit/sisad-pdfme/react` en verde.
