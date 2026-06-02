# Reglas — No-overlap

1. Comparar solo schemas del mismo documento, página y owner.
2. Excluir el schema activo al mover/redimensionar.
3. Para grupos, usar bounding box completo.
4. No resolver colisiones con CSS.
5. No usar offsets mágicos sin helper centralizado.
6. No romper zoom, scroll ni paper geometry.
7. Auto-placement debe respetar page bounds.
8. Si no hay espacio, mostrar feedback y evitar mutación inválida.
9. Validar con unit tests y Playwright.
