import { cloneDeep, Schema } from '@sisad-pdfme/common';
import { resolveSchemaAutoPlaceDescriptor } from './shared/schemaAutoPlace.js';
import type { AutoPlaceResolver } from './shared/designerExtensions.js';

type CustomSchemaDefinition = {
  id: string;
  label: string;
  category: string;
  pluginType: string;
  autoFillSource?: string;
  autoPlaceText?: string;
  defaultValue?: string;
  defaultSchema?: Record<string, unknown>;
};

type CreateSchemaArgs = {
  definitionId: string;
  recipient?: Record<string, unknown> | null;
  overrides?: {
    resolveBaseSchema?: () => Record<string, unknown> | null | undefined;
    resolveAutoPlaceDescriptor?: AutoPlaceResolver;
  };
};

const listeners = new Set<() => void>();
const definitions = new Map<string, CustomSchemaDefinition>();
const STORAGE_KEY = 'sisad-pdfme:custom-schema-definitions';
let hasHydratedFromStorage = false;

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const persistDefinitions = () => {
  if (!canUseStorage()) return;

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(Array.from(definitions.values()).map((definition) => cloneDeep(definition))),
  );
};

const hydrateDefinitions = () => {
  if (hasHydratedFromStorage || !canUseStorage()) return;
  hasHydratedFromStorage = true;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;

    parsed
      .map((definition) => normalizeDefinition(definition))
      .filter((definition): definition is CustomSchemaDefinition => Boolean(definition))
      .forEach((definition) => {
        definitions.set(definition.id, definition);
      });
  } catch {
    // Ignore invalid persisted payloads and continue with the in-memory registry.
  }
};

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
    autoPlaceText: definition.autoPlaceText ? String(definition.autoPlaceText) : undefined,
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

export const getCustomSchemaDefinitions = () => {
  hydrateDefinitions();
  return Array.from(definitions.values()).map((d) => cloneDeep(d));
};

export const subscribeCustomSchemaDefinitions = (listener: () => void) => {
  hydrateDefinitions();
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    hasHydratedFromStorage = false;
    definitions.clear();
    hydrateDefinitions();
    notify();
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', onStorage);
  }

  return () => {
    listeners.delete(listener);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage);
    }
  };
};

export const upsertCustomSchemaDefinition = (definition: Record<string, unknown>) => {
  hydrateDefinitions();
  const normalized = normalizeDefinition(definition);
  if (!normalized) return null;

  definitions.set(normalized.id, normalized);
  persistDefinitions();
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
  const autoPlaceDescriptor =
    args.overrides?.resolveAutoPlaceDescriptor?.(schema, {
      keyword: definition.autoPlaceText,
      fieldType: definition.pluginType,
    }) ||
    resolveSchemaAutoPlaceDescriptor(schema, {
      keyword: definition.autoPlaceText,
      fieldType: definition.pluginType,
    });
  if (autoPlaceDescriptor) {
    schema.autoPlaceText = autoPlaceDescriptor.keyword;
    schema.__designer = {
      ...((schema.__designer as Record<string, unknown>) || {}),
      autoPlace: autoPlaceDescriptor,
    };
  }

  withRecipient(schema, definition, args.recipient);

  return schema as Schema;
};

export type { CustomSchemaDefinition };
