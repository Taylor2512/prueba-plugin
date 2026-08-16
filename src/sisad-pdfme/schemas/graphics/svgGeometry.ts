/**
 * Geometría SVG → PDF para el renderer de `schemas/graphics/svg`.
 *
 * Rol arquitectónico:
 * - Traduce el sistema de coordenadas SVG (origen arriba-izquierda, `y` hacia
 *   abajo) al de PDF (origen abajo-izquierda, `y` hacia arriba).
 * - Convierte las formas básicas de SVG a datos de path, que es lo único que
 *   `PDFPage.drawSvgPath` sabe dibujar.
 *
 * Límites del módulo:
 * - No conoce pdf-lib ni el modelo de schemas: sólo números y strings.
 * - No decide política de errores; devuelve `null` y quien orquesta decide.
 */

/** Matriz afín 2D `[a, b, c, d, e, f]`: `x' = a·x + c·y + e`, `y' = b·x + d·y + f`. */
export type SvgMatrix = readonly [number, number, number, number, number, number];

/** Rectángulo de destino en espacio PDF, con `y` en el borde inferior. */
export type SvgRenderTarget = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Región de usuario declarada por `viewBox` (o derivada de `width`/`height`). */
export type SvgViewBox = {
  minX: number;
  minY: number;
  width: number;
  height: number;
};

export const IDENTITY_MATRIX: SvgMatrix = [1, 0, 0, 1, 0, 0];

/** Composición `outer ∘ inner`: aplica `inner` primero. */
export const multiplySvgMatrix = (outer: SvgMatrix, inner: SvgMatrix): SvgMatrix => [
  outer[0] * inner[0] + outer[2] * inner[1],
  outer[1] * inner[0] + outer[3] * inner[1],
  outer[0] * inner[2] + outer[2] * inner[3],
  outer[1] * inner[2] + outer[3] * inner[3],
  outer[0] * inner[4] + outer[2] * inner[5] + outer[4],
  outer[1] * inner[4] + outer[3] * inner[5] + outer[5],
];

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Separa una lista de números SVG: admite comas, espacios y signos pegados. */
const parseSvgNumberList = (raw: string): number[] => {
  const matches = raw.match(/[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g);
  if (!matches) return [];
  return matches.map(Number).filter((value) => Number.isFinite(value));
};

const rotateMatrix = (args: number[]): SvgMatrix | null => {
  const [angle, cx, cy] = args;
  if (!Number.isFinite(angle)) return null;
  const radians = toRadians(angle);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const rotation: SvgMatrix = [cos, sin, -sin, cos, 0, 0];
  if (args.length === 1) return rotation;
  if (args.length !== 3) return null;
  // rotate(a cx cy) === translate(cx cy) rotate(a) translate(-cx -cy)
  return multiplySvgMatrix(
    multiplySvgMatrix([1, 0, 0, 1, cx, cy], rotation),
    [1, 0, 0, 1, -cx, -cy],
  );
};

const transformFunctionToMatrix = (name: string, args: number[]): SvgMatrix | null => {
  switch (name) {
    case 'matrix':
      return args.length === 6 ? ([...args] as unknown as SvgMatrix) : null;
    case 'translate':
      if (args.length === 1) return [1, 0, 0, 1, args[0], 0];
      return args.length === 2 ? [1, 0, 0, 1, args[0], args[1]] : null;
    case 'scale':
      if (args.length === 1) return [args[0], 0, 0, args[0], 0, 0];
      return args.length === 2 ? [args[0], 0, 0, args[1], 0, 0] : null;
    case 'rotate':
      return rotateMatrix(args);
    case 'skewX':
      return args.length === 1 ? [1, 0, Math.tan(toRadians(args[0])), 1, 0, 0] : null;
    case 'skewY':
      return args.length === 1 ? [1, Math.tan(toRadians(args[0])), 0, 1, 0, 0] : null;
    default:
      return null;
  }
};

/**
 * Traduce el atributo `transform` a una matriz única.
 *
 * Devuelve `null` ante una función desconocida o una aridad inválida: el
 * llamador debe fallar en vez de dibujar la forma en el sitio equivocado.
 */
export const parseSvgTransform = (raw: string | undefined | null): SvgMatrix | null => {
  if (!raw || !raw.trim()) return IDENTITY_MATRIX;
  const pattern = /([a-zA-Z]+)\s*\(([^)]*)\)/g;
  let result: SvgMatrix = IDENTITY_MATRIX;
  let consumed = 0;
  let match = pattern.exec(raw);
  while (match) {
    const step = transformFunctionToMatrix(match[1], parseSvgNumberList(match[2]));
    if (!step) return null;
    result = multiplySvgMatrix(result, step);
    consumed += match[0].length;
    match = pattern.exec(raw);
  }
  // Si sobra texto que no son separadores, el transform no se entendió entero.
  const leftovers = raw.replace(/([a-zA-Z]+)\s*\(([^)]*)\)/g, '').trim();
  if (consumed === 0 || leftovers.replace(/[\s,]/g, '').length > 0) return null;
  return result;
};

/** Lee `viewBox`; devuelve `null` si falta, está mal formado o es degenerado. */
export const parseSvgViewBox = (raw: string | undefined | null): SvgViewBox | null => {
  if (!raw) return null;
  const values = parseSvgNumberList(raw);
  if (values.length !== 4) return null;
  const [minX, minY, width, height] = values;
  if (!(width > 0) || !(height > 0)) return null;
  return { minX, minY, width, height };
};

/** Longitudes `width`/`height` del elemento raíz, en unidades de usuario. */
export const parseSvgLength = (raw: string | undefined | null): number | null => {
  if (!raw) return null;
  const trimmed = raw.trim();
  // Sólo unidades absolutas equivalentes al px de usuario; `%` depende del
  // contenedor y no tiene significado dentro de una caja de PDF.
  if (!/^[+-]?(?:\d*\.\d+|\d+\.?)(?:px)?$/.test(trimmed)) return null;
  const value = Number.parseFloat(trimmed);
  return Number.isFinite(value) ? value : null;
};

/** Alineaciones de `preserveAspectRatio` reconocidas por el renderer. */
export type SvgAspectRatio = 'meet' | 'none';

/**
 * Matriz que lleva el espacio de usuario del SVG al espacio PDF del destino.
 *
 * El resultado ya incluye la inversión del eje `y`, de modo que un punto
 * `(minX, minY)` cae en la esquina superior izquierda del rectángulo.
 */
export const buildSvgViewportMatrix = (
  viewBox: SvgViewBox,
  target: SvgRenderTarget,
  aspectRatio: SvgAspectRatio = 'meet',
): SvgMatrix => {
  const rawScaleX = target.width / viewBox.width;
  const rawScaleY = target.height / viewBox.height;
  const scaleX = aspectRatio === 'none' ? rawScaleX : Math.min(rawScaleX, rawScaleY);
  const scaleY = aspectRatio === 'none' ? rawScaleY : scaleX;

  const renderedWidth = viewBox.width * scaleX;
  const renderedHeight = viewBox.height * scaleY;
  const left = target.x + (target.width - renderedWidth) / 2;
  const top = target.y + target.height - (target.height - renderedHeight) / 2;

  return [scaleX, 0, 0, -scaleY, left - scaleX * viewBox.minX, top + scaleY * viewBox.minY];
};

/**
 * Adapta una matriz SVG→PDF al contrato de `PDFPage.drawSvgPath`.
 *
 * `drawSvgPath` concatena siempre `scale(1, -1)` porque asume que recibe
 * coordenadas SVG crudas. Al pre-multiplicar por esa misma inversión, la
 * composición final vuelve a ser exactamente la matriz pedida.
 */
export const toDrawSvgPathMatrix = (matrix: SvgMatrix): SvgMatrix => [
  matrix[0],
  matrix[1],
  -matrix[2],
  -matrix[3],
  matrix[4],
  matrix[5],
];

/**
 * Rotación en espacio PDF alrededor de un pivote.
 *
 * `convertForPdfLayoutProps` ya coloca la caja como pdf-lib espera (pivote en
 * la esquina inferior izquierda), así que el renderer sólo tiene que aplicar
 * el mismo giro que `drawImage`/`drawRectangle` reciben vía `rotate`.
 */
export const buildPivotRotationMatrix = (
  radians: number,
  pivotX: number,
  pivotY: number,
): SvgMatrix => {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [cos, sin, -sin, cos, pivotX - cos * pivotX + sin * pivotY, pivotY - sin * pivotX - cos * pivotY];
};

const KAPPA = 0.5522847498307936;

const ellipseToPathData = (cx: number, cy: number, rx: number, ry: number): string | null => {
  if (!(rx > 0) || !(ry > 0)) return null;
  const ox = rx * KAPPA;
  const oy = ry * KAPPA;
  return [
    `M ${cx - rx} ${cy}`,
    `C ${cx - rx} ${cy - oy} ${cx - ox} ${cy - ry} ${cx} ${cy - ry}`,
    `C ${cx + ox} ${cy - ry} ${cx + rx} ${cy - oy} ${cx + rx} ${cy}`,
    `C ${cx + rx} ${cy + oy} ${cx + ox} ${cy + ry} ${cx} ${cy + ry}`,
    `C ${cx - ox} ${cy + ry} ${cx - rx} ${cy + oy} ${cx - rx} ${cy}`,
    'Z',
  ].join(' ');
};

const rectToPathData = (attributes: Record<string, string>): string | null => {
  const x = Number(attributes.x ?? 0);
  const y = Number(attributes.y ?? 0);
  const width = Number(attributes.width);
  const height = Number(attributes.height);
  if (![x, y, width, height].every(Number.isFinite)) return null;
  if (!(width > 0) || !(height > 0)) return null;

  const declaredRx = attributes.rx === undefined ? null : Number(attributes.rx);
  const declaredRy = attributes.ry === undefined ? null : Number(attributes.ry);
  const rx = Math.min(Math.max(declaredRx ?? declaredRy ?? 0, 0), width / 2);
  const ry = Math.min(Math.max(declaredRy ?? declaredRx ?? 0, 0), height / 2);
  if (!Number.isFinite(rx) || !Number.isFinite(ry)) return null;

  if (rx === 0 || ry === 0) {
    return `M ${x} ${y} H ${x + width} V ${y + height} H ${x} Z`;
  }
  return [
    `M ${x + rx} ${y}`,
    `H ${x + width - rx}`,
    `A ${rx} ${ry} 0 0 1 ${x + width} ${y + ry}`,
    `V ${y + height - ry}`,
    `A ${rx} ${ry} 0 0 1 ${x + width - rx} ${y + height}`,
    `H ${x + rx}`,
    `A ${rx} ${ry} 0 0 1 ${x} ${y + height - ry}`,
    `V ${y + ry}`,
    `A ${rx} ${ry} 0 0 1 ${x + rx} ${y}`,
    'Z',
  ].join(' ');
};

const pointsToPathData = (raw: string | undefined, close: boolean): string | null => {
  const values = parseSvgNumberList(raw ?? '');
  if (values.length < 4 || values.length % 2 !== 0) return null;
  const segments = [`M ${values[0]} ${values[1]}`];
  for (let index = 2; index < values.length; index += 2) {
    segments.push(`L ${values[index]} ${values[index + 1]}`);
  }
  if (close) segments.push('Z');
  return segments.join(' ');
};

/** Formas SVG que el renderer sabe convertir a datos de path. */
export const SVG_SHAPE_TAGS = [
  'path',
  'rect',
  'line',
  'polyline',
  'polygon',
  'circle',
  'ellipse',
] as const;

export type SvgShapeTag = (typeof SVG_SHAPE_TAGS)[number];

/**
 * Convierte una forma SVG a datos de path equivalentes.
 *
 * Devuelve `null` cuando los atributos son inválidos y `''` cuando la forma es
 * geométricamente vacía (por ejemplo un `rect` de ancho cero), que sí es un
 * resultado legítimo y no un error.
 */
export const svgShapeToPathData = (
  tag: SvgShapeTag,
  attributes: Record<string, string>,
): string | null => {
  switch (tag) {
    case 'path': {
      const data = attributes.d?.trim();
      return data ? data : '';
    }
    case 'rect':
      return rectToPathData(attributes) ?? (Number(attributes.width) === 0 || Number(attributes.height) === 0 ? '' : null);
    case 'line': {
      const values = [attributes.x1, attributes.y1, attributes.x2, attributes.y2].map((value) =>
        Number(value ?? 0),
      );
      if (!values.every(Number.isFinite)) return null;
      return `M ${values[0]} ${values[1]} L ${values[2]} ${values[3]}`;
    }
    case 'polyline':
      return pointsToPathData(attributes.points, false);
    case 'polygon':
      return pointsToPathData(attributes.points, true);
    case 'circle': {
      const cx = Number(attributes.cx ?? 0);
      const cy = Number(attributes.cy ?? 0);
      const r = Number(attributes.r);
      if (![cx, cy, r].every(Number.isFinite)) return null;
      if (r === 0) return '';
      return ellipseToPathData(cx, cy, r, r);
    }
    case 'ellipse': {
      const cx = Number(attributes.cx ?? 0);
      const cy = Number(attributes.cy ?? 0);
      const rx = Number(attributes.rx);
      const ry = Number(attributes.ry);
      if (![cx, cy, rx, ry].every(Number.isFinite)) return null;
      if (rx === 0 || ry === 0) return '';
      return ellipseToPathData(cx, cy, rx, ry);
    }
    default:
      return null;
  }
};
