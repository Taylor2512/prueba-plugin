# MIGRATION_GUIDE.md — Guía de migración

## Objetivo

Migrar desde una arquitectura Markdown parcial o dispersa hacia una arquitectura agentic centralizada.

## Pasos

1. Respaldar `AGENTS.md`, `.ai`, `docs`, `.github`, `.claude`, `.codex`, `.gemini`.
2. Copiar este paquete sobre la raíz.
3. Revisar `MANIFEST.md`.
4. Mantener `.ai` como fuente de verdad.
5. Mover docs obsoletos a `docs/99-archivo`.
6. Mantener stubs en providers; no duplicar reglas largas.
7. Ajustar prompts con rutas reales si el proyecto cambia de carpeta.

## No hacer

- No mover documentación viva a `src`.
- No crear prompts gigantes con snapshots completos.
- No mantener dos reglas activas para el mismo flujo.
