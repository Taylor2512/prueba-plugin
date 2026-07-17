# Reglas — Worktrees multiagente

1. `pwd`, rama y rol deben coincidir.
2. Implementadores no trabajan en `main` ni `ai/integration`.
3. Integrador no implementa features durante el gate.
4. Cada archivo tiene un owner por wave.
5. Los archivos transversales tienen owner exclusivo.
6. Los agentes no cambian de rama.
7. Los agentes no integran.
8. Los agentes no usan `push`, `pull`, `rebase`, `reset --hard`, `clean` o `stash`.
9. Commits atómicos, máximo 5 archivos productivos.
10. Handoff externo obligatorio.
11. El integrador rechaza commits con rutas fuera de ownership.
12. `main` solo avanza con `merge --ff-only`.
13. La realineación de ramas ocurre después del gate y con worktrees limpios.
14. No borrar ramas o worktrees reutilizables al cerrar una wave.
15. No actualizar expected o snapshots para ocultar fallos.
