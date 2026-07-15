# Session Handoff

## Último foco

Ejecución completa de task-cards active + backlog (2026-07-15). Cerradas y
movidas a `completed/`:

- **ACTIONS-001**: inventario clasificado en
  `reports/action-audit/button-action-inventory.md` (237 candidatos;
  MISSING_HANDLER = 0 tras aplicar el contrato).
- **ACTIONS-002**: `designerActionState.ts` con `resolveDesignerActionState`
  (regla dura missing-handler, razones para tooltips); alias kebab-case
  consolidados en `actionRegistry.DESIGNER_ACTION_ALIASES`; adoptado en CtlBar
  y en `reassignActionState` (ListView).
- **DETAIL-015**: labels unificados (`inspectorStatusLabel = statusLabel`,
  'Posición bloqueada', 'Bloqueo sin responsable', menú 'Bloquear posición');
  alias legacy directos; se corrigieron 2 bugs de merge paralelo
  (statusTone fuera de scope; miembros duplicados en SchemaAccessState).
- **UI-015**: rails con tooltips + `sidebar-rail-<side>-<modo>` +
  `sidebar-collapse-<side>`; spec de no-solape Guardar/rail.
- **UI-016** (backlog): zoom siempre porcentual (`formatZoomPercent`,
  `buildZoomSelectOptions` inyecta el nivel actual), testids designer-zoom-*.
- **QA-015**: specs `action-contract-smoke`, `sidebar-rail-collapse-actions`,
  `zoom-toolbar-contract` + `tests/unit/sisad-pdfme/ui/actions/` (12 unit).
- **RUNTIME-015** (backlog): `ResolvedDesignerUiMap` + `useDesignerUiConfig`
  (`designerUiConfig.ts`); ActionRegistry consume el mismo mapa.
- **CSS-013/014**: auditores ejecutados, reportes regenerados (649 duplicados
  clasificados), ledger actualizado; SIN eliminación de reglas esta pasada
  (merges por slice usando los reportes).
- **ARCH-004**: `reports/designer-deep-audit/wrapper-reduction.md`
  (PASS_THROUGH_REMOVE = 0; par duplicado SidebarEmptyState ↔
  SidebarSurfaceEmptyState documentado para slice propio).

Siguen en `active/` solo las cards del repo host (`Sisad-Web-FRONTEND`):
PDFME-005, PDFME-008 (parte core verificada aquí), PDFME-009. No son
ejecutables dentro de este checkout; aquí solo queda la base portable que ya fue
verificada y el contexto histórico de esas integraciones.

Validación global: build exit 0, lint 0 errores, 101+ unit tests de áreas
tocadas en verde, 13 specs e2e en verde (specs desactualizados por el copy
cambiante del DetailView se hicieron copy-agnósticos). `tsc` global bajó de
174 a 140 errores (se arreglaron imports rotos de visibilityConfig/
designerUiConfig, duplicados de SchemaAccessState, badge type y ctx de tests).

## Próximo paso sugerido

- Slice de merges CSS (MERGE_SAME_SELECTOR) zona por zona usando
  `selector-duplicates-current.md`, con verificación visual.
- Convergencia SidebarEmptyState ↔ SidebarSurfaceEmptyState (slice propio).
- Adopción progresiva de `useDesignerUiConfig` en componentes que aún leen
  options directo.
- Cards host en Sisad-Web-FRONTEND (PDFME-005/008/009) con el reporte de
  paridad como guía.
- Commitear el working tree (mezcla trabajo de Codex + estas sesiones).

## Atención

- Codex trabaja EN PARALELO sobre este working tree (DetailView copy, registry,
  externalForms): antes de editar, releer el archivo; ya hubo 2 merges con
  bugs (statusTone, miembros duplicados) corregidos aquí.
- El copy del DetailView es inestable; los specs nuevos asertan títulos
  estables/testids, no descripciones.
- No usar git stash (4 stashes ajenos).
