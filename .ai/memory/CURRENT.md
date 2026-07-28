# CURRENT

## Sprint

- Objetivo: cerrar CONFIG-020 con QA/documentación/gates coherentes y sin falsos verdes.
- Task-card activa: CONFIG-020
- Rama/worktree: `main` / `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin`
- Commit base: `23596c5`
- Último gate: `npm run quality:dead-code` sigue fallando por baseline heredada de deps/types y 3 duplicate exports semánticos; `lint`, `vitest`, `playwright`, `duplicate-functions`, `direct-config-readers` y `knip --include exports` verdes.
- Bloqueo: deuda heredada de `quality:dead-code` ya no incluye unused files ni unused exports.
- Próxima acción: documentar la excepción o abrir una ola separada para el último bloque de alias/constantes duplicadas.

No incluir historial; reemplazar al cambiar el estado.
