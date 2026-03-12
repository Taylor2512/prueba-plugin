import { Schema, SchemaForUI } from '@pdfme/common';

type ToneAwareSchema = (SchemaForUI | Schema) & {
  ownerColor?: string;
  borderColor?: string;
  color?: string;
  strokeColor?: string;
};

export const resolveSchemaTone = (schema: SchemaForUI | Schema, fallback: string): string => {
  const toneSchema = schema as ToneAwareSchema;
  const candidate =
    toneSchema.ownerColor || toneSchema.borderColor || toneSchema.strokeColor || toneSchema.color;

  return typeof candidate === 'string' && candidate.trim() ? candidate : fallback;
};

