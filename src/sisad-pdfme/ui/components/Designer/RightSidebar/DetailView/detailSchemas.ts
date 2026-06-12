import type { PropPanelInspectorConfig, PropPanelSchema, SchemaForUI } from '@sisad-pdfme/common';
import type { SchemaDesignerConfig } from '../../../../../ui/designerEngine.js';
import {
  CANONICAL_DETAIL_SECTION_LABELS,
  CANONICAL_DETAIL_SECTION_ORDER,
  resolveDetailSectionDefaultCollapsed,
  type CanonicalDetailSection,
  type LegacyDetailSection,
  toCanonicalDetailSection,
  shouldRenderDetailSection,
} from './detailSectionTaxonomy.js';
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

const replaceColorWidget = (schemaNode: unknown): unknown => {
  if (schemaNode === undefined || schemaNode === null || Array.isArray(schemaNode) || typeof schemaNode !== 'object') {
    return schemaNode;
  }
  const node = schemaNode as Record<string, unknown>;
  const nextNode: Record<string, unknown> = { ...node };

  if (nextNode.widget === 'color') {
    nextNode.widget = 'nativeColor';
  }

  if (nextNode.properties !== undefined && nextNode.properties !== null && typeof nextNode.properties === 'object') {
    const propsObj = nextNode.properties as Record<string, unknown>;
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
  const activeSchemaRecord = activeSchema as Record<string, unknown> | null | undefined;
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
  const shouldShowConnections =
    Boolean(inspectorConfig?.supportsConnections ?? inspectorConfig?.includeConnections ?? familyPreset.supportsConnections) ||
    hasSchemaBindings;
  const shouldShowCollaboration =
    Boolean(inspectorConfig?.supportsCollaboration ?? inspectorConfig?.includeCollaboration) ||
    hasSchemaCollaboration;
  const shouldShowValidation =
    Boolean(inspectorConfig?.supportsValidation ?? inspectorConfig?.includeValidation ?? familyPreset.supportsValidation);
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

  addFieldToSection(sectionProperties, 'general', 'name', {
    name: {
        title: 'Nombre del campo',
        type: 'string',
        required: true,
        span: 24,
        rules: [
          {
            validator: validateUniqueSchemaName,
            message: typedI18n('validation.uniqueName'),
          },
        ],
        props: { autoComplete: 'off' },
      },
    }.name as PropPanelSchema,
  );

  addFieldToSection(sectionProperties, 'general', 'inlineEditActions', {
    title: '',
    type: 'void',
    widget: 'InlineEditActionsWidget',
    span: 24,
  });

  addFieldToSection(sectionProperties, 'layout', 'align', {
    title: typedI18n('align'),
    type: 'void',
    widget: 'AlignWidget',
  });

  addFieldToSection(sectionProperties, 'layout', 'position', {
    type: 'object',
    widget: 'card',
    properties: {
      x: {
        title: 'X',
        type: 'number',
        widget: 'inputNumber',
        required: true,
        span: 8,
        min: paddingLeft,
        max: pageSize.width - paddingRight,
        rules: [
          {
            validator: (_: unknown, value: number) => validatePosition(_, value, 'x'),
            message: typedI18n('validation.outOfBounds'),
          },
        ],
      },
      y: {
        title: 'Y',
        type: 'number',
        widget: 'inputNumber',
        required: true,
        span: 8,
        min: paddingTop,
        max: pageSize.height - paddingBottom,
        rules: [
          {
            validator: (_: unknown, value: number) => validatePosition(_, value, 'y'),
            message: typedI18n('validation.outOfBounds'),
          },
        ],
      },
    },
  });

  addFieldToSection(sectionProperties, 'layout', 'width', {
    title: typedI18n('width'),
    type: 'number',
    widget: 'inputNumber',
    required: true,
    span: 6,
    props: { min: 0, max: maxWidth },
    rules: [
      {
        validator: (_: unknown, value: number) => validatePosition(_, value, 'width'),
        message: typedI18n('validation.outOfBounds'),
      },
    ],
  });

  addFieldToSection(sectionProperties, 'layout', 'height', {
    title: typedI18n('height'),
    type: 'number',
    widget: 'inputNumber',
    required: true,
    span: 6,
    props: { min: 0, max: maxHeight },
    rules: [
      {
        validator: (_: unknown, value: number) => validatePosition(_, value, 'height'),
        message: typedI18n('validation.outOfBounds'),
      },
    ],
  });

  addFieldToSection(sectionProperties, 'data', 'editable', {
    title: typedI18n('editable'),
    type: 'boolean',
    span: 12,
    hidden: defaultSchema.readOnly !== undefined || !canonicalVisibleSections.has('behavior'),
  });

  if (shouldShowConnections) {
    addFieldToSection(sectionProperties, 'connections', 'schemaConnections', {
      title: 'Conexiones',
      type: 'void',
      widget: 'SchemaConnectionsWidget',
    });
  }

  if (shouldShowCollaboration) {
    addFieldToSection(sectionProperties, 'collaboration', 'collaboration', {
      title: 'Colaboración',
      type: 'void',
      widget: 'SchemaCollaborationWidget',
    });
  }

  if (shouldShowComments) {
    addFieldToSection(sectionProperties, 'comments', 'fieldComments', {
      title: 'Comentarios del campo',
      type: 'void',
      widget: 'SchemaFieldCommentsWidget',
    });
  }

  if (shouldShowValidation) {
    addFieldToSection(sectionProperties, 'validation', 'required', {
      title: typedI18n('required'),
      type: 'boolean',
      span: 12,
      hidden: '{{!formData.editable}}',
    });
  }

  addFieldToSection(sectionProperties, 'advanced', 'rotate', {
    title: typedI18n('rotate'),
    type: 'number',
    widget: 'inputNumber',
    disabled: defaultSchema.rotate === undefined,
    max: 360,
    props: { min: 0 },
    span: 12,
  });

  addFieldToSection(sectionProperties, 'advanced', 'opacity', {
    title: typedI18n('opacity'),
    type: 'number',
    widget: 'inputNumber',
    disabled: defaultSchema.opacity === undefined,
    props: { step: 0.1, min: 0, max: 1 },
    span: 12,
  });

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
