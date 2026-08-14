# Prompt — tooling safety

Toda mutación filesystem requiere dry-run/preflight serializable. Reproduce defectos antes
de editar. Mantén config central. No overwrites silenciosos, no partial install por default,
backups externos. Verifica Windows/macOS cuando aplique. Nunca uses path reconciliation para
rename semántico Recipient→User.
