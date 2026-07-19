/**
 * Utilidades geométricas para posicionar superficies flotantes del canvas.
 *
 * Este módulo calcula posiciones seguras para toolbars, menús contextuales y
 * overlays anclados, evitando que se salgan del viewport. No toca DOM ni React.
 */

type ViewportSize = {
  left: number;
  top: number;
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
const FLOATING_SURFACE_BADGE_GAP = 26;

const clampWithin = (value: number, min: number, max: number) => Math.min(Math.max(min, value), max);

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
  const gap = FLOATING_SURFACE_EDGE_GAP;
  const selectionWidth = Math.max(0, bounds.right - bounds.left);
  const minTop = viewportSize.top + gap;
  const maxTop = Math.max(minTop, viewportSize.top + viewportSize.height - surfaceSize.height - gap);
  const minLeft = viewportSize.left + gap;
  const maxLeft = Math.max(minLeft, viewportSize.left + viewportSize.width - surfaceSize.width - gap);
  const preferredTop = bounds.top - surfaceSize.height - gap;
  const fallbackTop = bounds.bottom + gap;
  const top =
    preferredTop >= minTop
      ? preferredTop
      : clampWithin(fallbackTop, minTop, maxTop);

  const centeredLeft = bounds.left + selectionWidth / 2 - surfaceSize.width / 2;
  const left = clampWithin(centeredLeft, minLeft, maxLeft);

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
  const selectionCenter = bounds.left + selectionWidth / 2;
  const minTop = viewportSize.top + gap;
  const maxTop = Math.max(minTop, viewportSize.top + viewportSize.height - surfaceSize.height - gap);
  const minLeft = viewportSize.left + gap;
  const maxLeft = Math.max(minLeft, viewportSize.left + viewportSize.width - surfaceSize.width - gap);
  const clampTop = (value: number) => clampWithin(value, minTop, maxTop);
  const clampLeft = (value: number) => clampWithin(value, minLeft, maxLeft);

  const topCandidate = bounds.top - surfaceSize.height - gap - FLOATING_SURFACE_BADGE_GAP;
  const bottomCandidate = bounds.bottom + gap + FLOATING_SURFACE_BADGE_GAP;
  const top = topCandidate >= minTop ? topCandidate : clampTop(bottomCandidate);
  const centeredLeft = selectionCenter - surfaceSize.width / 2;
  return {
    top: clampTop(top),
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
  const minLeft = viewportSize.left + FLOATING_SURFACE_EDGE_GAP;
  const maxLeft = Math.max(minLeft, viewportSize.left + viewportSize.width - surfaceSize.width - FLOATING_SURFACE_EDGE_GAP);
  const minTop = viewportSize.top + FLOATING_SURFACE_EDGE_GAP;
  const maxTop = Math.max(minTop, viewportSize.top + viewportSize.height - surfaceSize.height - FLOATING_SURFACE_EDGE_GAP);
  const left = clampWithin(anchor.x, minLeft, maxLeft);
  const top =
    anchor.y + surfaceSize.height + FLOATING_SURFACE_EDGE_GAP > viewportSize.top + viewportSize.height
      ? clampWithin(anchor.y - surfaceSize.height, minTop, maxTop)
      : clampWithin(anchor.y, minTop, maxTop);

  return { top, left };
};
