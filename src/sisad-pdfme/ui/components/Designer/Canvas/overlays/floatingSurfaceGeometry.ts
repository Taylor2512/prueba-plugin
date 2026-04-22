type ViewportSize = {
  width: number;
  height: number;
};

type FloatingSurfaceSize = {
  width: number;
  height: number;
};

type SelectionBounds = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export const FLOATING_SURFACE_EDGE_GAP = 8;

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
