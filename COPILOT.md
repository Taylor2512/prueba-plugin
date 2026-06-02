# COPILOT.md — Adaptador GitHub Copilot para SISAD PDFME v5

## Startup

1. `AGENTS.md`
2. `.ai/INDEX.md`
3. `.ai/memory/project-memory.md`
4. `.ai/context-map.md`
5. `.ai/agents/registry.md`

## Modo de trabajo

- Nivel 1: cambio puntual, leer contexto + regla + prompt.
- Nivel 2: bug/feature de dominio, sumar subagente y skill.
- Nivel 3: auditoría global, justificar lectura de reportes o snapshots.
- Nivel 4: regresiones repetidas, activar contrato maestro de comportamiento.

## Instrucción crítica

No aplicar fixes locales si el bug afecta procesos transversales. Usar `application-behavior-contract-context.md` y crear matriz proceso → componentes → tests.

## Comandos/prompts sugeridos

- `START_PROMPT.md`
- `START_PROMPT_BEHAVIOR_AUDIT.md`
- `.ai/prompts/audit-application-behavior-regressions.prompt.md`
- `.ai/prompts/stabilize-selection-shortcuts-commandbus.prompt.md`
- `.ai/prompts/validate-multipdf-multipage-nooverlap.prompt.md`
- `.ai/prompts/improve-docusign-inspired-schema-design.prompt.md`

## Cierre obligatorio

```md
## Contexto usado
## Proceso afectado
## Diagnóstico
## Cambios
## Validación
## Riesgos
```
