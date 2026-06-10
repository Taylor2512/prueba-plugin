import type { Plugin, Schema } from '@sisad-pdfme/common';
import type { IconNode } from 'lucide-react';
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
const stableJsonSignature = (v: unknown) => {
  try {
    const canon = (function canon(x: any): any {
      if (x === null || typeof x !== 'object') return x;
      if (Array.isArray(x)) return x.map(canon);
      const keys = Object.keys(x).sort();
      const out: any = {};
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

export const createSchemaPlugin = <T extends Schema>(
  plugin: Plugin<T>,
  definition: SchemaDefinition,
): SchemaPluginWithMetadata<T> => {
  const wrapped: any = { ...plugin };

  if (typeof plugin.ui === 'function') {
    wrapped.ui = async (arg: any) => {
      const { rootElement, schema } = arg || {};
      const originalOnChange = arg?.onChange;

      const dedupeOnChange = (payload: unknown) => {
        if (typeof originalOnChange !== 'function') return originalOnChange?.(payload);
        try {
          const sig = stableJsonSignature(payload);
          if (schema && typeof schema.id === 'string' && schema.id) {
            const last = _lastSigBySchemaId.get(schema.id);
            if (last === sig) return;
            _lastSigBySchemaId.set(schema.id, sig);
          } else if (rootElement instanceof Element) {
            const last = _lastSigByElement.get(rootElement);
            if (last === sig) return;
            _lastSigByElement.set(rootElement, sig);
          }
        } catch (e) {
          // ignore signature errors and proceed
        }
        return originalOnChange(payload);
      };

      const newArg = { ...arg, onChange: dedupeOnChange };
      return plugin.ui(newArg);
    };
  }

  return {
    ...wrapped,
    designer: definition,
  } as SchemaPluginWithMetadata<T>;
};

export const getSchemaDefinition = (plugin: Plugin<Schema> | SchemaPluginWithMetadata<Schema>) =>
  'designer' in plugin ? plugin.designer : null;

const isPluginLike = (value: unknown): value is Plugin<Schema> =>
  Boolean(
    value &&
      typeof value === 'object' &&
      'pdf' in (value as Record<string, unknown>) &&
      'ui' in (value as Record<string, unknown>) &&
      'propPanel' in (value as Record<string, unknown>),
  );

const resolveDefinitionFromPlugin = (key: string, plugin: Plugin<Schema>) => {
  const definition = getSchemaDefinition(plugin as SchemaPluginWithMetadata<Schema>);
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
