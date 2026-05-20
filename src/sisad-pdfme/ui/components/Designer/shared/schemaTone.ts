import { Schema, SchemaForUI } from '@sisad-pdfme/common';

const SCHEMA_TYPE_TONES: Record<string, string> = {
  text: '#4F8EF7',
  multivariabletext: '#7B61FF',
  image: '#00C2A8',
  svg: '#00C2A8',
  table: '#FF8C42',
  line: '#94A3B8',
  rectangle: '#FFD166',
  ellipse: '#EF476F',
  checkbox: '#06D6A0',
  radiogroup: '#06D6A0',
  select: '#118AB2',
  date: '#9B5DE5',
  datetime: '#9B5DE5',
  time: '#9B5DE5',
  qrcode: '#073B4C',
  ean13: '#073B4C',
  ean8: '#073B4C',
  code39: '#073B4C',
  code128: '#073B4C',
  itf14: '#073B4C',
  upca: '#073B4C',
  upce: '#073B4C',
  gs1datamatrix: '#073B4C',
  pdf417: '#073B4C',
  japanpost: '#073B4C',
  nw7: '#073B4C',
  signature: '#F59E0B',
};

type ToneAwareSchema = (SchemaForUI | Schema) & {
  userColor?: string;
  ownerColor?: string;
  borderColor?: string;
  color?: string;
  strokeColor?: string;
};

const normalizeTypeKey = (value: unknown) =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

const normalizeHexChannel = (value: string) => {
  const numeric = Number.parseInt(value, 16);
  return Number.isFinite(numeric) ? numeric : 0;
};

const hexToRgb = (hex: string) => {
  const normalized = String(hex || '').trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(normalized)) return null;
  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((part) => part + part)
          .join('')
      : normalized;
  return {
    r: normalizeHexChannel(expanded.slice(0, 2)),
    g: normalizeHexChannel(expanded.slice(2, 4)),
    b: normalizeHexChannel(expanded.slice(4, 6)),
  };
};

export const resolveSchemaTone = (schema: SchemaForUI | Schema, fallback: string): string => {
  const toneSchema = schema as ToneAwareSchema;
  const candidate =
    toneSchema.userColor || toneSchema.ownerColor || toneSchema.borderColor || toneSchema.strokeColor || toneSchema.color;

  const typeTone = SCHEMA_TYPE_TONES[normalizeTypeKey((schema as SchemaForUI)?.type)];

  if (typeof candidate === 'string' && candidate.trim()) return candidate;
  if (typeTone) return typeTone;
  return fallback;
};

export const resolveSchemaToneSurface = (
  schema: SchemaForUI | Schema,
  fallback: string,
  alpha = 0.14,
): string => {
  const tone = resolveSchemaTone(schema, fallback);
  const rgb = hexToRgb(tone);
  if (!rgb) return tone;
  const resolvedAlpha = Math.max(0, Math.min(1, alpha));
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${resolvedAlpha})`;
};
