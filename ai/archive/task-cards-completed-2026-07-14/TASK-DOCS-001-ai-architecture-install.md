# TASK-DOCS-001 — Instalar arquitectura IA unificada

## Objetivo

Instalar carpeta `ai/` como fuente de verdad y adaptar Codex, Claude y Copilot con archivos puente.

## Alcance

- Copiar estructura `ai/`.
- Mantener `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md` como adaptadores.
- No eliminar documentación antigua aún.

## Validación

- `ai/start/START.md` existe.
- `AGENTS.md` apunta a `ai/start/START.md`.
- No hay reglas duplicadas extensas en adaptadores.

## No tocar

Código de runtime.

## Cierre (2026-07-14, Claude)

- [x] `ai/start/START.md` existe.
- [x] `AGENTS.md` apunta a `ai/start/START.md` (adaptador delgado, 26 líneas).
- [x] `.github/copilot-instructions.md` y `CLAUDE.md` también son adaptadores delgados (15/23 líneas).
- [x] Sin reglas duplicadas extensas en adaptadores; la fuente de verdad vive en `ai/`.
- [x] No se tocó código de runtime.
