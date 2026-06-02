# SISAD PDFME — Arquitectura Markdown Agentic v4

Actualizado: `2026-06-01`

Este paquete actualiza la arquitectura Markdown existente de `sisad-pdfme` sin reemplazarla por un prompt gigante. El objetivo es que Claude, Codex, Copilot, Gemini u otro proveedor puedan cargar contexto por dominio y ejecutar cambios seguros en el editor PDF.

## Investigación previa usada

La actualización se basó en:

- Código consolidado actual: `456` archivos JS/TS/JSX/TSX.
- Documentación consolidada actual: `361` archivos Markdown.
- Estilos consolidados actuales: `6` archivos CSS.
- Comportamientos observados en capturas/grabación: toolbar compacta, paneles flotantes, `checkboxGroup`, `radioGroup`, `dropdown`, no-overlap, DetailView y ListView.
- Arquitectura existente `.ai`, `docs`, `tests`, providers, agentes, skills, prompts y handoff.

## Principio rector

```txt
ContentCustomForm = host de negocio
sisad-pdfme = runtime visual y funcional del PDF
externalForms = runner del snapshot usando Form/Viewer
.ai = memoria, reglas y prompts para asistentes IA
docs = documentación humana y técnica
tests = matrices de regresión y casos de uso
```

## Novedades v4

- Se agregan contextos y prompts cortos para `standard-fields`, `checkboxGroup`, `radioGroup`, `dropdown/select` y `group no-overlap`.
- Se agrega matriz completa de casos de uso para schemas estándar y grupos tipo DocuSign/Wix, sin copiar marca ni CSS propietario.
- Se refuerza que el botón `+` tenga contrato explícito: `checkbox -> checkboxGroup`, `checkboxGroup -> add option`, `radioGroup -> add option`.
- Se separa diseño de Designer, ejecución en Form/Viewer y salida en Generator/PDF.
- Se actualizan adaptadores multi proveedor con arranque compacto.
- Se agregan documentos de investigación previa para evitar que un asistente reescriba coordenadas/collision por intuición.

## Uso recomendado

1. Copiar este paquete en la raíz del proyecto.
2. Leer `AGENTS.md`.
3. Según proveedor, leer `CLAUDE.md`, `CODEX.md`, `COPILOT.md`, `GEMINI.md` o `.ai/providers/*`.
4. Cargar solo el contexto necesario desde `.ai/context-map.md`.
5. Usar un prompt corto desde `.ai/prompts/`.
6. Validar con build/lint y tests focalizados.

## Prompt de arranque rápido

Ver `START_PROMPT.md`.
