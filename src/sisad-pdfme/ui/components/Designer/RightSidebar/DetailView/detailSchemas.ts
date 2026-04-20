import type { PropPanelSchema, Schema } from '@sisad-pdfme/common';

type BuildInspectorSchemasParams = {
  typedI18n: (key: string) => string;
  typeOptions: Array<{ label: string; value: string | undefined }>;
  defaultSchema: Record<string, unknown>;
  pluginProps: Record<string, Partial<Schema>>;
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

const buildSectionSchema = (properties: Record<string, Partial<Schema>>): PropPanelSchema => ({
  type: 'object',
  column: 2,
  properties,
});

const replaceColorWidget = (schemaNode: unknown): unknown => {
  if (!schemaNode || typeof schemaNode !== 'object') return schemaNode;
  const node = schemaNode as Record<string, unknown>;
  const nextNode: Record<string, unknown> = { ...node };

  if (nextNode.widget === 'color') {
    nextNode.widget = 'nativeColor';
  }

  if (nextNode.properties && typeof nextNode.properties === 'object') {
    const propsObj = nextNode.properties as Record<string, unknown>;
    const nextProps: Record<string, unknown> = {};
    Object.entries(propsObj).forEach(([propKey, propValue]) => {
      nextProps[propKey] = replaceColorWidget(propValue);
    });
    nextNode.properties = nextProps;
  }

  return nextNode;
};

export const buildInspectorSchemas = ({
  typedI18n,
  typeOptions,
  defaultSchema,
  pluginProps,
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
  const generalSchema = buildSectionSchema({
    type: {
      title: typedI18n('type'),
      type: 'string',
      widget: 'select',
      props: { options: typeOptions },
      required: true,
      span: 12,
    },
    name: {
      title: typedI18n('fieldName'),
      type: 'string',
      required: true,
      span: 12,
      rules: [
        {
          validator: validateUniqueSchemaName,
          message: typedI18n('validation.uniqueName'),
        },
      ],
      props: { autoComplete: 'off' },
    },
  });

  const styleSchema = buildSectionSchema({
    align: { title: typedI18n('align'), type: 'void', widget: 'AlignWidget' },
  });

  const layoutSchema = buildSectionSchema({
    position: {
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
    },
    width: {
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
    },
    height: {
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
    },
  });

  const dataSchema = buildSectionSchema({
    editable: {
      title: typedI18n('editable'),
      type: 'boolean',
      span: 12,
      hidden: typeof defaultSchema.readOnly !== 'undefined',
    },
    schemaConnections: {
      title: typedI18n('schemaConnections'),
      type: 'void',
      widget: 'SchemaConnectionsWidget',
    },
  });

  const collaborationSchema = buildSectionSchema({
    collaboration: {
      title: 'Colaboración',
      type: 'void',
      widget: 'SchemaCollaborationWidget',
    },
  });

  const validationSchema = buildSectionSchema({
    required: {
      title: typedI18n('required'),
      type: 'boolean',
      span: 12,
      hidden: '{{!formData.editable}}',
    },
  });

  const advancedProperties = {
    rotate: {
      title: typedI18n('rotate'),
      type: 'number',
      widget: 'inputNumber',
      disabled: typeof defaultSchema.rotate === 'undefined',
      max: 360,
      props: { min: 0 },
      span: 12,
    },
    opacity: {
      title: typedI18n('opacity'),
      type: 'number',
      widget: 'inputNumber',
      disabled: typeof defaultSchema.opacity === 'undefined',
      props: { step: 0.1, min: 0, max: 1 },
      span: 12,
    },
    ...pluginProps,
  };

  return {
    general: replaceColorWidget(generalSchema) as PropPanelSchema,
    style: replaceColorWidget(styleSchema) as PropPanelSchema,
    layout: replaceColorWidget(layoutSchema) as PropPanelSchema,
    data: replaceColorWidget(dataSchema) as PropPanelSchema,
    collaboration: replaceColorWidget(collaborationSchema) as PropPanelSchema,
    validation: replaceColorWidget(validationSchema) as PropPanelSchema,
    advanced: replaceColorWidget(buildSectionSchema(advancedProperties)) as PropPanelSchema,
  };
};
