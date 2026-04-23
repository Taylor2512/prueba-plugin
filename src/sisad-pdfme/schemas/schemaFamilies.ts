import type {
  PluginActionDefinition,
  PluginFamilyDefinition,
  PluginStrategyDefinition,
  PropPanelInspectorConfig,
  PropPanelInspectorSectionKey,
  SchemaInspectorSection,
} from '../common/types.js';

export type SchemaFamily = 'text' | 'mediaVisual' | 'boolean' | 'shapeBarcode' | 'table';
export type LegacySchemaFamily = 'textual' | 'media' | 'signature' | 'choice' | 'shape' | 'barcode' | 'table';

type FamilyPreset = PluginFamilyDefinition & {
  visibleSections: SchemaInspectorSection[];
  propertyMap: Partial<Record<string, PropPanelInspectorSectionKey>>;
  supportsConnections: boolean;
  supportsCollaboration: boolean;
  supportsValidation: boolean;
};

const TEXT_TYPES = new Set(['text', 'multivariabletext', 'select', 'date', 'time', 'datetime', 'signature']);
const BOOLEAN_TYPES = new Set(['checkbox', 'radiogroup']);
const MEDIA_TYPES = new Set(['image', 'svg']);
const SHAPE_BARCODE_TYPES = new Set([
  'line',
  'rectangle',
  'ellipse',
  'qrcode',
  'japanpost',
  'ean13',
  'ean8',
  'code39',
  'code128',
  'nw7',
  'itf14',
  'upca',
  'upce',
  'gs1datamatrix',
  'pdf417',
]);

const BASE_PROPERTY_MAP: Partial<Record<string, PropPanelInspectorSectionKey>> = {
  align: 'layout',
  formatter: 'style',
  fontName: 'style',
  fontSize: 'style',
  characterSpacing: 'style',
  lineHeight: 'style',
  useDynamicFontSize: 'style',
  dynamicFontSize: 'style',
  fontColor: 'style',
  textColor: 'style',
  backgroundColor: 'style',
  strokeColor: 'style',
  borderColor: 'style',
  borderWidth: 'style',
  color: 'style',
  radius: 'style',
  barColor: 'style',
  tableStyles: 'style',
  headStyles: 'style',
  bodyStyles: 'style',
  columnStyles: 'style',
  format: 'data',
  locale: 'data',
  optionsContainer: 'data',
  group: 'data',
  placeholderText: 'data',
  showHead: 'data',
  repeatHead: 'data',
  includetext: 'data',
};

const createActions = (ids: Array<PluginActionDefinition['command']>): PluginActionDefinition[] =>
  ids.map((command) => ({
    id: command,
    command,
    label: command,
    placement: ['toolbar', 'context-menu', 'inspector'],
  }));

const createStrategies = (types: Array<PluginStrategyDefinition['type']>): PluginStrategyDefinition[] =>
  types.map((type) => ({
    id: type,
    type,
    label: type,
  }));

const FAMILY_PRESETS: Record<SchemaFamily, FamilyPreset> = {
  text: {
    family: 'text',
    visibleSections: ['general', 'layout', 'data', 'style', 'connections', 'collaboration', 'validation', 'advanced', 'comments'],
    propertyMap: BASE_PROPERTY_MAP,
    supportedActions: createActions([
      'editText',
      'renameVariable',
      'resizeField',
      'moveField',
      'duplicateField',
      'deleteField',
      'changeColor',
      'togglePersistence',
      'addComment',
      'resolveComment',
      'lockField',
      'unlockField',
    ]),
    strategies: createStrategies(['validation', 'prefill', 'persistence', 'comments', 'locking']),
    supportsComments: true,
    supportsLocking: true,
    supportsPresence: true,
    supportsConnections: true,
    supportsCollaboration: true,
    supportsValidation: true,
  },
  mediaVisual: {
    family: 'mediaVisual',
    visibleSections: ['general', 'layout', 'style', 'collaboration', 'advanced'],
    propertyMap: BASE_PROPERTY_MAP,
    supportedActions: createActions([
      'resizeField',
      'moveField',
      'duplicateField',
      'deleteField',
      'changeColor',
      'addComment',
      'lockField',
      'unlockField',
    ]),
    strategies: createStrategies(['upload', 'comments', 'locking']),
    supportsComments: true,
    supportsLocking: true,
    supportsPresence: true,
    supportsConnections: false,
    supportsCollaboration: true,
    supportsValidation: false,
  },
  boolean: {
    family: 'boolean',
    visibleSections: ['general', 'layout', 'data', 'style', 'connections', 'collaboration', 'validation', 'advanced', 'comments'],
    propertyMap: BASE_PROPERTY_MAP,
    supportedActions: createActions([
      'renameVariable',
      'resizeField',
      'moveField',
      'duplicateField',
      'deleteField',
      'changeColor',
      'togglePersistence',
      'addComment',
      'resolveComment',
      'lockField',
      'unlockField',
    ]),
    strategies: createStrategies(['validation', 'prefill', 'persistence', 'comments', 'locking']),
    supportsComments: true,
    supportsLocking: true,
    supportsPresence: true,
    supportsConnections: true,
    supportsCollaboration: true,
    supportsValidation: true,
  },
  shapeBarcode: {
    family: 'shapeBarcode',
    visibleSections: ['general', 'layout', 'style', 'data', 'advanced', 'collaboration'],
    propertyMap: BASE_PROPERTY_MAP,
    supportedActions: createActions([
      'resizeField',
      'moveField',
      'duplicateField',
      'deleteField',
      'changeColor',
      'addComment',
      'lockField',
      'unlockField',
    ]),
    strategies: createStrategies(['comments', 'locking']),
    supportsComments: true,
    supportsLocking: true,
    supportsPresence: true,
    supportsConnections: false,
    supportsCollaboration: true,
    supportsValidation: false,
  },
  table: {
    family: 'table',
    visibleSections: ['general', 'layout', 'data', 'style', 'connections', 'collaboration', 'advanced', 'comments'],
    propertyMap: BASE_PROPERTY_MAP,
    supportedActions: createActions([
      'renameVariable',
      'resizeField',
      'moveField',
      'duplicateField',
      'deleteField',
      'changeColor',
      'togglePersistence',
      'addComment',
      'resolveComment',
      'lockField',
      'unlockField',
    ]),
    strategies: createStrategies(['prefill', 'persistence', 'comments', 'locking']),
    supportsComments: true,
    supportsLocking: true,
    supportsPresence: true,
    supportsConnections: true,
    supportsCollaboration: true,
    supportsValidation: false,
  },
};

const LEGACY_TO_CANONICAL: Record<LegacySchemaFamily, SchemaFamily> = {
  textual: 'text',
  media: 'mediaVisual',
  signature: 'text',
  choice: 'boolean',
  shape: 'shapeBarcode',
  barcode: 'shapeBarcode',
  table: 'table',
};

export const normalizeSchemaFamily = (family: SchemaFamily | LegacySchemaFamily): SchemaFamily =>
  family in LEGACY_TO_CANONICAL ? LEGACY_TO_CANONICAL[family as LegacySchemaFamily] : (family as SchemaFamily);

export const resolveSchemaFamily = (schemaType: string): SchemaFamily => {
  const normalizedType = String(schemaType || '').trim().toLowerCase();
  if (TEXT_TYPES.has(normalizedType)) return 'text';
  if (BOOLEAN_TYPES.has(normalizedType)) return 'boolean';
  if (MEDIA_TYPES.has(normalizedType)) return 'mediaVisual';
  if (normalizedType === 'table') return 'table';
  if (SHAPE_BARCODE_TYPES.has(normalizedType)) return 'shapeBarcode';
  return 'text';
};

export const getSchemaFamilyInspectorPreset = (family: SchemaFamily | LegacySchemaFamily): FamilyPreset => {
  const normalized = normalizeSchemaFamily(family);
  const preset = FAMILY_PRESETS[normalized];
  return {
    ...preset,
    visibleSections: [...preset.visibleSections],
    propertyMap: { ...preset.propertyMap },
    supportedActions: preset.supportedActions.map((action) => ({ ...action, placement: [...(action.placement || [])] })),
    strategies: preset.strategies.map((strategy) => ({ ...strategy })),
  };
};

export const getSchemaTypeInspectorPreset = (schemaType: string): FamilyPreset =>
  getSchemaFamilyInspectorPreset(resolveSchemaFamily(schemaType));

export const createSchemaInspectorConfig = (
  family: SchemaFamily | LegacySchemaFamily,
  overrides: PropPanelInspectorConfig = {},
): PropPanelInspectorConfig => {
  const preset = getSchemaFamilyInspectorPreset(family);
  const overridePropertyMap = overrides.propertyMap || overrides.fieldSections || {};

  return {
    visibleSections: overrides.visibleSections?.length ? [...overrides.visibleSections] : [...preset.visibleSections],
    propertyMap: {
      ...preset.propertyMap,
      ...overridePropertyMap,
    },
    supportedActions: overrides.supportedActions?.length ? overrides.supportedActions : preset.supportedActions,
    strategies: overrides.strategies?.length ? overrides.strategies : preset.strategies,
    supportsConnections: overrides.supportsConnections ?? overrides.includeConnections ?? preset.supportsConnections,
    supportsCollaboration:
      overrides.supportsCollaboration ?? overrides.includeCollaboration ?? preset.supportsCollaboration,
    supportsValidation: overrides.supportsValidation ?? overrides.includeValidation ?? preset.supportsValidation,
  };
};
