# TASK-RUNTIME-015 — Hook de configuración: mapa visible/acción/permisos

- Estado: backlog
- Agente principal: designer-runtime-agent
- Fecha: 2026-07-15
- Scope: `src/sisad-pdfme`
- Tipo: implementación controlada

## Resumen

Consolidar el hook de configuración para exponer un mapa de visibilidad + acción + permisos a todos los componentes, sin que cada componente reconstruya reglas.

## Archivos foco

```txt
src/sisad-pdfme/config/**
src/sisad-pdfme/react/useSisadPdfmeConfig.ts
src/sisad-pdfme/ui/components/Designer/shared/visibilityConfig.ts
src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts
```

## Pasos

```txt
1. Crear `ResolvedDesignerUiMap`.
2. Resolver `visibility`, `permissions`, `features`, `actions`.
3. Exponer hook `useDesignerUiConfig`.
4. Reemplazar props sueltos de visibility en componentes progresivamente.
5. No romper config legacy.
```

## Criterios de aceptación

```txt
[ ] Un componente pregunta al mapa, no recalcula reglas.
[ ] ActionRegistry usa el mismo mapa.
[ ] Reasignar, comentarios, documentos y panels obedecen config.
```

## Validación

```bash
npx vitest run tests/unit/sisad-pdfme/config
npm run build
```

## Notas / guardrails

## Cierre (2026-07-15, Claude)

- [x] `ResolvedDesignerUiMap` en `Designer/shared/designerUiConfig.ts`:
      visibility + permissions + features + overrides por acción.
- [x] Hook `useDesignerUiConfig` (OptionsContext → mapa memoizado).
- [x] `map.resolveAction(actionId, ctx)` delega en `resolveDesignerActionState`
      → ActionRegistry usa el mismo mapa (un componente pregunta, no recalcula).
- [x] Reasignar/comentarios/documentos/panels obedecen config (tests).
- [x] Config legacy intacta (mapa solo lee options existentes; test de config
      vacía). Adopción en componentes es progresiva por diseño de la card.
- Validación: `npx vitest run tests/unit/sisad-pdfme/config` (7 tests) + build.
