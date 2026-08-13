# Existing AI architecture

El worktree ya contiene `.ai/scrum`, `.ai/routes`, `.ai/prompts`,
`.ai/knowledge`, `.ai/memory`, `.ai/contracts`, `.ai/plans`,
`.ai/architecture`, `.ai/brain`, `.agents/skills`, `.claude`, `.codex` y
`.github`.

`brain/` concentra conocimiento durable y portable; `.ai/scrum` y los ledgers
manejan ejecución; `reports/` conserva evidence/cold output; `.ai/index` es
lookup generado.

No instalar una segunda jerarquía paralela. Las migraciones de nombre deben
usar aliases verificables y Git conserva el historial.
