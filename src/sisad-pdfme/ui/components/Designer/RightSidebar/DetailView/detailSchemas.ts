/**
 * detailSchemas — builder declarativo de secciones para el DetailView.
 *
 * Convierte el schema del plugin, contratos del inspector, metadata del schema y
 * contexto de página en una lista canónica de secciones renderizables. Este módulo
 * es la frontera entre los plugins y la UI del inspector.
 */
import type { PropPanelInspectorConfig, PropPanelSchema, SchemaForUI } from '@sisad-pdfme/common';
import type { SchemaDesignerConfig } from '../../../../../ui/designerEngine.js';
import type { SisadPdfmeVisibilityConfig } from '../../../../../config/SisadPdfmeConfig.js';
import { asRecord, isRecord } from '../../../../../shared/objectGuards.js';
import {
  hasMeaningfulInspectorValue,
  DETAIL_SECTION_LABELS,
  DETAIL_SECTION_ORDER,
  type DetailSectionKey,
  type PluginSectionKey,
  shouldRenderDetailSection,
} from './detailSectionTaxonomy.js';
import { contractSectionEnabled, resolveInspectorContract } from './inspectorContracts.js';
import { shouldShowInspectorSection } from '../../shared/visibilityConfig.js';
import { createSchemaConfigurationProfile } from '../../../../../config/schemaConfigurationProfile.js';

/** Clave de sección usada por el DetailView. */
export type DetailInspectorSectionKey = DetailSectionKey;

/**
 * Sección final que DetailViewContent puede renderizar.
 */
export type DetailInspectorSection = {
  key: DetailInspectorSectionKey;
  title: string;
  description: string;
  defaultCollapsed?: boolean;
  schema: PropPanelSchema;
};

/**
 * Perfil inspector normalizado para un schema activo.
 *
 * Mantiene juntas la familia semántica y las secciones visibles/abiertas,
 * evitando que el render de JSX tenga que recomponer esta lógica.
 */
export type InspectorProfile = {
  schemaType: string;
  family: string;
  visibleSections: DetailSectionKey[];
  defaultOpenSections: DetailSectionKey[];
};

/**
 * Input flexible aceptado por el contrato del inspector.
 */
type InspectorProfileInput = string | Pick<SchemaForUI, 'type'> | null | undefined;

/**
 * Parámetros necesarios para construir las secciones del inspector.
 */
type BuildInspectorSchemasParams = {
  activeSchemaType: string;
  activeSchema?: SchemaForUI | null;
  schemaConfig?: SchemaDesignerConfig | null;
  typedI18n: (key: string) => string;
  defaultSchema: Record<string, unknown>;
  pluginProps: Record<string, PropPanelSchema>;
  inspectorConfig?: PropPanelInspectorConfig;
  pageSize: { width: number; height: number };
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  maxWidth: number;
  maxHeight: number;
  validateUniqueSchemaName: (_: unknown, value: string) => boolean;
  validatePosition: (_: unknown, value: number, fieldName: string) => boolean;
  visibility?: SisadPdfmeVisibilityConfig;
};

/**
 * Resuelve el perfil inspector de alto nivel para un tipo de schema.
 *
 * Sirve como contrato estable para consumers externos y para `buildInspectorSections`.
 */
export const getInspectorProfile = (schema: InspectorProfileInput, _context?: unknown): InspectorProfile => {
  const normalizedSchemaType = String((typeof schema === 'string' ? schema : schema?.type) || '').trim().toLowerCase();
  const profile = createSchemaConfigurationProfile(normalizedSchemaType);

  return {
    schemaType: normalizedSchemaType,
    family: profile.semanticFamily,
    visibleSections: profile.inspector.visibleSections,
    defaultOpenSections: profile.inspector.defaultOpenSections,
  };
};

/** Devuelve las secciones visibles para un schema activo. */
export const getInspectorVisibleDetailSections = (schema: InspectorProfileInput, context?: unknown): DetailSectionKey[] =>
  getInspectorProfile(schema, context).visibleSections;

/** Devuelve las secciones abiertas por defecto para un schema activo. */
export const getInspectorDefaultOpenSections = (schema: InspectorProfileInput, context?: unknown): DetailSectionKey[] =>
  getInspectorProfile(schema, context).defaultOpenSections;

/** Metadata visual base por sección canónica. */
const SECTION_META: Record<DetailInspectorSectionKey, Omit<DetailInspectorSection, 'schema'>> = Object.fromEntries(
  DETAIL_SECTION_ORDER.map((sectionKey) => [
    sectionKey,
    {
      key: sectionKey,
      ...DETAIL_SECTION_LABELS[sectionKey],
    },
  ]),
) as Record<DetailInspectorSectionKey, Omit<DetailInspectorSection, 'schema'>>;

const DETAIL_FIELD_SPAN = {
  full: 24,
  half: 12,
  compact: 8,
} as const;

/**
 * Agrega un campo al bucket de sección indicado.
 */
const addFieldToSection = (
  sectionProperties: Record<PluginSectionKey, Record<string, PropPanelSchema>>,
  sectionKey: PluginSectionKey,
  fieldKey: string,
  fieldSchema: PropPanelSchema,
) => {
  sectionProperties[sectionKey][fieldKey] = fieldSchema;
};

/**
 * Factory pequeña para campos de form-render dentro del inspector.
 */
const createSectionField = (
  title: string,
  type: PropPanelSchema['type'],
  extra: Omit<PropPanelSchema, 'title' | 'type'> = {},
): PropPanelSchema => ({
  title,
  type,
  ...extra,
});

const DEFAULT_BOUNDED_NUMBER_FIELD_SPAN = 12;

const hasAnyTruthyInspectorField = (
  record: Record<string, unknown> | null | undefined,
  fieldKeys: readonly string[],
): boolean => Boolean(record && fieldKeys.some((fieldKey) => Boolean(record[fieldKey])));

const hasAnyFilledInspectorArrayField = (
  record: Record<string, unknown> | null | undefined,
  fieldKeys: readonly string[],
): boolean =>
  Boolean(
    record &&
      fieldKeys.some(
        (fieldKey) => Array.isArray(record[fieldKey]) && (record[fieldKey] as unknown[]).length > 0,
      ),
  );

/**
 * Crea un campo numérico acotado por página/padding y validación externa.
 */
const createBoundedNumberField = (
  title: string,
  max: number,
  validatePosition: (_: unknown, value: number, fieldName: string) => boolean,
  typedI18n: (key: string) => string,
  fieldName: 'x' | 'y' | 'width' | 'height',
  extra: Omit<PropPanelSchema, 'title' | 'type'> = {},
): PropPanelSchema => {
  const { span = DEFAULT_BOUNDED_NUMBER_FIELD_SPAN, props, rules, ...restExtra } = extra;

  return createSectionField(title, 'number', {
    ...restExtra,
    widget: 'inputNumber',
    required: true,
    span,
    props: { min: 0, max, ...(props || {}) },
    rules: [
      {
        validator: (_: unknown, value: number) => validatePosition(_, value, fieldName),
        message: typedI18n('validation.outOfBounds'),
      },
      ...(rules || []),
    ],
  });
};

/**
 * Reemplaza widgets `color`  por el widget `nativeColor` soportado.
 */
const replaceColorWidget = (schemaNode: unknown): unknown => {
  if (!isRecord(schemaNode)) {
    return schemaNode;
  }
  const nextNode: Record<string, unknown> = { ...schemaNode };

  if (nextNode.widget === 'color') {
    nextNode.widget = 'nativeColor';
  }

  if (isRecord(nextNode.properties)) {
    const propsObj = nextNode.properties;
    const nextProps: Record<string, unknown> = {};
    Object.entries(propsObj).forEach(([propKey, propValue]) => {
      nextProps[propKey] = replaceColorWidget(propValue);
    });
    nextNode.properties = nextProps;
  }

  return nextNode;
};

/**
 * Construye las secciones visibles del inspector para el schema activo.
 *
 * Combina preset por familia, contrato del inspector, plugin props, metadata del
 * schema y reglas de visibilidad para entregar una lista canónica filtrada.
 *
 * @param params Contexto completo del schema activo y límites de página.
 * @returns Secciones del DetailView listas para renderizar.
 */
export const buildInspectorSections = ({
  activeSchemaType,
  activeSchema,
  schemaConfig,
  typedI18n,
  defaultSchema,
  pluginProps,
  inspectorConfig,
  pageSize,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  maxWidth,
  maxHeight,
  validateUniqueSchemaName,
  validatePosition,
  visibility,
}: BuildInspectorSchemasParams) => {
  const schemaProfile = createSchemaConfigurationProfile(activeSchemaType);
  const familyPreset = schemaProfile.inspectorPreset;
  const semanticFamily = schemaProfile.semanticFamily;
  const inspectorContract = resolveInspectorContract(activeSchemaType);
  const activeSchemaRecord = asRecord(activeSchema);
  const hasSchemaBindings = Boolean(
    schemaConfig?.persistence?.enabled ||
      schemaConfig?.api?.enabled ||
      schemaConfig?.form?.enabled ||
      schemaConfig?.prefill?.enabled ||
      (schemaConfig?.integrations?.length || 0) > 0,
  );
  const hasSchemaCollaboration =
    Boolean(schemaConfig?.collaboration) ||
    hasAnyTruthyInspectorField(activeSchemaRecord, [
      'ownerRecipientId',
      'ownerRecipientIds',
      'ownerRecipientName',
      'ownerColor',
      'userColor',
      'createdBy',
      'lastModifiedBy',
      'lockedBy',
      'lock',
      'state',
    ]);
  const hasSchemaComments =
    Boolean(activeSchemaRecord?.commentsCount) ||
    hasAnyFilledInspectorArrayField(activeSchemaRecord, ['comments', 'commentAnchors', 'commentsAnchors']);
  const hasSchemaHelpContent =
    hasMeaningfulInspectorValue(activeSchemaRecord?.tooltip) ||
    hasMeaningfulInspectorValue(activeSchemaRecord?.helpText) ||
    hasMeaningfulInspectorValue(activeSchemaRecord?.helptext) ||
    hasMeaningfulInspectorValue(activeSchemaRecord?.description) ||
    hasMeaningfulInspectorValue(activeSchemaRecord?.helpDescription);
  const hasExplicitOpacity =
    activeSchemaRecord?.opacity !== undefined ||
    (typeof (defaultSchema as { opacity?: unknown }).opacity !== 'undefined' &&
      (defaultSchema as { opacity?: unknown }).opacity !== null);
  const contractSupportsConnections = contractSectionEnabled(inspectorContract, 'dataBindings');
  const contractSupportsCollaboration = contractSectionEnabled(inspectorContract, 'collaboration');
  const shouldShowConnections =
    Boolean(inspectorConfig?.supportsConnections ?? inspectorConfig?.includeConnections ?? familyPreset.supportsConnections) ||
    contractSupportsConnections ||
    hasSchemaBindings;
  const shouldShowCollaboration =
    Boolean(inspectorConfig?.supportsCollaboration ?? inspectorConfig?.includeCollaboration) ||
    contractSupportsCollaboration ||
    hasSchemaCollaboration;
  const shouldShowComments = hasSchemaComments;
  const fieldSections = {
    ...familyPreset.propertyMap,
    ...(inspectorConfig?.propertyMap || {}),
    ...(inspectorConfig?.fieldSections || {}),
  };
  const pluginFieldKeys = new Set(
    Object.keys(pluginProps).map((fieldKey) => fieldKey.trim().toLowerCase()),
  );

  const sectionProperties: Record<PluginSectionKey, Record<string, PropPanelSchema>> = {
    general: {},
    options: {},
    layout: {},
    style: {},
    data: {},
    connections: {},
    help: {},
    collaboration: {},
    validation: {},
    advanced: {},
    comments: {},
  };

  addFieldToSection(
    sectionProperties,
    'general',
    'name',
    createSectionField('Nombre del campo', 'string', {
      required: true,
      span: DETAIL_FIELD_SPAN.half,
      rules: [
        {
          validator: validateUniqueSchemaName,
          message: typedI18n('validation.uniqueName'),
        },
      ],
      props: { autoComplete: 'off' },
    }),
  );

  addFieldToSection(
    sectionProperties,
    'general',
    'inlineEditActions',
    createSectionField('', 'void', {
      widget: 'InlineEditActionsWidget',
      span: DETAIL_FIELD_SPAN.half,
    }),
  );

  addFieldToSection(
    sectionProperties,
    'layout',
    'align',
    createSectionField(typedI18n('align'), 'void', {
      widget: 'AlignWidget',
    }),
  );

  addFieldToSection(sectionProperties, 'layout', 'position', {
    type: 'object',
    column: 2,
    properties: {
      x: createBoundedNumberField('X mm', pageSize.width - paddingRight, validatePosition, typedI18n, 'x', {
        span: DETAIL_FIELD_SPAN.half,
        props: { min: paddingLeft },
      }),
      y: createBoundedNumberField('Y mm', pageSize.height - paddingBottom, validatePosition, typedI18n, 'y', {
        span: DETAIL_FIELD_SPAN.half,
        props: { min: paddingTop },
      }),
    },
  });

  addFieldToSection(
    sectionProperties,
    'layout',
    'width',
    createBoundedNumberField('Ancho mm', maxWidth, validatePosition, typedI18n, 'width'),
  );

  addFieldToSection(
    sectionProperties,
    'layout',
    'height',
    createBoundedNumberField('Alto mm', maxHeight, validatePosition, typedI18n, 'height'),
  );

  addFieldToSection(
    sectionProperties,
    'layout',
    'rotate',
    createSectionField('Rotación', 'number', {
      widget: 'inputNumber',
      disabled: defaultSchema.rotate === undefined,
      default: 0,
      max: 360,
      props: { min: 0 },
      span: DETAIL_FIELD_SPAN.compact,
    }),
  );

  if (shouldShowConnections) {
    addFieldToSection(
      sectionProperties,
      'connections',
      'schemaConnections',
      createSectionField('Conexiones', 'void', {
        widget: 'SchemaConnectionsWidget',
      }),
    );
  }

  if (shouldShowCollaboration) {
    addFieldToSection(
      sectionProperties,
      'collaboration',
      'collaboration',
      createSectionField('Colaboración', 'void', {
        widget: 'SchemaCollaborationWidget',
      }),
    );
  }

  if (shouldShowComments) {
    addFieldToSection(
      sectionProperties,
      'comments',
      'fieldComments',
      createSectionField('Comentarios', 'void', {
        widget: 'SchemaFieldCommentsWidget',
      }),
    );
  }

  if (hasExplicitOpacity) {
    addFieldToSection(
      sectionProperties,
      'style',
      'opacity',
      createSectionField(typedI18n('opacity'), 'number', {
        widget: 'inputNumber',
        disabled: defaultSchema.opacity === undefined,
        props: { step: 0.1, min: 0, max: 1 },
        span: DETAIL_FIELD_SPAN.half,
      }),
    );
  }

  // Fallbacks sintetizados cuando el plugin no declara el campo ni su inverso.
  // Cada concepto cae en su única sección (docs/03-designer/12-inspector-taxonomy.md):
  // editable/readOnly → Interacción; required/mandatory → Reglas de llenado.
  // Un campo declarado por el plugin siempre gana, para no duplicar el control.
  if (!pluginFieldKeys.has('editable') && !pluginFieldKeys.has('readonly')) {
    addFieldToSection(
      sectionProperties,
      'data',
      'editable',
      createSectionField(typedI18n('editable'), 'boolean', { span: DETAIL_FIELD_SPAN.half }),
    );
  }
  if (!pluginFieldKeys.has('required') && !pluginFieldKeys.has('mandatory')) {
    addFieldToSection(
      sectionProperties,
      'validation',
      'required',
      createSectionField(typedI18n('required'), 'boolean', { span: DETAIL_FIELD_SPAN.half }),
    );
  }

  const isOptionsSectionField = (fieldKey: string, fieldSchema: PropPanelSchema) => {
    const normalizedFieldKey = fieldKey.trim().toLowerCase();
    const normalizedWidget = String(fieldSchema.widget || '').trim().toLowerCase();
    return (
      normalizedFieldKey === 'optionscontainer' ||
      normalizedFieldKey === 'options' ||
      normalizedFieldKey.includes('option') ||
      normalizedWidget.includes('option')
    );
  };

  Object.entries(pluginProps).forEach(([fieldKey, fieldSchema]) => {
    if (/^-+$/.test(fieldKey)) return;
    const normalizedFieldKey = fieldKey.trim().toLowerCase();
    if (normalizedFieldKey === 'mandatory' && pluginFieldKeys.has('required')) return;
    if (normalizedFieldKey === 'readonly' && pluginFieldKeys.has('editable')) return;
    const nextFieldSchema =
      activeSchemaType === 'attachment' && normalizedFieldKey === 'allowreplace'
        ? {
            ...fieldSchema,
            title: 'Reemplazo',
          }
        : fieldSchema;
    const baseSectionKey =
      normalizedFieldKey === 'rotate'
        ? 'layout'
        : normalizedFieldKey === 'opacity'
          ? 'style'
          : (fieldSections[fieldKey] || 'advanced');
    const sectionKey =
      contractSectionEnabled(inspectorContract, 'options') && isOptionsSectionField(fieldKey, fieldSchema)
        ? 'options'
        : (baseSectionKey as PluginSectionKey);
    addFieldToSection(sectionProperties, sectionKey, fieldKey, nextFieldSchema);
  });

  const detailSectionProperties: Record<DetailSectionKey, Record<string, PropPanelSchema>> = {
    identity: { ...sectionProperties.general },
    options: { ...sectionProperties.options },
    validation: { ...sectionProperties.validation },
    box: { ...sectionProperties.layout },
    appearance: { ...sectionProperties.style },
    behavior: { ...sectionProperties.data },
    help: { ...sectionProperties.help },
    dataBindings: { ...sectionProperties.connections },
    collaboration: { ...sectionProperties.collaboration },
    comments: { ...sectionProperties.comments },
    advanced: { ...sectionProperties.advanced },
  };

  const inspectorVisibility = visibility?.inspector;
  if (inspectorVisibility?.visible === false) return [];

  const visibleFieldsBySchemaType =
    inspectorVisibility?.fieldsBySchemaType?.[activeSchemaType] ??
    inspectorVisibility?.fieldsBySchemaType?.[activeSchemaType.toLowerCase()] ??
    {};

  const isFieldVisible = (fieldKey: string): boolean => {
    if (inspectorVisibility?.fields?.[fieldKey] === false) return false;
    if (visibleFieldsBySchemaType[fieldKey] === false) return false;
    return true;
  };

  const filteredDetailSectionProperties: Record<DetailSectionKey, Record<string, PropPanelSchema>> =
    Object.fromEntries(
      Object.entries(detailSectionProperties).map(([sectionKey, fields]) => [
        sectionKey,
        Object.fromEntries(
          Object.entries(fields).filter(([fieldKey]) => isFieldVisible(fieldKey)),
        ),
      ]),
    ) as Record<DetailSectionKey, Record<string, PropPanelSchema>>;

  const sectionContext = {
    isMultiUser: shouldShowCollaboration,
    hasComments: hasSchemaComments,
    hasAnchors: hasSchemaComments,
    hasDataBindings: hasSchemaBindings,
    hasHelpContent: hasSchemaHelpContent,
    hasCollaborationContent: hasSchemaCollaboration,
    hasAdvancedOverrides:
      hasMeaningfulInspectorValue(activeSchemaRecord?.schemaUid) ||
      hasMeaningfulInspectorValue(activeSchemaRecord?.documentId) ||
      hasMeaningfulInspectorValue(activeSchemaRecord?.pageNumber) ||
      hasMeaningfulInspectorValue(activeSchemaRecord?.metadata) ||
      hasMeaningfulInspectorValue(activeSchemaRecord?.debug) ||
      hasMeaningfulInspectorValue(activeSchemaRecord?.__designer),
    supportsComments: shouldShowComments,
    supportsCollaboration: shouldShowCollaboration,
    supportsDataBindings: shouldShowConnections,
    supportsAppearance: true,
    supportsBehavior: true,
    supportsBox: true,
  };

  const visibilitySchema = (activeSchema || (defaultSchema as SchemaForUI)) as SchemaForUI;
  const detailProfile = getInspectorProfile(activeSchemaType, activeSchema);
  const visibleSections = detailProfile.visibleSections.filter((sectionKey) => {
    return shouldShowInspectorSection(sectionKey, visibility);
  });
  const defaultOpenSections = new Set(detailProfile.defaultOpenSections);

  const resolveSectionMeta = (sectionKey: DetailSectionKey) => {
    const base = SECTION_META[sectionKey];
    if (activeSchemaType === 'attachment') {
      if (sectionKey === 'behavior') {
        return {
          ...base,
          title: 'Reglas del archivo',
          description: 'Tipo, tamaño y reemplazo.',
        };
      }
      if (sectionKey === 'box') {
        return {
          ...base,
          description: 'Posición, tamaño y rotación.',
        };
      }
    }
    if (sectionKey === 'appearance' && activeSchemaType === 'attachment') {
      return {
        ...base,
        title: 'Formato',
        description: 'Estilo visual y opacidad.',
      };
    }
    return base;
  };

  const sections = visibleSections.map((sectionKey) => {
    const sectionFields = filteredDetailSectionProperties[sectionKey];
    if (!sectionFields || Object.keys(sectionFields).length === 0) return null;
    const schema = replaceColorWidget({
      type: 'object',
      column: 2,
      properties: sectionFields,
    }) as PropPanelSchema;
    const defaultCollapsed = !defaultOpenSections.has(sectionKey);

    return {
      ...resolveSectionMeta(sectionKey),
      defaultCollapsed,
      schema,
      sectionKey,
    } as DetailInspectorSection & { sectionKey: DetailSectionKey };
  }).filter((section): section is DetailInspectorSection & { sectionKey: DetailSectionKey } => Boolean(section)).filter((section) =>
    shouldRenderDetailSection({
      section: section.sectionKey,
      schema: visibilitySchema,
      schemaType: activeSchemaType,
      semanticFamily,
      fields: sectionFieldsFromSection(section),
      widgets: sectionWidgetsFromSection(section),
      context: sectionContext,
    }),
  );

  return sections;
};

/**
 * Extrae metadata mínima de campos desde una sección ya construida.
 */
const sectionFieldsFromSection = (section: DetailInspectorSection & { sectionKey?: DetailSectionKey }) =>
  Object.entries((section.schema as { properties?: Record<string, PropPanelSchema> }).properties || {}).map(([fieldKey, fieldSchema]) => ({
    key: fieldKey,
    hidden: Boolean((fieldSchema as { hidden?: boolean }).hidden),
    disabled: Boolean((fieldSchema as { disabled?: boolean }).disabled),
    widget: (fieldSchema as { widget?: string }).widget,
    schema: fieldSchema,
  }));

/**
 * Extrae nombres de widgets presentes en una sección.
 */
const sectionWidgetsFromSection = (section: DetailInspectorSection & { sectionKey?: DetailSectionKey }) =>
  sectionFieldsFromSection(section)
    .map((field) => field.widget)
    .filter((widget): widget is string => Boolean(widget));

/**
 * Devuelve los widgets presentes en una sección del inspector.
 *
 * El parámetro `schema` se mantiene en la firma pública para permitir futura
 * autoconfiguración por contexto sin romper el contrato actual.
 */
export const getSectionWidgets = (
  section: DetailInspectorSection,
  _schema?: SchemaForUI | Record<string, unknown> | null,
  _context?: unknown,
): string[] => sectionWidgetsFromSection(section);
