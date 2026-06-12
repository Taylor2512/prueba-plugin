import { cloneDeep } from '@sisad-pdfme/common';
import { flatSchemaPlugins } from '@sisad-pdfme/schemas';

export const DEFAULT_AUDIT_BASE_TIMESTAMP = 1713570000000;

export const sanitizeIdentifier = (value: unknown): string =>
  String(value || 'lab-example')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'lab-example';

export const chunkItems = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

export const createSchema = (
  baseSchema: Record<string, unknown>,
  overrides: Record<string, unknown> = {},
): Record<string, unknown> => ({
  ...cloneDeep(baseSchema),
  ...cloneDeep(overrides),
});

export type CreateSchemaByTypeOptions = {
  plugins?: Record<string, { propPanel?: { defaultSchema?: Record<string, unknown> } }>;
};

export const createSchemaByType = (
  type: string,
  overrides: Record<string, unknown> = {},
  options: CreateSchemaByTypeOptions = {},
): Record<string, unknown> => {
  const plugins = (options.plugins ?? flatSchemaPlugins) as Record<string, { propPanel?: { defaultSchema?: Record<string, unknown> } }>;
  const plugin = plugins[type];
  if (!plugin?.propPanel?.defaultSchema) {
    throw new Error(`Schema type not registered for example generation: ${type}`);
  }

  return createSchema(plugin.propPanel.defaultSchema, {
    position: { x: 18, y: 24 },
    name: `${sanitizeIdentifier(type)}_field`,
    schemaUid: `schema-${sanitizeIdentifier(type)}`,
    ...overrides,
  });
};

export const createCommentAnchor = ({
  schemaUid,
  fileId,
  pageNumber,
  x = 0,
  y = 0,
}: {
  schemaUid: string;
  fileId?: string;
  pageNumber?: number;
  x?: number;
  y?: number;
}) => ({
  id: `${schemaUid}-anchor-${pageNumber || 1}`,
  schemaUid,
  fileId,
  pageNumber,
  x,
  y,
  resolved: false,
});

export type CreateAuditMetadataOptions = {
  baseTimestamp?: number;
};

export const createAuditMetadata = (
  createdBy: string,
  lastModifiedBy: string = createdBy,
  offset = 0,
  options: CreateAuditMetadataOptions = {},
) => {
  const base = options.baseTimestamp ?? DEFAULT_AUDIT_BASE_TIMESTAMP;
  return {
    createdBy,
    lastModifiedBy,
    createdAt: base + offset,
    updatedAt: base + offset + 60000,
  };
};
