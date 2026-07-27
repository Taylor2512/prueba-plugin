# UX-001 — Right Sidebar / ListView: compacidad, contador único, filtro accesible y DnD

**Estado:** review · **Owner:** claude-opus · **Modelo:** Opus 4.8 max · **Worktree:** actual (`main`)

## Objetivo observable

El modo Campos del RightSidebar queda compacto, con un solo contador semántico, header horizontal (sin apilar título+contador+acciones), filtro de tipos accesible y estilizado (sin `<select>` nativo, sin salir del panel, labels en español), filas con delete no dominante, sin selección de texto accidental y con drag overlay del ancho de la fila. Se conservan todos los contratos de selección/DnD/testid.

## Evidencia

Capturas del usuario (11/11 con `Reasignar`+`…` en fila vacía; menú `…` ambiguo; `<select>` nativo oscuro con labels EN). Ver `reports/right-sidebar-listview-ux-audit.md`.

## Archivos permitidos

- `src/sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarSurfacePrimitives.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewToolbar.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/TypeFilterSelect.tsx` (nuevo)
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListViewDragOverlay.tsx`
- `src/sisad-pdfme/ui/components/Designer/shared/designerLabels.ts` (solo añadir claves de tipo)
- Tests focales en `tests/unit/.../RightSidebar/ListView/**`

## Archivos prohibidos

`Canvas/Moveable.tsx`, `Selecto.tsx`, `Paper.tsx`, `snapshotAdapter.ts`, `generator/**`, `pdf-lib/**`, geometría/zoom, y `RightSidebar.tsx`/`layout.tsx` salvo necesidad (no requeridos por este alcance).

## Invariantes

Selección ListView↔Canvas, `mergeVisibleOrder` con filtros, testids, permisos (`canEditStructure`), sin `!important`/`setTimeout`/z-index arbitrario/CSS global, Tailwind en `className`.

## Diseño/patrón

- Header: slot `meta` inline (contador único) en `SidebarSurfaceHeader`; sin `stacked` para la fila principal.
- Filtro: `TypeFilterSelect` = listbox accesible portal-a-`body` (flip, teclado, Escape/outside-click, `data-designer-control`).
- Fila: `select-none`/`draggable=false`/`touch-none` puntuales; delete neutral→rose en hover/focus.
- Overlay: contenedor único `pointer-events-none select-none`, ancho de fila, extras como chip `+N`.

## Comandos de validación

```
npm run lint
npx vitest run tests/unit/sisad-pdfme/ui/components/Designer/RightSidebar/ListView
npm run build
```

## Criterios de aceptación

Contador único y semántico; header no apila título; filtro accesible sin `<select>` nativo ni recorte; delete no domina; sin text-select; overlay del ancho de la fila; testids/contratos intactos; gates focales en verde.

## Medición antes/después

| Aspecto | Antes | Después |
|---|---|---|
| Contador | badge `11/11` + subtítulo `8 visibles` (duplicado, card alta) | 1 contador `meta` inline: `11 campos` / `8 de 11` / `0 de 11` |
| Header minimal | `flex-col` apila título+contador+acciones | fila principal horizontal; solo búsqueda/filtro apilan |
| Filtro tipos | `<select>` nativo (menú oscuro macOS, se sale del panel, EN/ES) | listbox accesible portal-a-`body`, teclado, flip, labels ES |
| Delete | rojo permanente (domina) | neutro slate; rojo solo hover/focus |
| Text-select | resaltado azul accidental | `select-none` fila/grip/icono; `touch-none` grip |
| Drag overlay | doble card `<ul p-2 border shadow-lg>` + `adjustScale` (más ancho) | 1 contenedor ancho-fila, `pointer-events-none`, chip `+N` |

## Cierre

- Archivos productivos (6): `designerLabels.ts` (labels ES), `SidebarSurfacePrimitives.tsx` (slot `meta`), `TypeFilterSelect.tsx` (nuevo, listbox accesible), `ListViewToolbar.tsx` (contador único, sin `stacked`, menú contextual, filtro), `Item.tsx` (delete neutro, `select-none`, estados), `ListViewDragOverlay.tsx` (alineación).
- Tests: `visibility` reescrito; nuevos `counter`, `type-filter`, `Item.states`. Focal ListView 13 files / 36 tests verdes.
- Gates: ESLint exit 0; `vite build` exit 0 (6188 módulos); `tsc --noEmit` sin errores nuevos en archivos tocados (384 preexistentes ajenos).
- Fronteras: Canvas/Moveable/Selecto/Paper/snapshot/generator/pdf-lib intactos; `RightSidebar.tsx`/`layout.tsx` no modificados.
- Pendiente (fuera de alcance): validación en navegador vivo (extensión Chrome no conectada) y suite Playwright + 6 screenshots → **UX-003**; tabs/colapso → **UX-002**.

## Riesgos y rollback

Riesgo en el test `visibility` (asertaba `flex-col`): reescrito a la nueva semántica. `z-[70]` del popover reutiliza la capa del sidebar; verificar en navegador que no lo tapa un modal (no debería: modales antd ~1000). Rollback por archivo vía git; cambios acotados y reversibles.

## Memory delta

Nota durable: en el field-list el contador es único (`meta`) y el filtro de tipos es un listbox portal-a-`body` (no `<select>`). Relacionado con `[[detailview-proppanel-notes]]` y `[[w15-inspector-regressions]]` (patrón "docs/styles" ocultando lógica).
