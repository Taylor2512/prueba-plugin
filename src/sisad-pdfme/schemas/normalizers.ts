import { cloneDeep } from '@sisad-pdfme/common';
import type { Plugin, Schema, SchemaForUI } from '@sisad-pdfme/common';
import { isRecord } from '@sisad-pdfme/shared/objectGuards';
import { createDefaultSchema } from './index';

/**
 * Normalize a plugin's declared defaultSchema into a fully-formed SchemaForUI.
 * Uses the canonical createDefaultSchema helper and preserves overrides from
 * the plugin when present. Always returns a cloned object so callers can
 * safely mutate the result.
 */
export const normalizePluginDefaultSchema = (
  plugin: Plugin<Schema> | null | undefined,
  type?: string,
  context: Parameters<typeof createDefaultSchema>[1] = {},
): SchemaForUI => {
  const declaredDefault = plugin?.propPanel?.defaultSchema;
  const declaredType = isRecord(declaredDefault) ? declaredDefault.type : undefined;
  const t = String(type || declaredType || 'text').trim();
  // Start from the canonical defaults (fills id/schemaUid/name/position)
  const canonical = createDefaultSchema(t, context);

  // If the plugin provides a defaultSchema and it's an object, shallow-merge
  // it on top of the canonical defaults so plugin-provided fields override.
  const declared = isRecord(declaredDefault) ? declaredDefault : {};

  return cloneDeep({ ...(canonical as SchemaForUI), ...(declared as Schema) }) as SchemaForUI;
};

export default normalizePluginDefaultSchema;
