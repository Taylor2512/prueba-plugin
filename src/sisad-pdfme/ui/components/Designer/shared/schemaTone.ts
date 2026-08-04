import { Schema, SchemaForUI } from '@sisad-pdfme/common';
import { resolveSchemaVisualTone } from '../../../../schemas/shared/fieldChrome.js';
import { resolveSchemaOwnerColorValue } from '../../../../collaboration/schemaOwnershipAppearance.js';

type ToneAwareSchema = (SchemaForUI | Schema) & {
  borderColor?: string;
  color?: string;
  strokeColor?: string;
};

export const resolveSchemaTone = (schema: SchemaForUI | Schema, fallback: string): string => {
  const toneSchema = schema as ToneAwareSchema;
  const candidate =
    resolveSchemaOwnerColorValue(schema) ||
    toneSchema.borderColor ||
    toneSchema.strokeColor ||
    toneSchema.color;
  const visualTone = resolveSchemaVisualTone(schema, { fallbackColor: candidate || fallback });
  return visualTone.ownerColor;
};

export const resolveSchemaToneSurface = (
  schema: SchemaForUI | Schema,
  fallback: string,
  alpha = 0.14,
): string => {
  const resolvedAlpha = Math.max(0, Math.min(1, alpha));
  const visualTone = resolveSchemaVisualTone(schema, { fallbackColor: fallback });
  if (resolvedAlpha === 0.14) return visualTone.ownerBackground;
  return `color-mix(in srgb, ${visualTone.ownerColor} ${Math.round(resolvedAlpha * 100)}%, white)`;
};
