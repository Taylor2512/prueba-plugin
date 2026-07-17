# TASK-CSS-023 — Continuidad de migración Tailwind por slices pequeños

## Objetivo

Seguir migrando clases visuales desde `src/sisad-pdfme/ui/styles/sisad-pdfme.css` y los otros CSS activos hacia sus componentes JSX/TSX propietarios, sin perder paridad visual ni tocar contratos técnicos de canvas, Moveable, Selecto, zoom o geometría.

## Contexto

- La hoja `src/sisad-pdfme/ui/styles/sisad-pdfme.css` ya quedó reducida y conserva sobre todo contratos técnicos.
- Parte de las clases visuales del proyecto se concatenan desde `src/sisad-pdfme/ui/constants.ts`.
- El laboratorio de referencia es `http://localhost:5174/lab/multi-document-routing`.
- Hay una sola task-card activa; esta tarjeta vive en `backlog` hasta que el board libere espacio.

## Alcance

- Analizar componentes que concatenan clases desde `src/sisad-pdfme/ui/constants.ts`.
- Mover a JSX/TSX utilidades estáticas de layout, spacing, tipografía, bordes, radios, hover y focus-visible.
- Mantener en CSS solo lo que sea técnico, dinámico o imposible de expresar con seguridad en JSX/TSX.
- Actualizar pruebas y el ledger de migración en cada slice.

## Fuera de alcance

- Moveable, Selecto, zoom, paper geometry, canvas coordinates, snapshot, generator y `pdf-lib`.
- Crear CSS nuevo paralelo.
- Forzar vaciado total de CSS técnico.
- Cambiar lógica funcional de selección, drag/drop, reasignación o runtime.

## Archivos candidatos

Máximo 5 por slice. Priorizar:

- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarSurfacePrimitives.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx`

## Archivos prohibidos

- `src/sisad-pdfme/ui/styles/tokens.css`
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` para skin técnico/geométrico ya validado
- `src/features/pdfcomponent/labRoutes.css`
- Canvas geometry, Moveable, Selecto, snapshot, generator, `pdf-lib`

## Plan paso a paso

1. Reabrir `ai/router/CONTEXT_BUDGET.md` y trabajar solo un slice visual.
2. Buscar clases concatenadas desde `src/sisad-pdfme/ui/constants.ts` y ubicar el nodo dueño real.
3. Comparar la captura actual con el baseline del laboratorio en el panel objetivo.
4. Migrar únicamente utilidades estáticas seguras al JSX/TSX del componente dueño.
5. Dejar en CSS solo contratos técnicos, media queries o descendientes que el JSX no pueda expresar con seguridad.
6. Agregar o ajustar pruebas unitarias y Playwright para el comportamiento visual cubierto.
7. Regenerar `reports/tailwind-migration/selector-duplicates-current.md` si se retiró algún selector.
8. Actualizar `ai/task-cards/active/*` o `reports/tailwind-migration/component-migration-ledger.md` con el slice validado.
9. Validar con `npm run build` y el smoke o unit test correspondiente.
10. Detenerse si el siguiente ajuste requiere más de 5 archivos o toca geometría/canvas.

## Regla operativa

- Un slice = una región visual.
- No mezclar sidebar izquierdo, sidebar derecho, inspector y canvas en el mismo pase.
- No borrar CSS sin comprobar el consumidor real.
- No convertir clases runtime o derivadas en strings dinámicos si Tailwind no las detecta.

## Validación mínima por slice

- `npm run build`
- Prueba focalizada del componente o panel
- Smoke visual en `/lab/multi-document-routing`
- Actualización del ledger y del reporte de duplicados si aplica

## Criterio de parada

Detenerse si:

- el ajuste depende de geometría o del canvas;
- el selector no tiene consumidor claro;
- la migración requiere más de 5 archivos;
- la comparación visual empeora;
- el contrato ya es técnico y no debe vaciarse más.

## Entrega esperada

Registro corto del slice, archivos tocados, validaciones ejecutadas y estado de CSS restante.
