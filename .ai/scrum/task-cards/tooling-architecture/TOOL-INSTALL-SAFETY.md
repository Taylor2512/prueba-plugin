---
id: TOOL-INSTALL-SAFETY
status: BACKLOG
domain: tooling-architecture
priority: P0
---
# Preflight y conflict-safe install-project-tools

Caracterizar `scripts/install-project-tools.mjs`. Introducir plan completo antes de apply:
create/identical/safe-update/conflict. Keep-target en conflicto; `--prefer-source` explícito.
Detectar conflictos de `package.json.scripts` en vez de pisarlos con `Object.assign`.
Backups externos y cero partial apply por defecto.
