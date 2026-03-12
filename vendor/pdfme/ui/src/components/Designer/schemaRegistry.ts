import { cloneDeep, Schema } from '@pdfme/common';

type CustomSchemaDefinition = {
  id: string;
  label: string;
  category: string;
  pluginType: string;
  autoFillSource?: string;
  defaultValue?: string;
  defaultSchema?: Record<string, unknown>;
};

type CreateSchemaArgs = {
  definitionId: string;
  recipient?: Record<string, unknown> | null;
  overrides?: {
    resolveBaseSchema?: () => Record<string, unknown> | null | undefined;
  };
};

const listeners = new Set<() => void>();
const definitions = new Map<string, CustomSchemaDefinition>();

const notify = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Ignore listener errors to keep registry resilient.
    }
  });
};

const normalizeDefinition = (definition: Record<string, unknown>): CustomSchemaDefinition | null => {
  const id = String(definition.id || '').trim();
  const label = String(definition.label || '').trim();
  const category = String(definition.category || '').trim() || 'General';
  const pluginType = String(definition.pluginType || '').trim();

  if (!id || !label || !pluginType) return null;

  return {
    id,
    label,
    category,
    pluginType,
    autoFillSource: definition.autoFillSource ? String(definition.autoFillSource) : undefined,
    defaultValue: definition.defaultValue ? String(definition.defaultValue) : undefined,
    defaultSchema:
      definition.defaultSchema && typeof definition.defaultSchema === 'object'
        ? cloneDeep(definition.defaultSchema as Record<string, unknown>)
        : undefined,
  };
};

const withRecipient = (
  schema: Record<string, unknown>,
  definition: CustomSchemaDefinition,
  recipient?: Record<string, unknown> | null,
) => {
  if (!recipient || !definition.autoFillSource) return schema;
  const source = definition.autoFillSource.trim();
  if (!source) return schema;

  const value = source.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, recipient);

  if (typeof value === 'string' || typeof value === 'number') {
    schema.content = String(value);
  }

  return schema;
};

export const getCustomSchemaDefinitions = () => Array.from(definitions.values()).map((d) => cloneDeep(d));

export const subscribeCustomSchemaDefinitions = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const upsertCustomSchemaDefinition = (definition: Record<string, unknown>) => {
  const normalized = normalizeDefinition(definition);
  if (!normalized) return null;

  definitions.set(normalized.id, normalized);
  notify();
  return cloneDeep(normalized);
};

export const createCustomSchemaFromDefinition = (args: CreateSchemaArgs): Schema | null => {
  const definition = definitions.get(String(args.definitionId || '').trim());
  if (!definition) return null;

  const baseFromRegistry =
    definition.defaultSchema && typeof definition.defaultSchema === 'object'
      ? cloneDeep(definition.defaultSchema)
      : null;
  const baseFromOverride = args.overrides?.resolveBaseSchema?.();
  const base = cloneDeep((baseFromRegistry || baseFromOverride || {}) as Record<string, unknown>);

  const schema: Record<string, unknown> = {
    ...base,
    name: String(base.name || definition.label || `custom_${definition.id}`),
    type: String(base.type || definition.pluginType),
  };

  if (!schema.position || typeof schema.position !== 'object') {
    schema.position = { x: 0, y: 0 };
  }
  if (typeof schema.width !== 'number') schema.width = 120;
  if (typeof schema.height !== 'number') schema.height = 18;
  if (typeof schema.content !== 'string') schema.content = definition.defaultValue || '';

  withRecipient(schema, definition, args.recipient);

  return schema as Schema;
};

export type { CustomSchemaDefinition };
