# GitHub Copilot — SISAD-PDFME

Use `AGENTS.md` as the neutral authority, then `.ai/START.md`,
`.ai/STATE-SOURCES.md`, the current task-card, one route and one skill.

Preserve public API, schema identity, document/page routing, ownership,
snapshot compatibility, Canvas geometry, accessibility and host independence.

Do not create a second registry, event bus, config service, snapshot format,
renderer or operational-state source. Report executed and non-executed gates
explicitly.

TypeScript typing rule: reducir el uso de `any` y `unknown`.

- **Regla general:** Evita usar `any` y `unknown` como tipos de primera clase en el código de producto. Prefiere tipos precisos, aliases con nombre o adaptadores en los límites (p. ej. zod/validators o funciones adaptadoras). Cuando `any` o `unknown` sean estrictamente necesarios, documenta la razón y limita su alcance localmente.
- **Soporte automático:** ESLint está configurado para advertir el uso de `any` y `unknown` para facilitar la adopción gradual. Corrige los usos cuando sea sencillo y crea adaptadores o validadores en el borde del sistema cuando proceda.
