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
