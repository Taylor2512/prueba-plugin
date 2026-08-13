---
id: TOOL-MARKDOWN-ENGINE
status: BACKLOG
domain: tooling-architecture
---

# Consolidar sanitización/index/topology/links

## Reglas

- source vivo es autoridad;
- no borrar un script hasta localizar todos sus consumers;
- dry-run antes de cambios de filesystem;
- no version tokens en paths nuevos;
- backups fuera del repo;
- no `git clean`, `reset --hard`, force push ni sync con `--delete`.

## Acceptance

- evidencia con comandos realmente ejecutados;
- no lógica duplicada nueva;
- configuración común tomada del config central;
- `git diff --check` limpio.
