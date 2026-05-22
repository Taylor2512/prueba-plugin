# Arquitectura del asistente IA — recipient transform edition

## Capas

1. Router: `AGENTS.md` + `.ai/INDEX.md`.
2. Reglas: `.ai/rules/global-rules.md`.
3. Contexto: `.ai/context/*.md`.
4. Agentes: `.ai/agents/*.agent.md`.
5. Skills: `.ai/skills/*/SKILL.md`.
6. Prompts: `.ai/prompts/*.prompt.md`.
7. Validación: tests unitarios + Playwright + documentación.

## Flujo recomendado

```txt
Diagnóstico → Agente → Skills → Prompt → Cambios pequeños → Tests → Docs → Reporte
```

## Orquestación sugerida

- Para color ownership: `recipient-color-ownership-architect`.
- Para iconos de catálogo: `schema-icon-color-sync-agent`.
- Para resize/rotate: `canvas-transform-interaction-architect`.
- Para colisiones Moveable/Selecto: `moveable-selecto-rotation-guardian`.
- Para pruebas: `playwright-recipient-color-test-guardian`.
- Para docs: `docs-migration-steward`.
