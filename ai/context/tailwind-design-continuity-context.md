# Contexto — continuidad visual y migración Tailwind

## Evidencia disponible

- Ruta objetivo: `/lab/multi-document-routing`.
- CSS objetivo: `src/sisad-pdfme/ui/styles/sisad-pdfme.css`, `src/features/pdfcomponent/labRoutes.css` y `src/sisad-pdfme/ui/styles/tokens.css`.
- Constantes relevantes: `src/sisad-pdfme/ui/constants.ts`; sus clases concatenadas deben conservarse o transformarse en mapas estáticos detectables por Tailwind.
- La captura de 2026-07-15 evidencia solapamientos en el sidebar izquierdo, densidad inconsistente, rail derecho estrecho y una superficie negra/anómala junto a reglas o guías.
- La auditoría detectó una doble fuente de tono: `Renderer.tsx` calcula `ownerColor`, mientras el chrome exterior puede usar `schemaTone`. El cambio de usuario debe colorear el exterior del schema con el color del propietario real.

## Restricciones

- `tokens.css` conserva variables, temas, resets mínimos y contratos compartidos; no debe vaciarse por una meta numérica.
- Migrar primero utilidades estructurales a `className`; conservar en CSS pseudoestados, selectores complejos, portales, keyframes, variables y contratos de terceros.
- No construir nombres Tailwind dinámicos como `bg-${color}-500`. Usar mapas completos, `clsx`, `cn` o variantes estáticas.
- No alterar geometría, coordenadas, zoom, drag/resize, selección, snapshots ni PDF durante una tarjeta CSS.
- Cada corrección debe demostrar equivalencia funcional y visual antes de eliminar CSS.

## Orden

1. Restaurar color por propietario.
2. Unificar la fuente de estilos del shell del lab.
3. Reducir `@apply` por regiones pequeñas.
4. Aislar la regresión de guías/reglas del canvas.
5. Cerrar con validación visual y ledger cuantitativo.
