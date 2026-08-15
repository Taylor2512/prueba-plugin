import { ZOOM } from '@sisad-pdfme/common';

export type Point = { x: number; y: number };
export type Rect = { left: number; top: number; right: number; bottom: number; width: number; height: number };
export type Size = { width: number; height: number };
export type PagePoint = Point;
export type PdfPoint = Point;
export type DOMRectLike = Pick<Rect, 'left' | 'top' | 'right' | 'bottom' | 'width' | 'height'>;
export type PointArea = {
  pos1: number[];
  pos2: number[];
  pos3: number[];
  pos4: number[];
};

type SelectionRegionPageHit = {
  pageIndex: number;
  pageRect: Rect;
  regionRect: Rect;
  pageStartPoint: PagePoint;
  pageEndPoint: PagePoint;
  pdfStartPoint: PdfPoint;
  pdfEndPoint: PdfPoint;
};

export type SelectionRegionResult = {
  regionRect: Rect;
  pageHits: SelectionRegionPageHit[];
};

export type ResolveSelectionRegionParams = {
  startClientX: number;
  startClientY: number;
  endClientX: number;
  endClientY: number;
  pageElements: HTMLElement[];
  zoom: number;
};

const normalizeCoordinateZoom = (value: number | undefined) => {
  if (!Number.isFinite(value) || (value || 0) <= 0) return 1;
  return value as number;
};

const getZoomRatio = (zoom: number | undefined) => normalizeCoordinateZoom(zoom);

const normalizeRect = (rect: Rect): Rect => {
  const left = Math.min(rect.left, rect.right);
  const right = Math.max(rect.left, rect.right);
  const top = Math.min(rect.top, rect.bottom);
  const bottom = Math.max(rect.top, rect.bottom);
  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
  };
};

export const rectToPointArea = (rect: DOMRectLike): PointArea => ({
  pos1: [rect.left, rect.top],
  pos2: [rect.right, rect.top],
  pos3: [rect.left, rect.bottom],
  pos4: [rect.right, rect.bottom],
});

/**
 * Congela el rectángulo vivo del elemento en un `Rect` propio.
 *
 * wrapper-check: allow getPageRectInViewport — devolver el `DOMRect` sería el
 * error: es un objeto vivo que el navegador puede recalcular y que arrastra
 * `x`, `y` y `toJSON`. Copiar los seis campos ES el propósito, no un
 * envoltorio.
 */
export const getPageRectInViewport = (pageEl: HTMLElement): Rect => {
  const rect = pageEl.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
};

export const clientPointToPagePoint = (
  clientX: number,
  clientY: number,
  pageRect: DOMRectLike,
  zoom: number,
): PagePoint => {
  const scale = getZoomRatio(zoom);
  return {
    x: (clientX - pageRect.left) / scale,
    y: (clientY - pageRect.top) / scale,
  };
};

export const pagePointToSchemaPoint = (point: PagePoint): PdfPoint => ({
  x: point.x / ZOOM,
  y: point.y / ZOOM,
});

const rectIntersects = (a: DOMRectLike, b: DOMRectLike): boolean =>
  !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);

export const resolveSelectionRegion = ({
  startClientX,
  startClientY,
  endClientX,
  endClientY,
  pageElements,
  zoom,
}: ResolveSelectionRegionParams): SelectionRegionResult => {
  const regionRect = normalizeRect({
    left: startClientX,
    top: startClientY,
    right: endClientX,
    bottom: endClientY,
    width: endClientX - startClientX,
    height: endClientY - startClientY,
  });

  const pageHits = pageElements
    .map((pageElement, pageIndex) => {
      if (!pageElement) return null;
      const pageRect = getPageRectInViewport(pageElement);
      if (!rectIntersects(regionRect, pageRect)) return null;

      const pageStartPoint = clientPointToPagePoint(regionRect.left, regionRect.top, pageRect, zoom);
      const pageEndPoint = clientPointToPagePoint(regionRect.right, regionRect.bottom, pageRect, zoom);

      return {
        pageIndex,
        pageRect,
        regionRect,
        pageStartPoint,
        pageEndPoint,
        pdfStartPoint: pagePointToSchemaPoint(pageStartPoint),
        pdfEndPoint: pagePointToSchemaPoint(pageEndPoint),
      } satisfies SelectionRegionPageHit;
    })
    .filter((pageHit): pageHit is SelectionRegionPageHit => pageHit !== null);

  return { regionRect, pageHits };
};

export { normalizeRect };
