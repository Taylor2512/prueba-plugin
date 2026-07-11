/**
 * useFloatingToolbarPosition — calcula posición del toolbar contextual.
 *
 * Resuelve bounds de elementos DOM seleccionados relativos al canvas y delega
 * el posicionamiento seguro a las utilidades de floatingSurfaceGeometry.
 */

import {
  resolveCenteredFloatingSurfacePosition,
  resolveSelectionToolbarPosition,
} from './floatingSurfaceGeometry.js';

/**
 * Bounds agregados de una o varias selecciones en coordenadas del canvas.
 */
type Bounds = { top: number; left: number; right: number; bottom: number };
/**
 * Tamaño de página usado como fallback para el viewport de posicionamiento.
 */
type PageSize = { width: number; height: number };
/**
 * Tamaño de la superficie flotante que se debe posicionar.
 */
type SurfaceSize = { width: number; height: number };

/**
 * Ancho default estimado del toolbar flotante.
 */
const TOOLBAR_WIDTH = 384;
/**
 * Alto default estimado del toolbar flotante.
 */
const TOOLBAR_HEIGHT = 224;
/**
 * Tamaño por defecto para cálculos cuando el caller no provee uno.
 */
const DEFAULT_SURFACE_SIZE: SurfaceSize = { width: TOOLBAR_WIDTH, height: TOOLBAR_HEIGHT };

/**
 * Calcula posición y tamaño de la selección activa para ubicar el toolbar.
 *
 * Aunque se expone como hook por convención de consumo React, no usa hooks
 * internos; calcula sin side effects a partir del DOM actual.
 */
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
