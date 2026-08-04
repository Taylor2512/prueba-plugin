# Instalación del paquete

Este ZIP es un overlay aditivo.

1. Crear una rama o worktree.
2. Extraer el ZIP en la raíz de `prueba-plugin`.
3. Verificar que no se reemplazaron:
   - `README.md`
   - `.ai/scrum/PRODUCT-BACKLOG.md`
   - `.ai/scrum/SPRINT-CURRENT.md`
   - `.ai/memory/**`
4. Fusionar manualmente las filas del backlog.
5. Ejecutar `git status --short`.
6. Revisar `MANIFEST.md`.
7. Activar únicamente `VISUX-001`.

No ejecutar herramientas de mirror/sync con borrado.
