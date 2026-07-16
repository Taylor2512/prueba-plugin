# TASK-CSS-024 — Fila plana del ListView (RightSidebar) en Tailwind/TSX

- Estado: active
- Fecha: 2026-07-15
- Responsable: Claude
- Área: `sisad-pdfme` / RightSidebar / ListView / continuidad Tailwind

## Objetivo

Convertir la fila del ListView de "card flotante" a una fila plana profesional
(una sola superficie por fila, borde 1px gris, radio 8-10px, sin sombra
permanente, sin translate en hover, grip e icono discretos sin card interior,
barra de color de owner visible, metadata en una sola línea), moviendo el skin
al TSX sin tocar CSS de hoja.

## Diagnóstico

El container (`SelectableSortableContainer`), el toolbar y los duplicados de
`.sisad-pdfme-designer-list-view-item` en `sisad-pdfme.css` ya fueron
aplanados/limpiados por el trabajo paralelo. La pieza pendiente es `Item.tsx`:
la fila conserva `rounded-[1.1rem]`, `shadow-sm`, `hover:-translate-y-px`,
grip con píldora (borde+bg), icono con card interior (borde+shadow-inner),
alineación `items-start` y barra de owner tenue (2px, opacity 25%).

## Alcance

- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/Item.tsx`

## Fuera de alcance (deferido / prohibido)

- `RightSidebar.tsx` (§4 superficie única) y `SelectableSortableContainer.tsx`
  → en edición por el agente de TASK-REGRESSION-021; no tocar (colisión).
- `ListViewToolbar.tsx` (§3) → ya compacto (Input h-8/h-9, Select h-7/h-8, sin
  cards); no requiere cambio.
- `sisad-pdfme.css` / `tokens.css` / `labRoutes.css`.
- Moveable, Selecto, geometría de canvas, snapshot, generator, pdf-lib.

## Invariantes a conservar

- data-testids: `right-sidebar-field-item`, `right-sidebar-field-label`,
  `right-sidebar-field-technical-name`, `right-sidebar-field-type`,
  `right-sidebar-field-badge`; clases `.sisad-pdfme-designer-list-view-item*`.
- Atributo `data-schema-owner-color` y var `--schema-owner-color`
  (continuidad de color de owner, TASK-REGRESSION-020).
- Listeners de drag en el grip; hit-target de click; selección/hover por
  data-attributes; delete visible en hover/focus.

## Validación

- `npm run build`
- `npx playwright test tests/playwright/list-view-regression.spec.ts tests/playwright/right-sidebar-visual-polish.spec.ts tests/playwright/detail-view-options-listview.spec.ts`

## Criterio de parada

Si aplanar la fila exige tocar RightSidebar/Container o CSS de hoja, detenerse
y reflejar §3/§4 en TASK-REGRESSION-021.

## Cierre (2026-07-15, Claude)

`Item.tsx` migrado a fila plana en Tailwind/TSX (único archivo de producto tocado):

- Card raíz: `rounded-lg` (8px, antes 1.1rem), `shadow-none` (antes shadow-sm),
  sin `hover:-translate-y-px`; selección por `border/bg/ring` sky; `group` +
  `focus-within` ring.
- Contenido: `items-center`; barra de owner `before` a 3px, `opacity-55`, que
  sube a `opacity-100` al seleccionar vía `group-data-[selected=true]`
  (corrige el bug latente: el `data-[selected]:before` anterior nunca disparaba
  porque el `data-selected` vive en el `<li>`, no en el content).
- Grip: transparente sin píldora (`border-0 bg-transparent p-0 opacity-55`,
  antd `type="text"`); icono sin card interior (`border-0 bg-transparent
  shadow-none`); nombre `truncate min-w-0` + `title`.
- Densidad como fuente ÚNICA de utilidades de tamaño (mergeClassNames es join
  plano, no resuelve conflictos): alturas ~52/46/40px comfortable/compact/minimal;
  metadata en una sola línea (`flex-nowrap` fuera de comfortable, badge
  `max-w-[7.5rem]`).
- Conservados: todos los data-testids, `.sisad-pdfme-designer-list-view-item*`,
  `data-schema-owner-color`/`--schema-owner-color`, listeners del grip,
  hit-target, delete-on-hover, selección/hover por data-attributes.

### Validación

- `npm run build` → exit 0.
- `npx eslint Item.tsx` → 0 problemas.
- Verificación en vivo (pestaña "Campos" de `/lab/multi-document-routing`,
  densidad comfortable): 11 filas; `right-sidebar-field-list`=1,
  `-field-label`=11, `-field-technical-name`=11; `border-radius: 8px`;
  `box-shadow: none`; barra de owner `opacity 0.55`; `data-schema-owner-color=#2563EB`;
  grip `border 0px`; icono `border none`.
- Specs `list-view-regression`, `detail-view-options-listview`,
  `right-sidebar-visual-polish`: rojos por deriva ajena (panel Docs por defecto
  de LAB-029 + rename del switcher a `bg-[linear-gradient]`), NO por este cambio
  — no llegan a montar la pestaña Campos. Rastreado en
  `ai/task-cards/backlog/TASK-QA-017-listview-specs-docs-default-drift.md`.

### Fuera de alcance (no tocado, per criterio de parada)

§3 toolbar (ya compacto) y §4 superficie única de `RightSidebar.tsx` — en
edición por TASK-REGRESSION-021; la dedup CSS de `.list-view-item` ya estaba
resuelta por el trabajo paralelo.
