import { ZOOM } from '@sisad-pdfme/common';
import {
  clientPointToPagePoint,
  getPageRectInViewport,
  normalizeRect,
  pagePointToSchemaPoint as toSchemaPoint,
  type Point,
  type Rect,
  type Size,
} from './coordinateMath.js';

export {
  clientPointToPagePoint,
  getPageRectInViewport,
  pagePointToSchemaPoint,
  pagePointToPdfPoint,
  rectIntersects,
  resolveSelectionRegion,
} from './coordinateMath.js';

export type {
  DOMRectLike,
  PagePoint,
  PdfPoint,
  ResolveSelectionRegionParams,
  SelectionRegionPageHit,
  SelectionRegionResult,
} from './coordinateMath.js';

export type PointArea = {
  pos1: number[];
  pos2: number[];
  pos3: number[];
  pos4: number[];
};

export type DesignerCoordinateServiceOptions = {
  getZoom?: () => number;
  getCanvasRoot?: () => HTMLElement | null;
  getPageElement?: (pageIndex: number) => HTMLElement | null;
};

const normalizeZoom = (value: number | undefined) => {
  if (!Number.isFinite(value) || (value || 0) <= 0) return 1;
  return value as number;
};

const parseTransformScale = (value: string | null): number => {
  if (!value || value === 'none') return 1;

  const matrixMatch = value.match(/^matrix\(([-0-9.,\s]+)\)$/i);
  if (matrixMatch) {
    const parts = matrixMatch[1].split(',').map((part) => Number(part.trim()));
    if (Number.isFinite(parts[0]) && Number.isFinite(parts[3]) && parts[0] > 0 && parts[3] > 0) {
      return (parts[0] + parts[3]) / 2;
    }
    if (Number.isFinite(parts[0]) && parts[0] > 0) return parts[0];
  }

  const scaleMatch = value.match(/scale\(([-0-9.]+)(?:,\s*([-0-9.]+))?\)/i);
  if (scaleMatch) {
    const x = Number(scaleMatch[1]);
    const y = Number(scaleMatch[2] || scaleMatch[1]);
    if (Number.isFinite(x) && x > 0 && Number.isFinite(y) && y > 0) {
      return (x + y) / 2;
    }
    if (Number.isFinite(x) && x > 0) return x;
  }

  return 1;
};

export class DesignerCoordinateService {
  constructor(private readonly options: DesignerCoordinateServiceOptions = {}) {}

  private getZoom() {
    return normalizeZoom(this.options.getZoom?.() ?? 1);
  }

  private getCanvasRoot() {
    return this.options.getCanvasRoot?.() ?? null;
  }

  private getPageElement(pageIndex: number) {
    return this.options.getPageElement?.(pageIndex) ?? null;
  }

  private getPaperScale() {
    const root = this.getCanvasRoot();
    if (!root || typeof window === 'undefined') return 1;
    return parseTransformScale(window.getComputedStyle(root).transform);
  }

  elementRectToCanvasRect(element: HTMLElement): PointArea {
    const canvasRoot = this.getCanvasRoot();
    const rect = getPageRectInViewport(element);
    if (!canvasRoot) {
      return {
        pos1: [rect.left, rect.top],
        pos2: [rect.right, rect.top],
        pos3: [rect.left, rect.bottom],
        pos4: [rect.right, rect.bottom],
      };
    }
    const canvasRect = getPageRectInViewport(canvasRoot);
    const scale = this.getPaperScale();
    const left = (rect.left - canvasRect.left) / scale;
    const top = (rect.top - canvasRect.top) / scale;
    const right = (rect.right - canvasRect.left) / scale;
    const bottom = (rect.bottom - canvasRect.top) / scale;
    return {
      pos1: [left, top],
      pos2: [right, top],
      pos3: [left, bottom],
      pos4: [right, bottom],
    };
  }

  viewportToCanvasPoint(point: Point): Point {
    const root = this.getCanvasRoot();
    if (!root) return point;
    const rect = getPageRectInViewport(root);
    const scale = this.getPaperScale();
    return {
      x: (point.x - rect.left) / scale,
      y: (point.y - rect.top) / scale,
    };
  }

  viewportToPagePoint(point: Point, pageElement: HTMLElement): Point {
    return clientPointToPagePoint(point.x, point.y, getPageRectInViewport(pageElement), this.getZoom());
  }

  pagePointToSchemaPoint(point: Point, _pageIndex: number): Point {
    return toSchemaPoint(point);
  }

  schemaPointToViewport(point: Point, pageIndex: number): Point {
    const pageElement = this.getPageElement(pageIndex);
    if (!pageElement) return point;
    const pageRect = getPageRectInViewport(pageElement);
    const scale = this.getPaperScale();
    return {
      x: pageRect.left + point.x * ZOOM * scale,
      y: pageRect.top + point.y * ZOOM * scale,
    };
  }

  regionViewportRectToPageRect(rect: Rect, pageElement: HTMLElement): Rect {
    const normalized = normalizeRect(rect);
    const pageRect = getPageRectInViewport(pageElement);
    const leftTop = clientPointToPagePoint(normalized.left, normalized.top, pageRect, this.getZoom());
    const rightBottom = clientPointToPagePoint(normalized.right, normalized.bottom, pageRect, this.getZoom());
    const left = leftTop.x;
    const top = leftTop.y;
    const right = rightBottom.x;
    const bottom = rightBottom.y;
    return normalizeRect({ left, top, right, bottom, width: right - left, height: bottom - top });
  }

  normalizeRect(rect: Rect): Rect {
    return normalizeRect(rect);
  }

  clampRectToPage(rect: Rect, pageSize: Size): Rect {
    const normalized = normalizeRect(rect);
    const width = Math.min(Math.max(normalized.width, 0), pageSize.width);
    const height = Math.min(Math.max(normalized.height, 0), pageSize.height);
    const left = Math.min(Math.max(0, normalized.left), Math.max(0, pageSize.width - width));
    const top = Math.min(Math.max(0, normalized.top), Math.max(0, pageSize.height - height));
    return {
      left,
      top,
      right: left + width,
      bottom: top + height,
      width,
      height,
    };
  }
}
