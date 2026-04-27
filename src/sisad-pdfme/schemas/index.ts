import { cloneDeep, type ChangeSchemaItem, type Plugin, type Schema, type SchemaForUI } from '@sisad-pdfme/common';
import multiVariableText from './multiVariableText/index.js';
import text from './text/index.js';
import image from './graphics/image.js';
import svg from './graphics/svg.js';
import barcodes from './barcodes/index.js';
import line from './shapes/line.js';
import table from './tables/index.js';
import { rectangle, ellipse } from './shapes/rectAndEllipse.js';
import dateTime from './date/dateTime.js';
import date from './date/date.js';
import time from './date/time.js';
import select from './select/index.js';
import radioGroup from './radioGroup/index.js';
import checkbox from './checkbox/index.js';
import signature from './signature/index.js';
import {
  flattenSchemaPlugins,
  getSchemaDefinition as getSchemaDefinitionFromPlugin,
  listSchemaDefinitions,
  createSchemaPlugin,
  renderLucideIcon,
} from './schemaBuilder.js';
import type { SchemaPluginMap, SchemaPluginWithMetadata } from './schemaBuilder.js';
import {
  createSchemaInspectorConfig,
  getSchemaFamilyInspectorPreset,
  getSchemaTypeInspectorPreset,
  normalizeSchemaFamily,
  resolveSchemaFamily,
} from './schemaFamilies.js';

const schemaPlugins: SchemaPluginMap = {
  text,
  multiVariableText,
  image,
  svg,
  signature,
  table,
  barcodes,
  line,
  rectangle,
  ellipse,
  dateTime,
  date,
  time,
  select,
  radioGroup,
  checkbox,
};

const flatSchemaPlugins = flattenSchemaPlugins(schemaPlugins);
const builtInPlugins = flatSchemaPlugins;
const builtInSchemaDefinitions = listSchemaDefinitions(schemaPlugins);
const builtInSchemaDefinitionsByType = Object.fromEntries(
  builtInSchemaDefinitions.map((definition) => [definition.type, definition]),
);
const builtInFields = builtInSchemaDefinitions;
const registeredSchemaPlugins = new Map<string, Plugin<Schema>>();

const normalizeText = (value: unknown) => String(value || '').trim();
const normalizeSchemaType = (value: unknown) => normalizeText(value).toLowerCase();

const getAllRegisteredSchemaPlugins = () => ({
  ...flatSchemaPlugins,
  ...Object.fromEntries(registeredSchemaPlugins.entries()),
});

const getDefinitionFromType = (type: string) => {
  const normalizedType = normalizeSchemaType(type);
  if (!normalizedType) return null;
  if (builtInSchemaDefinitionsByType[normalizedType]) return builtInSchemaDefinitionsByType[normalizedType];
  const plugin = getAllRegisteredSchemaPlugins()[normalizedType];
  return plugin ? getSchemaDefinitionFromPlugin(plugin as SchemaPluginWithMetadata<Schema>) : null;
};

const createSchemaUid = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `schema-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const flattenSchemaList = (schemas: Schema[] | Schema[][] = []) =>
  Array.isArray(schemas[0]) ? (schemas as Schema[][]).flat() : (schemas as Schema[]);

const normalizeFieldName = (value: unknown, fallback = 'field') => normalizeText(value) || fallback;

const updateValueByPath = (target: Record<string, unknown>, key: string, value: unknown) => {
  const path = normalizeText(key);
  if (!path) return;
  const segments = path.split('.').filter(Boolean);
  if (segments.length === 0) return;

  let node = target;
  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    if (!node[segment] || typeof node[segment] !== 'object') {
      node[segment] = {};
    }
    node = node[segment] as Record<string, unknown>;
  }
  node[segments[segments.length - 1]] = value;
};

export const registerFieldPlugin = (
  typeOrPlugin: string | Plugin<Schema>,
  maybePlugin?: Plugin<Schema>,
) => {
  const plugin = typeof typeOrPlugin === 'string' ? maybePlugin : typeOrPlugin;
  const type =
    typeof typeOrPlugin === 'string'
      ? normalizeSchemaType(typeOrPlugin)
      : normalizeSchemaType(typeOrPlugin?.propPanel?.defaultSchema?.type);

  if (!type || !plugin) return null;
  registeredSchemaPlugins.set(type, plugin);
  return plugin;
};

export const registerPlugins = (plugins: Record<string, Plugin<Schema>> = {}) => {
  Object.entries(plugins || {}).forEach(([type, plugin]) => {
    registerFieldPlugin(type, plugin);
  });
  return getAllRegisteredSchemaPlugins();
};

export const getSchemaPluginByType = (type: string) =>
  getAllRegisteredSchemaPlugins()[normalizeSchemaType(type)];

export const getBuiltInFields = () => builtInSchemaDefinitions.map((definition) => ({ ...definition }));

export const getSchemaDefinition = (
  input: string | Plugin<Schema> | SchemaPluginWithMetadata<Schema>,
) => {
  if (typeof input === 'string') {
    return getDefinitionFromType(input);
  }
  return getSchemaDefinitionFromPlugin(input as Plugin<Schema>);
};

export const getSchemaFamily = (type: string) => resolveSchemaFamily(type);

export const generateUniqueSchemaName = (
  typeOrBaseName: string,
  existingSchemas: Schema[] | Schema[][] = [],
) => {
  const baseName = normalizeFieldName(typeOrBaseName, 'field');
  const names = new Set(
    flattenSchemaList(existingSchemas)
      .map((schema) => normalizeText(schema?.name).toLowerCase())
      .filter(Boolean),
  );

  if (!names.has(baseName.toLowerCase())) return baseName;
  let attempt = 2;
  while (names.has(`${baseName}_${attempt}`.toLowerCase())) attempt += 1;
  return `${baseName}_${attempt}`;
};

export const validateSchemaNameUniqueness = (
  name: string,
  existingSchemas: Schema[] | Schema[][] = [],
  ignoredSchemaUid?: string | null,
) => {
  const normalizedName = normalizeText(name).toLowerCase();
  if (!normalizedName) {
    return {
      isUnique: false,
      conflictSchemaUid: null,
      normalizedName,
    };
  }

  const schema = flattenSchemaList(existingSchemas).find((item) => {
    const sameName = normalizeText(item?.name).toLowerCase() === normalizedName;
    const ignored = ignoredSchemaUid && normalizeText(item?.schemaUid || item?.name) === normalizeText(ignoredSchemaUid);
    return sameName && !ignored;
  });

  return {
    isUnique: !schema,
    conflictSchemaUid: schema ? normalizeText(schema.schemaUid || schema.name) || null : null,
    normalizedName,
  };
};

export const createDefaultSchema = (
  type: string,
  context: {
    existingSchemas?: Schema[] | Schema[][];
    fileId?: string | null;
    fileTemplateId?: string | null;
    pageNumber?: number;
    schemaUid?: string;
    id?: string;
    ownerRecipientId?: string | null;
    ownerRecipientIds?: string[];
    ownerMode?: 'single' | 'multi' | 'shared';
    position?: { x?: number; y?: number };
  } = {},
) => {
  const plugin = getSchemaPluginByType(type);
  const baseSchema = cloneDeep(
    (plugin?.propPanel?.defaultSchema as Schema | undefined) || {
      name: normalizeFieldName(type, 'field'),
      type: normalizeSchemaType(type),
      position: { x: 0, y: 0 },
      width: 45,
      height: 10,
    },
  );

  const schemaUid = normalizeText(context.schemaUid) || normalizeText(baseSchema.schemaUid) || createSchemaUid();
  const id = normalizeText(context.id) || schemaUid;
  const existingSchemas = flattenSchemaList(context.existingSchemas || []);

  const defaultSchema: SchemaForUI = {
    ...(baseSchema as SchemaForUI),
    id,
    schemaUid,
    type: normalizeSchemaType(baseSchema.type || type),
    name: generateUniqueSchemaName(baseSchema.name || type, existingSchemas),
    fileTemplateId: normalizeText(context.fileTemplateId || context.fileId || baseSchema.fileTemplateId || baseSchema.fileId) || undefined,
    fileId: normalizeText(context.fileId || context.fileTemplateId || baseSchema.fileId || baseSchema.fileTemplateId) || undefined,
    pageNumber:
      Number.isFinite(context.pageNumber) && Number(context.pageNumber) > 0
        ? Math.trunc(Number(context.pageNumber))
        : baseSchema.pageNumber,
    ownerMode: context.ownerMode || baseSchema.ownerMode,
    ownerRecipientId:
      normalizeText(context.ownerRecipientId || baseSchema.ownerRecipientId) || undefined,
    ownerRecipientIds:
      context.ownerRecipientIds?.length
        ? context.ownerRecipientIds.filter(Boolean)
        : baseSchema.ownerRecipientIds,
    position: {
      x:
        Number.isFinite(context.position?.x) && Number(context.position?.x) >= 0
          ? Number(context.position?.x)
          : baseSchema.position?.x || 0,
      y:
        Number.isFinite(context.position?.y) && Number(context.position?.y) >= 0
          ? Number(context.position?.y)
          : baseSchema.position?.y || 0,
    },
  };

  return defaultSchema;
};

export const changeSchemas = (schemas: SchemaForUI[] = [], changes: ChangeSchemaItem[] = []) => {
  const nextSchemas = cloneDeep(schemas || []);
  const changeMap = new Map<string, ChangeSchemaItem[]>();

  (changes || []).forEach((change) => {
    const schemaId = normalizeText(change?.schemaId);
    if (!schemaId) return;
    if (!changeMap.has(schemaId)) changeMap.set(schemaId, []);
    changeMap.get(schemaId)?.push(change);
  });

  return nextSchemas.map((schema) => {
    const schemaId = normalizeText(schema.id || schema.schemaUid || schema.name);
    const schemaChanges = changeMap.get(schemaId);
    if (!schemaChanges?.length) return schema;

    const nextSchema = cloneDeep(schema) as unknown as Record<string, unknown>;
    schemaChanges.forEach((change) => {
      updateValueByPath(nextSchema, change.key, change.value);
    });
    return nextSchema as SchemaForUI;
  });
};

export const createSchemaBuilder = () => ({
  registerFieldPlugin,
  registerPlugins,
  getSchemaPluginByType,
  getSchemaDefinition,
  getSchemaFamily,
  getBuiltInFields,
  createDefaultSchema,
  generateUniqueSchemaName,
  validateSchemaNameUniqueness,
  changeSchemas,
  listDefinitions: () => listSchemaDefinitions(getAllRegisteredSchemaPlugins()),
  listPlugins: () => getAllRegisteredSchemaPlugins(),
});

const schemaFamilies = Object.freeze({
  normalize: normalizeSchemaFamily,
  resolve: resolveSchemaFamily,
  getPreset: getSchemaFamilyInspectorPreset,
  getTypePreset: getSchemaTypeInspectorPreset,
  createInspectorConfig: createSchemaInspectorConfig,
});

export {
  builtInPlugins,
  schemaPlugins,
  flatSchemaPlugins,
  builtInSchemaDefinitions,
  builtInSchemaDefinitionsByType,
  builtInFields,
  schemaFamilies,
  // schemas
  text,
  multiVariableText,
  image,
  svg,
  signature,
  table,
  barcodes,
  line,
  rectangle,
  ellipse,
  dateTime,
  date,
  time,
  select,
  radioGroup,
  checkbox,
};

export { createSchemaPlugin, renderLucideIcon as createLucideIcon, flattenSchemaPlugins, listSchemaDefinitions };
export { createSchemaInspectorConfig, normalizeSchemaFamily, resolveSchemaFamily, getSchemaFamilyInspectorPreset, getSchemaTypeInspectorPreset };
export type {
  SchemaDefinition,
  SchemaPluginWithMetadata,
  SchemaCapability,
  SchemaPluginMap,
  SchemaPluginEntry,
} from './schemaBuilder.js';

// Export utility functions
export {
  getDynamicHeightsForTable
} from './tables/dynamicTemplate.js';

export {
  createSvgStr,
  isEditable,
  readFile,
  convertForPdfLayoutProps,
  rotatePoint,
  addAlphaToHex,
  hex2RgbColor,
  hex2PrintingColor,
} from './utils.js';
