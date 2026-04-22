import type { PropPanelInspectorConfig, PropPanelInspectorSectionKey, PropPanelSchema } from '@sisad-pdfme/common';
import { getSchemaTypeInspectorPreset } from '../../../../../schemas/schemaFamilies.js';

export type DetailInspectorSectionKey = PropPanelInspectorSectionKey;

export type DetailInspectorSection = {
  key: DetailInspectorSectionKey;
  title: string;
  description: string;
  defaultCollapsed?: boolean;
  schema: PropPanelSchema;
};

type BuildInspectorSchemasParams = {
  activeSchemaType: string;
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

const SECTION_META: Record<DetailInspectorSectionKey, Omit<DetailInspectorSection, 'schema'>> = {
  general: {
    key: 'general',
    title: 'General',
    description: 'Identidad y metadatos del campo.',
    defaultCollapsed: false,
  },
  layout: {
    key: 'layout',
    title: 'Layout',
    description: 'Posición y tamaño en la página.',
    defaultCollapsed: false,
  },
  style: {
    key: 'style',
    title: 'Estilo',
    description: 'Alineación y tratamiento visual.',
    defaultCollapsed: true,
  },
  data: {
    key: 'data',
    title: 'Datos',
    description: 'Comportamiento semántico y edición.',
    defaultCollapsed: false,
  },
  connections: {
    key: 'connections',
    title: 'Conexiones',
    description: 'Persistencia, API y salida de datos.',
    defaultCollapsed: true,
  },
  collaboration: {
    key: 'collaboration',
    title: 'Colaboración',
    description: 'Propietario, bloqueo, auditoría y trazabilidad.',
    defaultCollapsed: true,
  },
  validation: {
    key: 'validation',
    title: 'Validación',
    description: 'Reglas y obligatoriedad.',
    defaultCollapsed: true,
  },
  advanced: {
    key: 'advanced',
    title: 'Avanzado',
    description: 'Propiedades avanzadas del plugin.',
    defaultCollapsed: true,
  },
};

const buildSectionSchema = (properties: Record<string, PropPanelSchema>): PropPanelSchema => ({
  type: 'object',
  column: 2,
  properties,
});

const hasVisibleFields = (schema: PropPanelSchema | undefined): boolean => {
  if (!schema || typeof schema !== 'object') return false;
  const properties = (schema as { properties?: Record<string, PropPanelSchema> }).properties;
  if (!properties) return false;

  return Object.values(properties).some((property) => {
    if (!property || typeof property !== 'object') return false;
    if ((property as { hidden?: unknown }).hidden === true) return false;
    const nestedProperties = (property as { properties?: Record<string, PropPanelSchema> }).properties;
    if (nestedProperties) {
      return hasVisibleFields({ type: 'object', properties: nestedProperties } as PropPanelSchema);
    }
    return true;
  });
};

const addFieldToSection = (
  sectionProperties: Record<DetailInspectorSectionKey, Record<string, PropPanelSchema>>,
  sectionKey: DetailInspectorSectionKey,
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
  const visibleSections = new Set(
    inspectorConfig?.visibleSections?.length ? inspectorConfig.visibleSections : familyPreset.visibleSections,
  );
  const shouldShowConnections =
    inspectorConfig?.supportsConnections ?? inspectorConfig?.includeConnections ?? familyPreset.supportsConnections;
  const shouldShowCollaboration =
    inspectorConfig?.supportsCollaboration ??
    inspectorConfig?.includeCollaboration ??
    familyPreset.supportsCollaboration;
  const shouldShowValidation =
    inspectorConfig?.supportsValidation ?? inspectorConfig?.includeValidation ?? familyPreset.supportsValidation;
  const fieldSections = {
    ...familyPreset.propertyMap,
    ...(inspectorConfig?.propertyMap || {}),
    ...(inspectorConfig?.fieldSections || {}),
  };

  const sectionProperties: Record<DetailInspectorSectionKey, Record<string, PropPanelSchema>> = {
    general: {},
    layout: {},
    style: {},
    data: {},
    connections: {},
    collaboration: {},
    validation: {},
    advanced: {},
  };

  addFieldToSection(sectionProperties, 'general', 'name', {
    name: {
        title: 'Nombre de variable',
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
    hidden: defaultSchema.readOnly !== undefined || !visibleSections.has('data'),
  });

  if (shouldShowConnections) {
    addFieldToSection(sectionProperties, 'connections', 'schemaConnections', {
      title: typedI18n('schemaConnections'),
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
    const sectionKey = fieldSections[fieldKey] || 'advanced';
    addFieldToSection(sectionProperties, sectionKey, fieldKey, fieldSchema);
  });

  const sections = (Object.keys(SECTION_META) as DetailInspectorSectionKey[])
    .filter((sectionKey) => visibleSections.has(sectionKey))
    .map((sectionKey) => {
      const schema = replaceColorWidget(buildSectionSchema(sectionProperties[sectionKey])) as PropPanelSchema;
      return {
        ...SECTION_META[sectionKey],
        schema,
      };
    })
    .filter((section) => hasVisibleFields(section.schema));

  return sections;
};
