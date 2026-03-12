import { useForm } from 'form-render';
import React, { useRef, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Dict,
  ChangeSchemaItem,
  SchemaForUI,
  PropPanelWidgetProps,
  PropPanelSchema,
  Schema,
} from '@pdfme/common';
import { isBlankPdf } from '@pdfme/common';
import type { SidebarProps } from '../../../../types.js';
import { ArrowLeft } from 'lucide-react';
import { I18nContext, PluginsRegistry, OptionsContext } from '../../../../contexts.js';
import { debounce } from '../../../../helper.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { theme, Typography, Button, Divider, Input, Popover, Tooltip } from 'antd';
import AlignWidget from './AlignWidget.js';
import WidgetRenderer from './WidgetRenderer.js';
import ButtonGroupWidget from './ButtonGroupWidget.js';
import DetailHeaderCard from './DetailHeaderCard.js';
import DetailSectionCard from './DetailSectionCard.js';
import { InternalNamePath, ValidateErrorEntity } from 'rc-field-form/es/interface.js';
import { SidebarBody, SidebarFrame, SidebarHeader, SIDEBAR_H_PADDING_PX } from '../layout.js';

// Import FormRender as a default import
import FormRenderComponent from 'form-render';

const { Text } = Typography;

// Wix-like preset palette for the native colour picker
const COLOR_PRESETS = [
  '#000000', '#ffffff', '#f5f5f5', '#e0e0e0',
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4',
  '#1e3a5f', '#7c3aed', '#065f46', '#78350f',
];

const ColorPickerWidget = ({
  value,
  onChange,
  normalizeHex,
}: {
  value: unknown;
  onChange?: (v: string) => void;
  normalizeHex: (v: unknown) => string;
}) => {
  const currentColor = typeof value === 'string' ? value : '#000000';
  const hex = normalizeHex(currentColor);

  const swatches = (
    <div className={DESIGNER_CLASSNAME + "div-auto"}>
      {COLOR_PRESETS.map((preset) => (
        <Tooltip key={preset} title={preset} placement="top">
          <button
            onClick={() => onChange?.(preset)}
            onMouseEnter={(e) => { (e.currentTarget.style.transform = 'scale(1.2)'); }}
            onMouseLeave={(e) => { (e.currentTarget.style.transform = 'scale(1)'); }}
            className={DESIGNER_CLASSNAME + "button-auto"}
          />
        </Tooltip>
      ))}
    </div>
  );

  return (
    <div className={`${DESIGNER_CLASSNAME}color-picker-container`}>
      <Popover content={swatches} trigger="click" placement="bottomLeft">
        <button
          title="Elegir color"
          className={DESIGNER_CLASSNAME + "button-auto"}
        />
      </Popover>
      <input
        type="color"
        className={`${DESIGNER_CLASSNAME}color-picker-input`}
        value={hex}
        onChange={(e) => onChange?.(e.target.value)}
        aria-label="Color picker" />
      <Input
        className={`${DESIGNER_CLASSNAME}color-picker-hex`}
        value={currentColor}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="#000000"
        size="small" />
    </div>
  );
};

type DetailViewProps = Pick<
  SidebarProps,
  | 'size'
  | 'schemas'
  | 'schemasList'
  | 'pageSize'
  | 'basePdf'
  | 'changeSchemas'
  | 'activeElements'
  | 'deselectSchema'
> & {
  activeSchema: SchemaForUI;
};

const DetailView = (props: DetailViewProps) => {
  const { token } = theme.useToken();

  const { schemasList, changeSchemas, deselectSchema, activeSchema, pageSize, basePdf } = props;
  const form = useForm();

  const i18n = useContext(I18nContext);
  const pluginsRegistry = useContext(PluginsRegistry);
  const options = useContext(OptionsContext);

  // Define a type-safe i18n function that accepts string keys
  const typedI18n = useCallback(
    (key: string): string => {
      // Use a type assertion to handle the union type constraint
      return typeof i18n === 'function' ? i18n(key as keyof Dict) : key;
    },
    [i18n],
  );

  const [widgets, setWidgets] = useState<{
    [key: string]: (props: PropPanelWidgetProps) => React.JSX.Element;
  }>({});

  const normalizeColorHex = useCallback((value: unknown): string => {
    if (typeof value !== 'string') return '#000000';
    const hexMatch = value.trim().match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
    if (hexMatch) {
      const raw = hexMatch[1];
      if (raw.length === 3) {
        return `#${raw
          .split('')
          .map((c) => `${c}${c}`)
          .join('')}`;
      }
      return `#${raw}`;
    }
    const rgbMatch = value
      .replace(/\s+/g, '')
      .match(/^rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3})(?:,[0-9.]+)?\)$/i);
    if (rgbMatch) {
      const [r, g, b] = rgbMatch.slice(1, 4).map((n) => {
        const parsed = Number(n);
        return Math.max(0, Math.min(255, Number.isFinite(parsed) ? parsed : 0));
      });
      return `#${[r, g, b]
        .map((channel) => channel.toString(16).padStart(2, '0'))
        .join('')}`;
    }
    return '#000000';
  }, []);

  useEffect(() => {
    const newWidgets: typeof widgets = {
      AlignWidget: (p) => <AlignWidget {...p} {...props} options={options} />,
      Divider: () => (
        <Divider className={`${DESIGNER_CLASSNAME}detail-view-divider`} />
      ),
      ButtonGroup: (p) => <ButtonGroupWidget {...p} {...props} options={options} />,
      nativeColor: (p) => (
        <ColorPickerWidget
          value={p.value}
          onChange={p.onChange}
          normalizeHex={normalizeColorHex}
        />
      ),
    };
    for (const plugin of pluginsRegistry.values()) {
      const widgets = plugin.propPanel.widgets || {};
      Object.entries(widgets).forEach(([widgetKey, widgetValue]) => {
        newWidgets[widgetKey] = (p) => (
          <WidgetRenderer
            {...p}
            {...props}
            options={options}
            theme={token}
            i18n={typedI18n}
            widget={widgetValue}
          />
        );
      });
    }
    setWidgets(newWidgets);
  }, [activeSchema, normalizeColorHex, pluginsRegistry, JSON.stringify(options), token]);

  useEffect(() => form.resetFields(), [activeSchema.id]);

  useEffect(() => {
    // Create a type-safe copy of the schema with editable property
    const values: Record<string, unknown> = { ...activeSchema };
    // Safely access and set properties
    const readOnly = typeof values.readOnly === 'boolean' ? values.readOnly : false;
    values.editable = !readOnly;
    form.setValues(values);
  }, [activeSchema]);

  useEffect(() => {
    uniqueSchemaName.current = (value: string): boolean => {
      for (const page of schemasList) {
        for (const s of Object.values(page)) {
          if (s.name === value && s.id !== activeSchema.id) {
            return false;
          }
        }
      }
      return true;
    };
  }, [schemasList, activeSchema]);

  // Reference to a function that validates schema name uniqueness
  const uniqueSchemaName = useRef(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_unused: string): boolean => true,
  );

  // Use proper type for validator function parameter
  const validateUniqueSchemaName = (_: unknown, value: string): boolean =>
    uniqueSchemaName.current(value);

  // Calculate padding values once
  const [paddingTop, paddingRight, paddingBottom, paddingLeft] = isBlankPdf(basePdf)
    ? basePdf.padding
    : [0, 0, 0, 0];

  // Cross-field validation: only checks when both fields are individually valid
  const validatePosition = (_: unknown, value: number, fieldName: string): boolean => {
    const formValues = form.getValues() as Record<string, unknown>;
    const position = formValues.position as { x: number; y: number } | undefined;
    const width = formValues.width as number | undefined;
    const height = formValues.height as number | undefined;

    if (!position || width === undefined || height === undefined) return true;

    if (fieldName === 'x') {
      if (value < paddingLeft || value > pageSize.width - paddingRight) return true;
      if (width > 0 && value + width > pageSize.width - paddingRight) return false;
    } else if (fieldName === 'y') {
      if (value < paddingTop || value > pageSize.height - paddingBottom) return true;
      if (height > 0 && value + height > pageSize.height - paddingBottom) return false;
    } else if (fieldName === 'width') {
      if (position.x < paddingLeft || position.x > pageSize.width - paddingRight) return true;
      if (value > 0 && position.x + value > pageSize.width - paddingRight) return false;
    } else if (fieldName === 'height') {
      if (position.y < paddingTop || position.y > pageSize.height - paddingBottom) return true;
      if (value > 0 && position.y + value > pageSize.height - paddingBottom) return false;
    }

    return true;
  };

  // Use explicit type for debounce function that matches the expected signature
  const handleWatch = debounce(function (...args: unknown[]) {
    const formSchema = args[0] as Record<string, unknown>;
    const formAndSchemaValuesDiffer = (formValue: unknown, schemaValue: unknown): boolean => {
      if (typeof formValue === 'object' && formValue !== null) {
        return JSON.stringify(formValue) !== JSON.stringify(schemaValue);
      }
      return formValue !== schemaValue;
    };

    let changes: ChangeSchemaItem[] = [];
    for (const key in formSchema) {
      if (['id', 'content'].includes(key)) continue;

      let value = formSchema[key];
      if (formAndSchemaValuesDiffer(value, (activeSchema as Record<string, unknown>)[key])) {
        // FIXME memo: https://github.com/pdfme/pdfme/pull/367#issuecomment-1857468274
        if (value === null && ['rotate', 'opacity'].includes(key)) {
          value = undefined;
        }

        if (key === 'editable') {
          const readOnlyValue = !value;
          changes.push({ key: 'readOnly', value: readOnlyValue, schemaId: activeSchema.id });
          if (readOnlyValue) {
            changes.push({ key: 'required', value: false, schemaId: activeSchema.id });
          }
          continue;
        }

        changes.push({ key, value, schemaId: activeSchema.id });
      }
    }

    if (changes.length) {
      // Only commit these schema changes if they have passed form validation
      form
        .validateFields()
        .then(() => changeSchemas(changes))
        .catch((reason: ValidateErrorEntity) => {
          if (reason.errorFields.length) {
            changes = changes.filter(
              (change: ChangeSchemaItem) =>
                !reason.errorFields.find((field: { name: InternalNamePath; errors: string[] }) =>
                  field.name.includes(change.key),
                ),
            );
          }
          if (changes.length) {
            changeSchemas(changes);
          }
        });
    }
  }, 100);

  const activePlugin = pluginsRegistry.findByType(activeSchema.type);
  if (!activePlugin) {
    throw Error(`[@pdfme/ui] Failed to find plugin used for ${activeSchema.type}`);
  }

  const activePropPanelSchema = activePlugin.propPanel.schema;
  const typeOptions: Array<{ label: string; value: string | undefined }> = [];

  pluginsRegistry.entries().forEach(([label, plugin]) => {
    typeOptions.push({ label, value: plugin.propPanel.defaultSchema?.type ?? undefined });
  });

  // Create a safe empty schema as fallback
  const emptySchema: Record<string, unknown> = {};

  // Safely access the default schema with proper null checking
  const defaultSchema: Record<string, unknown> = activePlugin?.propPanel?.defaultSchema
    ? // Create a safe copy of the schema
      (() => {
        const result: Record<string, unknown> = {};

        // Only copy properties that exist on the object
        for (const key in activePlugin.propPanel.defaultSchema) {
          if (Object.prototype.hasOwnProperty.call(activePlugin.propPanel.defaultSchema, key)) {
            result[key] = (activePlugin.propPanel.defaultSchema as Record<string, unknown>)[key];
          }
        }

        return result;
      })()
    : emptySchema;

  // Calculate max values considering padding
  const maxWidth = pageSize.width - paddingLeft - paddingRight;
  const maxHeight = pageSize.height - paddingTop - paddingBottom;

  // Create a type-safe schema object
  const propPanelSchema: PropPanelSchema = {
    type: 'object',
    column: 2,
    properties: {
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
      editable: {
        title: typedI18n('editable'),
        type: 'boolean',
        span: 8,
        hidden: typeof defaultSchema.readOnly !== 'undefined',
      },
      required: {
        title: typedI18n('required'),
        type: 'boolean',
        span: 16,
        hidden: '{{!formData.editable}}',
      },
      '-': { type: 'void', widget: 'Divider' },
      align: { title: typedI18n('align'), type: 'void', widget: 'AlignWidget' },
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
      rotate: {
        title: typedI18n('rotate'),
        type: 'number',
        widget: 'inputNumber',
        disabled: typeof defaultSchema.rotate === 'undefined',
        max: 360,
        props: { min: 0 },
        span: 6,
      },
      opacity: {
        title: typedI18n('opacity'),
        type: 'number',
        widget: 'inputNumber',
        disabled: typeof defaultSchema.opacity === 'undefined',
        props: { step: 0.1, min: 0, max: 1 },
        span: 6,
      },
    },
  };

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

  // Create a safe copy of the properties
  const safeProperties = { ...propPanelSchema.properties };

  if (typeof activePropPanelSchema === 'function') {
    // Create a new object without the schemasList property
    const { size, schemas, pageSize, changeSchemas, activeElements, deselectSchema, activeSchema } =
      props;
    const propPanelProps = {
      size,
      schemas,
      pageSize,
      changeSchemas,
      activeElements,
      deselectSchema,
      activeSchema,
    };

    // Use the typedI18n function to avoid type issues
    const functionResult = activePropPanelSchema({
      ...propPanelProps,
      options,
      theme: token,
      i18n: typedI18n,
    });

    // Safely handle the result
    const apps = functionResult && typeof functionResult === 'object' ? functionResult : {};

    // Create a divider if needed
    const dividerObj =
      Object.keys(apps).length === 0 ? {} : { '--': { type: 'void', widget: 'Divider' } };

    // Assign properties safely - use type assertion to satisfy TypeScript
    propPanelSchema.properties = {
      ...safeProperties,
      ...(dividerObj as Record<string, Partial<Schema>>),
      ...(apps as Record<string, Partial<Schema>>),
    };
  } else {
    // Handle non-function case
    const apps =
      activePropPanelSchema && typeof activePropPanelSchema === 'object'
        ? activePropPanelSchema
        : {};

    // Create a divider if needed
    const dividerObj =
      Object.keys(apps).length === 0 ? {} : { '--': { type: 'void', widget: 'Divider' } };

    // Assign properties safely - use type assertion to satisfy TypeScript
    propPanelSchema.properties = {
      ...safeProperties,
      ...(dividerObj as Record<string, Partial<Schema>>),
      ...(apps as Record<string, Partial<Schema>>),
    };
  }

  const normalizedPropPanelSchema = replaceColorWidget(propPanelSchema) as PropPanelSchema;

  return (
    <SidebarFrame className={DESIGNER_CLASSNAME + 'detail-view'}>
      <SidebarHeader>
        <Tooltip title={typedI18n('fieldsList')} placement="right">
          <Button
            className={DESIGNER_CLASSNAME + 'back-button'}
            htmlType="button"
            onClick={deselectSchema}
            icon={<ArrowLeft strokeWidth={1.5} size={18} />}
            size="small"
            type="text"
          />
        </Tooltip>
        <Text strong className={DESIGNER_CLASSNAME + 'detail-view-title'}>
          {typedI18n('editField')}
        </Text>
      </SidebarHeader>
      <SidebarBody>
        <DetailHeaderCard activeSchema={activeSchema} />
        <DetailSectionCard
          title={typedI18n('editField')}
          description="Ajusta identidad, tamaño, posición y comportamiento del campo sin salir del documento."
        >
          <div className={`${DESIGNER_CLASSNAME}detail-view-form-shell`}>
            <FormRenderComponent
              form={form}
              schema={normalizedPropPanelSchema}
              widgets={widgets}
              watch={{ '#': handleWatch }}
              locale="en-US"
            />
          </div>
        </DetailSectionCard>
      </SidebarBody>
    </SidebarFrame>
  );
};

const propsAreUnchanged = (prevProps: DetailViewProps, nextProps: DetailViewProps) => {
  return JSON.stringify(prevProps.activeSchema) == JSON.stringify(nextProps.activeSchema);
};

export default React.memo(DetailView, propsAreUnchanged);
