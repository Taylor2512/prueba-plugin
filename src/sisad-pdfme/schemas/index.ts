import { cloneDeep, type ChangeSchemaItem, type Plugin, type Schema, type SchemaForUI } from '@sisad-pdfme/common';
import { normalizeLooseText } from '@sisad-pdfme/shared/text';
import multiVariableText from '@sisad-pdfme/schemas/multiVariableText';
import text from '@sisad-pdfme/schemas/text';
import number from '@sisad-pdfme/schemas/number';
import image from '@sisad-pdfme/schemas/graphics/image';
import svg from '@sisad-pdfme/schemas/graphics/svg';
import barcodes from '@sisad-pdfme/schemas/barcodes';
import line from '@sisad-pdfme/schemas/shapes/line';
import table from '@sisad-pdfme/schemas/tables';
import { rectangle, ellipse } from '@sisad-pdfme/schemas/shapes/rectAndEllipse';
import dateTime from '@sisad-pdfme/schemas/date/dateTime';
import date from '@sisad-pdfme/schemas/date/date';
import time from '@sisad-pdfme/schemas/date/time';
import select from '@sisad-pdfme/schemas/select';
import radioGroup from '@sisad-pdfme/schemas/radioGroup';
import checkbox from '@sisad-pdfme/schemas/checkbox';
import checkboxGroup from '@sisad-pdfme/schemas/checkboxGroup';
import signature from '@sisad-pdfme/schemas/signature';
import initials from '@sisad-pdfme/schemas/signature/initials';
import dateSigned from '@sisad-pdfme/schemas/signature/dateSigned';
import { fullName, emailAddress, company, title } from '@sisad-pdfme/schemas/textLike/textLikePresets';
import attachment from '@sisad-pdfme/schemas/actions/attachment';
import note from '@sisad-pdfme/schemas/actions/note';
import approve from '@sisad-pdfme/schemas/actions/approve';
import decline from '@sisad-pdfme/schemas/actions/decline';
import {
  flattenSchemaPlugins,
  buildSchemaDefinitionFromPlugin as getSchemaDefinitionFromPlugin,
  listSchemaDefinitions,
  createSchemaPlugin,
  renderLucideIcon,
} from '@sisad-pdfme/schemas/schemaBuilder';
import type { SchemaPluginMap, SchemaPluginWithMetadata } from '@sisad-pdfme/schemas/schemaBuilder';
import {
  createSchemaInspectorConfig,
  getSchemaFamilyInspectorPreset,
  getSchemaTypeInspectorPreset,
  normalizeSchemaFamily,
  resolveSchemaFamily,
} from '@sisad-pdfme/schemas/schemaFamilies';

const schemaPlugins: SchemaPluginMap = {
  text,
  multiVariableText,
  image,
  svg,
  signature,
  initials,
  dateSigned,
  fullName,
  emailAddress,
  company,
  title,
  table,
  barcodes,
  line,
  rectangle,
  ellipse,
  dateTime,
  date,
  time,
  number,
  select,
  radioGroup,
  checkbox,
  checkboxGroup,
  attachment,
  note,
  approve,
  decline,
};

const flatSchemaPlugins = flattenSchemaPlugins(schemaPlugins);
const builtInPlugins = flatSchemaPlugins;
const builtInSchemaDefinitions = listSchemaDefinitions(schemaPlugins);
const builtInTypeAliases: Record<string, string[]> = {
  select: ['dropdown'],
};
const builtInSchemaDefinitionsByType = Object.fromEntries(
  builtInSchemaDefinitions.flatMap((definition) => {
    const normalizedType = String(definition.type || '').trim().toLowerCase();
    const aliases = builtInTypeAliases[normalizedType] || [];
    return [
      [definition.type, definition],
      [normalizedType, definition],
      ...aliases.map((alias) => [alias, definition] as const),
    ];
  }),
);
const builtInFields = builtInSchemaDefinitions;
const registeredSchemaPlugins = new Map<string, Plugin<Schema>>();

const normalizeSchemaText = normalizeLooseText;
const normalizeSchemaType = (value: unknown) => normalizeSchemaText(value).toLowerCase();

const getAllRegisteredSchemaPlugins = () => ({
  ...Object.entries(flatSchemaPlugins).reduce<Record<string, Plugin<Schema>>>((acc, [key, plugin]) => {
    acc[key] = plugin;
    acc[normalizeSchemaType(key)] = plugin;
    return acc;
  }, {}),
  ...Object.entries(builtInTypeAliases).reduce<Record<string, Plugin<Schema>>>((acc, [primaryType, aliases]) => {
    const plugin = flatSchemaPlugins[primaryType] || flatSchemaPlugins[normalizeSchemaType(primaryType)];
    if (!plugin) return acc;
    aliases.forEach((alias) => {
      acc[alias] = plugin;
    });
    return acc;
  }, {}),
  ...Object.fromEntries(registeredSchemaPlugins.entries()),
});

const getDefinitionFromType = (type: string) => {
  const normalizedType = normalizeSchemaType(type);
  if (!normalizedType) return null;
  if (builtInSchemaDefinitionsByType[normalizedType]) return builtInSchemaDefinitionsByType[normalizedType];
  const pluginMap = getAllRegisteredSchemaPlugins();
  const exactPlugin = pluginMap[type] || pluginMap[normalizedType];
  if (exactPlugin) return getSchemaDefinitionFromPlugin(exactPlugin as SchemaPluginWithMetadata<Schema>);
  const match = Object.entries(pluginMap).find(([key]) => normalizeSchemaType(key) === normalizedType)?.[1];
  return match ? getSchemaDefinitionFromPlugin(match as SchemaPluginWithMetadata<Schema>) : null;
};

const createSchemaUid = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `schema-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const flattenSchemaList = (schemas: Schema[] | Schema[][] = []) =>
  Array.isArray(schemas[0]) ? (schemas as Schema[][]).flat() : (schemas as Schema[]);

const normalizeFieldName = (value: unknown, fallback = 'field') => normalizeSchemaText(value) || fallback;

const updateValueByPath = (target: Record<string, unknown>, key: string, value: unknown) => {
  const path = normalizeSchemaText(key);
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
      .map((schema) => normalizeSchemaText(schema?.name).toLowerCase())
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
  const normalizedName = normalizeSchemaText(name).toLowerCase();
  if (!normalizedName) {
    return {
      isUnique: false,
      conflictSchemaUid: null,
      normalizedName,
    };
  }

  const schema = flattenSchemaList(existingSchemas).find((item) => {
    const sameName = normalizeSchemaText(item?.name).toLowerCase() === normalizedName;
    const ignored = ignoredSchemaUid && normalizeSchemaText(item?.schemaUid || item?.name) === normalizeSchemaText(ignoredSchemaUid);
    return sameName && !ignored;
  });

  return {
    isUnique: !schema,
    conflictSchemaUid: schema ? normalizeSchemaText(schema.schemaUid || schema.name) || null : null,
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

  const schemaUid = normalizeSchemaText(context.schemaUid) || normalizeSchemaText(baseSchema.schemaUid) || createSchemaUid();
  const id = normalizeSchemaText(context.id) || schemaUid;
  const existingSchemas = flattenSchemaList(context.existingSchemas || []);

  const defaultSchema: SchemaForUI = {
    ...(baseSchema as SchemaForUI),
    id,
    schemaUid,
    type: baseSchema.type || type,
    name: generateUniqueSchemaName(baseSchema.name || type, existingSchemas),
    fileTemplateId: normalizeSchemaText(context.fileTemplateId || context.fileId || baseSchema.fileTemplateId || baseSchema.fileId) || undefined,
    fileId: normalizeSchemaText(context.fileId || context.fileTemplateId || baseSchema.fileId || baseSchema.fileTemplateId) || undefined,
    pageNumber:
      Number.isFinite(context.pageNumber) && Number(context.pageNumber) > 0
        ? Math.trunc(Number(context.pageNumber))
        : baseSchema.pageNumber,
    ownerMode: context.ownerMode || baseSchema.ownerMode,
    ownerRecipientId:
      normalizeSchemaText(context.ownerRecipientId || baseSchema.ownerRecipientId) || undefined,
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
    const schemaId = normalizeSchemaText(change?.schemaId);
    if (!schemaId) return;
    if (!changeMap.has(schemaId)) changeMap.set(schemaId, []);
    changeMap.get(schemaId)?.push(change);
  });

  return nextSchemas.map((schema) => {
    const schemaId = normalizeSchemaText(schema.id || schema.schemaUid || schema.name);
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
  number,
  image,
  svg,
  signature,
  initials,
  dateSigned,
  fullName,
  emailAddress,
  company,
  title,
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
  checkboxGroup,
  attachment,
  note,
  approve,
  decline,
};

export { createSchemaPlugin, renderLucideIcon as createLucideIcon, flattenSchemaPlugins, listSchemaDefinitions };
export { createSchemaInspectorConfig, normalizeSchemaFamily, resolveSchemaFamily, getSchemaFamilyInspectorPreset, getSchemaTypeInspectorPreset };
export {
  isOptionGroupSchema,
  isCheckboxGroupSchema,
  isRadioGroupSchema,
  isSelectSchema,
  isOptionBasedSchema,
  isCheckboxSchema,
  isActionSchema,
  isSigningSchema,
  isTextLikeSchema,
  isRawOptionItem,
  getSchemaOptions,
  resolveSchemaIdByIdentity,
} from '@sisad-pdfme/schemas/shared/schemaGuards';
export type {
  MinimalSchema,
  OptionGroupSchemaLike,
  CheckboxGroupSchemaLike,
  RadioGroupSchemaLike,
  ActionKind,
  SigningKind,
  TextLikeKind,
  RawOptionItem,
  SchemaIdentityLike,
} from '@sisad-pdfme/schemas/shared/schemaGuards';
export type {
  SchemaDefinition,
  SchemaPluginWithMetadata,
  SchemaCapability,
  SchemaPluginMap,
  SchemaPluginEntry,
} from '@sisad-pdfme/schemas/schemaBuilder';

// Export utility functions
export {
  getDynamicHeightsForTable
} from '@sisad-pdfme/schemas/tables/dynamicTemplate';

// Compact designer geometry helpers for option-based groups (radio/checkbox),
// so callers can size a group's width/height to its option count.
export {
  optionGroupDesignerWidthMM,
  optionGroupDesignerHeightMM,
} from '@sisad-pdfme/schemas/options/optionGroupLayout';

export {
  createSvgStr,
  isEditable,
  readFile,
  convertForPdfLayoutProps,
  rotatePoint,
  addAlphaToHex,
  hex2RgbColor,
  hex2PrintingColor,
} from '@sisad-pdfme/schemas/utils';
