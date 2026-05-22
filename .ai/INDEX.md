# AI Context Index

Este archivo es el punto de entrada principal para cualquier asistente IA en `sisad-pdfme`.

## Fuente de verdad

La carpeta `.ai/` contiene la base única de contexto compartido:

- reglas globales
- contexto estable
- arquitectura IA
- agentes
- skills
- prompts
- instrucciones
- templates

## Lectura mínima obligatoria

1. `.ai/rules/global-rules.md`
2. `.ai/context/project-overview.md`
3. `.ai/context/code-map.md`
4. `.ai/architecture/assistant-architecture.md`
5. `.ai/architecture/agent-routing.md`

## Flujo de implementación

1. Seleccionar agente en `.ai/agents`.
2. Cargar skill en `.ai/skills`.
3. Ejecutar prompt en `.ai/prompts`.
4. Implementar cambios incrementales.
5. Ejecutar tests relevantes.
6. Actualizar documentación.

## Regla de sincronización

Si cambia una regla, prompt o instrucción:

1. Actualizar primero `.ai/`.
2. Ejecutar `npm run ai:sync`.
3. Ejecutar `npm run ai:check`.
4. Actualizar manifiesto con `npm run ai:manifest`.

## Adaptadores

Los siguientes archivos son adaptadores y no fuente de verdad:

- `AGENTS.md`
- `CLAUDE.md`
- `CODEX.md`
- `GEMINI.md`
- `.github/copilot-instructions.md`
- `.claude/README.md`
- `.codex/README.md`
- `.gemini/README.md`

Si hay contradicción, prevalece `.ai/`.