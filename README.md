# SISAD PDFME — Arquitectura Markdown Agentic v3

Generado: `2026-06-01T18:47:53Z`

Este paquete reemplaza y ordena la arquitectura Markdown del workspace `sisad-pdfme`, tomando como referencia la arquitectura amplia de Inverneg pero ajustándola al contexto actual del proyecto: editor PDF, canvas, schemas, destinatarios, colores, transformaciones, snapshots, externalForms, generator/converter, UI/UX y pruebas.

## Diagnóstico base

El análisis cruzó:

- `510` archivos de código JS/TS/JSX/TSX.
- `323` archivos Markdown existentes.
- `6` archivos CSS consolidados.
- Referencia de arquitectura Inverneg/SISAD para adoptar `.ai`, `docs`, `handoff`, `tests`, providers, agentes, subagentes, skills, prompts, reglas y economía de tokens.

## Principio rector

```txt
ContentCustomForm = host de negocio
sisad-pdfme = runtime visual y funcional del PDF
externalForms = runner del snapshot usando Form/Viewer
.ai = memoria y ejecución para asistentes IA
docs = documentación humana y técnica
tests = matrices documentales y planes de validación
```

## Uso recomendado

1. Copiar este paquete en la raíz del proyecto.
2. Leer `AGENTS.md`.
3. Ejecutar el flujo de inicio según el proveedor:
   - Claude: `CLAUDE.md`
   - Codex: `CODEX.md`
   - Copilot: `.github/copilot-instructions.md`
   - Gemini: `GEMINI.md`
4. No cargar todo el snapshot: usar `.ai/INDEX.md` y `.ai/context-map.md`.
5. Validar cambios con build, lint, Vitest dirigido y Playwright cuando toque canvas/visual.

## Capas

```txt
AGENTS.md / CLAUDE.md / CODEX.md / COPILOT.md / GEMINI.md
  -> adaptadores pequeños por proveedor

.ai/
  -> router, memoria, contexto, reglas, agentes, prompts, skills y checklists

docs/
  -> documentación humana y técnica

handoff/
  -> continuidad de sesión, plan y tickets

tests/
  -> matrices de regresión y gaps

reports/
  -> análisis actual, inventarios y riesgos

metadata/
  -> inventarios JSON para futuras herramientas
```
