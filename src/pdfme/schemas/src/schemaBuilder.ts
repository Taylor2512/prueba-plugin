import type { Plugin, Schema } from '@pdfme/common';
import type { IconNode } from 'lucide';
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

export const createLucideIcon = (icon: IconNode, attrs?: Record<string, string>) =>
  createSvgStr(icon, attrs);

export const createSchemaPlugin = <T extends Schema>(
  plugin: Plugin<T>,
  definition: SchemaDefinition,
): SchemaPluginWithMetadata<T> => ({
  ...plugin,
  designer: definition,
});

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
