/**
 * detailSectionTaxonomy - taxonomía estable de secciones del DetailView.
 *
 * Mapea nombres de entrada a secciones actuales, define orden/labels y
 * decide si una sección debe renderizarse según tipo de schema, familia
 * semántica, campos, widgets y señales de contenido real.
 */
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  resolveInspectorFamily,
  type InspectorFamily,
  type SchemaSemanticFamily,
} from '@sisad-pdfme/schemas/schemaFamilies';
import { asRecord, isRecord } from '@sisad-pdfme/shared/objectGuards';
import { normalizeText as normalizeTextRaw } from '@sisad-pdfme/shared/text';

/**
 * Claves de sección actuales del DetailView.
 */
export type DetailSectionKey =
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
 * Claves de entrada aceptadas por plugins existentes.
 */
export type PluginSectionKey =
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
 * Mapa de normalización desde claves heredadas a claves actuales.
 */
export const DETAIL_SECTION_ALIASES = {
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
} as const satisfies Record<PluginSectionKey, DetailSectionKey>;

/**
 * Orden visual estable del inspector.
 */
export const DETAIL_SECTION_ORDER = [
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
] as const satisfies readonly DetailSectionKey[];

/**
 * Labels y descripciones por clave de sección.
 */
export const DETAIL_SECTION_LABELS: Record<DetailSectionKey, { title: string; description: string; defaultCollapsed?: boolean }> = {
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
    description: 'Permisos, estado y auditoría.',
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

const normalizeLowerText = (value: unknown) => normalizeTextRaw(value).toLowerCase();

const normalizeDetailSchemaType = (schemaType?: string) => normalizeLowerText(schemaType);
const EMPTY_TEXT_VALUES = new Set(['', '-', '—', '–', 'n/a', 'na', 'null', 'undefined']);

/** Determina si metadata del inspector contiene un valor visible significativo. */
export const hasMeaningfulInspectorValue = (value: unknown): boolean => {
  if (Array.isArray(value)) {
    return value.some((entry) => hasMeaningfulInspectorValue(entry));
  }

  if (isRecord(value)) {
    return Object.values(value).some((entry) => hasMeaningfulInspectorValue(entry));
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

/**
 * Única lista de tipos que sobrevive en este módulo: la casilla suelta es la
 * excepción documentada dentro de la familia `choice` (no tiene lista de
 * opciones). El resto de la clasificación vive en `resolveInspectorFamily`.
 */
const CHECKBOX_TYPES = new Set(['checkbox']);

/**
 * Perfil de visibilidad del inspector para un tipo de schema.
 */
export type DetailProfile = {
  schemaType: string;
  visibleSections: DetailSectionKey[];
  defaultOpenSections: DetailSectionKey[];
};

/**
 * Factory de perfil de detalle.
 */
const createDetailProfile = (schemaType: string, visibleSections: DetailSectionKey[], defaultOpenSections: DetailSectionKey[]): DetailProfile => ({
  schemaType,
  visibleSections,
  defaultOpenSections,
});

const DEFAULT_DETAIL_SECTION_VISIBILITY: DetailSectionKey[] = [
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

/** Secciones transversales que ve cualquier familia. */
const SHARED_SECTIONS: DetailSectionKey[] = [
  'identity',
  'behavior',
  'box',
  'appearance',
  'help',
  'dataBindings',
  'collaboration',
  'comments',
  'advanced',
];

/**
 * Matriz estable sección x familia de inspector.
 *
 * Fuente única de verdad: `docs/03-designer/12-inspector-taxonomy.md` §3.
 * `visible` se ordena por `DETAIL_SECTION_ORDER`; `open` conserva el
 * orden de lectura de cada familia (qué mira primero quien edita ese tipo).
 */
const INSPECTOR_FAMILY_SECTIONS: Record<
  InspectorFamily,
  { visible: DetailSectionKey[]; open: DetailSectionKey[] }
> = {
  'text-like': {
    visible: [...SHARED_SECTIONS, 'validation'],
    open: ['identity', 'validation', 'behavior'],
  },
  choice: {
    visible: [...SHARED_SECTIONS, 'validation', 'options'],
    open: ['identity', 'options', 'validation'],
  },
  signature: {
    visible: [...SHARED_SECTIONS, 'validation'],
    open: ['identity', 'behavior', 'validation'],
  },
  action: {
    visible: [...SHARED_SECTIONS],
    open: ['identity', 'behavior', 'box'],
  },
  visual: {
    visible: [...SHARED_SECTIONS],
    open: ['identity', 'box', 'appearance'],
  },
};

/**
 * Resuelve el perfil de secciones visibles y abiertas por defecto.
 *
 * @param schemaType Tipo del schema activo.
 * @returns Perfil canónico de detalle.
 */
export const getDetailProfile = (schemaType: string): DetailProfile => {
  const normalized = normalizeDetailSchemaType(schemaType);
  const familySections = INSPECTOR_FAMILY_SECTIONS[resolveInspectorFamily(normalized)];

  if (!familySections) {
    return createDetailProfile(normalized, [...DEFAULT_DETAIL_SECTION_VISIBILITY], ['identity', 'box']);
  }

  if (normalized === 'attachment') {
    return createDetailProfile(
      normalized,
      sortDetailSections([...familySections.visible, 'validation']),
      ['identity', 'validation', 'behavior'],
    );
  }

  // Única excepción dentro de una familia: la casilla suelta pertenece a
  // `choice` pero no tiene lista de opciones que editar, así que abre reglas de
  // llenado en lugar de una sección que nunca se renderiza.
  const isLoneCheckbox = CHECKBOX_TYPES.has(normalized);

  return createDetailProfile(
    normalized,
    sortDetailSections(
      isLoneCheckbox
        ? familySections.visible.filter((section) => section !== 'options')
        : familySections.visible,
    ),
    isLoneCheckbox ? ['identity', 'validation', 'behavior'] : [...familySections.open],
  );
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

/** Normaliza diferentes formas de campo a un contrato uniforme. */
const normalizeFieldEntry = (field: FieldLike): NormalizedField => {
  if (typeof field === 'string') {
    return { key: normalizeLowerText(field), hidden: false, disabled: false, widget: '' };
  }

  if (Array.isArray(field)) {
    const [key, schema] = field;
    return {
      key: normalizeLowerText(key),
      hidden: Boolean((schema as { hidden?: boolean } | undefined)?.hidden),
      disabled: Boolean((schema as { disabled?: boolean } | undefined)?.disabled),
      widget: normalizeLowerText((schema as { widget?: string } | undefined)?.widget),
      schema,
    };
  }

  return {
    key: normalizeLowerText(field.key),
    hidden: Boolean(field.hidden),
    disabled: Boolean(field.disabled),
    widget: normalizeLowerText(field.widget),
    schema: field.schema,
  };
};

const fieldNames = (fields: FieldLike[] = []): NormalizedField[] => fields.map(normalizeFieldEntry).filter((field) => field.key && !field.hidden);

const getInspectorSchemaValue = (schema: unknown, key: string) => {
  const record = asRecord(schema);
  return record ? record[key] : undefined;
};

const hasDefinedSchemaValue = (schema: unknown, key: string) => {
  const value = getInspectorSchemaValue(schema, key);
  return value !== undefined && value !== null && value !== '';
};

const hasAnyValue = (schema: unknown, keys: string[]) => keys.some((key) => hasDefinedSchemaValue(schema, key));
const hasMeaningfulSchemaValue = (schema: unknown, keys: string[]) =>
  keys.some((key) => hasMeaningfulInspectorValue(getInspectorSchemaValue(schema, key)));

const hasWidget = (fields: FieldLike[], widgetNames: string[]) => fieldNames(fields).some((field) => widgetNames.includes(field.widget));

const hasField = (fields: FieldLike[], names: string[]) => fieldNames(fields).some((field) => names.includes(field.key));

const hasRenderableField = (fields: FieldLike[]) => fieldNames(fields).some((field) => !field.hidden && !field.disabled);

/**
 * Convierte una sección heredada o actual a una clave de sección.
 */
export const toDetailSectionKey = (section: string): DetailSectionKey | null => {
  const normalized = normalizeLowerText(section) as PluginSectionKey | DetailSectionKey;
  if (!normalized) return null;
  if ((DETAIL_SECTION_ORDER as readonly string[]).includes(normalized)) {
    return normalized as DetailSectionKey;
  }
  return DETAIL_SECTION_ALIASES[normalized as PluginSectionKey] || null;
};

/** Ordena y deduplica secciones según el orden estable. */
export const sortDetailSections = (sections: DetailSectionKey[]) =>
  [...new Set(sections)].sort(
    (left, right) => DETAIL_SECTION_ORDER.indexOf(left) - DETAIL_SECTION_ORDER.indexOf(right),
  );

/**
 * Determina si una sección debe renderizarse para el schema/contexto actual.
 *
 * @param params Contexto del schema, campos, widgets y señales de contenido.
 * @returns `true` si la sección contiene información o capacidades relevantes.
 */
export function shouldRenderDetailSection(params: {
  section: DetailSectionKey;
  Section?: PluginSectionKey | string;
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
  const widgetNames = widgets.map((widget) => normalizeLowerText(typeof widget === 'string' ? widget : widget.name || widget.widget));

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
    const validationFields = [
      'required',
      'validation',
      'validation.type',
      'validation.pattern',
      'validation.message',
      'min',
      'max',
      'minLength',
      'maxLength',
      'decimals',
      'allowedmimetypes',
      'maxfiles',
      'maxsizemb',
      'allowreplace',
      'showfilename',
      'showuploadstatus',
    ];
    return Boolean(context.supportsBehavior !== false) && (hasField(entries, validationFields) || hasAnyValue(schemaObject, ['required', 'validation', 'min', 'max', 'minLength', 'maxLength', 'decimals']));
  }

  if (section === 'box') {
    return Boolean(context.supportsBox !== false) && (hasAnyValue(schemaObject, ['position', 'width', 'height', 'rotate']) || hasField(entries, ['position', 'x', 'y', 'width', 'height', 'rotate']) || hasRenderableField(entries));
  }

  if (section === 'appearance') {
    const signatureVisualKeys = new Set([
      'signaturemode',
      'signatureproviderkey',
      'signatureproviderstatus',
      'signatureproviderdisplay',
      'signaturecapabilities',
      'signaturedisplay',
      'signatureproviderconfig',
      'signatureproviderconfigaction',
      'signaturemetadata',
    ]);
    const appearanceFields = entries.filter((field) => !signatureVisualKeys.has(field.key));
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
      'placeholdertext',
      'optionscontainer',
    ];
    return Boolean(context.supportsAppearance !== false) && (hasField(appearanceFields, visualFields) || hasWidget(appearanceFields, widgetNames) || hasRenderableField(appearanceFields) || hasAnyValue(schemaObject, ['fontName', 'fontSize', 'fontColor', 'textColor', 'backgroundColor', 'strokeColor', 'borderColor', 'borderWidth', 'color', 'radius', 'barColor', 'tableStyles', 'headStyles', 'bodyStyles', 'columnStyles', 'placeholderText', 'optionsContainer', 'opacity']));
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
    // Render la sección también cuando la familia soporta conexiones aunque el
    // schema aún no tenga bindings, para poder crear la PRIMERA conexión desde el
    // SchemaConnectionsWidget (antes: `hasDataBindings` bloqueaba el chicken-and-egg).
    return Boolean(context.hasDataBindings || context.supportsDataBindings) && (hasField(entries, bindingFields) || hasWidget(fields, widgetNames) || hasAnyValue(schemaObject, ['schemaConnections', 'persistence', 'api', 'form', 'prefill', 'rootKey', 'endpoint', 'baseUrl', 'headers', 'params', 'storageKey', 'requestMapping', 'responseMapping', 'mapping', 'dataLabel', 'tabLabel', 'fieldKey']));
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
