import type { SchemaForUI } from '@sisad-pdfme/common';
import { getCatalogLabel, getSchemaTypeLabel } from '@sisad-pdfme/ui/components/Designer/shared/designerLabels';
import { defaultTranslate, type Translate } from '@sisad-pdfme/ui/i18n';
import { normalizeText } from '@sisad-pdfme/shared/text';

export type SchemaDisplayInfo = {
  primaryLabel: string;
  technicalName: string;
  typeLabel: string;
};

/**
 * Resuelve nombre visible, nombre técnico y etiqueta de tipo de un schema.
 *
 * `translate` es opcional porque esta función es API pública y puede invocarse
 * fuera del árbol React; sin ella las etiquetas se resuelven en `DEFAULT_LANG`.
 * Los consumidores internos deben pasar la función de `I18nContext` para respetar
 * `options.lang` y `options.labels`.
 *
 * `schema.name` y `schema.type` se leen como identidad y nunca se reescriben.
 */
export const resolveSchemaDisplayInfo = (
  schema: SchemaForUI,
  translate: Translate = defaultTranslate,
): SchemaDisplayInfo => {
  const primaryLabel =
    normalizeText((schema as SchemaForUI & { label?: string }).label) ||
    getCatalogLabel(translate, schema.name, schema.type, 'builtin');
  const technicalName = normalizeText(schema.name) || primaryLabel;
  return {
    primaryLabel,
    technicalName,
    typeLabel: getSchemaTypeLabel(translate, schema.type),
  };
};

export { getCatalogLabel, getSchemaTypeLabel };
