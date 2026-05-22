# Compatibilidad multi proveedor IA

## Objetivo

Mantener un workspace neutral que pueda ser consumido por Claude, Codex, GitHub Copilot y Gemini sin duplicar reglas contradictorias.

## Fuente de verdad

La fuente de verdad es `.ai/`.

## Adaptadores

- Claude: `CLAUDE.md` y `.claude/README.md`.
- Codex: `CODEX.md`, `AGENTS.md` y `.codex/README.md`.
- GitHub Copilot: `.github/copilot-instructions.md`, `.github/prompts`, `.github/instructions`.
- Gemini: `GEMINI.md` y `.gemini/README.md`.

## Reglas

- Los adaptadores deben resumir, no contradecir.
- Las reglas globales viven en `.ai/rules/global-rules.md`.
- Los prompts principales viven en `.ai/prompts`.
- Los skills viven en `.ai/skills`.
- Los agentes viven en `.ai/agents`.
