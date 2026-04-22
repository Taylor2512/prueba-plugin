import {
  resolveCenteredFloatingSurfacePosition,
  resolveSelectionToolbarPosition,
} from './floatingSurfaceGeometry.js';

type Bounds = { top: number; left: number; right: number; bottom: number };
type PageSize = { width: number; height: number };
type SurfaceSize = { width: number; height: number };

const TOOLBAR_WIDTH = 384;
const TOOLBAR_HEIGHT = 224;
const DEFAULT_SURFACE_SIZE: SurfaceSize = { width: TOOLBAR_WIDTH, height: TOOLBAR_HEIGHT };

export const useFloatingToolbarPosition = (
  activeElements: HTMLElement[],
  pageSize: PageSize,
  surfaceSize?: SurfaceSize,
) => {
  const resolvedSurfaceSize = surfaceSize ?? DEFAULT_SURFACE_SIZE;

  if (!activeElements.length) return null;

  const candidateRoot = activeElements[0]?.closest?.('.sisad-pdfme-designer-canvas');
  const canvasRoot = candidateRoot instanceof Element ? candidateRoot : globalThis.document?.querySelector('.sisad-pdfme-designer-canvas');

  if (!canvasRoot) return null;

  const canvasRect = canvasRoot.getBoundingClientRect();
  const bounds = activeElements.reduce<Bounds>(
    (acc, element) => {
      const rect = element.getBoundingClientRect();
      const top = rect.top - canvasRect.top;
      const left = rect.left - canvasRect.left;
      const right = rect.right - canvasRect.left;
      const bottom = rect.bottom - canvasRect.top;
      acc.top = Math.min(acc.top, top);
      acc.left = Math.min(acc.left, left);
      acc.right = Math.max(acc.right, right);
      acc.bottom = Math.max(acc.bottom, bottom);
      return acc;
    },
    { top: Number.POSITIVE_INFINITY, left: Number.POSITIVE_INFINITY, right: 0, bottom: 0 },
  );

  if (!Number.isFinite(bounds.top) || !Number.isFinite(bounds.left)) {
    return null;
  }

  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const safePageWidth = Number.isFinite(pageSize.width) ? Math.max(0, pageSize.width) : 0;
  const safePageHeight = Number.isFinite(pageSize.height) ? Math.max(0, pageSize.height) : 0;

  const viewportSize = {
    width: Math.max(safePageWidth, canvasRect.width),
    height: Math.max(safePageHeight, canvasRect.height),
  };
  const { top, left } =
    activeElements.length > 1
      ? resolveCenteredFloatingSurfacePosition(bounds, resolvedSurfaceSize, viewportSize)
      : resolveSelectionToolbarPosition(bounds, resolvedSurfaceSize, viewportSize);

  return {
    top,
    left,
    width,
    height,
  };
};
