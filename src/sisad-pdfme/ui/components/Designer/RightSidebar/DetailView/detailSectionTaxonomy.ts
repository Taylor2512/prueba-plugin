/**
 * detailSectionTaxonomy — taxonomía canónica de secciones del DetailView.
 *
 * Mapea nombres legacy a secciones actuales, define orden/labels y decide si una
 * sección debe renderizarse según tipo de schema, familia semántica, campos,
 * widgets y señales de contenido real.
 */
import type { SchemaForUI } from '@sisad-pdfme/common';
import type { SchemaSemanticFamily } from '../../../../../schemas/schemaFamilies.js';
import { asRecord, isRecord } from '../../shared/objectGuards.js';

/**
 * Secciones canónicas actuales del DetailView.
 */
export type CanonicalDetailSection =
  | 'identity'
  | 'options'
  | 'validation'
  | 'behavior'
  | 'box'
  | 'appearance'
  | 'help'
  | 'dataBindings'
  | 'collaboration'
  | 'comments'
  | 'advanced';

/**
 * Secciones legacy aceptadas para compatibilidad con plugins existentes.
 */
export type LegacyDetailSection =
  | 'general'
  | 'options'
  | 'layout'
  | 'style'
  | 'data'
  | 'connections'
  | 'help'
  | 'validation'
  | 'collaboration'
  | 'comments'
  | 'advanced';

/**
 * Mapa de normalización desde secciones legacy a secciones canónicas.
 */
export const LEGACY_TO_CANONICAL_DETAIL_SECTION = {
  general: 'identity',
  options: 'options',
  layout: 'box',
  style: 'appearance',
  data: 'behavior',
  connections: 'dataBindings',
  help: 'help',
  validation: 'behavior',
  collaboration: 'collaboration',
  comments: 'comments',
  advanced: 'advanced',
} as const satisfies Record<LegacyDetailSection, CanonicalDetailSection>;

/**
 * Orden visual estable del inspector.
 */
export const CANONICAL_DETAIL_SECTION_ORDER = [
  'identity',
  'options',
  'validation',
  'behavior',
  'box',
  'appearance',
  'help',
  'dataBindings',
  'collaboration',
  'comments',
  'advanced',
] as const satisfies readonly CanonicalDetailSection[];

/**
 * Labels y descripciones por sección canónica.
 */
export const CANONICAL_DETAIL_SECTION_LABELS: Record<CanonicalDetailSection, { title: string; description: string; defaultCollapsed?: boolean }> = {
  identity: {
    title: 'Información del campo',
    description: 'Nombre visible y metadatos.',
    defaultCollapsed: false,
  },
  options: {
    title: 'Opciones',
    description: 'Valores, orden y selección del campo.',
    defaultCollapsed: true,
  },
  validation: {
    title: 'Reglas de llenado',
    description: 'Reglas y restricciones del valor.',
    defaultCollapsed: true,
  },
  box: {
    title: 'Ubicación y tamaño',
    description: 'Posición, tamaño y rotación.',
    defaultCollapsed: false,
  },
  appearance: {
    title: 'Formato',
    description: 'Estilo visual y opacidad.',
    defaultCollapsed: true,
  },
  behavior: {
    title: 'Interacción',
    description: 'Edición y visibilidad.',
    defaultCollapsed: true,
  },
  help: {
    title: 'Ayuda del campo',
    description: 'Texto de ayuda y descripción.',
    defaultCollapsed: true,
  },
  dataBindings: {
    title: 'Datos y conexiones',
    description: 'Persistencia, JSON y API.',
    defaultCollapsed: true,
  },
  collaboration: {
    title: 'Asignación y bloqueo',
    description: 'Propietario y acceso.',
    defaultCollapsed: true,
  },
  comments: {
    title: 'Comentarios',
    description: 'Hilos y referencias.',
    defaultCollapsed: true,
  },
  advanced: {
    title: 'Técnico',
    description: 'IDs y metadata de depuración.',
    defaultCollapsed: true,
  },
};

const normalizeSchemaType = (schemaType?: string) => normalizeText(schemaType);
const EMPTY_TEXT_VALUES = new Set(['', '-', '—', '–', 'n/a', 'na', 'null', 'undefined']);

const isMeaningfulInspectorText = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.some((entry) => isMeaningfulInspectorText(entry));
  }

  if (isRecord(value)) {
    return Object.values(value).some((entry) => isMeaningfulInspectorText(entry));
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return true;
  }

  if (typeof value !== 'string') {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 && !EMPTY_TEXT_VALUES.has(normalized);
};

const OPTION_BASED_TYPES = new Set(['select', 'dropdown', 'radiogroup', 'checkboxgroup']);
const CHECKBOX_TYPES = new Set(['checkbox']);
const TEXT_LIKE_TYPES = new Set([
  'text',
  'multivariabletext',
  'fullname',
  'emailaddress',
  'company',
  'title',
]);
const NUMBER_LIKE_TYPES = new Set(['number']);
const SIGNING_TYPES = new Set(['signature', 'initials', 'datesigned']);
const ACTION_TYPES = new Set(['attachment', 'approve', 'decline', 'note']);

/**
 * Perfil de visibilidad del inspector para un tipo de schema.
 */
export type DetailProfile = {
  schemaType: string;
  visibleSections: CanonicalDetailSection[];
  defaultOpenSections: CanonicalDetailSection[];
};

/**
 * Factory de perfil de detalle.
 */
const createDetailProfile = (schemaType: string, visibleSections: CanonicalDetailSection[], defaultOpenSections: CanonicalDetailSection[]): DetailProfile => ({
  schemaType,
  visibleSections,
  defaultOpenSections,
});

const DEFAULT_DETAIL_SECTION_VISIBILITY: CanonicalDetailSection[] = [
  'identity',
  'box',
  'appearance',
  'behavior',
  'help',
  'dataBindings',
  'collaboration',
  'comments',
  'advanced',
];

/**
 * Resuelve el perfil de secciones visibles y abiertas por defecto.
 *
 * @param schemaType Tipo del schema activo.
 * @returns Perfil canónico de detalle.
 */
export const getDetailProfile = (schemaType: string): DetailProfile => {
  const normalized = normalizeSchemaType(schemaType);

  if (normalized === 'attachment') {
    return createDetailProfile(normalized, ['identity', 'behavior', 'box', 'dataBindings', 'help', 'collaboration', 'advanced'], ['identity', 'behavior', 'box']);
  }

  if (normalized === 'approve' || normalized === 'decline') {
    return createDetailProfile(normalized, ['identity', 'behavior', 'box', 'collaboration', 'advanced'], ['identity', 'behavior', 'box']);
  }

  if (normalized === 'note') {
    return createDetailProfile(normalized, ['identity', 'behavior', 'box', 'appearance', 'help', 'advanced'], ['identity', 'behavior', 'box']);
  }

  if (OPTION_BASED_TYPES.has(normalized)) {
    return createDetailProfile(normalized, ['identity', 'options', 'validation', 'behavior', 'box', 'dataBindings', 'appearance', 'help', 'collaboration', 'comments', 'advanced'], ['identity', 'options']);
  }

  if (CHECKBOX_TYPES.has(normalized)) {
    return createDetailProfile(normalized, ['identity', 'validation', 'behavior', 'box', 'appearance', 'dataBindings', 'help', 'collaboration', 'comments', 'advanced'], ['identity', 'validation', 'behavior']);
  }

  if (TEXT_LIKE_TYPES.has(normalized) || NUMBER_LIKE_TYPES.has(normalized)) {
    return createDetailProfile(normalized, ['identity', 'validation', 'behavior', 'box', 'appearance', 'dataBindings', 'help', 'collaboration', 'comments', 'advanced'], ['identity', 'validation', 'behavior']);
  }

  if (SIGNING_TYPES.has(normalized)) {
    return createDetailProfile(normalized, ['identity', 'behavior', 'box', 'collaboration', 'help', 'comments', 'advanced'], ['identity', 'behavior']);
  }

  if (ACTION_TYPES.has(normalized)) {
    return createDetailProfile(normalized, ['identity', 'behavior', 'box', 'collaboration', 'advanced'], ['identity', 'behavior', 'box']);
  }

  return createDetailProfile(normalized, [...DEFAULT_DETAIL_SECTION_VISIBILITY], ['identity', 'box']);
};

/** Devuelve secciones abiertas por defecto para un tipo de schema. */
export const getDefaultOpenSections = (schemaType: string): CanonicalDetailSection[] => {
  return getDetailProfile(schemaType).defaultOpenSections;
};

/** Devuelve secciones visibles para un tipo de schema. */
export const getVisibleDetailSections = (schemaType: string): CanonicalDetailSection[] => {
  return getDetailProfile(schemaType).visibleSections;
};

/**
 * Decide si una sección debe iniciar colapsada según sección y familia.
 */
export const resolveDetailSectionDefaultCollapsed = (
  section: CanonicalDetailSection,
  semanticFamily?: SchemaSemanticFamily | string,
): boolean => {
  const baseCollapsed = Boolean(CANONICAL_DETAIL_SECTION_LABELS[section]?.defaultCollapsed);
  const normalizedFamily = normalizeText(semanticFamily);

  if (section === 'identity') return false;
  if (section === 'options') return false;
  if (section === 'validation') return baseCollapsed;
  if (section === 'behavior') {
    const keepBehaviorExpanded = new Set(['text', 'multivariabletext', 'signature', 'choice', 'boolean', 'datetime', 'number']);
    return !keepBehaviorExpanded.has(normalizedFamily);
  }
  if (section === 'box') return false;
  return baseCollapsed;
};

/** Entrada flexible de campo usada por reglas de visibilidad. */
type FieldLike =
  | string
  | [string, unknown]
  | {
      key?: string;
      widget?: string;
      type?: string;
      hidden?: boolean;
      disabled?: boolean;
      schema?: unknown;
    };

/** Campo normalizado para reglas internas de sección. */
type NormalizedField = {
  key: string;
  hidden: boolean;
  disabled: boolean;
  widget: string;
  schema?: unknown;
};

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

/** Normaliza diferentes formas de campo a un contrato uniforme. */
const normalizeFieldEntry = (field: FieldLike): NormalizedField => {
  if (typeof field === 'string') {
    return { key: normalizeText(field), hidden: false, disabled: false, widget: '' };
  }

  if (Array.isArray(field)) {
    const [key, schema] = field;
    return {
      key: normalizeText(key),
      hidden: Boolean((schema as { hidden?: boolean } | undefined)?.hidden),
      disabled: Boolean((schema as { disabled?: boolean } | undefined)?.disabled),
      widget: normalizeText((schema as { widget?: string } | undefined)?.widget),
      schema,
    };
  }

  return {
    key: normalizeText(field.key),
    hidden: Boolean(field.hidden),
    disabled: Boolean(field.disabled),
    widget: normalizeText(field.widget),
    schema: field.schema,
  };
};

const fieldNames = (fields: FieldLike[] = []): NormalizedField[] => fields.map(normalizeFieldEntry).filter((field) => field.key && !field.hidden);

const getSchemaValue = (schema: SchemaForUI, key: string) => {
  const record = asRecord(schema);
  return record ? record[key] : undefined;
};

const hasDefinedSchemaValue = (schema: SchemaForUI, key: string) => {
  const value = getSchemaValue(schema, key);
  return value !== undefined && value !== null && value !== '';
};

const hasAnyValue = (schema: SchemaForUI, keys: string[]) => keys.some((key) => hasDefinedSchemaValue(schema, key));
const hasMeaningfulSchemaValue = (schema: SchemaForUI, keys: string[]) =>
  keys.some((key) => isMeaningfulInspectorText(getSchemaValue(schema, key)));

const hasWidget = (fields: FieldLike[], widgetNames: string[]) => fieldNames(fields).some((field) => widgetNames.includes(field.widget));

const hasField = (fields: FieldLike[], names: string[]) => fieldNames(fields).some((field) => names.includes(field.key));

const hasRenderableField = (fields: FieldLike[]) => fieldNames(fields).some((field) => !field.hidden && !field.disabled);

/**
 * Convierte una sección legacy o canónica a sección canónica.
 */
export const toCanonicalDetailSection = (section: string): CanonicalDetailSection | null => {
  const normalized = normalizeText(section) as LegacyDetailSection | CanonicalDetailSection;
  if (!normalized) return null;
  if ((CANONICAL_DETAIL_SECTION_ORDER as readonly string[]).includes(normalized)) {
    return normalized as CanonicalDetailSection;
  }
  return LEGACY_TO_CANONICAL_DETAIL_SECTION[normalized as LegacyDetailSection] || null;
};

/** Ordena y deduplica secciones según el orden canónico. */
export const sortCanonicalDetailSections = (sections: CanonicalDetailSection[]) =>
  [...new Set(sections)].sort(
    (left, right) => CANONICAL_DETAIL_SECTION_ORDER.indexOf(left) - CANONICAL_DETAIL_SECTION_ORDER.indexOf(right),
  );

/**
 * Determina si una sección debe renderizarse para el schema/contexto actual.
 *
 * @param params Contexto del schema, campos, widgets y señales de contenido.
 * @returns `true` si la sección contiene información o capacidades relevantes.
 */
export function shouldRenderDetailSection(params: {
  section: CanonicalDetailSection;
  legacySection?: LegacyDetailSection | string;
  schema: SchemaForUI | Record<string, unknown> | null | undefined;
  schemaType: string;
  semanticFamily?: SchemaSemanticFamily | string;
  fields?: FieldLike[];
  widgets?: Array<string | { name?: string; widget?: string }>;
    context?: {
      isMultiUser?: boolean;
      hasComments?: boolean;
      hasAnchors?: boolean;
      hasHelpContent?: boolean;
      hasCollaborationContent?: boolean;
      hasDataBindings?: boolean;
      hasAdvancedOverrides?: boolean;
      supportsComments?: boolean;
    supportsCollaboration?: boolean;
    supportsDataBindings?: boolean;
    supportsAppearance?: boolean;
    supportsBehavior?: boolean;
    supportsBox?: boolean;
  };
}): boolean {
  const { section, schema, fields = [], widgets = [], context = {} } = params;
  const entries = fieldNames(fields);
  const schemaObject = (isRecord(schema) ? schema : {}) as SchemaForUI;
  const hasVisibleFields = entries.some((field) => !field.disabled);
  const hasAnyFields = entries.length > 0;
  const widgetNames = widgets.map((widget) => normalizeText(typeof widget === 'string' ? widget : widget.name || widget.widget));

  if (section === 'identity') {
    return Boolean(schema);
  }

  if (section === 'options') {
    const optionFields = [
      'optionscontainer',
      'options',
      'defaultselectedoptionid',
      'selectedoptionid',
      'defaultvalue',
      'placeholder',
      'placeholdertext',
      'selectionmode',
      'orientation',
      'group',
      'groupname',
    ];
    return hasField(entries, optionFields) || hasWidget(fields, widgetNames) || hasAnyValue(schemaObject, ['options', 'optionsContainer', 'defaultSelectedOptionId', 'selectedOptionId', 'placeholder', 'placeholderText', 'selectionMode', 'orientation']);
  }

  if (section === 'validation') {
    const validationFields = ['required', 'validation', 'validation.type', 'validation.pattern', 'validation.message', 'min', 'max', 'minLength', 'maxLength', 'decimals'];
    return Boolean(context.supportsBehavior !== false) && (hasField(entries, validationFields) || hasAnyValue(schemaObject, ['required', 'validation', 'min', 'max', 'minLength', 'maxLength', 'decimals']));
  }

  if (section === 'box') {
    return Boolean(context.supportsBox !== false) && (hasAnyValue(schemaObject, ['position', 'width', 'height', 'rotate']) || hasField(entries, ['position', 'x', 'y', 'width', 'height', 'rotate']) || hasRenderableField(entries));
  }

  if (section === 'appearance') {
    const visualFields = [
      'align',
      'fontname',
      'fontsize',
      'characterspacing',
      'lineheight',
      'usedynamicfontsize',
      'dynamicfontsize',
      'fontcolor',
      'textcolor',
      'backgroundcolor',
      'strokecolor',
      'bordercolor',
      'borderwidth',
      'color',
      'radius',
      'barcolor',
      'tablestyles',
      'headstyles',
      'bodystyles',
      'columnstyles',
      'signaturedisplay',
      'signaturemode',
      'signatureproviderkey',
      'signatureproviderconfig',
      'placeholdertext',
      'optionscontainer',
    ];
    return Boolean(context.supportsAppearance !== false) && (hasField(entries, visualFields) || hasWidget(fields, widgetNames) || hasRenderableField(entries) || hasAnyValue(schemaObject, ['fontName', 'fontSize', 'fontColor', 'textColor', 'backgroundColor', 'strokeColor', 'borderColor', 'borderWidth', 'color', 'radius', 'barColor', 'tableStyles', 'headStyles', 'bodyStyles', 'columnStyles', 'signatureDisplay', 'signatureMode', 'signatureProviderKey', 'signatureProviderConfig', 'placeholderText', 'optionsContainer', 'opacity']));
  }

  if (section === 'behavior') {
    const behaviorFields = [
      'editable',
      'readonly',
      'readOnly',
      'locked',
      'restrictchanges',
      'restrictChanges',
      'format',
      'locale',
      'options',
      'group',
      'showhead',
      'repeathead',
      'includetext',
      'validation',
      'validation.type',
      'validation.pattern',
      'validation.message',
      'type',
      'placeholder',
      'defaultvalue',
      'defaultValue',
      'maxlength',
      'maxLength',
      'masked',
      'fixedwidth',
      'fixedWidth',
      'variables',
      'readvalue',
      'writevalue',
      'mandatory',
      'editablebysender',
      'editablebyrecipient',
    ];
    return Boolean(context.supportsBehavior !== false) && (hasField(entries, behaviorFields) || hasRenderableField(entries) || hasAnyValue(schemaObject, ['editable', 'readOnly', 'locked', 'format', 'locale', 'options', 'group']));
  }

  if (section === 'help') {
    return Boolean(context.hasHelpContent) && hasMeaningfulSchemaValue(schemaObject, ['tooltip', 'helpText', 'helptext', 'description', 'helpDescription']);
  }

  if (section === 'dataBindings') {
    const bindingFields = [
      'schemaconnections',
      'persistence',
      'api',
      'form',
      'prefill',
      'rootkey',
      'endpoint',
      'baseurl',
      'headers',
      'params',
      'storagekey',
      'requestmapping',
      'responsemapping',
      'mapping',
      // data label / integration fields
      'datalabel',
      'dataLabel',
      'tablabel',
      'tabLabel',
      'fieldkey',
      'fieldKey',
      'externalkey',
      'externalKey',
    ];
    return Boolean(context.hasDataBindings) && (hasField(entries, bindingFields) || hasWidget(fields, widgetNames) || hasAnyValue(schemaObject, ['schemaConnections', 'persistence', 'api', 'form', 'prefill', 'rootKey', 'endpoint', 'baseUrl', 'headers', 'params', 'storageKey', 'requestMapping', 'responseMapping', 'mapping', 'dataLabel', 'tabLabel', 'fieldKey']));
  }

  if (section === 'collaboration') {
    const collaborationFields = [
      'ownerrecipientid',
      'ownerrecipientids',
      'ownermode',
      'ownerrecipientname',
      'ownercolor',
      'usercolor',
      'createdby',
      'createdat',
      'lastmodifiedby',
      'lastmodifiedat',
      'lockedby',
      'lockedat',
      'state',
      'lock',
      'authorid',
      'authorname',
      'authorcolor',
    ];
    return Boolean(context.hasCollaborationContent || context.isMultiUser) && (hasField(entries, collaborationFields) || hasAnyValue(schemaObject, ['ownerRecipientId', 'ownerRecipientIds', 'ownerMode', 'ownerColor', 'userColor', 'lock', 'state', 'createdBy', 'lastModifiedBy']) || hasWidget(fields, widgetNames));
  }

  if (section === 'comments') {
    const commentCount = Number((schemaObject as { commentsCount?: number }).commentsCount || 0);
    const comments = (schemaObject as { comments?: unknown[] }).comments;
    const anchors = (schemaObject as { commentAnchors?: unknown[]; commentsAnchors?: unknown[] }).commentAnchors || (schemaObject as { commentsAnchors?: unknown[] }).commentsAnchors;
    const hasComments = Boolean(context.hasComments || context.hasAnchors || commentCount > 0 || (Array.isArray(comments) && comments.length > 0) || (Array.isArray(anchors) && anchors.length > 0));
    return hasComments;
  }

  if (section === 'advanced') {
    const advancedFields = ['schemauid', 'documentid', 'pagenumber', 'metadata', 'debug', '__designer'];
    return (
      Boolean(context.hasAdvancedOverrides) &&
      (hasMeaningfulSchemaValue(schemaObject, advancedFields) ||
        hasWidget(fields, widgetNames) ||
        hasAnyFields)
    );
  }

  return hasVisibleFields || hasAnyFields;
}
