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
