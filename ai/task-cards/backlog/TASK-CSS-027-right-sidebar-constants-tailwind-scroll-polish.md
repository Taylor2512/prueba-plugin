# TASK-CSS-027 — RightSidebar: migración Tailwind guiada por constantes y pulido de scroll

## Objetivo

Continuar la migración de clases visuales desde `src/sisad-pdfme/ui/styles/sisad-pdfme.css` hacia los componentes JSX/TSX propietarios, usando como referencia las clases concatenadas en `src/sisad-pdfme/ui/constants.ts` y corrigiendo los problemas visuales actuales del `RightSidebar`.

## Contexto

- La migración Tailwind ya avanzó bastante, pero todavía quedan contratos técnicos en `src/sisad-pdfme/ui/styles/sisad-pdfme.css`.
- En el laboratorio `http://localhost:5174/lab/multi-document-routing` siguen apareciendo problemas de jerarquía visual, scroll y affordances en el panel derecho.
- Los estilos visuales migrados deben vivir en JSX/TSX; CSS solo debe conservar contratos técnicos, geométricos o no expresables con seguridad.
- Hay otras task-cards activas en el board, así que este slice debe permanecer acotado y validable.

## Alcance

Este slice solo toca la superficie y el comportamiento visual del `RightSidebar`:

- Tabs superiores `Campos / Detalle / Docs`.
- Header del panel y rail de acciones.
- `ListViewToolbar` y su relación con `ListView`.
- `Item.tsx` y la interacción de hover, selección y eliminar.
- `DetailHeaderCard.tsx`, `DetailSectionCard.tsx` y `SchemaCollaborationWidget.tsx` si el ajuste visual lo exige.
- Scroll local de `ListView`, `DetailView` y `Docs`.

## Fuera de alcance

- `Canvas` geometry, Moveable, Selecto, zoom, paper coordinates, snapshot, generator y `pdf-lib`.
- Crear CSS nuevo paralelo.
- Introducir `!important` como solución.
- Cambiar la lógica de selección, reasignación, ownership o permisos.
- Reabrir task-cards completadas o tocar tarjetas archivadas.

## Archivos candidatos

Máximo 5 archivos de producto por pasada. Priorizar:

- `src/sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/layout.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailSectionCard.tsx`

Si el slice lo requiere:

- `src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarSurfacePrimitives.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaCollaborationWidget.tsx`

## Archivos prohibidos

- `src/sisad-pdfme/ui/styles/tokens.css`
- `src/features/pdfcomponent/labRoutes.css`
- Canvas geometry y overlays técnicos de Moveable/Selecto
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css` para contratos técnicos ya validados de canvas

## Pasos

1. Revisar los consumidores reales de `src/sisad-pdfme/ui/constants.ts` dentro del `RightSidebar`.
2. Identificar qué clases estáticas pueden vivir en JSX/TSX y cuáles deben permanecer en CSS por ser técnicas o dependientes de runtime.
3. Migrar primero el skin seguro del panel superior: switcher, tabs, botones, estados active/focus-visible y compactación.
4. Corregir el header del `ListView` para que quede compacto, estable y sin duplicar bordes, sombras o paddings.
5. Ajustar `Item.tsx` para que:
   - el hover no oculte el icono de eliminar;
   - el estado selected no se confunda con el acento del owner;
   - el drag handle y el hit target no compitan con el click.
6. Revisar `DetailSectionCard.tsx` para alinear los headers de secciones con el baseline visual y evitar tonos grises/negros demasiado pesados.
7. Verificar que el panel derecho tenga un solo propietario de scroll por subvista y que `Docs`/`Detalle` no hagan wrap ni corten contenido.
8. Eliminar de `src/sisad-pdfme/ui/styles/sisad-pdfme.css` solo los selectores migrados y verificados en este slice.
9. Actualizar `reports/tailwind-migration/component-migration-ledger.md` con el slice validado.
10. Si se retiró algún selector, regenerar `reports/tailwind-migration/selector-duplicates-current.md`.

## Validación mínima

- `npm run build`
- Prueba focalizada de `RightSidebar` o `ListView`
- Smoke visual en `http://localhost:5174/lab/multi-document-routing`
- Verificación manual de:
  - tabs sin wrap;
  - scroll estable;
  - botón eliminar visible en hover;
  - header de detalle sin exceso de gris/negro;
  - docs accesible y consistente.

## Criterio de parada

Detenerse si:

- el siguiente ajuste requiere más de 5 archivos;
- la corrección depende de geometría del canvas;
- no está claro el consumidor de una clase;
- la comparación visual empeora;
- el cambio pide crear CSS nuevo paralelo.

## Entrega esperada

Registro corto del slice, archivos tocados, clases migradas desde `constants.ts`, validaciones ejecutadas y CSS técnico restante.
