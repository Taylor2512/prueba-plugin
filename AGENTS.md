# AGENTS — Router neutral IA para `sisad-pdfme`

Este repositorio usa `.ai/` como fuente de verdad.

## Inicio obligatorio

1. Leer `.ai/INDEX.md`.
2. Leer `.ai/rules/global-rules.md`.
3. Leer `.ai/context/project-overview.md`.
4. Leer `.ai/architecture/agent-routing.md`.

## Flujo estándar

1. Seleccionar agente en `.ai/agents`.
2. Cargar skill en `.ai/skills`.
3. Ejecutar prompt en `.ai/prompts`.
4. Implementar cambios pequeños y reversibles.
5. Ejecutar tests relevantes.
6. Actualizar documentación si cambia contrato.

## Guardrails

- No acoplar `sisad-pdfme` a terceros.
- No duplicar runtime de canvas, sidebars, snapshot engine ni schemas.
- Mantener CSS dentro de `.sisad-pdfme-root`.
- Preservar geometría de canvas, zoom, scroll, Moveable y Selecto.
- Si cambia runtime o API pública, agregar o actualizar tests.

Si hay contradicción entre adaptadores, prevalece `.ai/`.
