import type { SchemaForUI } from '@sisad-pdfme/common';
import { getCatalogLabel, getSchemaTypeLabel } from '../../shared/designerLabels.js';

export type SchemaDisplayInfo = {
  primaryLabel: string;
  technicalName: string;
  typeLabel: string;
};

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export const resolveSchemaDisplayInfo = (schema: SchemaForUI): SchemaDisplayInfo => {
  const primaryLabel =
    normalizeText((schema as SchemaForUI & { label?: string }).label) ||
    getCatalogLabel(schema.name, schema.type, 'builtin');
  const technicalName = normalizeText(schema.name) || primaryLabel;
  return {
    primaryLabel,
    technicalName,
    typeLabel: getSchemaTypeLabel(schema.type),
  };
};

export { getCatalogLabel, getSchemaTypeLabel };
