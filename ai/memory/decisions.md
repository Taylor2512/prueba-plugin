# Decisions

## DEC-001 — Carpeta única de IA

Toda la fuente de verdad de asistentes vive en `ai/`. Archivos raíz para Codex/Claude/Copilot son adaptadores delgados.

## DEC-002 — Contexto por task-card

Cada tarea carga máximo una task-card, un contexto, una regla y un playbook.

## DEC-003 — Tailwind sin preflight

Tailwind debe mantener `preflight: false` para no alterar Ant Design, canvas, PDF, Moveable, Selecto ni inputs.

## DEC-004 — Baseline visual en public/img-version

Las imágenes de `public/img-version` son referencia de intención visual previa a Tailwind.

## DEC-005 — CSS de geometría no migra a Tailwind

Paper, transform, zoom, x/y/width/height, Moveable/Selecto y z-index crítico permanecen en CSS/tokens o inline controlado.

## DEC-006 — Worktrees reutilizables por proveedor

Codex, Claude y Copilot implementan en worktrees y ramas locales estables:

```txt
ai/codex
ai/claude
ai/copilot
```

## DEC-007 — Rama de integración como único gate

Los commits aceptados se aplican en `ai/integration`. `main` solo avanza mediante fast-forward después de lint, build, Vitest y Playwright focal.

## DEC-008 — Coordinación viva fuera del repositorio

Locks, handoffs, status y gates viven en:

```txt
/Users/desarrollo1/Documents/Taylor/frontend/ai-coordination/sisad-pdfme
```

La documentación estable permanece en `ai/coordination/worktrees/**`.

## DEC-009 — Agente lógico separado de proveedor

`canvas-agent`, `inspector-agent`, etc. describen ownership de producto. Codex, Claude y Copilot son ejecutores asignados por wave.
