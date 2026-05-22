# CODEX — Adaptador para tareas de código en `sisad-pdfme`

Codex debe usar `.ai/` como fuente de verdad.

## Inicio obligatorio

1. Leer `AGENTS.md`.
2. Leer `.ai/INDEX.md`.
3. Seguir `.ai/rules/global-rules.md`.
4. Resolver agente y skill desde `.ai/architecture/agent-routing.md`.

## Reglas de ejecución

- Cambios pequeños, incrementales y testeables.
- No refactors masivos sin plan técnico.
- No duplicar lógica ni romper contratos públicos.
- No acoplar `sisad-pdfme` a integraciones externas.
- Actualizar docs y tests cuando cambie runtime o API.

## Checklist final

1. Ejecutar tests relevantes.
2. Confirmar consistencia de docs.
3. Reportar riesgos y alcance.
