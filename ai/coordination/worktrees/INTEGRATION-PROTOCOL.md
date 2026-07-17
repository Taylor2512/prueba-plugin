# Integration Protocol


1. Validar `ai/integration` limpio.
2. Leer handoffs.
3. Comparar `main..ai/<agente>`.
4. Rechazar rutas ajenas.
5. Cherry-pick SHAs aceptados.
6. `git diff --check`, lint, build, Vitest.
7. Playwright focal.
8. Gate.
9. `git merge --ff-only ai/integration`.
10. Realinear ramas limpias.
