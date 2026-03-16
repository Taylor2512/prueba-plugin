# ADR-001: Centralize on-canvas interaction state

## Context
Antes del cambio el lienzo mantenía múltiples banderas dispersas (`editing`, `hover`, `activeElements.length`, `moving`, etc.). Cada consumidor (Canvas, stage wrapper, Renderer QuickActions, AlignWidget) volvía a calcular si el usuario estaba seleccionando o manipulando objetos, lo que generaba comportamientos inconsistentes y difíciles de sincronizar.

## Decisión
Extraer la definición de `InteractionState` a `shared/interactionState.ts`, derivarla mediante `deriveInteractionState` en el Canvas y propagarla por `data-interaction-*` y el bridge. El estado alimenta overlays, el control bar y los comandos, eliminando cálculos duplicados. La capa de comandos (`selectionCommands.ts`) usa exactamente los mismos inputs para mantener todas las acciones en línea con el estado actual.

## Estados definidos
- `idle`: sin hover ni selección activa. El lienzo muestra el control bar mínimo y las sidebars en modo docked/overlay según configuración.
- `hover`: el mouse pasa sobre un schema sin haberlo seleccionado. Se sigue viendo el highlight y se prepara el toolbar.
- `selected-single`: un solo elemento seleccionado, se pueden mostrar métricas e interacciones individuales.
- `selected-multi`: múltiples elementos seleccionados; las actions de alineación/distribución aparecen junto al toolbar.
- `editing`: un renderer está editando el contenido (i.e., `Moveable` no está activo pero el usuario cliqueó para escribir).
- `dragging`, `resizing`, `rotating`: Moveable reporta una manipulación activa; el toolbar se vuelve minimalista y el stage pinta el estado `dragging`/`resizing`/`rotating`.

Cada fase se transforma en atributos `data-interaction-phase`, `data-interaction-count` y banderas booleanas, además de pasar al Bridge (`componentBridge.view`) y al hook de `CtlBar` para que reaccionen visualmente.

## Consumidores del estado
- `Canvas/index.tsx`: deriva el estado y lo reencamina al overlay manager, a los atributos del DOM y al bridge. También controla los flags `isDragging`, `isResizing`, `isRotating`. 
- `CanvasOverlayManager.tsx` y los overlays (`SelectionContextToolbar`, `InlineMetricsOverlay`, `SelectionBadgesOverlay`, `SnapFeedbackOverlay`): muestran UI contextual alineada al estado. 
- `CtlBar.tsx`: (pendiente) leerá los atributos para adaptar su estilo/contexto.
- `Renderer.tsx`: expone data attributes `data-schema-state`, `data-schema-active`, etc., que ayudan a los overlays a detectar qué elemento está activo/hover. 
- `RightSidebar`/`DetailView`/`AlignWidget`: consumen `selectionCommands` que dependen del mismo estado para evitar duplicaciones.
- `hooks.ts`: los atajos (`delete`, `selectAll`, etc.) llaman a los mismos comandos y se sincronizan con `activeElements`.

## Qué queda fuera
- No se reescribió la lógica interna de los plugins del sidebar izquierdo ni de las integraciones externas.
- No se modificó el motor de renderizado (`@pdfme/common`), sólo la capa UI que consume los schemas.
- El CSS legacy (`final-classes.css`) se mantiene mientras se migra gradualmente a `pdfme-improved.css`; confiar en ambos archivos se considera técnico de transición.

## Consecuencias
- Una sola fuente de verdad para hover/selección facilita añadir nuevos overlays sin reimplementar la lógica.
- El renderer queda limpio, dejando que la toolbar flotante y los comandos se encarguen de acciones rápidas.
- Cualquier nuevo consumidor debe leer la `InteractionState` en lugar de recomputar el estado local.
