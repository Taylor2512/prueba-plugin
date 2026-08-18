# Prompt de arranque — Designer UX hardening

Trabaja sobre el repositorio SISAD-PDFME actual. Tu objetivo es cerrar, con evidencia y pruebas reales, cuatro brechas del Designer:

1. la selección por región dibuja/representa un área que no coincide con la región semánticamente seleccionada;
2. `Cuadrícula` aparece activa en el menú pero la rejilla no se visualiza sobre el documento;
3. el bloque LeftSidebar de `Todos / Favoritos / Recientes` + modos de visualización ocupa demasiado espacio y debe tener distribución compacta/progresiva sin perder funciones;
4. en RightSidebar/ListView, una pulsación prolongada debe activar multiselección y permitir seleccionar varios campos sin redirigir automáticamente al tab Detalle.

## Reglas obligatorias

- Lee primero `git status --short`, branch, commit base y `.ai/ops/coordination/claims.json`.
- No uses Git destructivo, no hagas stash general, no sobrescribas trabajo dirty ajeno.
- Respeta claims; un solo writer por slice.
- No crees task-cards/campañas paralelas. Refina `UX-WORKSPACE`, `UX-LEFT-SIDEBAR` y `UX-RIGHT-SIDEBAR`.
- No edites paths reclamados por otro agente; si un path necesario está reclamado, detén ese slice y continúa sólo con trabajo no conflictivo.
- No crees un segundo store de selección, motor de coordenadas, registry, event bus, grid engine, layout state ni sistema de favoritos/recientes.
- Reutiliza `DesignerCoordinateService`, `canvasViewCapabilities`, `gridGeometry`, `selectionCommands`, `selectionPolicy`, `useLeftSidebarCatalogState`, `CatalogLayoutToggle`, `SelectableSortableContainer` y autoridades existentes si siguen siendo canónicas en HEAD.
- Antes de crear archivos nuevos, busca implementaciones/tests equivalentes.
- No uses offsets mágicos para arreglar selección regional.
- No vuelvas a pintar grid fijo sobre el canvas si el contrato actual es page-space/mm.
- No uses `setTimeout` para sincronizar estado. Un timer sólo es aceptable como detector del gesto long-press y debe tener cleanup completo.
- Long-press no puede ser la única vía de multiselección: conserva modifier selection y añade equivalente accesible/teclado.
- Mantén configuración dinámica, multiusuario, multipágina, multidocumento, access policy y schema identity.
- No agregues fechas/versiones a nombres persistentes.

## Fuente de trabajo

Lee, como máximo inicial, estos anchors y sus tests cercanos:

- `src/sisad-pdfme/ui/components/Designer/Canvas/Canvas.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/gridGeometry.ts`
- `src/sisad-pdfme/ui/components/Designer/Canvas/canvasViewCapabilities.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/selectionCommands.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/selectionPolicy.ts`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/useLeftSidebarCatalogState.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/CatalogLayoutToggle.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableContainer.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/SelectableSortableItem.tsx`
- `src/sisad-pdfme/ui/styles/sisad-pdfme.css`

No asumas que esas rutas no han cambiado: confirma por símbolo antes de editar.

## Slice 1 — Grid

Primero demuestra el defecto con Playwright/DOM. Comprueba root Canvas y cada paper:

- `data-canvas-page`;
- `data-grid-visible`;
- `--sisad-grid-step`;
- `--sisad-grid-major-step`;
- `--sisad-grid-offset-x/y`;
- computed `background-image`.

Investiga el diff/HEAD para confirmar si se perdió la proyección page-level que antes escribía `paper.dataset.gridVisible` y `gridCssVariables`. Si ésa es la causa, restaura **una sola autoridad page-scoped**, no el viejo background de 24px sobre Canvas.

Tests requeridos: unit de capability/geometry + Playwright toggle, zoom, padding, multipágina, grid/snap independientes.

## Slice 2 — Selección por región

Construye una caracterización cuantitativa. Usa Playwright para iniciar y finalizar pointer en coordenadas conocidas, lee el bounding box del marquee y los `schemaUid` seleccionados.

Traza el contrato de espacios de coordenadas. Confirma si Selecto y `DesignerCoordinateService` trabajan en viewport/canvas/paper con compensaciones consistentes. Corrige en una sola autoridad.

Tests requeridos:

- unit de zoom/scroll/paper offset/reverse drag;
- Playwright en 50/75/100/125/150/200 %, scroll X/Y, sidebars, dos páginas, locked/no-access y option groups;
- región que cruza otra página sólo puede capturar la página/documento donde inició si ése sigue siendo el contrato canónico.

## Slice 3 — LeftSidebar compact controls

No reimplementes favoritos, recientes ni layout. Usa el state existente.

Objetivo visual recomendado:

- densidad normal: `[Filtro ▾] [lista][tiles][iconos]` en una sola fila;
- densidad mini: `[Filtro ▾] [Vista ▾]` con opciones secundarias en popover;
- búsqueda visible;
- filtro activo siempre visible;
- counts dinámicos;
- estado de chrome expandido/colapsado efímero, salvo contrato explícito contrario.

Tests requeridos: unit/RTL de filtros/counts/persistencia/layout + Playwright desktop/narrow, keyboard, focus, expand/collapse y drag de schemas después de cambiar layout.

## Slice 4 — RightSidebar long-press multiselect

No guardes IDs seleccionados en un state paralelo. Usa selection commands/state canónico.

Separa explícitamente:

```text
selection intent
!=
open Detail intent
```

Comportamiento:

- click corto fuera de multi mode conserva comportamiento actual;
- long-press sin movimiento entra a multi mode y selecciona/toggle sin abrir Detail;
- mientras multi mode está activo, clicks alternan membresía y permanecen en Campos;
- movimiento mayor al slop cancela long-press y deja actuar al DnD/reorder;
- modifier click sigue siendo compatible;
- entrada accesible/teclado equivalente obligatoria;
- contador y acciones derivan del selection state/capabilities reales.

Tests requeridos: unit del recognizer/policy + Playwright short click, long press, 2/3/N, toggle, movement/DnD, touch, Escape, modifier, Canvas↔List sync, locked/readOnly y page/document switch.

## Metodología de cada slice

1. caracterización y test rojo;
2. hipótesis de causa raíz;
3. cambio mínimo en autoridad existente;
4. test focal verde;
5. lint/typecheck del alcance;
6. Playwright Chromium;
7. Firefox/WebKit cuando Chromium esté verde;
8. registrar evidencia exacta: comando, resultado, archivos, riesgos residuales.

Si un test existente es defectuoso, corrige primero el harness y demuestra por qué; no cambies producto para satisfacer un falso positivo/negativo.

## Gate de cierre

No declares PASS hasta tener:

- unitarios focales PASS;
- Playwright de las cuatro capacidades PASS;
- 0 `pageerror`/errores críticos de consola en los flujos;
- `npm run lint` PASS;
- typecheck canónico PASS;
- build PASS;
- `git diff --check` PASS;
- no nuevos duplicados arquitectónicos;
- task-cards y evidence actualizados sólo con resultados ejecutados.

Entrega al final:

- causa raíz por slice;
- archivos exactos cambiados;
- tests añadidos/modificados;
- comandos y resultados;
- evidencia de configuración dinámica;
- riesgos residuales;
- diff summary;
- estado de `UX-WORKSPACE`, `UX-LEFT-SIDEBAR`, `UX-RIGHT-SIDEBAR`.
