# AGENTS

Este repositorio usa un workspace neutral para múltiples proveedores de IA. La fuente de verdad está en `.ai/`. Los adaptadores de proveedor como GitHub Copilot, Codex, Claude, Gemini, Kilo y Antigravity deben leer o derivar desde ese espacio neutral, no inventar instrucciones paralelas.

## Objetivo
Coordinar subagentes, prompts, skills, reglas e instrucciones para evolucionar este fork de SISAD PDF editor sin perder coherencia técnica.

## Principios
- Priorizar la arquitectura real del repositorio, no la del pdfme original.
- Mantener foco en engine, canvas, overlays, sidebars, schemas, generator y converter.
- Diseñar con ahorro de espacio, progressive disclosure y widgets contextuales.
- Favorecer cambios pequeños, testeables y documentados.
- Mantener compatibilidad con múltiples proveedores de IA.

## Dónde mirar primero
- `.ai/agents`
- `.ai/prompts`
- `.ai/skills`
- `.ai/instructions`
- `.ai/rules/global-rules.md`
- `docs/90-indice-verdad-actual.md`
- `docs/96-sisad-pdfme-overview.md`

## Flujo recomendado
1. Elegir subagente por dominio.
2. Cargar skill relevante.
3. Ejecutar prompt de tarea.
4. Validar con tests y documentación.
