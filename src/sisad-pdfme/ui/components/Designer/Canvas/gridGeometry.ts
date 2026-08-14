/**
 * gridGeometry — geometría canónica de la rejilla, en espacio de página (mm).
 *
 * ## Por qué existe
 *
 * La rejilla era **sólo CSS**: un `background-image` de paso fijo `24px`
 * pintado sobre el contenedor del canvas. Eso implicaba tres cosas:
 *
 * 1. no estaba en espacio de página, así que su paso no significaba ninguna
 *    medida real del documento;
 * 2. no reaccionaba al zoom ni al origen de página, de modo que en multipágina
 *    las líneas no coincidían con el borde del papel;
 * 3. no existía snap-to-grid en absoluto: la rejilla era decorativa.
 *
 * `snapEngine` (object snap) ya trabajaba en mm y era correcto; la rejilla no
 * compartía nada con él.
 *
 * ## Contrato
 *
 * La geometría se define en **milímetros de página**. El renderer y el motor
 * de snap consumen la MISMA geometría: `gridRenderMetrics` no es una fuente
 * paralela, es una proyección de `GridGeometry` a píxeles CSS para un zoom
 * dado. Por construcción, un punto ajustado con `snapPointToGrid` cae sobre
 * una línea de `gridRenderMetrics` a cualquier zoom.
 *
 * Las coordenadas lógicas NUNCA dependen del zoom. El zoom sólo entra al
 * proyectar a píxeles.
 */
import { ZOOM } from '@sisad-pdfme/common';

/** Paso mayor por defecto, en mm. 10 mm = 1 cm es la retícula usual de maqueta. */
export const DEFAULT_GRID_STEP_MM = 10;

/** Subdivisiones por paso mayor. 2 → línea menor cada 5 mm. */
export const DEFAULT_GRID_SUBDIVISIONS = 2;

/** Umbral de captura por defecto, en mm. */
export const DEFAULT_GRID_SNAP_THRESHOLD_MM = 1;

export type PageSizeMm = { width: number; height: number };
export type PointMm = { x: number; y: number };
export type RectMm = { x: number; y: number; width: number; height: number };

export type GridGeometry = {
  /** Paso mayor en mm. Siempre > 0. */
  stepMm: number;
  /** Número de subdivisiones dentro de un paso mayor. Siempre >= 1. */
  subdivisions: number;
  /** Paso menor derivado, en mm. */
  minorStepMm: number;
  /**
   * Origen de la rejilla en espacio de página. Normalmente el borde del papel
   * (0,0); con padding de documento puede desplazarse.
   */
  originMm: PointMm;
  /** Tamaño de la página a la que pertenece esta geometría. */
  pageMm: PageSizeMm;
};

export type CreateGridGeometryInput = {
  pageMm: PageSizeMm;
  stepMm?: number;
  subdivisions?: number;
  originMm?: PointMm;
};

const toPositive = (value: number | undefined, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;

const toPositiveInteger = (value: number | undefined, fallback: number) => {
  const numeric = toPositive(value, fallback);
  return Math.max(1, Math.round(numeric));
};

const roundMm = (value: number) => Math.round(value * 1000) / 1000;

export const createGridGeometry = ({
  pageMm,
  stepMm,
  subdivisions,
  originMm,
}: CreateGridGeometryInput): GridGeometry => {
  const resolvedStep = toPositive(stepMm, DEFAULT_GRID_STEP_MM);
  const resolvedSubdivisions = toPositiveInteger(subdivisions, DEFAULT_GRID_SUBDIVISIONS);
  return {
    stepMm: resolvedStep,
    subdivisions: resolvedSubdivisions,
    minorStepMm: resolvedStep / resolvedSubdivisions,
    originMm: {
      x: Number.isFinite(originMm?.x) ? (originMm as PointMm).x : 0,
      y: Number.isFinite(originMm?.y) ? (originMm as PointMm).y : 0,
    },
    pageMm: {
      width: toPositive(pageMm?.width, 0) || 0,
      height: toPositive(pageMm?.height, 0) || 0,
    },
  };
};

/**
 * Líneas de la rejilla sobre un eje, en mm de página.
 *
 * Se enumeran desde el origen hacia ambos lados y se recortan al papel: una
 * línea fuera de página no es una línea, y devolverla haría que reglas y
 * renderer discreparan en los bordes.
 */
export const gridLinesMm = (
  geometry: GridGeometry,
  axis: 'x' | 'y',
  kind: 'minor' | 'major' = 'minor',
): number[] => {
  const step = kind === 'major' ? geometry.stepMm : geometry.minorStepMm;
  const origin = axis === 'x' ? geometry.originMm.x : geometry.originMm.y;
  const extent = axis === 'x' ? geometry.pageMm.width : geometry.pageMm.height;
  if (!(step > 0) || !(extent > 0)) return [];

  const firstIndex = Math.ceil((0 - origin) / step);
  const lastIndex = Math.floor((extent - origin) / step);
  const lines: number[] = [];
  for (let index = firstIndex; index <= lastIndex; index += 1) {
    lines.push(roundMm(origin + index * step));
  }
  return lines;
};

export type GridSnapOptions = {
  /** Umbral de captura en mm. Fuera de él, la coordenada no se toca. */
  thresholdMm?: number;
  /** Ajustar al paso mayor en vez de al menor. */
  useMajorStep?: boolean;
};

export type AxisSnapResult = {
  value: number;
  snapped: boolean;
  /** Línea de rejilla a la que se ajustó, en mm. `null` si no hubo captura. */
  lineMm: number | null;
};

const snapAxis = (
  value: number,
  origin: number,
  step: number,
  thresholdMm: number,
): AxisSnapResult => {
  if (!(step > 0)) return { value, snapped: false, lineMm: null };
  const nearest = origin + Math.round((value - origin) / step) * step;
  if (Math.abs(nearest - value) > thresholdMm) {
    return { value: roundMm(value), snapped: false, lineMm: null };
  }
  const line = roundMm(nearest);
  return { value: line, snapped: true, lineMm: line };
};

export type GridSnapResult = {
  point: PointMm;
  x: AxisSnapResult;
  y: AxisSnapResult;
  /** `true` si al menos un eje fue capturado. */
  snapped: boolean;
};

/** Ajusta un punto a la rejilla. Trabaja y devuelve mm de página. */
export const snapPointToGrid = (
  geometry: GridGeometry,
  point: PointMm,
  options: GridSnapOptions = {},
): GridSnapResult => {
  const step = options.useMajorStep ? geometry.stepMm : geometry.minorStepMm;
  const thresholdMm = toPositive(options.thresholdMm, DEFAULT_GRID_SNAP_THRESHOLD_MM);
  const x = snapAxis(point.x, geometry.originMm.x, step, thresholdMm);
  const y = snapAxis(point.y, geometry.originMm.y, step, thresholdMm);
  return { point: { x: x.value, y: y.value }, x, y, snapped: x.snapped || y.snapped };
};

/**
 * Ajusta un rectángulo por su origen.
 *
 * Se ajusta la esquina superior-izquierda y se conserva el tamaño: mover un
 * elemento no debe redimensionarlo. El ajuste por otros bordes es
 * responsabilidad del object snap (`snapEngine`), que es una capability
 * distinta.
 */
export const snapRectToGrid = (
  geometry: GridGeometry,
  rect: RectMm,
  options: GridSnapOptions = {},
): { rect: RectMm } & GridSnapResult => {
  const result = snapPointToGrid(geometry, { x: rect.x, y: rect.y }, options);
  return {
    ...result,
    rect: { x: result.point.x, y: result.point.y, width: rect.width, height: rect.height },
  };
};

/** Convierte mm de página a píxeles CSS para un zoom dado. `zoom` 1 = 100 %. */
export const mmToCanvasPx = (mm: number, zoom = 1): number => mm * ZOOM * zoom;

/** Convierte píxeles CSS a mm de página para un zoom dado. */
export const canvasPxToMm = (px: number, zoom = 1): number => px / (ZOOM * zoom);

export type GridRenderMetrics = {
  /** Paso menor proyectado a píxeles CSS. */
  minorStepPx: number;
  /** Paso mayor proyectado a píxeles CSS. */
  majorStepPx: number;
  /** Desplazamiento del patrón respecto al borde del papel, en píxeles CSS. */
  offsetXPx: number;
  offsetYPx: number;
  /** Tamaño del papel en píxeles CSS a este zoom. */
  pagePx: { width: number; height: number };
  /** Zoom aplicado. */
  zoom: number;
};

/**
 * Proyección de la geometría a píxeles CSS.
 *
 * No es una segunda fuente: todo sale de `geometry`. El renderer debe pintar
 * con estas métricas y nunca con un paso constante.
 */
export const gridRenderMetrics = (geometry: GridGeometry, zoom = 1): GridRenderMetrics => {
  const safeZoom = toPositive(zoom, 1);
  return {
    minorStepPx: mmToCanvasPx(geometry.minorStepMm, safeZoom),
    majorStepPx: mmToCanvasPx(geometry.stepMm, safeZoom),
    offsetXPx: mmToCanvasPx(geometry.originMm.x, safeZoom),
    offsetYPx: mmToCanvasPx(geometry.originMm.y, safeZoom),
    pagePx: {
      width: mmToCanvasPx(geometry.pageMm.width, safeZoom),
      height: mmToCanvasPx(geometry.pageMm.height, safeZoom),
    },
    zoom: safeZoom,
  };
};

/**
 * Variables CSS que consume el renderer de rejilla.
 *
 * Se exponen como custom properties para que la hoja de estilos no tenga que
 * conocer la geometría, sólo pintarla.
 */
export const gridCssVariables = (
  geometry: GridGeometry,
  zoom = 1,
): Record<string, string> => {
  const metrics = gridRenderMetrics(geometry, zoom);
  return {
    '--sisad-grid-step': `${metrics.minorStepPx}px`,
    '--sisad-grid-major-step': `${metrics.majorStepPx}px`,
    '--sisad-grid-offset-x': `${metrics.offsetXPx}px`,
    '--sisad-grid-offset-y': `${metrics.offsetYPx}px`,
  };
};
