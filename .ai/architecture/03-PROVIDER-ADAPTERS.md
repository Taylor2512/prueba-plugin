# Adaptadores de proveedores

La autoridad funcional es vendor-neutral y comienza en `AGENTS.md`.

Claude, Codex y Copilot pueden añadir sintaxis o capacidades propias, pero no
reglas de producto distintas.

## Validación disponible

```bash
node .ai/scripts/validate-provider-adapters.mjs
node .ai/scripts/validate-provider-drift.mjs
```

No documentar un generador `sync-provider-adapters.mjs` como autoridad mientras
ese script no exista en el worktree.

Los adapters raíz deben permanecer pequeños y enlazar a `AGENTS.md`,
`.ai/START.md` y las fuentes de estado vigentes.
