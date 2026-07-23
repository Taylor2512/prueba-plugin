# SISAD PDFME — Arquitectura de Asistentes IA V5

Arquitectura versionada para coordinar Codex, Claude Code y GitHub Copilot en `prueba-plugin`, con prioridad en:

- reducir duplicidad de código, contratos, estado, UI, CSS, pruebas, documentación y prompts;
- mantener la seguridad del diseñador PDF, multipágina, multidocumento, ownership y snapshot;
- usar el modelo y esfuerzo de razonamiento mínimos que resuelvan cada tarea;
- sostener memoria durable, Scrum ligero, task-cards y handoffs verificables;
- impedir que varios agentes escriban sobre los mismos archivos sin aislamiento;
- separar deuda propia, código vendorizado y documentación generada.

## Inicio rápido

1. Copia el contenido de esta carpeta en la raíz de `prueba-plugin`.
2. Lee `.ai/START.md`.
3. Copia `.codex/config.toml.example` a `.codex/config.toml` y revisa permisos/modelos disponibles.
4. Ejecuta `node tools/ai-quality/validate-ai-architecture.mjs`.
5. Actualiza `.ai/scrum/SPRINT-CURRENT.md` y elige una task-card activa.
6. Inicia el agente con `PROMPT_MAESTRO_CODEX_SISAD_PDFME.md` o uno de `.ai/prompts/`.

## Principio rector

Una tarea tiene un solo propietario de escritura. Los agentes auxiliares investigan, prueban o revisan y devuelven evidencia resumida. Las reglas durables se versionan; la memoria automática nunca es la única fuente de verdad.

## Documentos principales

- `PLAN_MAESTRO_ARQUITECTURA_IA_SISAD_PDFME_V5.md`
- `PROMPT_MAESTRO_CODEX_SISAD_PDFME.md`
- `.ai/MODEL-ROUTER.md`
- `.ai/DUPLICATION-POLICY.md`
- `.ai/ORCHESTRATION.md`
- `.ai/QUALITY-GATES.md`
- `research/OFFICIAL-FINDINGS.md`
- `research/CURRENT-DUPLICATION-BASELINE.md`
