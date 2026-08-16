/**
 * Contrato de zoom y ajuste de viewport.
 *
 * La aritmética vivía embebida en `Designer/index.tsx`, así que la toolbar, el
 * controller y los atajos podían divergir y no era comprobable sin montar el
 * Designer entero. Aquí es pura y se prueba sola.
 *
 * Hallazgo que corrige (baseline COREUX-001, BASE-01): el ajuste aplicaba el
 * mismo suelo de zoom que el zoom manual (0.25), de modo que en 390 y 768 px la
 * página A4 no cabía y el Canvas arrancaba con scroll horizontal obligatorio.
 * «Ajustar» debe poder bajar más que «alejar a mano»: son dos intenciones
 * distintas y ahora tienen dos límites distintos.
 */

export type ViewportFitMode = 'fit-width' | 'fit-page' | 'actual-size' | 'manual' | 'auto';

/** Suelo del zoom manual: por debajo el documento deja de ser utilizable. */
const MANUAL_MIN_ZOOM = 0.25;

/**
 * Suelo del ajuste automático.
 *
 * Más bajo a propósito: si el usuario pide «ajustar a la página», el resultado
 * debe caber aunque implique una escala pequeña. Clamparlo al mínimo manual
 * produce exactamente el bug que documenta BASE-01.
 */
const FIT_MIN_ZOOM = 0.05;

/** Ancho de viewport por debajo del cual `auto` prefiere ajustar a lo ancho. */
const AUTO_FIT_WIDTH_BREAKPOINT = 980;

export type FitInput = {
  /** Tamaño de la página en unidades de template. */
  pageSize: { width: number; height: number };
  /** Espacio utilizable del canvas, en píxeles. */
  canvas: { width: number; height: number };
  /** Píxeles por unidad de template a zoom 1. */
  unitScale: number;
  /** Escala base actual (scale / zoomLevel). */
  baseScale: number;
  /** Techo de zoom del entorno. */
  maxZoom: number;
  /** Ancho del viewport, para resolver `auto`. */
  viewportWidth: number;
};

const isPositiveFinite = (value: number): boolean => Number.isFinite(value) && value > 0;

/** Resuelve `auto` al modo concreto que corresponde al viewport. */
const resolveAutoFitMode = (
  mode: ViewportFitMode,
  viewportWidth: number,
): Exclude<ViewportFitMode, 'auto'> => {
  if (mode !== 'auto') return mode;
  return viewportWidth <= AUTO_FIT_WIDTH_BREAKPOINT ? 'fit-width' : 'fit-page';
};

/** Limita el zoom al rango del modo. `manual` usa un suelo más alto que el ajuste. */
const clampZoom = (
  zoom: number,
  maxZoom: number,
  mode: 'manual' | 'fit' = 'manual',
): number => {
  const min = mode === 'fit' ? FIT_MIN_ZOOM : MANUAL_MIN_ZOOM;
  const ceiling = isPositiveFinite(maxZoom) ? maxZoom : min;
  return Math.max(min, Math.min(ceiling, zoom));
};

/**
 * Calcula el zoom que corresponde a un modo de ajuste.
 *
 * @returns `null` cuando faltan datos para decidir; el caller debe conservar el
 * zoom actual en lugar de inventar uno.
 */
export const computeFitZoom = (mode: ViewportFitMode, input: FitInput): number | null => {
  const { pageSize, canvas, unitScale, baseScale, maxZoom, viewportWidth } = input;

  if (!isPositiveFinite(pageSize?.width) || !isPositiveFinite(pageSize?.height)) return null;
  if (!isPositiveFinite(canvas?.width) || !isPositiveFinite(canvas?.height)) return null;
  if (!isPositiveFinite(unitScale) || !isPositiveFinite(baseScale)) return null;

  const resolved = resolveAutoFitMode(mode, viewportWidth);
  if (resolved === 'manual') return null;

  const pageWidthPx = Math.max(1, pageSize.width * unitScale);
  const pageHeightPx = Math.max(1, pageSize.height * unitScale);
  const widthScale = canvas.width / pageWidthPx;
  const heightScale = canvas.height / pageHeightPx;

  let targetScale: number;
  if (resolved === 'fit-width') targetScale = widthScale;
  else if (resolved === 'fit-page') targetScale = Math.min(widthScale, heightScale);
  else targetScale = 1; // actual-size

  if (!isPositiveFinite(targetScale)) return null;

  const zoom = targetScale / Math.max(0.0001, baseScale);
  // `actual-size` es una posición de zoom manual; el ajuste usa su propio suelo.
  const clamped = clampZoom(zoom, maxZoom, resolved === 'actual-size' ? 'manual' : 'fit');
  return Number.isFinite(clamped) ? clamped : null;
};

/**
 * ¿El ajuste cupo de verdad?
 *
 * Si el zoom quedó topado por los límites, la página sigue desbordando y la UI
 * debería decirlo en vez de anunciar un ajuste que no ocurrió.
 */
const fitFitsWithinCanvas = (mode: ViewportFitMode, input: FitInput): boolean => {
  const zoom = computeFitZoom(mode, input);
  if (zoom === null) return false;

  const resolved = resolveAutoFitMode(mode, input.viewportWidth);
  const scale = zoom * input.baseScale;
  const width = input.pageSize.width * input.unitScale * scale;
  const height = input.pageSize.height * input.unitScale * scale;

  const fitsWidth = width <= input.canvas.width + 0.5;
  const fitsHeight = height <= input.canvas.height + 0.5;

  if (resolved === 'fit-width') return fitsWidth;
  if (resolved === 'fit-page') return fitsWidth && fitsHeight;
  return true;
};

/**
 * Porcentaje mostrado en la UI.
 *
 * Siempre devuelve un valor válido: un indicador que dice `NaN%` o `0%` es peor
 * que uno que dice `100%`.
 */
const formatZoomPercent = (zoom: number): string => {
  const normalized = isPositiveFinite(zoom) ? zoom : 1;
  return `${Math.round(normalized * 100)}%`;
};
