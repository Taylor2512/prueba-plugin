/**
 * pointerGeometry — conversión de coordenadas de puntero a coordenadas de PDF.
 *
 * Centraliza utilidades para drops, placeholders y posicionamiento de schemas:
 * client point → canvas/page point, conversión px/mm y clamp dentro de página.
 */

import { px2mm } from '@sisad-pdfme/common';
import { getPageRectInViewport } from '../../shared/coordinateMath.js';

/**
 * Punto bidimensional genérico en píxeles o milímetros según contexto.
 */
export type PointLike = {
  x: number;
  y: number;
};

/**
 * Rectángulo genérico compatible con DOMRect-like values.
 */
export type RectLike = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

/**
 * Entrada necesaria para convertir coordenadas clientX/clientY a página PDF.
 */
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

/**
 * Resultado normalizado de coordenadas de puntero sobre una página.
 */
export type PointerToPaperResult = {
  xPx: number;
  yPx: number;
  xMm: number;
  yMm: number;
  insidePage: boolean;
  pageIndex: number;
};

/**
 * Type guard para números finitos.
 */
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

/**
 * Normaliza zoom inválido a 1 para evitar divisiones inestables.
 */
const normalizeZoom = (zoom: number) => (Number.isFinite(zoom) && zoom > 0 ? zoom : 1);

/**
 * Convierte píxeles de pantalla a milímetros del documento considerando zoom.
 */
const toMm = (px: number, zoom: number) => px2mm(px / normalizeZoom(zoom));

/**
 * Convierte un punto de viewport/client a coordenadas relativas al paper.
 *
 * Devuelve px, mm y flags de pertenencia al canvas/página para drops externos.
 */
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

/**
 * Alias semántico de `resolveClientPointToCanvasPoint` para flujos por página.
 */
export const resolveClientPointToPagePoint = (
  input: PointerToPaperInput,
): PointerToPaperResult => resolveClientPointToCanvasPoint(input);

/**
 * Ajusta un punto para que un schema completo quede dentro de los límites de página.
 */
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

/**
 * Resuelve qué página contiene un punto client de drop.
 *
 * Retorna -1 cuando el punto no pertenece a ningún paper.
 */
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

/**
 * Extrae coordenadas clientX/clientY desde eventos mouse/pointer/touch.
 */
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
