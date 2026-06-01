# COPILOT.md — Adaptador GitHub Copilot

Copilot debe actuar con instrucciones pequeñas y reutilizables.

## Inicio

1. Leer `.github/copilot-instructions.md`.
2. Leer `.ai/INDEX.md`.
3. Usar `.github/prompts/*` como wrappers de `.ai/prompts/*`.

## Regla

`.github/prompts` no debe contener lógica divergente. Debe apuntar o copiar de forma controlada la fuente `.ai/prompts`.

## Foco recomendado

- Cambios puntuales de UI.
- Tests cercanos al cambio.
- Refactor local.
- Normalización de nombres y contratos.
