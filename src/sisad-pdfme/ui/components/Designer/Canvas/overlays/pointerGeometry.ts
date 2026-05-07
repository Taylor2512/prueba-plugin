import { px2mm } from '@sisad-pdfme/common';
import { getPageRectInViewport } from '../../shared/coordinateMath.js';

export type PointLike = {
  x: number;
  y: number;
};

export type RectLike = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export type PointerToPaperInput = {
  clientX: number;
  clientY: number;
  canvasElement: HTMLElement;
  paperElement: HTMLElement;
  zoom: number;
  rulerOffset?: {
    x: number;
    y: number;
  };
  scroll?: {
    left: number;
    top: number;
  };
};

export type PointerToPaperResult = {
  xPx: number;
  yPx: number;
  xMm: number;
  yMm: number;
  insidePage: boolean;
  pageIndex: number;
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const normalizeZoom = (zoom: number) => (Number.isFinite(zoom) && zoom > 0 ? zoom : 1);

const toMm = (px: number, zoom: number) => px2mm(px / normalizeZoom(zoom));

export const resolveClientPointToCanvasPoint = (
  input: PointerToPaperInput,
): PointerToPaperResult => {
  const paperRect = getPageRectInViewport(input.paperElement);
  const canvasRect = input.canvasElement.getBoundingClientRect();
  const rulerOffsetX = input.rulerOffset?.x || 0;
  const rulerOffsetY = input.rulerOffset?.y || 0;
  const scrollLeft = input.scroll?.left || 0;
  const scrollTop = input.scroll?.top || 0;

  const xPx = input.clientX - paperRect.left + scrollLeft - rulerOffsetX;
  const yPx = input.clientY - paperRect.top + scrollTop - rulerOffsetY;
  const insideCanvas =
    input.clientX >= canvasRect.left &&
    input.clientX <= canvasRect.right &&
    input.clientY >= canvasRect.top &&
    input.clientY <= canvasRect.bottom;
  const insidePage =
    insideCanvas &&
    input.clientX >= paperRect.left &&
    input.clientX <= paperRect.right &&
    input.clientY >= paperRect.top &&
    input.clientY <= paperRect.bottom;

  return {
    xPx,
    yPx,
    xMm: toMm(xPx, input.zoom),
    yMm: toMm(yPx, input.zoom),
    insidePage,
    pageIndex: insidePage ? 0 : -1,
  };
};

export const resolveClientPointToPagePoint = (
  input: PointerToPaperInput,
): PointerToPaperResult => resolveClientPointToCanvasPoint(input);

export const clampPointToPageBounds = (
  point: PointLike,
  pageSize: { width: number; height: number },
  schemaSize: { width: number; height: number },
) => {
  const safeWidth = Math.max(0, Number(schemaSize.width) || 0);
  const safeHeight = Math.max(0, Number(schemaSize.height) || 0);
  const maxX = Math.max(0, (Number(pageSize.width) || 0) - safeWidth);
  const maxY = Math.max(0, (Number(pageSize.height) || 0) - safeHeight);
  return {
    x: Math.min(Math.max(0, point.x), maxX),
    y: Math.min(Math.max(0, point.y), maxY),
  };
};

export const resolveDropPageIndex = (
  point: PointLike,
  paperElements: Array<HTMLElement | null | undefined>,
): number => {
  for (let index = 0; index < paperElements.length; index += 1) {
    const paper = paperElements[index];
    if (!paper) continue;
    const rect = paper.getBoundingClientRect();
    if (point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom) {
      return index;
    }
  }

  return -1;
};

export const extractClientPoint = (event: Event | null | undefined): PointLike | null => {
  if (!event) return null;
  if ('clientX' in event && isFiniteNumber(event.clientX) && 'clientY' in event && isFiniteNumber(event.clientY)) {
    return { x: event.clientX, y: event.clientY };
  }

  if ('touches' in event && Array.isArray(event.touches) && event.touches[0]) {
    const touch = event.touches[0];
    if (isFiniteNumber(touch.clientX) && isFiniteNumber(touch.clientY)) {
      return { x: touch.clientX, y: touch.clientY };
    }
  }

  return null;
};
