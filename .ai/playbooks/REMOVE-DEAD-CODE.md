# Verificar y retirar dead code

1. Ejecutar Knip y búsquedas de imports/registries/dynamic loading.
2. Clasificar: público, dinámico, test-only, browser/node, realmente muerto.
3. No borrar barrels o entrypoints por reporte aislado.
4. Retirar en lotes pequeños.
5. Build + tests + consumer contract.
6. Actualizar exports/dependencies y documentar falsos positivos.
