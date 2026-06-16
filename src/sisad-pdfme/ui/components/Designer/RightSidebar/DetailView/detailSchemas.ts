import type { PropPanelInspectorConfig, PropPanelSchema, SchemaForUI } from '@sisad-pdfme/common';
import type { SchemaDesignerConfig } from '../../../../../ui/designerEngine.js';
import { asRecord, isRecord } from '../../shared/objectGuards.js';
import {
  CANONICAL_DETAIL_SECTION_LABELS,
  CANONICAL_DETAIL_SECTION_ORDER,
  resolveDetailSectionDefaultCollapsed,
  type CanonicalDetailSection,
  type LegacyDetailSection,
  toCanonicalDetailSection,
  shouldRenderDetailSection,
} from './detailSectionTaxonomy.js';
import { contractSectionEnabled, resolveInspectorContract } from './inspectorContracts.js';
import { getSchemaTypeInspectorPreset, resolveSchemaSemanticFamily } from '../../../../../schemas/schemaFamilies.js';

export type DetailInspectorSectionKey = CanonicalDetailSection;

export type DetailInspectorSection = {
  key: DetailInspectorSectionKey;
  title: string;
  description: string;
  defaultCollapsed?: boolean;
  schema: PropPanelSchema;
};

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
};

const SECTION_META: Record<DetailInspectorSectionKey, Omit<DetailInspectorSection, 'schema'>> = Object.fromEntries(
  CANONICAL_DETAIL_SECTION_ORDER.map((sectionKey) => [
    sectionKey,
    {
      key: sectionKey,
      ...CANONICAL_DETAIL_SECTION_LABELS[sectionKey],
    },
  ]),
) as Record<DetailInspectorSectionKey, Omit<DetailInspectorSection, 'schema'>>;

const buildSectionSchema = (properties: Record<string, PropPanelSchema>): PropPanelSchema => ({
  type: 'object',
  column: 2,
  properties,
});

const addFieldToSection = (
  sectionProperties: Record<LegacyDetailSection, Record<string, PropPanelSchema>>,
  sectionKey: LegacyDetailSection,
  fieldKey: string,
  fieldSchema: PropPanelSchema,
) => {
  sectionProperties[sectionKey][fieldKey] = fieldSchema;
};

const createSectionField = (
  title: string,
  type: PropPanelSchema['type'],
  extra: Omit<PropPanelSchema, 'title' | 'type'> = {},
): PropPanelSchema => ({
  title,
  type,
  ...extra,
});

const createBoundedNumberField = (
  title: string,
  max: number,
  validatePosition: (_: unknown, value: number, fieldName: string) => boolean,
  typedI18n: (key: string) => string,
  fieldName: 'x' | 'y' | 'width' | 'height',
  extra: Omit<PropPanelSchema, 'title' | 'type'> = {},
): PropPanelSchema =>
  createSectionField(title, 'number', {
    ...extra,
    widget: 'inputNumber',
    required: true,
    span: fieldName === 'x' || fieldName === 'y' ? 8 : fieldName === 'width' || fieldName === 'height' ? 6 : 12,
    props: { min: 0, max, ...(extra.props || {}) },
    rules: [
      {
        validator: (_: unknown, value: number) => validatePosition(_, value, fieldName),
        message: typedI18n('validation.outOfBounds'),
      },
      ...(extra.rules || []),
    ],
  });

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
}: BuildInspectorSchemasParams) => {
  const familyPreset = getSchemaTypeInspectorPreset(activeSchemaType);
  const semanticFamily = resolveSchemaSemanticFamily(activeSchemaType);
  const inspectorContract = resolveInspectorContract(activeSchemaType);
  const activeSchemaRecord = asRecord(activeSchema);
  const canonicalVisibleSections = new Set(
    (inspectorConfig?.visibleSections?.length ? inspectorConfig.visibleSections : familyPreset.visibleSections)
      .map((sectionKey) => toCanonicalDetailSection(sectionKey))
      .filter((sectionKey): sectionKey is CanonicalDetailSection => Boolean(sectionKey)),
  );
  const hasSchemaBindings = Boolean(
    schemaConfig?.persistence?.enabled ||
      schemaConfig?.api?.enabled ||
      schemaConfig?.form?.enabled ||
      schemaConfig?.prefill?.enabled ||
      (schemaConfig?.integrations?.length || 0) > 0,
  );
  const hasSchemaCollaboration = Boolean(
    schemaConfig?.collaboration ||
      (activeSchemaRecord &&
        (activeSchemaRecord.ownerRecipientId ||
          activeSchemaRecord.ownerRecipientIds ||
          activeSchemaRecord.ownerRecipientName ||
          activeSchemaRecord.ownerColor ||
          activeSchemaRecord.userColor ||
          activeSchemaRecord.createdBy ||
          activeSchemaRecord.lastModifiedBy ||
          activeSchemaRecord.lockedBy ||
          activeSchemaRecord.lock ||
          activeSchemaRecord.state)),
  );
  const hasSchemaComments = Boolean(
    activeSchemaRecord &&
      (activeSchemaRecord.commentsCount ||
        (Array.isArray(activeSchemaRecord.comments) && activeSchemaRecord.comments.length > 0) ||
        (Array.isArray(activeSchemaRecord.commentAnchors) && activeSchemaRecord.commentAnchors.length > 0) ||
        (Array.isArray(activeSchemaRecord.commentsAnchors) && activeSchemaRecord.commentsAnchors.length > 0)),
  );
  const contractSupportsConnections = contractSectionEnabled(inspectorContract, 'dataBindings');
  const contractSupportsCollaboration = contractSectionEnabled(inspectorContract, 'collaboration');
  const contractSupportsValidation = contractSectionEnabled(inspectorContract, 'validation');
  const shouldShowConnections =
    Boolean(inspectorConfig?.supportsConnections ?? inspectorConfig?.includeConnections ?? familyPreset.supportsConnections) ||
    contractSupportsConnections ||
    hasSchemaBindings;
  const shouldShowCollaboration =
    Boolean(inspectorConfig?.supportsCollaboration ?? inspectorConfig?.includeCollaboration) ||
    contractSupportsCollaboration ||
    hasSchemaCollaboration;
  const shouldShowValidation =
    semanticFamily !== 'action' &&
    (Boolean(inspectorConfig?.supportsValidation ?? inspectorConfig?.includeValidation ?? familyPreset.supportsValidation) ||
      contractSupportsValidation);
  const shouldShowComments = hasSchemaComments;
  const fieldSections = {
    ...familyPreset.propertyMap,
    ...(inspectorConfig?.propertyMap || {}),
    ...(inspectorConfig?.fieldSections || {}),
  };

  const sectionProperties: Record<LegacyDetailSection, Record<string, PropPanelSchema>> = {
    general: {},
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
      span: 24,
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
      span: 24,
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
    widget: 'card',
    properties: {
      x: createBoundedNumberField('X', pageSize.width - paddingRight, validatePosition, typedI18n, 'x', {
        span: 8,
        props: { min: paddingLeft },
      }),
      y: createBoundedNumberField('Y', pageSize.height - paddingBottom, validatePosition, typedI18n, 'y', {
        span: 8,
        props: { min: paddingTop },
      }),
    },
  });

  addFieldToSection(
    sectionProperties,
    'layout',
    'width',
    createBoundedNumberField(typedI18n('width'), maxWidth, validatePosition, typedI18n, 'width'),
  );

  addFieldToSection(
    sectionProperties,
    'layout',
    'height',
    createBoundedNumberField(typedI18n('height'), maxHeight, validatePosition, typedI18n, 'height'),
  );

  addFieldToSection(
    sectionProperties,
    'data',
    'editable',
    createSectionField(typedI18n('editable'), 'boolean', {
      span: 12,
      hidden: defaultSchema.readOnly !== undefined || !canonicalVisibleSections.has('behavior'),
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
      createSectionField('Comentarios del campo', 'void', {
        widget: 'SchemaFieldCommentsWidget',
      }),
    );
  }

  if (shouldShowValidation) {
    addFieldToSection(
      sectionProperties,
      'validation',
      'required',
      createSectionField(typedI18n('required'), 'boolean', {
        span: 12,
        hidden: '{{!formData.editable}}',
      }),
    );
  }

  addFieldToSection(
    sectionProperties,
    'advanced',
    'rotate',
    createSectionField(typedI18n('rotate'), 'number', {
      widget: 'inputNumber',
      disabled: defaultSchema.rotate === undefined,
      max: 360,
      props: { min: 0 },
      span: 12,
    }),
  );

  addFieldToSection(
    sectionProperties,
    'advanced',
    'opacity',
    createSectionField(typedI18n('opacity'), 'number', {
      widget: 'inputNumber',
      disabled: defaultSchema.opacity === undefined,
      props: { step: 0.1, min: 0, max: 1 },
      span: 12,
    }),
  );

  Object.entries(pluginProps).forEach(([fieldKey, fieldSchema]) => {
    if (/^-+$/.test(fieldKey)) return;
    const sectionKey = (fieldSections[fieldKey] || 'advanced') as LegacyDetailSection;
    addFieldToSection(sectionProperties, sectionKey, fieldKey, fieldSchema);
  });

  const canonicalSectionProperties: Record<CanonicalDetailSection, Record<string, PropPanelSchema>> = {
    identity: { ...sectionProperties.general },
    box: { ...sectionProperties.layout },
    appearance: { ...sectionProperties.style },
    behavior: { ...sectionProperties.data, ...sectionProperties.validation },
    help: { ...sectionProperties.help },
    dataBindings: { ...sectionProperties.connections },
    collaboration: { ...sectionProperties.collaboration },
    comments: { ...sectionProperties.comments },
    advanced: { ...sectionProperties.advanced },
  };

  const sectionContext = {
    isMultiUser: shouldShowCollaboration,
    hasComments: hasSchemaComments,
    hasAnchors: hasSchemaComments,
    hasDataBindings: hasSchemaBindings,
    supportsComments: shouldShowComments,
    supportsCollaboration: shouldShowCollaboration,
    supportsDataBindings: shouldShowConnections,
    supportsAppearance: true,
    supportsBehavior: true,
    supportsBox: true,
  };

  const visibilitySchema = (activeSchema || (defaultSchema as SchemaForUI)) as SchemaForUI;

  const sections = CANONICAL_DETAIL_SECTION_ORDER.map((sectionKey) => {
    const schema = replaceColorWidget(buildSectionSchema(canonicalSectionProperties[sectionKey])) as PropPanelSchema;
    const defaultCollapsed = resolveDetailSectionDefaultCollapsed(sectionKey, semanticFamily);

    return {
      ...SECTION_META[sectionKey],
      defaultCollapsed,
      schema,
      canonicalKey: sectionKey,
    } as DetailInspectorSection & { canonicalKey: CanonicalDetailSection };
  }).filter((section) =>
    shouldRenderDetailSection({
      section: section.canonicalKey,
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

const sectionFieldsFromSection = (section: DetailInspectorSection & { canonicalKey?: CanonicalDetailSection }) =>
  Object.entries((section.schema as { properties?: Record<string, PropPanelSchema> }).properties || {}).map(([fieldKey, fieldSchema]) => ({
    key: fieldKey,
    hidden: Boolean((fieldSchema as { hidden?: boolean }).hidden),
    disabled: Boolean((fieldSchema as { disabled?: boolean }).disabled),
    widget: (fieldSchema as { widget?: string }).widget,
    schema: fieldSchema,
  }));

const sectionWidgetsFromSection = (section: DetailInspectorSection & { canonicalKey?: CanonicalDetailSection }) =>
  sectionFieldsFromSection(section)
    .map((field) => field.widget)
    .filter((widget): widget is string => Boolean(widget));
