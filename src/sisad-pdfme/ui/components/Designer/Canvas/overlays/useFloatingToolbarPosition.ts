/**
 * useFloatingToolbarPosition — calcula posición del toolbar contextual.
 *
 * Resuelve bounds de elementos DOM seleccionados relativos al canvas.
 *
 * Importante: este hook devuelve el rectángulo ancla de la selección en el
 * sistema de coordenadas del scroll owner del canvas; los componentes de
 * superficie flotante son quienes aplican flip/clamp con su tamaño real.
 */

/**
 * Bounds agregados de una o varias selecciones en coordenadas del canvas.
 */
type Bounds = { top: number; left: number; right: number; bottom: number };
type PageSize = { width: number; height: number };
/**
 * Calcula posición y tamaño de la selección activa para ubicar el toolbar.
 *
 * Aunque se expone como hook por convención de consumo React, no usa hooks
 * internos; calcula sin side effects a partir del DOM actual.
 */
export const useFloatingToolbarPosition = (
  activeElements: HTMLElement[],
  pageSize: PageSize,
  _surfaceSize?: { width: number; height: number },
) => {
  if (!activeElements.length) return null;

  const candidateRoot = activeElements[0]?.closest?.('.sisad-pdfme-designer-canvas');
  const canvasRoot = candidateRoot instanceof Element ? candidateRoot : globalThis.document?.querySelector('.sisad-pdfme-designer-canvas');

  if (!canvasRoot) return null;

  const canvasRect = canvasRoot.getBoundingClientRect();
  const bounds = activeElements.reduce<Bounds>(
    (acc, element) => {
      const rect = element.getBoundingClientRect();
      const scrollLeft = 'scrollLeft' in canvasRoot ? canvasRoot.scrollLeft : 0;
      const scrollTop = 'scrollTop' in canvasRoot ? canvasRoot.scrollTop : 0;
      const top = rect.top - canvasRect.top + scrollTop;
      const left = rect.left - canvasRect.left + scrollLeft;
      const right = rect.right - canvasRect.left + scrollLeft;
      const bottom = rect.bottom - canvasRect.top + scrollTop;
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
  void pageSize;

  return {
    top: bounds.top,
    left: bounds.left,
    right: bounds.right,
    bottom: bounds.bottom,
    width,
    height,
  };
};
