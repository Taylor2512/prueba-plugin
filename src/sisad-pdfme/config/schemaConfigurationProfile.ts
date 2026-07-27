import { getSchemaInteractionCapabilities } from '../ui/components/Designer/shared/schemaInteractionCapabilities.js';
import {
  getDetailProfile,
  type CanonicalDetailSection,
} from '../ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.js';
import {
  getSchemaTypeInspectorPreset,
  resolveSchemaSemanticFamily,
  type SchemaSemanticFamily,
} from '../schemas/schemaFamilies.js';

export type SchemaConfigurationFamily =
  | 'text-like'
  | 'option-based'
  | 'signing-based'
  | 'action-based'
  | 'media'
  | 'barcodes'
  | 'tables'
  | 'shapes'
  | 'custom';

export type SchemaConfigurationProfile = {
  schemaType: string;
  family: SchemaConfigurationFamily;
  semanticFamily: SchemaSemanticFamily;
  catalog: {
    category: string;
    searchable: boolean;
    visibleByDefault: boolean;
  };
  canvas: ReturnType<typeof getSchemaInteractionCapabilities> & {
    customFallback: boolean;
  };
  inspector: {
    visibleSections: CanonicalDetailSection[];
    defaultOpenSections: CanonicalDetailSection[];
    supportsConnections: boolean;
    supportsCollaboration: boolean;
    supportsValidation: boolean;
  };
  inspectorPreset: ReturnType<typeof getSchemaTypeInspectorPreset>;
  runtime: {
    supported: boolean;
    editable: boolean;
    supportsConnections: boolean;
    supportsCollaboration: boolean;
    supportsValidation: boolean;
  };
  capabilities: {
    supportsInlineEdit: boolean;
    supportsOptions: boolean;
    supportsSigning: boolean;
    supportsActions: boolean;
    supportsMedia: boolean;
    supportsBarcode: boolean;
    supportsTable: boolean;
    supportsShape: boolean;
    requiresProvider: boolean;
    hasGroupFloatingAction: boolean;
  };
  configuration: {
    customFallback: boolean;
  };
};

const TEXT_LIKE_TYPES = new Set([
  'text',
  'number',
  'multivariabletext',
  'date',
  'datetime',
  'time',
  'fullname',
  'emailaddress',
  'company',
  'title',
]);

const OPTION_BASED_TYPES = new Set(['select', 'dropdown', 'radiogroup', 'checkboxgroup', 'checkbox']);
const SIGNING_TYPES = new Set(['signature', 'initials', 'datesigned']);
const ACTION_TYPES = new Set(['attachment', 'approve', 'decline', 'note']);
const MEDIA_TYPES = new Set(['image', 'svg']);
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
const SHAPE_TYPES = new Set(['line', 'rectangle', 'ellipse']);
const TABLE_TYPES = new Set(['table']);

const resolveSchemaConfigurationFamily = (schemaType: string): SchemaConfigurationFamily => {
  const normalized = String(schemaType || '').trim().toLowerCase();
  if (TABLE_TYPES.has(normalized)) return 'tables';
  if (ACTION_TYPES.has(normalized)) return 'action-based';
  if (SIGNING_TYPES.has(normalized)) return 'signing-based';
  if (MEDIA_TYPES.has(normalized)) return 'media';
  if (BARCODE_TYPES.has(normalized)) return 'barcodes';
  if (SHAPE_TYPES.has(normalized)) return 'shapes';
  if (OPTION_BASED_TYPES.has(normalized)) return 'option-based';
  if (TEXT_LIKE_TYPES.has(normalized)) return 'text-like';
  return 'custom';
};

const resolveCatalogCategory = (family: SchemaConfigurationFamily): string => {
  switch (family) {
    case 'text-like':
      return 'Texto';
    case 'option-based':
      return 'Selecciones';
    case 'signing-based':
      return 'Firmas';
    case 'action-based':
      return 'General';
    case 'media':
      return 'Imagen y medios';
    case 'barcodes':
      return 'QR y Códigos';
    case 'tables':
    case 'shapes':
      return 'Estructura';
    case 'custom':
    default:
      return 'General';
  }
};

export const createSchemaConfigurationProfile = (schemaType: string): SchemaConfigurationProfile => {
  const normalizedType = String(schemaType || '').trim().toLowerCase();
  const family = resolveSchemaConfigurationFamily(normalizedType);
  const semanticFamily = resolveSchemaSemanticFamily(normalizedType);
  const inspectorProfile = getDetailProfile(normalizedType);
  const inspectorPreset = getSchemaTypeInspectorPreset(normalizedType);
  const canvasCapabilities = getSchemaInteractionCapabilities(normalizedType);
  const customFallback = family === 'custom';

  return {
    schemaType: normalizedType,
    family,
    semanticFamily,
    catalog: {
      category: resolveCatalogCategory(family),
      searchable: true,
      visibleByDefault: true,
    },
    canvas: {
      ...canvasCapabilities,
      customFallback,
    },
    inspector: {
      visibleSections: inspectorProfile.visibleSections,
      defaultOpenSections: inspectorProfile.defaultOpenSections,
      supportsConnections: Boolean(inspectorPreset.supportsConnections),
      supportsCollaboration: Boolean(inspectorPreset.supportsCollaboration),
      supportsValidation: Boolean(inspectorPreset.supportsValidation),
    },
    inspectorPreset,
    runtime: {
      supported: true,
      editable: true,
      supportsConnections: Boolean(inspectorPreset.supportsConnections),
      supportsCollaboration: Boolean(inspectorPreset.supportsCollaboration),
      supportsValidation: Boolean(inspectorPreset.supportsValidation),
    },
    capabilities: {
      supportsInlineEdit: canvasCapabilities.canInlineEdit,
      supportsOptions: canvasCapabilities.isOptionBased,
      supportsSigning: family === 'signing-based',
      supportsActions: family === 'action-based',
      supportsMedia: family === 'media',
      supportsBarcode: family === 'barcodes',
      supportsTable: family === 'tables',
      supportsShape: family === 'shapes',
      requiresProvider: canvasCapabilities.requiresProvider,
      hasGroupFloatingAction: canvasCapabilities.hasGroupFloatingAction,
    },
    configuration: {
      customFallback,
    },
  };
};

export { resolveSchemaConfigurationFamily };
