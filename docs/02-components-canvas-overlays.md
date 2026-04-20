# `CanvasOverlayManager.tsx`

## Propósito

`CanvasOverlayManager.tsx` es el orquestador visual del canvas. Monta la capa de overlays que complementa la edición directa sobre el documento: toolbar contextual, métricas inline, feedback de snap, y edición inline. La estructura del árbol de componentes muestra claramente que existe un subsistema completo de overlays dentro de `ui/components/Designer/Canvas/overlays`, incluyendo `CanvasContextMenu`, `canvasContextMenuActions`, `CanvasOverlayManager`, `floatingSurfaceGeometry`, `InlineEditOverlay`, `InlineMetricsOverlay`, `SelectionContextToolbar`, `SnapFeedbackOverlay` y `useFloatingToolbarPosition`. fileciteturn19file12turn19file4

## Por qué es importante

Sin este manager, el canvas se convertiría en una suma de widgets independientes. Con él, el editor:
- sabe qué overlay mostrar en cada fase
- reduce ruido visual
- centraliza el contexto de selección
- coordina edición inline y toolbar
- mantiene una jerarquía de overlays coherente

## Responsabilidades

### 1. Coordinar overlays
Debe decidir cuándo renderizar:
- toolbar contextual
- inline edit overlay
- métricas inline
- snap feedback

### 2. Consumir el estado de interacción
Depende de la fase actual (`editing`, `dragging`, `resizing`, `rotating`, etc.) y del conjunto de elementos/schemas activos.

### 3. Resolver posición
Normalmente delega la geometría a `useFloatingToolbarPosition` y utilidades como `floatingSurfaceGeometry`.

## Relación con otros archivos

- `SelectionContextToolbar.tsx`
- `InlineEditOverlay.tsx`
- `InlineMetricsOverlay.tsx`
- `SnapFeedbackOverlay.tsx`
- `interactionState.ts`
- `selectionCommands.ts`

## Problemas típicos que resuelve

- no mostrar toolbar mientras el usuario arrastra
- no solapar edición inline con selección activa
- ajustar posición del toolbar si el elemento es pequeño o está cerca del borde
- mostrar métricas solo cuando el usuario necesita feedback

## Qué documentar internamente

Este archivo debería tener comentarios de alto valor sobre:
- prioridad entre overlays
- reglas de visibilidad por fase
- fuentes del estado
- si usa memoización o no
- responsabilidades que no deben escaparse a overlays individuales

## Ejemplo de flujo

1. El usuario hace click sobre un schema.
2. El canvas calcula selección y `interactionState`.
3. `CanvasOverlayManager` recibe:
   - bounds
   - activeSchemas
   - activeElements
   - interactionState
4. Si no hay edición inline activa:
   - pinta `SelectionContextToolbar`
5. Si hay resize:
   - pinta `InlineMetricsOverlay`
6. Si hay snap:
   - pinta `SnapFeedbackOverlay`
7. Si el usuario entra en editar texto:
   - oculta toolbar
   - muestra `InlineEditOverlay`

## Recomendaciones

- Introducir una tabla explícita de prioridades de overlays.
- Añadir tests unitarios o de integración del orden de visibilidad.
- Si piensas vender la plataforma, este archivo debe documentarse como “Overlay Orchestrator”.
