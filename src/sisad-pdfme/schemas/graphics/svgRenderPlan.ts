/**
 * Plan de dibujo de un documento SVG dentro de una caja de PDF.
 *
 * Rol arquitectónico:
 * - Convierte el markup SVG en una lista explícita de trazos con su matriz,
 *   sus colores y su opacidad ya resueltos por herencia.
 * - Es la única autoridad sobre qué subconjunto de SVG soporta el runtime.
 *
 * Contrato clave:
 * - Falla en voz alta. Un documento que el renderer no sabe dibujar produce
 *   `SvgRenderError`, nunca una página en blanco.
 *
 * Límites del módulo:
 * - No conoce pdf-lib: devuelve datos, no operadores.
 * - No conoce el modelo de schemas ni el generador.
 */

import {
  IDENTITY_MATRIX,
  SVG_SHAPE_TAGS,
  buildSvgViewportMatrix,
  multiplySvgMatrix,
  parseSvgLength,
  parseSvgTransform,
  parseSvgViewBox,
  svgShapeToPathData,
  toDrawSvgPathMatrix,
  type SvgAspectRatio,
  type SvgMatrix,
  type SvgRenderTarget,
  type SvgShapeTag,
} from '@sisad-pdfme/schemas/graphics/svgGeometry';

/** Error de renderizado SVG. Se propaga: un SVG no dibujable invalida el PDF. */
export class SvgRenderError extends Error {
  constructor(message: string) {
    super(`[@sisad-pdfme/schemas] SVG render failed: ${message}`);
    this.name = 'SvgRenderError';
  }
}

/** Un trazo listo para `PDFPage.drawSvgPath`, con la matriz ya adaptada. */
export type SvgPathDraw = {
  pathData: string;
  matrix: SvgMatrix;
  fill: string | null;
  stroke: string | null;
  strokeWidth: number;
  fillOpacity: number;
  strokeOpacity: number;
};

type SvgNode = {
  tag: string;
  attributes: Record<string, string>;
  children: SvgNode[];
};

/** Elementos sin geometría que pueden ignorarse sin alterar el resultado. */
const IGNORED_TAGS = new Set(['title', 'desc', 'metadata']);

const SHAPE_TAGS = new Set<string>(SVG_SHAPE_TAGS);

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
};

const decodeEntities = (value: string): string =>
  value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
      return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    }
    if (entity.startsWith('#')) return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
    return ENTITIES[entity] ?? match;
  });

const ATTRIBUTE_PATTERN = /([A-Za-z_:][\w.:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

const parseAttributes = (raw: string): Record<string, string> => {
  const attributes: Record<string, string> = {};
  ATTRIBUTE_PATTERN.lastIndex = 0;
  let match = ATTRIBUTE_PATTERN.exec(raw);
  while (match) {
    attributes[match[1]] = decodeEntities(match[2] ?? match[3] ?? '');
    match = ATTRIBUTE_PATTERN.exec(raw);
  }
  return attributes;
};

const stripProlog = (markup: string): string =>
  markup
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\?[\s\S]*?\?>/g, '')
    .replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '')
    .replace(/<!DOCTYPE[^>[]*(?:\[[\s\S]*?\])?\s*>/gi, '');

const TAG_PATTERN = /<(\/?)([A-Za-z_][\w.:-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/g;

/** Nombre local del elemento: `svg:path` y `path` son el mismo elemento. */
const localName = (tag: string): string => {
  const separator = tag.indexOf(':');
  return (separator >= 0 ? tag.slice(separator + 1) : tag).toLowerCase();
};

/**
 * Parser XML mínimo, suficiente para el subconjunto SVG soportado.
 *
 * Se implementa aquí en vez de depender de `DOMParser` porque el generador de
 * PDF también corre fuera del navegador: una única ruta de parseo mantiene el
 * resultado idéntico en ambos entornos.
 */
const parseSvgMarkup = (markup: string): SvgNode => {
  const source = stripProlog(markup);
  const stack: SvgNode[] = [];
  let root: SvgNode | null = null;

  TAG_PATTERN.lastIndex = 0;
  let match = TAG_PATTERN.exec(source);
  while (match) {
    const [, closing, rawTag, rawAttributes, selfClosing] = match;
    const tag = localName(rawTag);

    if (closing) {
      const open = stack.pop();
      if (!open || open.tag !== tag) throw new SvgRenderError(`unbalanced </${tag}>`);
    } else {
      const node: SvgNode = { tag, attributes: parseAttributes(rawAttributes), children: [] };
      const parent = stack[stack.length - 1];
      if (parent) parent.children.push(node);
      else if (root) throw new SvgRenderError('multiple root elements');
      else root = node;
      if (!selfClosing) stack.push(node);
    }

    match = TAG_PATTERN.exec(source);
  }

  if (stack.length > 0) throw new SvgRenderError(`unclosed <${stack[stack.length - 1].tag}>`);
  if (!root) throw new SvgRenderError('no elements found');
  if (root.tag !== 'svg') throw new SvgRenderError(`root element is <${root.tag}>, expected <svg>`);
  return root;
};

/** Colores con nombre aceptados. Cualquier otro nombre falla explícitamente. */
const NAMED_COLORS: Record<string, string> = {
  black: '#000000',
  white: '#ffffff',
  red: '#ff0000',
  lime: '#00ff00',
  green: '#008000',
  blue: '#0000ff',
  yellow: '#ffff00',
  cyan: '#00ffff',
  aqua: '#00ffff',
  magenta: '#ff00ff',
  fuchsia: '#ff00ff',
  silver: '#c0c0c0',
  gray: '#808080',
  grey: '#808080',
  maroon: '#800000',
  olive: '#808000',
  navy: '#000080',
  purple: '#800080',
  teal: '#008080',
  orange: '#ffa500',
};

const clampChannel = (value: number) => Math.min(255, Math.max(0, Math.round(value)));

const toHexChannel = (value: number) => clampChannel(value).toString(16).padStart(2, '0');

/** Normaliza un color de pintura a `#rrggbb`, o `null` para «sin pintura». */
const parsePaint = (raw: string | undefined, inherited: string | null): string | null => {
  if (raw === undefined) return inherited;
  const value = raw.trim().toLowerCase();
  if (!value || value === 'inherit') return inherited;
  if (value === 'none' || value === 'transparent') return null;
  if (/^#[0-9a-f]{6}$/.test(value)) return value;
  if (/^#[0-9a-f]{3}$/.test(value)) {
    return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
  }
  const rgbMatch = value.match(/^rgba?\(([^)]*)\)$/);
  if (rgbMatch) {
    const parts = rgbMatch[1].split(',').map((part) => part.trim());
    if (parts.length < 3) throw new SvgRenderError(`unsupported color "${raw.trim()}"`);
    const channels = parts.slice(0, 3).map((part) =>
      part.endsWith('%') ? (Number.parseFloat(part) / 100) * 255 : Number.parseFloat(part),
    );
    if (!channels.every(Number.isFinite)) throw new SvgRenderError(`unsupported color "${raw.trim()}"`);
    return `#${channels.map(toHexChannel).join('')}`;
  }
  const named = NAMED_COLORS[value];
  if (named) return named;
  throw new SvgRenderError(`unsupported color "${raw.trim()}"`);
};

const parseOpacity = (raw: string | undefined, inherited: number): number => {
  if (raw === undefined) return inherited;
  const value = raw.trim();
  if (!value || value === 'inherit') return inherited;
  const numeric = value.endsWith('%') ? Number.parseFloat(value) / 100 : Number.parseFloat(value);
  if (!Number.isFinite(numeric)) throw new SvgRenderError(`unsupported opacity "${value}"`);
  return Math.min(1, Math.max(0, numeric));
};

/** Propiedades de pintura heredadas por el árbol SVG. */
type PaintState = {
  fill: string | null;
  stroke: string | null;
  strokeWidth: number;
  fillOpacity: number;
  strokeOpacity: number;
};

const ROOT_PAINT: PaintState = {
  fill: '#000000',
  stroke: null,
  strokeWidth: 1,
  fillOpacity: 1,
  strokeOpacity: 1,
};

/** Declaraciones del atributo `style`, que ganan a los atributos de presentación. */
const parseStyleDeclarations = (raw: string | undefined): Record<string, string> => {
  if (!raw) return {};
  const declarations: Record<string, string> = {};
  for (const chunk of raw.split(';')) {
    const separator = chunk.indexOf(':');
    if (separator < 0) continue;
    const property = chunk.slice(0, separator).trim().toLowerCase();
    if (property) declarations[property] = chunk.slice(separator + 1).trim();
  }
  return declarations;
};

const resolvePaint = (node: SvgNode, inherited: PaintState): PaintState => {
  const style = parseStyleDeclarations(node.attributes.style);
  const read = (property: string) => style[property] ?? node.attributes[property];

  const fillRule = read('fill-rule')?.trim().toLowerCase();
  if (fillRule && fillRule !== 'nonzero' && fillRule !== 'inherit') {
    throw new SvgRenderError(`unsupported fill-rule "${fillRule}"`);
  }

  const groupOpacity = parseOpacity(read('opacity'), 1);
  const strokeWidthRaw = read('stroke-width');
  const strokeWidth =
    strokeWidthRaw === undefined ? inherited.strokeWidth : parseSvgLength(strokeWidthRaw);
  if (strokeWidth === null || !(strokeWidth >= 0)) {
    throw new SvgRenderError(`unsupported stroke-width "${strokeWidthRaw}"`);
  }

  return {
    fill: parsePaint(read('fill'), inherited.fill),
    stroke: parsePaint(read('stroke'), inherited.stroke),
    strokeWidth,
    fillOpacity: parseOpacity(read('fill-opacity'), inherited.fillOpacity) * groupOpacity,
    strokeOpacity: parseOpacity(read('stroke-opacity'), inherited.strokeOpacity) * groupOpacity,
  };
};

const resolveAspectRatio = (raw: string | undefined): SvgAspectRatio => {
  if (!raw) return 'meet';
  const value = raw.trim().toLowerCase();
  if (value === 'none') return 'none';
  if (value === 'xmidymid' || value === 'xmidymid meet') return 'meet';
  throw new SvgRenderError(`unsupported preserveAspectRatio "${raw.trim()}"`);
};

const resolveRootViewBox = (root: SvgNode) => {
  const viewBox = parseSvgViewBox(root.attributes.viewBox);
  if (viewBox) return viewBox;
  const width = parseSvgLength(root.attributes.width);
  const height = parseSvgLength(root.attributes.height);
  if (width !== null && height !== null && width > 0 && height > 0) {
    return { minX: 0, minY: 0, width, height };
  }
  throw new SvgRenderError('root <svg> has no usable viewBox or width/height');
};

const collectDraws = (node: SvgNode, matrix: SvgMatrix, paint: PaintState, out: SvgPathDraw[]): void => {
  for (const child of node.children) {
    if (IGNORED_TAGS.has(child.tag)) continue;

    const transform = parseSvgTransform(child.attributes.transform);
    if (!transform) {
      throw new SvgRenderError(`unsupported transform "${child.attributes.transform ?? ''}"`);
    }
    const childMatrix = multiplySvgMatrix(matrix, transform);
    const childPaint = resolvePaint(child, paint);

    if (child.tag === 'g') {
      collectDraws(child, childMatrix, childPaint, out);
      continue;
    }

    if (!SHAPE_TAGS.has(child.tag)) {
      throw new SvgRenderError(`unsupported element <${child.tag}>`);
    }

    const pathData = svgShapeToPathData(child.tag as SvgShapeTag, child.attributes);
    if (pathData === null) throw new SvgRenderError(`invalid <${child.tag}> geometry`);
    if (!pathData) continue;
    if (!childPaint.fill && !childPaint.stroke) continue;

    out.push({
      pathData,
      matrix: toDrawSvgPathMatrix(childMatrix),
      fill: childPaint.fill,
      stroke: childPaint.stroke,
      strokeWidth: childPaint.strokeWidth,
      fillOpacity: childPaint.fillOpacity,
      strokeOpacity: childPaint.strokeOpacity,
    });
  }
};

/**
 * Traduce el SVG a la lista de trazos que hay que emitir en la página.
 *
 * Lanza `SvgRenderError` si el documento no es dibujable o si no produce ni un
 * solo trazo: un SVG con contenido que acaba en nada es un fallo, no un dibujo
 * vacío.
 */
export const planSvgDraw = (markup: string, target: SvgRenderTarget): SvgPathDraw[] => {
  if (!(target.width > 0) || !(target.height > 0)) {
    throw new SvgRenderError('target box has no area');
  }

  const root = parseSvgMarkup(markup);
  const viewBox = resolveRootViewBox(root);
  const aspectRatio = resolveAspectRatio(root.attributes.preserveAspectRatio);
  const viewportMatrix = buildSvgViewportMatrix(viewBox, target, aspectRatio);

  const rootTransform = parseSvgTransform(root.attributes.transform);
  if (!rootTransform) {
    throw new SvgRenderError(`unsupported transform "${root.attributes.transform ?? ''}"`);
  }

  const draws: SvgPathDraw[] = [];
  collectDraws(
    root,
    multiplySvgMatrix(viewportMatrix, multiplySvgMatrix(rootTransform, IDENTITY_MATRIX)),
    resolvePaint(root, ROOT_PAINT),
    draws,
  );

  if (draws.length === 0) throw new SvgRenderError('document produced no drawable geometry');
  return draws;
};
