# GitHub Copilot Instructions — `sisad-pdfme`

Fuente de verdad: `.ai/`.

## Inicio obligatorio

1. Revisar `AGENTS.md`.
2. Revisar `.ai/INDEX.md`.
3. Aplicar `.ai/rules/global-rules.md`.
4. Para recipient colors y transform controls, leer `.ai/context/recipient-transform-context.md`.
5. Usar agentes, skills y prompts desde `.ai/`.

## Reglas críticas

- No acoplar `sisad-pdfme` a terceros.
- Cada usuario/destinatario de pruebas debe tener color único.
- El catálogo debe reflejar el color del destinatario activo.
- El schema creado debe conservar ownerColor/ownerId.
- Resize/rotation no debe colisionar con Selecto, inline edit, comments, context menu ni shortcuts.
- CSS solo bajo `.sisad-pdfme-root` y tokens existentes.
