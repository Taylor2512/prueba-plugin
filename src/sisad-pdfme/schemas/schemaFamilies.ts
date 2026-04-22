import type { PropPanelInspectorConfig, PropPanelInspectorSectionKey } from '@sisad-pdfme/common';

export type SchemaFamily = 'textual' | 'media' | 'signature' | 'choice' | 'shape' | 'barcode' | 'table';

type FamilyPreset = {
  visibleSections: PropPanelInspectorSectionKey[];
  propertyMap: Partial<Record<string, PropPanelInspectorSectionKey>>;
  supportsConnections: boolean;
  supportsCollaboration: boolean;
  supportsValidation: boolean;
};

const TEXTUAL_TYPES = new Set(['text', 'multiVariableText', 'select', 'date', 'time', 'dateTime']);
const CHOICE_TYPES = new Set(['checkbox', 'radioGroup']);
const MEDIA_TYPES = new Set(['image', 'svg']);
const SHAPE_TYPES = new Set(['line', 'rectangle', 'ellipse']);
const BARCODE_TYPES = new Set([
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

const FAMILY_PRESETS: Record<SchemaFamily, FamilyPreset> = {
  textual: {
    visibleSections: ['general', 'layout', 'style', 'data', 'connections', 'collaboration', 'validation', 'advanced'],
    propertyMap: BASE_PROPERTY_MAP,
    supportsConnections: true,
    supportsCollaboration: true,
    supportsValidation: true,
  },
  media: {
    visibleSections: ['general', 'layout', 'style', 'collaboration', 'advanced'],
    propertyMap: BASE_PROPERTY_MAP,
    supportsConnections: false,
    supportsCollaboration: true,
    supportsValidation: false,
  },
  signature: {
    visibleSections: ['general', 'layout', 'style', 'data', 'connections', 'collaboration', 'validation', 'advanced'],
    propertyMap: BASE_PROPERTY_MAP,
    supportsConnections: true,
    supportsCollaboration: true,
    supportsValidation: true,
  },
  choice: {
    visibleSections: ['general', 'layout', 'style', 'data', 'connections', 'collaboration', 'validation', 'advanced'],
    propertyMap: BASE_PROPERTY_MAP,
    supportsConnections: true,
    supportsCollaboration: true,
    supportsValidation: true,
  },
  shape: {
    visibleSections: ['general', 'layout', 'style', 'collaboration', 'advanced'],
    propertyMap: BASE_PROPERTY_MAP,
    supportsConnections: false,
    supportsCollaboration: true,
    supportsValidation: false,
  },
  barcode: {
    visibleSections: ['general', 'layout', 'style', 'data', 'collaboration', 'advanced'],
    propertyMap: BASE_PROPERTY_MAP,
    supportsConnections: false,
    supportsCollaboration: true,
    supportsValidation: false,
  },
  table: {
    visibleSections: ['general', 'layout', 'style', 'data', 'connections', 'collaboration', 'advanced'],
    propertyMap: BASE_PROPERTY_MAP,
    supportsConnections: true,
    supportsCollaboration: true,
    supportsValidation: false,
  },
};

export const resolveSchemaFamily = (schemaType: string): SchemaFamily => {
  if (TEXTUAL_TYPES.has(schemaType)) return 'textual';
  if (MEDIA_TYPES.has(schemaType)) return 'media';
  if (schemaType === 'signature') return 'signature';
  if (CHOICE_TYPES.has(schemaType)) return 'choice';
  if (SHAPE_TYPES.has(schemaType)) return 'shape';
  if (BARCODE_TYPES.has(schemaType)) return 'barcode';
  if (schemaType === 'table') return 'table';
  return 'textual';
};

export const getSchemaFamilyInspectorPreset = (family: SchemaFamily): FamilyPreset => {
  const preset = FAMILY_PRESETS[family];
  return {
    ...preset,
    visibleSections: [...preset.visibleSections],
    propertyMap: { ...preset.propertyMap },
  };
};

export const getSchemaTypeInspectorPreset = (schemaType: string): FamilyPreset =>
  getSchemaFamilyInspectorPreset(resolveSchemaFamily(schemaType));

export const createSchemaInspectorConfig = (
  family: SchemaFamily,
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
    supportsConnections: overrides.supportsConnections ?? overrides.includeConnections ?? preset.supportsConnections,
    supportsCollaboration:
      overrides.supportsCollaboration ?? overrides.includeCollaboration ?? preset.supportsCollaboration,
    supportsValidation: overrides.supportsValidation ?? overrides.includeValidation ?? preset.supportsValidation,
  };
};