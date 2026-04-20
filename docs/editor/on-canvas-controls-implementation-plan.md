# Plan de implementación: Controles on-canvas (Wix/Figma-like)

Este plan está organizado en 7 fases ejecutables. Cada fase indica objetivo, archivos a tocar, archivos a crear (si procede), dependencias, riesgos, criterios de aceptación, definición de terminado y estrategia de rollback. Se trabajará exclusivamente dentro de las rutas permitidas.

---

## Fase 1: Interaction State

	- Implementar un hook centralizado que derive y exponga el estado de interacción del canvas (fase, ids ancla, bounding rects, flags de transform) a partir de `activeElements`, `hoveringSchemaId` y los eventos de Moveable.

	- `ui/components/Designer/Canvas/index.tsx` (conectar hook y exponer eventos/ref)
	- `ui/components/Renderer.tsx` (exponer `getElementRect(id)` y emitir `onHover/onLeave` si hace falta)
	- `ui/types.ts` (añadir/ajustar tipos: InteractionPhase, InteractionFlags, AnchorRect)

	- `ui/components/Designer/Canvas/interaction/useInteractionState.ts`
	- `ui/components/Designer/Canvas/interaction/types.ts`

	- `Moveable.tsx` callbacks (onDragStart/onDrag/onDragEnd, onResize, onRotate)
	- `selectionCommands.ts` para consumo posterior

	- Re-renders excesivos por manejar eventos de mouse/drag sin throttling.

	- Usar requestAnimationFrame + debounce (16–32ms) y comparar diffs de rects antes de emitir cambios.

	- El hook devuelve fases correctas (idle, hover, selected-single, selected-multi, dragging, resizing, rotating, editing).
	- Cambios de fase no provocan más de 60 renders/s en una interacción normal.

	- `useInteractionState` está integrado en `Canvas/index.tsx` y el canvas expone `data-interaction-*` con la fase y flags.

	- Revertir el commit que añade el hook; volver a la extracción previa de `activeElements` en `Canvas/index.tsx`.


## Fase 2: Overlay Manager
	- `ui/components/Designer/Canvas/Moveable.tsx` (asegurar que emite bounding rects/preview events)

	- `useInteractionState` (Fase 1)
	- overlays existentes: `InlineMetricsOverlay.tsx`, `SelectionBadgesOverlay.tsx`, `SnapFeedbackOverlay.tsx`

- Mitigaciones
	- Contenedor base con `pointer-events: none`; botones individuales con `pointer-events: auto`.
	- Usar portal para controlar stacking context.

- Criterios de aceptación
	- Overlays se posicionan correctamente con el zoom activo y respetan el bounding rect de la selección.
	- No se pierden eventos de drag/resize al aparecer overlays.

- Definición de terminado
	- `CanvasOverlayManager` desplegando overlays según `useInteractionState` y `Moveable`.

- Rollback strategy
	- Desmontar `CanvasOverlayManager` y restaurar el render directo de overlays en `Canvas/index.tsx`.

---

## Fase 3: Floating Toolbar

- Objetivo
	- Implementar una Floating Toolbar portalizada con acciones claves (duplicate, delete, align, open details) integradas con `selectionCommands`.

- Archivos a tocar
	- `ui/components/Designer/Canvas/index.tsx` (punto de anclaje / API)
	- `ui/components/Designer/Canvas/overlays/CanvasOverlayManager.tsx`
	- `ui/components/Designer/RightSidebar/index.tsx` (exponer `openFromCanvas(schemaId)` si no existe)

- Archivos a crear
	- `ui/components/Designer/Canvas/overlays/FloatingToolbar.tsx`
	- `ui/components/Designer/Canvas/overlays/ContextualToolbar.tsx` (opcional para multi-select)

- Dependencias
	- `selectionCommands.ts`
	- `ControlsPortal.tsx` (Fase 2)

- Riesgos
	- Ocupación de espacio en elementos pequeños; focus loss al portalizar.

- Mitigaciones
	- Corner placement para bbox < 64px; gestionar focus/tabindex al abrir.

- Criterios de aceptación
	- Floating toolbar aparece en la posición correcta, ejecuta comandos y anuncia acciones via aria-live.

- Definición de terminado
	- Toolbar accessible por teclado y touch; comandos realizados correctamente.

- Rollback strategy
	- Desactivar render del FloatingToolbar y conservar QuickActions inline.

---

## Fase 4: Inline Metrics + Badges

- Objetivo
	- Pulir y optimizar overlays inline: métricas (InlineMetricsOverlay) y badges (SelectionBadgesOverlay) mostrando estado y acciones rápidas.

- Archivos a tocar
	- `ui/components/Renderer.tsx` (asegurar data attributes / hooks)
	- `ui/components/Designer/Canvas/overlays/InlineMetricsOverlay.tsx`
	- `ui/components/Designer/Canvas/overlays/SelectionBadgesOverlay.tsx`

- Archivos a crear
	- Opcional: `ui/components/Designer/Canvas/overlays/BadgeButton.tsx` para botones reutilizables

- Dependencias
	- `useInteractionState`, `Moveable.tsx`

- Riesgos
	- Overhead en actualizaciones durante drag/resize.

- Mitigaciones
	- Throttle a 60Hz o menos, cache de rects y uso de `React.memo` en componentes pesados.

- Criterios de aceptación
	- Métricas y badges se actualizan en preview sin degradar interacción; no bloquean Moveable.

- Definición de terminado
	- Inline overlays integrados visualmente y funcionalmente con la Floating Toolbar.

- Rollback strategy
	- Revertir cambios en overlays y mantener QuickActions minimal.

---

## Fase 5: Contextual Top Bar

- Objetivo
	- Extender `CtlBar.tsx` o añadir `ContextualTopBar` para mostrar acciones de alto nivel cuando hay multi-select (group, align, distribute, z-order).

- Archivos a tocar
	- `ui/components/CtlBar.tsx`
	- `ui/components/Designer/Canvas/index.tsx` (pasar estado a CtlBar)

- Archivos a crear
	- Opcional: `ui/components/Designer/Canvas/overlays/ContextualTopBar.tsx` si se separa de `CtlBar`

- Dependencias
	- `useInteractionState`, `selectionCommands.ts`

- Riesgos
	- Duplicidad con FloatingToolbar; confusión de prioridad de acciones.

- Mitigaciones
	- Definir reglas de prioridad: FloatingToolbar (single-element quick), TopBar (bulk/high-level).

- Criterios de aceptación
	- Top bar aparece para multi-select y no interfiere con el pager/zoom.

- Definición de terminado
	- Top bar accesible, acciones implementadas y tests manuales completados.

- Rollback strategy
	- Desactivar top bar y mantener acciones en RightSidebar.

---

## Fase 6: Right Sidebar inteligente

- Objetivo
	- Añadir `QuickDetail` mode en `RightSidebar` para edición rápida desde el canvas y mantener el `DetailView` completo para edición avanzada.

- Archivos a tocar
	- `ui/components/Designer/RightSidebar/index.tsx`
	- `ui/components/Designer/RightSidebar/DetailView/index.tsx`

- Archivos a crear
	- `ui/components/Designer/RightSidebar/QuickDetailView.tsx`

- Dependencias
	- `useInteractionState`, `selectionCommands.ts`, `changeSchemas` API

- Riesgos
	- Race conditions entre ediciones en QuickDetail y cambios aplicados por overlays.

- Mitigaciones
	- Uso de `commitSchemas` transaccional y feedback visual de sincronización.

- Criterios de aceptación
	- Open-from-canvas abre QuickDetail centrado en `schemaId`; cambios se reflejan en canvas inmediatamente.

- Definición de terminado
	- QuickDetail implementado y probado en flujos de edición comunes.

- Rollback strategy
	- Volver a navegación previa hacia `DetailView` y desactivar QuickDetail.

---

## Fase 7: Limpieza CSS

- Objetivo
	- Consolidar reglas en `sisad-pdfme-improved.css` y sanear `final-classes.css`; crear estilos específicos para overlays y controles.

- Archivos a tocar
	- `final-classes.css`
	- `sisad-pdfme-improved.css`
	- estilos inline de componentes en `ui/components/*` cuando sea necesario

- Archivos a crear
	- `ui/components/Designer/Canvas/overlays/controls.css` (scoped styles para controles)

- Dependencias
	- Tokens de tema existentes (colors, spacing, motion)

- Riesgos
	- Rupturas visuales por cambios de especificidad.

- Mitigaciones
	- Hacer cambios en rama, ejecutar pruebas visuales y usar feature flag CSS para rollback rápido.

- Criterios de aceptación
	- Contraste y tamaños cumplen WCAG AA; no hay solapamientos en los estados comunes.

- Definición de terminado
	- CSS consolidado, lint/format, PR con revisión visual aprobada.

- Rollback strategy
	- Revertir commits CSS y restaurar la hoja previa; destruir feature-flag si fuera necesario.

---

## Entrega incremental y gobernanza

- Branching
-  - Crear ramas por fase: `feature/controls/phase-1`, `feature/controls/phase-2`, ... Cada PR debe ser pequeño y revisable.
-
- Testing mínimo por PR
-  - Comprobaciones manuales: selección, multi-select, drag/resize/rotate, keyboard navigation, touch.
-  - Performance smoke test: ~200 elementos en el canvas.
-
- Documentación
-  - Adjuntar esta planificación y un breve ADR por decisión mayor (portal, pointer-events strategy, hotspot sizes).
-
---

Si quieres, empiezo implementando la Fase 1 (`useInteractionState.ts` y la integración mínima en `Canvas/index.tsx`) y envío el parche por fases.

