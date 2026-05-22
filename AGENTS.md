# AGENTS — Router neutral IA para `sisad-pdfme`

Este repositorio usa `.ai/` como fuente de verdad para asistentes IA.

## Inicio obligatorio

1. Leer `.ai/INDEX.md`.
2. Leer `.ai/rules/global-rules.md`.
3. Leer `.ai/context/project-overview.md`.
4. Leer `.ai/context/recipient-transform-context.md`.
5. Leer `.ai/architecture/agent-routing.md`.

## Tarea actual prioritaria

Mejorar los comportamientos de recipient colors, schema icon color sync y transform controls:

- Cada destinatario/usuario de pruebas debe tener color único.
- El catálogo de schemas debe tomar el color del destinatario activo.
- Al cambiar destinatario activo, los iconos del catálogo deben cambiar al nuevo color.
- Los schemas ya creados deben conservar el color de su propietario original.
- Al seleccionar un schema debe poder redimensionarse y rotarse sin colisionar con selección, inline edit, context menu, comments ni shortcuts.

## Guardrails

- No acoplar el fork a terceros.
- No duplicar runtime de canvas, sidebars, snapshot engine ni schemas.
- No manipular DOM interno desde fuera del fork.
- Mantener CSS dentro de `.sisad-pdfme-root`.
- Preservar geometría de canvas, zoom, scroll, Moveable y Selecto.
- Si cambia runtime o API pública, agregar tests y docs.

Si hay contradicción entre adaptadores, prevalece `.ai/`.
