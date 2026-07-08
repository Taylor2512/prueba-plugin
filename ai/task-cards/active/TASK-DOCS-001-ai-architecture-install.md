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
