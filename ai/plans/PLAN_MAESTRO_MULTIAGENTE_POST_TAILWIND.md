# Plan maestro multiagente post-Tailwind

## Objetivo

Estabilizar SISAD PDFME después de la migración visual y completar UX, runtime y QA sin colisiones.

## Estado base

- Wave 1 consolidada en `main`.
- Lint y build pasaron.
- Vitest dejó fallos por reclasificar.
- `sisad-pdfme.css` está vacío.
- Worktrees deben ser hermanos y quedar fuera de scanners.

## Principios

```txt
funcionalidad → interacción → estructura visual → accesibilidad → polish → limpieza
```

## Fases

### Fase 0 — Documentación y contexto
Restaurar README, excluir worktrees/backups, compactar memoria, activar topología y regenerar context packs.

### Fase 1.5 — Contratos y tests
- Codex: core, schemas, downloads y pdf-lib focal.
- Claude: inspector, action schemas, radio groups y CtlBar.
- Copilot: Vitest, AntD, host lab y tests stale.
- Gate: lint, build, Vitest y Playwright focal.

### Fase 2 — UX principal
- Codex: toolbar contextual y focus.
- Claude: topbar global, Guardar y menú.
- Copilot: LeftSidebar y catálogo.

### Fase 3 — Colaboración/runtime
Owner color, reassignment, multi-recipient, documents/pages y Form/Viewer.

### Fase 4 — runtimeStyles
Clasificar KEEP_TECHNICAL, MIGRATE_TO_TAILWIND y DELETE_DEAD.

### Fase 5 — Release QA
Unit global, E2E, visual, a11y, docs y boundary tests.

## Criterio final

- Cero fallos no clasificados.
- Main recibe solo integración validada.
- No hay worktrees en context packs.
- Host no consume internals.
- No hay CSS visual duplicado.
