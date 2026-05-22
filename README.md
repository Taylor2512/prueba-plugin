# SISAD PDFME — Workspace IA extendido para recipient colors + transform controls

Este paquete reemplaza y amplía el ZIP anterior. Mantiene el formato `.ai/` como fuente neutral para Claude, Codex, GitHub Copilot y Gemini, pero ahora incluye una cobertura mucho más amplia de agentes, skills, prompts, instrucciones, documentación y matrices de pruebas.

## Objetivo del paquete

Preparar a los asistentes IA para corregir y completar comportamientos de `sisad-pdfme` relacionados con:

- colores únicos por usuario o destinatario;
- sincronización del color del destinatario activo en iconos del catálogo de schemas;
- preservación del color propietario de schemas ya creados;
- pruebas donde cada usuario/destinatario usa un color distinto;
- resize, rotación, drag, selección simple y selección múltiple sin colisiones;
- convivencia segura entre Moveable, Selecto, inline edit, toolbar, context menu, comments y shortcuts;
- documentación y test coverage trazable.

## Regla principal

`.ai/` es la fuente de verdad. Los adaptadores `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.github/copilot-instructions.md` y carpetas de proveedor solo apuntan a `.ai/`.

## Orden recomendado de ejecución

1. Leer `AGENTS.md`.
2. Leer `.ai/INDEX.md`.
3. Leer `.ai/rules/global-rules.md`.
4. Usar `.ai/architecture/agent-routing.md` para elegir subagentes.
5. Cargar skills desde `.ai/skills`.
6. Ejecutar prompts desde `.ai/prompts`.
7. Validar con Vitest + Playwright.
8. Actualizar docs si cambian contratos públicos.

## Prompts principales

- `.ai/prompts/recipient-transform-master-plan.prompt.md`
- `.ai/prompts/enforce-recipient-colors-and-icon-sync.prompt.md`
- `.ai/prompts/stabilize-schema-resize-rotation.prompt.md`
- `.ai/prompts/fix-results-from-tests-recipient-transform.prompt.md`

## Estadísticas de contexto del último bundle

- Archivos de código detectados en el TXT unificado: `504`.
- Archivos CSS detectados: `6`.
- Archivos Markdown detectados: `248`.

## Instalación sugerida

Copia el contenido del ZIP en la raíz del repositorio y revisa los diffs antes de sobrescribir archivos existentes.

```bash
unzip sisad_pdfme_recipient_transform_ai_workspace_EXTENDIDO.zip -d .
```
