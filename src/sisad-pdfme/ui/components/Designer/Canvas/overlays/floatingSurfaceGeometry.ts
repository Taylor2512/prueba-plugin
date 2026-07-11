/**
 * Utilidades geométricas para posicionar superficies flotantes del canvas.
 *
 * Este módulo calcula posiciones seguras para toolbars, menús contextuales y
 * overlays anclados, evitando que se salgan del viewport. No toca DOM ni React.
 */

type ViewportSize = {
  width: number;
  height: number;
};

/**
 * Tamaño estimado o medido de la superficie flotante.
 */
type FloatingSurfaceSize = {
  width: number;
  height: number;
};

/**
 * Bounds rectangulares de la selección usados como ancla de posicionamiento.
 */
type SelectionBounds = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

/**
 * Separación mínima contra bordes del viewport y contra la selección/ancla.
 */
export const FLOATING_SURFACE_EDGE_GAP = 8;

/**
 * Posiciona una superficie centrada sobre la selección cuando hay espacio.
 *
 * Si no cabe arriba, usa una posición inferior controlada y clamp contra los
 * bordes del viewport.
 */
export const resolveCenteredFloatingSurfacePosition = (
  bounds: SelectionBounds,
  surfaceSize: FloatingSurfaceSize,
  viewportSize: ViewportSize,
) => {
  const selectionWidth = Math.max(0, bounds.right - bounds.left);
  const preferredTop = bounds.top - surfaceSize.height - FLOATING_SURFACE_EDGE_GAP;
  const fallbackTop = bounds.bottom + FLOATING_SURFACE_EDGE_GAP;
  const top =
    preferredTop >= FLOATING_SURFACE_EDGE_GAP
      ? preferredTop
      : Math.min(
        Math.max(FLOATING_SURFACE_EDGE_GAP, fallbackTop),
        Math.max(FLOATING_SURFACE_EDGE_GAP, viewportSize.height - surfaceSize.height - FLOATING_SURFACE_EDGE_GAP),
      );

  const maxLeft = Math.max(FLOATING_SURFACE_EDGE_GAP, viewportSize.width - surfaceSize.width - FLOATING_SURFACE_EDGE_GAP);
  const centeredLeft = bounds.left + selectionWidth / 2 - surfaceSize.width / 2;
  const left = Math.min(Math.max(FLOATING_SURFACE_EDGE_GAP, centeredLeft), maxLeft);

  return { top, left };
};

/**
 * Posiciona el toolbar de selección priorizando el lateral derecho, luego el
 * lateral izquierdo y finalmente una posición superior/inferior centrada.
 */
export const resolveSelectionToolbarPosition = (
  bounds: SelectionBounds,
  surfaceSize: FloatingSurfaceSize,
  viewportSize: ViewportSize,
) => {
  const gap = FLOATING_SURFACE_EDGE_GAP;
  const selectionWidth = Math.max(0, bounds.right - bounds.left);
  const selectionHeight = Math.max(0, bounds.bottom - bounds.top);
  const centeredTop = bounds.top + selectionHeight / 2 - surfaceSize.height / 2;
  const clampTop = (value: number) =>
    Math.min(Math.max(gap, value), Math.max(gap, viewportSize.height - surfaceSize.height - gap));
  const clampLeft = (value: number) =>
    Math.min(Math.max(gap, value), Math.max(gap, viewportSize.width - surfaceSize.width - gap));

  const rightLeft = bounds.right + gap;
  const leftLeft = bounds.left - surfaceSize.width - gap;
  const fitsRight = rightLeft + surfaceSize.width <= viewportSize.width - gap;
  const fitsLeft = leftLeft >= gap;

  if (fitsRight) {
    return {
      top: clampTop(centeredTop),
      left: clampLeft(rightLeft),
    };
  }

  if (fitsLeft) {
    return {
      top: clampTop(centeredTop),
      left: clampLeft(leftLeft),
    };
  }

  const centeredLeft = bounds.left + selectionWidth / 2 - surfaceSize.width / 2;
  return {
    top: clampTop(bounds.top - surfaceSize.height - gap >= gap ? bounds.top - surfaceSize.height - gap : bounds.bottom + gap),
    left: clampLeft(centeredLeft),
  };
};

/**
 * Posiciona una superficie a partir de un punto ancla, normalmente un click o
 * contextmenu, evitando que exceda los límites del viewport.
 */
export const resolveAnchoredFloatingSurfacePosition = (
  anchor: { x: number; y: number },
  surfaceSize: FloatingSurfaceSize,
  viewportSize: ViewportSize,
) => {
  const maxLeft = Math.max(FLOATING_SURFACE_EDGE_GAP, viewportSize.width - surfaceSize.width - FLOATING_SURFACE_EDGE_GAP);
  const maxTop = Math.max(FLOATING_SURFACE_EDGE_GAP, viewportSize.height - surfaceSize.height - FLOATING_SURFACE_EDGE_GAP);
  const left = Math.min(Math.max(FLOATING_SURFACE_EDGE_GAP, anchor.x), maxLeft);
  const top =
    anchor.y + surfaceSize.height + FLOATING_SURFACE_EDGE_GAP > viewportSize.height
      ? Math.max(FLOATING_SURFACE_EDGE_GAP, anchor.y - surfaceSize.height)
      : Math.min(Math.max(FLOATING_SURFACE_EDGE_GAP, anchor.y), maxTop);

  return { top, left };
};
