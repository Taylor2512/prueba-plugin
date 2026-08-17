import type { Plugin, Schema, SchemaForUI } from '@sisad-pdfme/common';

/**
 * Runtime helper to avoid duplicating try/require/normalizePluginDefaultSchema
 * blocks across many schema files. Returns the normalized canonical defaults
 * or `null` when the normalizer is not available (avoids import cycles).
 */
export function getCanonicalDefault(
  plugin?: Plugin<Schema> | null,
  type?: string,
  context?: Record<string, unknown>,
): SchemaForUI | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { normalizePluginDefaultSchema } = require('@sisad-pdfme/schemas/normalizers');
    return normalizePluginDefaultSchema(plugin as any, type, context);
  } catch (e) {
    return null;
  }
}

export default getCanonicalDefault;
