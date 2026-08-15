import type { SchemaForUI } from '@sisad-pdfme/common';
import { getCatalogLabel, getSchemaTypeLabel } from '@sisad-pdfme/ui/components/Designer/shared/designerLabels';
import { normalizeText } from '@sisad-pdfme/shared/text';

export type SchemaDisplayInfo = {
  primaryLabel: string;
  technicalName: string;
  typeLabel: string;
};

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
