# On-Canvas Accessibility Improvements

Resumen de cambios aplicados para mejorar accesibilidad en los overlays y controles on-canvas:

- `SelectionContextToolbar`
  - Añadido `aria-live` para anuncios de acciones (notificaciones silenciosas).
  - Auto-focus al abrir y manejo de navegación por flechas dentro del toolbar.
  - `aria-pressed` para controles tipo toggle y `role="button"` explícito en renderers.
  - Focus visible mejorado con `outline` y `box-shadow`.
  - Soporte para `toolbarConfig` JSON y anunciamiento tras ejecución de comandos.

- `SectionInsertOverlay`
  - Cierre al hacer clic fuera y tras realizar la inserción.
  - Emisión de evento `designer:inserted` con `id` y `type` del elemento insertado.
  - Auto-focus y navegación por flechas entre botones de inserción.
  - Animación de entrada ligera para indicar apertura.

- `SnapFeedbackOverlay`
  - Mensajes `aria-live` y `role="status"` para anunciar snaps.
  - Líneas visuales de snapping renderizadas con throttling (rAF) para rendimiento.
  - Animación sutil del badge de feedback.

- Drag & Drop (ListView)
  - `ListViewDragOverlay` visual mejorada con apilado y badge contador para multi-select.
  - `SelectableSortableContainer` renderiza un indicador de zona de drop entre elementos durante el arrastre.
  - Estilos y transiciones para mejorar visibilidad y reducir layout jank.

- `controlRegistry`
  - Renderers (`button`, `toggle`, `menu`) ahora incluyen `data-ctl-id`, `role`, `aria-label` y manejo de teclado consistente.

- Tests
  - Añadido E2E provisional `tests/e2e/reorder-insert.spec.cjs` para insertar y reordenar (requiere servidor local para ejecutar).
  - Tests unitarios ejecutados localmente después de cada cambio (sin fallos introducidos).

Pruebas recomendadas (local):

1. Levantar servidor dev: `npm run dev` en la raíz del proyecto.
2. Ejecutar unit tests: `npm test`.
3. Ejecutar E2E (Playwright): `npx playwright test tests/e2e/reorder-insert.spec.cjs` (asegurar que Playwright esté instalado y el servidor corriendo).

Notas y próximos pasos:

- Completar cobertura E2E en CI y afinar timeouts en tests que usan el DOM del canvas.
- Revisar y documentar accesos por teclado adicionales (Moveable integrations).
- Añadir checklist de accesibilidad automatizada (axe-core) para pruebas periódicas.
