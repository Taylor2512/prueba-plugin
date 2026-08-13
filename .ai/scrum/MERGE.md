# Merge seguro de arquitectura

Antes de aplicar un overlay:

1. capturar `git status`, branch y HEAD;
2. ejecutar el instalador en dry-run;
3. respaldar cualquier archivo reemplazado;
4. preservar task-cards, ledger, backlog, CURRENT/HANDOFF y evidence;
5. aplicar aliases de paths antes de regenerar navegación;
6. validar nombres, links e IDs;
7. revisar diff antes de commit.

No asumir archivos históricos como `SPRINT-CURRENT.md` o `CLAIMS.md` si no
existen en el worktree actual.
