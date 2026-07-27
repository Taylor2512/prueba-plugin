import type { Plugin, Schema } from '@sisad-pdfme/common';
import type { IconNode } from 'lucide-react';
import { isRecord } from '../shared/objectGuards.js';
import { createSvgStr } from './utils.js';

export type SchemaCapability =
  | 'designer'
  | 'form'
  | 'viewer'
  | 'content'
  | 'layout'
  | 'selection'
  | 'prefill'
  | 'dynamic';

export type SchemaDefinition = {
  key: string;
  type: string;
  label: string;
  category: string;
  tags?: string[];
  capabilities?: SchemaCapability[];
};

export type SchemaPluginWithMetadata<T extends Schema = Schema> = Plugin<T> & {
  designer: SchemaDefinition;
};

export type AnySchemaPlugin = Plugin<Schema>;
export type SchemaPluginEntry =
  | AnySchemaPlugin
  | SchemaPluginWithMetadata<Schema>
  | Record<string, AnySchemaPlugin | SchemaPluginWithMetadata<Schema>>;
export type SchemaPluginMap = Record<string, SchemaPluginEntry>;

export const renderLucideIcon = (icon: unknown, attrs?: Record<string, string>) =>
  createSvgStr(icon, attrs);

// Wrap UI handlers to dedupe identical onChange emissions using a stable JSON signature.
const buildSchemaBuilderStableJsonSignature = (v: unknown) => {
  try {
    const canon = (function canon(x: unknown): unknown {
      if (x === null || typeof x !== 'object') return x;
      if (Array.isArray(x)) return x.map(canon);
      const keys = Object.keys(x).sort();
      const out: Record<string, unknown> = {};
      keys.forEach((k) => (out[k] = canon(x[k])));
      return out;
    })(v);
    return JSON.stringify(canon);
  } catch {
    return String(v || '');
  }
};

// Global cache for last signatures per schema id or per root element
const _lastSigBySchemaId = new Map<string, string>();
const _lastSigByElement = new WeakMap<Element, string>();

const getOnChangeCacheKey = (schema: unknown, rootElement: unknown): string | Element | null => {
  if (isRecord(schema) && typeof schema.id === 'string' && schema.id) {
    return schema.id;
  }
  if (rootElement instanceof Element) {
    return rootElement;
  }
  return null;
};

const shouldSkipDuplicateEmission = (cacheKey: string | Element | null, signature: string): boolean => {
  if (typeof cacheKey === 'string') {
    const last = _lastSigBySchemaId.get(cacheKey);
    if (last === signature) return true;
    _lastSigBySchemaId.set(cacheKey, signature);
    return false;
  }

  if (cacheKey instanceof Element) {
    const last = _lastSigByElement.get(cacheKey);
    if (last === signature) return true;
    _lastSigByElement.set(cacheKey, signature);
  }

  return false;
};

export const createSchemaPlugin = <T extends Schema>(
  plugin: Plugin<T>,
  definition: SchemaDefinition,
): SchemaPluginWithMetadata<T> => {
  const wrapped: Plugin<T> & { designer?: SchemaDefinition } = { ...plugin };

  if (typeof plugin.ui === 'function') {
    wrapped.ui = async (arg: Parameters<NonNullable<typeof plugin.ui>>[0]) => {
      const uiArg: Record<string, unknown> = isRecord(arg) ? arg : {};
      const rootElement = uiArg.rootElement;
      const schema = uiArg.schema;
      const originalOnChange =
        typeof uiArg.onChange === 'function'
          ? (uiArg.onChange as (payload: unknown) => unknown)
          : undefined;

      const dedupeOnChange = (payload: unknown) => {
        if (typeof originalOnChange !== 'function') return undefined;
        try {
          const sig = buildSchemaBuilderStableJsonSignature(payload);
          if (shouldSkipDuplicateEmission(getOnChangeCacheKey(schema, rootElement), sig)) return;
        } catch (e) {
          // ignore signature errors and proceed
        }
        return originalOnChange(payload);
      };

      const newArg = { ...uiArg, onChange: dedupeOnChange } as Parameters<NonNullable<typeof plugin.ui>>[0];
      return plugin.ui(newArg);
    };
  }

  return {
    ...wrapped,
    designer: definition,
  } as SchemaPluginWithMetadata<T>;
};

export const buildSchemaDefinitionFromPlugin = (plugin: Plugin<Schema> | SchemaPluginWithMetadata<Schema>) =>
  'designer' in plugin ? plugin.designer : null;

const isPluginLike = (value: unknown): value is Plugin<Schema> =>
  isRecord(value) &&
  'pdf' in value &&
  'ui' in value &&
  'propPanel' in value;

const resolveDefinitionFromPlugin = (key: string, plugin: Plugin<Schema>) => {
  const definition = buildSchemaDefinitionFromPlugin(plugin as SchemaPluginWithMetadata<Schema>);
  if (definition) return definition;
  const defaultSchema = plugin?.propPanel?.defaultSchema;
  return defaultSchema
    ? {
        key,
        type: defaultSchema.type,
        label: key,
        category: 'General',
        tags: [],
        capabilities: ['designer', 'form', 'viewer'],
      }
    : null;
};

export const flattenSchemaPlugins = (plugins: SchemaPluginMap) =>
  Object.entries(plugins).reduce<Record<string, Plugin<Schema>>>((acc, [key, entry]) => {
    if (isPluginLike(entry)) {
      acc[key] = entry;
      return acc;
    }
    Object.entries(entry || {}).forEach(([nestedKey, nestedEntry]) => {
      if (isPluginLike(nestedEntry)) {
        acc[nestedKey] = nestedEntry;
      }
    });
    return acc;
  }, {});

export const listSchemaDefinitions = (plugins: SchemaPluginMap) =>
  Object.entries(flattenSchemaPlugins(plugins))
    .map(([key, plugin]) => resolveDefinitionFromPlugin(key, plugin))
    .filter(Boolean) as SchemaDefinition[];
