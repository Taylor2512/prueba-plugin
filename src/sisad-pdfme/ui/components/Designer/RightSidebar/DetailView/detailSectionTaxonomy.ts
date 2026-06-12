import type { SchemaForUI } from '@sisad-pdfme/common';
import type { SchemaSemanticFamily } from '../../../../../schemas/schemaFamilies.js';

export type CanonicalDetailSection =
  | 'identity'
  | 'box'
  | 'appearance'
  | 'behavior'
  | 'help'
  | 'dataBindings'
  | 'collaboration'
  | 'comments'
  | 'advanced';

export type LegacyDetailSection =
  | 'general'
  | 'layout'
  | 'style'
  | 'data'
  | 'connections'
  | 'help'
  | 'validation'
  | 'collaboration'
  | 'comments'
  | 'advanced';

export const LEGACY_TO_CANONICAL_DETAIL_SECTION = {
  general: 'identity',
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

export const CANONICAL_DETAIL_SECTION_ORDER = [
  'identity',
  'box',
  'appearance',
  'behavior',
  'help',
  'dataBindings',
  'collaboration',
  'comments',
  'advanced',
] as const satisfies readonly CanonicalDetailSection[];

export const CANONICAL_DETAIL_SECTION_LABELS: Record<CanonicalDetailSection, { title: string; description: string; defaultCollapsed?: boolean }> = {
  identity: {
    title: 'Identidad',
    description: 'Nombre, identidad y metadatos esenciales.',
    defaultCollapsed: false,
  },
  box: {
    title: 'Caja',
    description: 'Posición, tamaño y orden espacial.',
    defaultCollapsed: false,
  },
  appearance: {
    title: 'Apariencia',
    description: 'Tratamiento visual específico de la familia.',
    defaultCollapsed: true,
  },
  behavior: {
    title: 'Comportamiento',
    description: 'Semántica, reglas y opciones del campo.',
    defaultCollapsed: true,
  },
  help: {
    title: 'Ayuda',
    description: 'Tooltips y textos de asistencia para el usuario.',
    defaultCollapsed: true,
  },
  dataBindings: {
    title: 'Datos conectados',
    description: 'Persistencia, JSON y API.',
    defaultCollapsed: true,
  },
  collaboration: {
    title: 'Colaboración',
    description: 'Owner, bloqueo y trazabilidad.',
    defaultCollapsed: true,
  },
  comments: {
    title: 'Comentarios',
    description: 'Hilos, anchors y navegación de revisión.',
    defaultCollapsed: true,
  },
  advanced: {
    title: 'Avanzado',
    description: 'Propiedades poco frecuentes o de bajo nivel.',
    defaultCollapsed: true,
  },
};

export const resolveDetailSectionDefaultCollapsed = (
  section: CanonicalDetailSection,
  semanticFamily?: SchemaSemanticFamily | string,
): boolean => {
  const baseCollapsed = Boolean(CANONICAL_DETAIL_SECTION_LABELS[section]?.defaultCollapsed);

  if (section === 'identity' || section === 'box') {
    return false;
  }

  if (section === 'behavior') {
    const normalizedFamily = normalizeText(semanticFamily);
    const keepBehaviorExpanded = new Set([
      'text',
      'multivariabletext',
      'signature',
      'table',
      'choice',
      'boolean',
      'datetime',
    ]);
    return !keepBehaviorExpanded.has(normalizedFamily);
  }

  return baseCollapsed;
};

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

type NormalizedField = {
  key: string;
  hidden: boolean;
  disabled: boolean;
  widget: string;
  schema?: unknown;
};

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

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

const getSchemaValue = (schema: SchemaForUI, key: string) => (schema as Record<string, unknown>)[key];

const hasDefinedSchemaValue = (schema: SchemaForUI, key: string) => {
  const value = getSchemaValue(schema, key);
  return value !== undefined && value !== null && value !== '';
};

const hasAnyValue = (schema: SchemaForUI, keys: string[]) => keys.some((key) => hasDefinedSchemaValue(schema, key));

const hasWidget = (fields: FieldLike[], widgetNames: string[]) => fieldNames(fields).some((field) => widgetNames.includes(field.widget));

const hasField = (fields: FieldLike[], names: string[]) => fieldNames(fields).some((field) => names.includes(field.key));

const hasRenderableField = (fields: FieldLike[]) => fieldNames(fields).some((field) => !field.hidden && !field.disabled);

export const toCanonicalDetailSection = (section: string): CanonicalDetailSection | null => {
  const normalized = normalizeText(section) as LegacyDetailSection | CanonicalDetailSection;
  if (!normalized) return null;
  if ((CANONICAL_DETAIL_SECTION_ORDER as readonly string[]).includes(normalized)) {
    return normalized as CanonicalDetailSection;
  }
  return LEGACY_TO_CANONICAL_DETAIL_SECTION[normalized as LegacyDetailSection] || null;
};

export const sortCanonicalDetailSections = (sections: CanonicalDetailSection[]) =>
  [...new Set(sections)].sort(
    (left, right) => CANONICAL_DETAIL_SECTION_ORDER.indexOf(left) - CANONICAL_DETAIL_SECTION_ORDER.indexOf(right),
  );

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
  const schemaObject = (schema || {}) as SchemaForUI & Record<string, unknown>;
  const hasVisibleFields = entries.some((field) => !field.disabled);
  const hasAnyFields = entries.length > 0;
  const widgetNames = widgets.map((widget) => normalizeText(typeof widget === 'string' ? widget : widget.name || widget.widget));

  if (section === 'identity') {
    return Boolean(schema);
  }

  if (section === 'box') {
    return Boolean(context.supportsBox !== false) && (hasAnyValue(schemaObject, ['position', 'width', 'height', 'rotate']) || hasField(entries, ['position', 'x', 'y', 'width', 'height']) || hasRenderableField(entries));
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
    return Boolean(context.supportsAppearance !== false) && (hasField(entries, visualFields) || hasWidget(fields, widgetNames) || hasRenderableField(entries) || hasAnyValue(schemaObject, ['fontName', 'fontSize', 'fontColor', 'textColor', 'backgroundColor', 'strokeColor', 'borderColor', 'borderWidth', 'color', 'radius', 'barColor', 'tableStyles', 'headStyles', 'bodyStyles', 'columnStyles', 'signatureDisplay', 'signatureMode', 'signatureProviderKey', 'signatureProviderConfig', 'placeholderText', 'optionsContainer']));
  }

  if (section === 'behavior') {
    const behaviorFields = [
      'editable',
      'readonly',
      'required',
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
    return Boolean(context.supportsBehavior !== false) && (hasField(entries, behaviorFields) || hasRenderableField(entries) || hasAnyValue(schemaObject, ['editable', 'readOnly', 'required', 'locked', 'format', 'locale', 'options', 'group', 'mandatory']));
  }

  if (section === 'help') {
    const helpKeys = ['tooltip', 'helptext', 'helpText'];
    return hasField(entries, helpKeys) || hasAnyValue(schemaObject, ['tooltip', 'helpText']);
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
    return hasField(entries, bindingFields) || hasWidget(fields, widgetNames) || hasAnyValue(schemaObject, ['schemaConnections', 'persistence', 'api', 'form', 'prefill', 'rootKey', 'endpoint', 'baseUrl', 'headers', 'params', 'storageKey', 'requestMapping', 'responseMapping', 'mapping', 'dataLabel', 'tabLabel', 'fieldKey']);
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
    return hasField(entries, collaborationFields) || hasAnyValue(schemaObject, ['ownerRecipientId', 'ownerRecipientIds', 'ownerMode', 'ownerColor', 'userColor', 'lock', 'state', 'createdBy', 'lastModifiedBy']) || hasWidget(fields, widgetNames) || Boolean(context.isMultiUser);
  }

  if (section === 'comments') {
    const commentCount = Number((schemaObject as { commentsCount?: number }).commentsCount || 0);
    const comments = (schemaObject as { comments?: unknown[] }).comments;
    const anchors = (schemaObject as { commentAnchors?: unknown[]; commentsAnchors?: unknown[] }).commentAnchors || (schemaObject as { commentsAnchors?: unknown[] }).commentsAnchors;
    const hasComments = Boolean(context.hasComments || context.hasAnchors || commentCount > 0 || (Array.isArray(comments) && comments.length > 0) || (Array.isArray(anchors) && anchors.length > 0));
    return hasComments || hasWidget(fields, widgetNames);
  }

  if (section === 'advanced') {
    const advancedFields = [
      'rotate',
      'opacity',
      'metadata',
      'providerconfig',
      'providerkey',
      'capabilities',
      'display',
      'style',
      'custom',
      '__designer',
    ];
    return Boolean(
      context.hasAdvancedOverrides ||
        entries.some((field) => advancedFields.includes(field.key) && !field.disabled) ||
        hasWidget(fields, widgetNames) ||
        hasAnyValue(schemaObject, ['rotate', 'opacity']) ||
        hasRenderableField(entries),
    );
  }

  return hasVisibleFields || hasAnyFields;
}
