import type {
  PluginActionDefinition,
  PluginFamilyDefinition,
  PluginStrategyDefinition,
  PropPanelInspectorConfig,
  PropPanelInspectorSectionKey,
  SchemaInspectorSection,
} from '@sisad-pdfme/common/types';

export type SchemaFamily = 'text' | 'mediaVisual' | 'boolean' | 'shapeBarcode' | 'table';
export type SchemaSemanticFamily =
  | 'text'
  | 'multiVariableText'
  | 'signature'
  | 'action'
  | 'table'
  | 'barcode'
  | 'boolean'
  | 'choice'
  | 'dateTime'
  | 'media'
  | 'shape';

type FamilyPreset = PluginFamilyDefinition & {
  visibleSections: SchemaInspectorSection[];
  propertyMap: Partial<Record<string, PropPanelInspectorSectionKey>>;
  supportsConnections: boolean;
  supportsCollaboration: boolean;
  supportsValidation: boolean;
};

type FamilyCapabilityKey =
  | 'supportsComments'
  | 'supportsLocking'
  | 'supportsPresence'
  | 'supportsConnections'
  | 'supportsCollaboration'
  | 'supportsValidation';

type FamilyPresetConfig = Omit<
  FamilyPreset,
  'visibleSections' | 'propertyMap' | 'supportedActions' | 'strategies' | FamilyCapabilityKey
> & Partial<Pick<FamilyPreset, FamilyCapabilityKey>> & {
  visibleSections: SchemaInspectorSection[];
  propertyMap?: Partial<Record<string, PropPanelInspectorSectionKey>>;
  supportedActions: Array<PluginActionDefinition['command']>;
  strategies: Array<PluginStrategyDefinition['type']>;
};

const TEXT_TYPES = new Set([
  'text', 'number', 'multivariabletext', 'select', 'dropdown',
  'date', 'time', 'datetime',
  'signature', 'initials', 'datesigned',
  'fullname', 'emailaddress', 'company', 'title',
  'attachment', 'note', 'approve', 'decline',
]);
const BOOLEAN_TYPES = new Set(['checkbox', 'radiogroup', 'checkboxgroup']);
const MEDIA_TYPES = new Set(['image', 'svg']);
const ACTION_TYPES = new Set(['attachment', 'note', 'approve', 'decline']);
const OPTION_TYPES = new Set(['select', 'dropdown', 'radiogroup', 'checkboxgroup']);
const DATE_TYPES = new Set(['date', 'time', 'datetime']);
const SIGNING_TYPES = new Set(['signature', 'initials', 'datesigned']);
const TEXTUAL_TYPES = new Set(['fullname', 'emailaddress', 'company', 'title']);

/**
 * Schema types that support inline content editing on the canvas.
 * Narrower than TEXT_TYPES — only types with a free-text `content` field.
 * Shared across canvasContextMenuActions, detailWidgets, and any consumer
 * that needs to decide whether to show an "Edit text" action.
 */
export const INLINE_EDITABLE_TEXT_TYPES: ReadonlySet<string> = new Set(['text', 'multivariabletext']);
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

const SEMANTIC_FAMILY_BY_TYPE: Record<string, SchemaSemanticFamily> = {
  multivariabletext: 'multiVariableText',
  signature: 'signature',
  initials: 'signature',
  datesigned: 'signature',
  fullname: 'text',
  emailaddress: 'text',
  company: 'text',
  title: 'text',
  attachment: 'action',
  note: 'action',
  approve: 'action',
  decline: 'action',
  select: 'choice',
  dropdown: 'choice',
  checkbox: 'boolean',
  radiogroup: 'choice',
  checkboxgroup: 'choice',
  date: 'dateTime',
  time: 'dateTime',
  datetime: 'dateTime',
  table: 'table',
};

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

const createFamilyPreset = ({
  visibleSections,
  propertyMap = {},
  supportedActions,
  strategies,
  supportsComments = true,
  supportsLocking = true,
  supportsPresence = true,
  supportsConnections = false,
  supportsCollaboration = true,
  supportsValidation = false,
  ...rest
}: FamilyPresetConfig): FamilyPreset => ({
  ...rest,
  visibleSections,
  propertyMap,
  supportedActions: createActions(supportedActions),
  strategies: createStrategies(strategies),
  supportsComments,
  supportsLocking,
  supportsPresence,
  supportsConnections,
  supportsCollaboration,
  supportsValidation,
});

const VISUAL_FIELD_ACTIONS: Array<PluginActionDefinition['command']> = [
  'resizeField',
  'moveField',
  'duplicateField',
  'deleteField',
  'changeColor',
  'addComment',
  'lockField',
  'unlockField',
];

const DATA_FIELD_ACTIONS: Array<PluginActionDefinition['command']> = [
  'renameVariable',
  ...VISUAL_FIELD_ACTIONS.slice(0, 5),
  'togglePersistence',
  'addComment',
  'resolveComment',
  'lockField',
  'unlockField',
];

const FAMILY_PRESETS: Record<SchemaFamily, FamilyPreset> = {
  text: createFamilyPreset({
    family: 'text',
    visibleSections: ['general', 'layout', 'data', 'style', 'connections', 'help', 'collaboration', 'validation', 'advanced', 'comments'],
    propertyMap: BASE_PROPERTY_MAP,
    supportedActions: ['editText', ...DATA_FIELD_ACTIONS],
    strategies: ['validation', 'prefill', 'persistence', 'comments', 'locking'],
    supportsConnections: true,
    supportsValidation: true,
  }),
  mediaVisual: createFamilyPreset({
    family: 'mediaVisual',
    visibleSections: ['general', 'layout', 'style', 'collaboration', 'comments', 'advanced'],
    propertyMap: BASE_PROPERTY_MAP,
    supportedActions: VISUAL_FIELD_ACTIONS,
    strategies: ['upload', 'comments', 'locking'],
  }),
  boolean: createFamilyPreset({
    family: 'boolean',
    visibleSections: ['general', 'layout', 'data', 'style', 'connections', 'help', 'collaboration', 'validation', 'advanced', 'comments'],
    propertyMap: BASE_PROPERTY_MAP,
    supportedActions: DATA_FIELD_ACTIONS,
    strategies: ['validation', 'prefill', 'persistence', 'comments', 'locking'],
    supportsConnections: true,
    supportsValidation: true,
  }),
  shapeBarcode: createFamilyPreset({
    family: 'shapeBarcode',
    visibleSections: ['general', 'layout', 'style', 'data', 'collaboration', 'comments', 'advanced'],
    propertyMap: BASE_PROPERTY_MAP,
    supportedActions: VISUAL_FIELD_ACTIONS,
    strategies: ['comments', 'locking'],
  }),
  table: createFamilyPreset({
    family: 'table',
    visibleSections: ['general', 'layout', 'data', 'style', 'connections', 'collaboration', 'advanced', 'comments'],
    propertyMap: BASE_PROPERTY_MAP,
    supportedActions: DATA_FIELD_ACTIONS,
    strategies: ['prefill', 'persistence', 'comments', 'locking'],
    supportsConnections: true,
  }),
};

const _TO_: Record<string, SchemaFamily | string> = {
  textual: 'text',
  media: 'mediaVisual',
  signature: 'text',
  choice: 'boolean',
  shape: 'shapeBarcode',
  barcode: 'shapeBarcode',
  table: 'table',
};

export const normalizeSchemaFamily = (family: string | SchemaFamily): SchemaFamily => {
  const key = String(family || '').trim();
  const v = key in _TO_ ? _TO_[key] : family;
  // Ensure we always return a valid SchemaFamily. If the mapping returns a
  // plain string (legacy), fall back to resolveSchemaFamily which knows how
  // to canonicalize by type. This keeps callers safe until all call-sites
  // migrate to SchemaFamily values.
  return (['text', 'mediaVisual', 'boolean', 'shapeBarcode', 'table'].includes(String(v))
    ? (v as SchemaFamily)
    : resolveSchemaFamily(String(v)));
};

export const resolveSchemaFamily = (schemaType: string): SchemaFamily => {
  const normalizedType = String(schemaType || '').trim().toLowerCase();
  if (TEXT_TYPES.has(normalizedType)) return 'text';
  if (BOOLEAN_TYPES.has(normalizedType)) return 'boolean';
  if (MEDIA_TYPES.has(normalizedType)) return 'mediaVisual';
  if (normalizedType === 'table') return 'table';
  if (SHAPE_BARCODE_TYPES.has(normalizedType)) return 'shapeBarcode';
  return 'text';
};

export const resolveSchemaSemanticFamily = (schemaType: string): SchemaSemanticFamily => {
  const normalizedType = String(schemaType || '').trim().toLowerCase();

  if (normalizedType in SEMANTIC_FAMILY_BY_TYPE) return SEMANTIC_FAMILY_BY_TYPE[normalizedType];
  if (ACTION_TYPES.has(normalizedType)) return 'action';
  if (OPTION_TYPES.has(normalizedType)) return 'choice';
  if (SIGNING_TYPES.has(normalizedType)) return 'signature';
  if (TEXTUAL_TYPES.has(normalizedType)) return 'text';
  if (DATE_TYPES.has(normalizedType)) return 'dateTime';
  if (normalizedType === 'checkbox') return 'boolean';
  if (MEDIA_TYPES.has(normalizedType)) return 'media';
  if (SHAPE_BARCODE_TYPES.has(normalizedType)) {
    return normalizedType.startsWith('qrcode') || normalizedType === 'japanpost' || normalizedType === 'ean13' || normalizedType === 'ean8' || normalizedType === 'code39' || normalizedType === 'code128' || normalizedType === 'nw7' || normalizedType === 'itf14' || normalizedType === 'upca' || normalizedType === 'upce' || normalizedType === 'gs1datamatrix' || normalizedType === 'pdf417' ? 'barcode' : 'shape';
  }

  return 'text';
};

/**
 * Familias del inspector derecho.
 *
 * Es la ÚNICA clasificación que decide qué secciones ve un schema en el
 * DetailView. No se confunde con `SchemaFamily` (que gobierna acciones y
 * estrategias de plugin) ni con `SchemaSemanticFamily` (etiquetado semántico):
 * se deriva de esta última para no reabrir una tercera lista de tipos.
 *
 * Contrato documentado en `docs/03-designer/12-inspector-taxonomy.md`.
 */
export type InspectorFamily = 'text-like' | 'choice' | 'signature' | 'action' | 'visual';

/** Familia semántica → familia de inspector. */
const INSPECTOR_FAMILY_BY_SEMANTIC: Record<SchemaSemanticFamily, InspectorFamily> = {
  text: 'text-like',
  multiVariableText: 'text-like',
  dateTime: 'text-like',
  choice: 'choice',
  boolean: 'choice',
  signature: 'signature',
  action: 'action',
  media: 'visual',
  shape: 'visual',
  barcode: 'visual',
  table: 'visual',
};

/**
 * Resuelve la familia de inspector de un tipo de schema.
 *
 * @param schemaType Tipo declarado por el plugin.
 * @returns Familia de inspector; `text-like` para tipos desconocidos.
 */
export const resolveInspectorFamily = (schemaType: string): InspectorFamily =>
  INSPECTOR_FAMILY_BY_SEMANTIC[resolveSchemaSemanticFamily(schemaType)] || 'text-like';

export const getSchemaFamilyInspectorPreset = (family: string | SchemaFamily): FamilyPreset => {
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
  family: string | SchemaFamily,
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
