# SISAD PDFME — Workspace IA extendido

Este paquete contiene una arquitectura completa de asistencia con IA para evolucionar `sisad-pdfme` como fork aislado, configurable y genérico.

## Qué incluye

- Reglas globales para IA.
- Arquitectura de asistencia multiagente.
- Skills reutilizables.
- Prompts especializados.
- Instrucciones por proveedor.
- Adaptadores para Claude, Codex, GitHub Copilot y Gemini.
- Documentación técnica mejorada y extendida.
- Checklists de calidad, seguridad y regresión.
- Mapa de módulos detectado desde el código consolidado.

## Principio rector

`sisad-pdfme` debe mantenerse como componente aislado. Todo componente debe ser genérico, toda habilidad debe ser configurable y toda integración debe entrar mediante contratos públicos, plugins, adapters, comandos o eventos.

## Proveedores soportados

- Claude
- Codex
- GitHub Copilot
- Gemini

## Orden recomendado de lectura

1. `AGENTS.md`
2. `.ai/rules/global-rules.md`
3. `.ai/architecture/assistant-architecture.md`
4. `.ai/context/project-overview.md`
5. `.ai/instructions/*.instructions.md`
6. `.ai/agents/*.agent.md`
7. `.ai/skills/*/SKILL.md`
8. `.ai/prompts/*.prompt.md`
9. `docs/README.md`

## Estadísticas usadas para generar el workspace

- Archivos de código detectados: `504`
- Archivos bajo `src/sisad-pdfme`: `385`
- Archivos Markdown detectados: `248`
- Archivos CSS detectados: `6`

## Instalación sugerida

Copia el contenido de este ZIP en la raíz del repositorio del fork. Si ya tienes archivos con el mismo nombre, revisa primero los diffs y fusiona manualmente.

```bash
unzip sisad_pdfme_ai_workspace.zip -d .
```

## Uso recomendado

Para una tarea técnica:

1. Identifica el dominio: canvas, schema, sidebars, snapshot, generator, testing, CSS o arquitectura.
2. Abre el agente correspondiente en `.ai/agents`.
3. Lee el skill correspondiente en `.ai/skills`.
4. Ejecuta el prompt de `.ai/prompts`.
5. Valida con tests unitarios y Playwright.
6. Actualiza documentación si cambian contratos públicos.
