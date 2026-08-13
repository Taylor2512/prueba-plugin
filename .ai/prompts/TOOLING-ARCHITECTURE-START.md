# Prompt de arranque — tooling architecture cleanup

Repo:

`/Users/desarrollo1/Documents/proyectos de Taylor/frontend/prueba-plugin`

Objetivo: reducir duplicidad/redundancia de `scripts`, `tools` y tooling `.ai`, centralizar
configuración y sanear la arquitectura Markdown.

## Invariantes

1. No tratar SISAD-PDFME como pdfme; es el producto actual.
2. No crear archivos/carpetas con tokens de versión.
3. IDs históricos pueden permanecer dentro del contenido, nunca como estrategia de versionado físico.
4. No borrar scripts por tamaño/nombre: localizar imports, package scripts, hooks, docs y CI.
5. Una sola autoridad de paths/ignores/naming/quality: `config/tooling/project-tools.config.mjs`.
6. Una sola implementación de Markdown index/topology/duplicates.
7. `tools/` solo para analizadores especializados.
8. Import ZIP/folder es aditivo y preserva hot state.
9. No copiar índices generados desde un overlay: regenerarlos localmente.
10. Dry-run antes de toda operación destructiva.

Empieza en `TOOL-BASELINE`. No ejecutes las siguientes tasks hasta tener el mapa de consumers
del worktree vivo.
