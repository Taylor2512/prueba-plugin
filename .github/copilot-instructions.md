# GitHub Copilot Instructions — `sisad-pdfme`

Fuente de verdad del proyecto: `.ai/`.

## Inicio obligatorio

1. Revisar `AGENTS.md`.
2. Revisar `.ai/INDEX.md`.
3. Seguir `.ai/rules/global-rules.md`.
4. Aplicar `.ai/instructions/*.instructions.md` para la tarea.
5. Usar agentes, skills y prompts desde `.ai/`.

## Reglas críticas

- No acoplar `sisad-pdfme` a terceros.
- No duplicar sidebars, canvas runtime, snapshot engine ni schemas.
- Mantener CSS dentro de `.sisad-pdfme-root`.
- Preservar geometría de canvas, zoom, scroll, Moveable y Selecto.
- Actualizar docs y tests cuando cambie runtime o API pública.

Si existe contradicción con otro adaptador, prevalece `.ai/`.
