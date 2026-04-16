import { useForm } from 'form-render';
import React, { useContext, useEffect, useCallback, useMemo } from 'react';
import type {
  Dict,
  ChangeSchemaItem,
  SchemaForUI,
  Schema,
} from '@pdfme/common';
import { isBlankPdf } from '@pdfme/common';
import type { SidebarProps } from '../../../../types.js';
import { I18nContext, PluginsRegistry, OptionsContext } from '../../../../contexts.js';
import { debounce } from '../../../../helper.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { theme } from 'antd';
import { InternalNamePath, ValidateErrorEntity } from 'rc-field-form/es/interface.js';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import {
  buildInspectorSchemas,
} from './detailSchemas.js';
import { buildDetailWidgets } from './detailWidgets.js';
import DetailViewContent from './DetailViewContent.js';
import {
  getSchemaConfigStorageKey,
  getSchemaDesignerConfig,
  mergeSchemaDesignerConfig,
  resolveDesignerEngine,
  type SchemaDesignerConfig,
} from '../../../../designerEngine.js';

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
  selectionCommands?: SelectionCommandSet;
};

const DetailView = (props: DetailViewProps) => {
  const { token } = theme.useToken();
  const { schemasList, changeSchemas, deselectSchema, activeSchema, pageSize, basePdf } = props;
  const form = useForm();
  const i18n = useContext(I18nContext);
  const pluginsRegistry = useContext(PluginsRegistry);
  const options = useContext(OptionsContext);
  const designerEngine = useMemo(() => resolveDesignerEngine(options as Record<string, unknown>), [options]);
  const schemaConfig = useMemo(
    () => getSchemaDesignerConfig(activeSchema, designerEngine) || null,
    [activeSchema, designerEngine],
  );

  const typedI18n = useCallback(
    (key: string): string => {
      return typeof i18n === 'function' ? i18n(key as keyof Dict) : key;
    },
    [i18n],
  );

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

  const optionsKey = JSON.stringify(options);
  const widgets = React.useMemo(
    () =>
      buildDetailWidgets({
        pluginsRegistry,
        options,
        token,
        typedI18n,
        normalizeColorHex,
        props: {
          ...props,
          designerEngine,
          schemaConfig,
          updateSchemaConfig: (patch: Partial<SchemaDesignerConfig>) => {
            const currentConfig = getSchemaDesignerConfig(activeSchema, designerEngine) || {};
            const nextSchema = mergeSchemaDesignerConfig(activeSchema, patch, designerEngine);
            const storageKey = getSchemaConfigStorageKey(designerEngine);
            const nextConfig = getSchemaDesignerConfig(nextSchema, designerEngine) || {};
            if (JSON.stringify(currentConfig) === JSON.stringify(nextConfig)) return;
            changeSchemas([{ schemaId: activeSchema.id, key: storageKey, value: nextConfig }]);
          },
        },
      }),
    [
      activeSchema,
      activeSchema.id,
      changeSchemas,
      designerEngine,
      normalizeColorHex,
      options,
      optionsKey,
      pluginsRegistry,
      props,
      schemaConfig,
      token,
      typedI18n,
    ],
  );

  useEffect(() => form.resetFields(), [activeSchema.id, form]);

  useEffect(() => {
    const values: Record<string, unknown> = { ...activeSchema };
    const readOnly = typeof values.readOnly === 'boolean' ? values.readOnly : false;
    values.editable = !readOnly;
    form.setValues(values);
  }, [activeSchema, form]);

  const validateUniqueSchemaName = useCallback(
    (_: unknown, value: string): boolean => {
      for (const page of schemasList) {
        for (const schema of Object.values(page)) {
          if (schema.name === value && schema.id !== activeSchema.id) {
            return false;
          }
        }
      }
      return true;
    },
    [schemasList, activeSchema.id],
  );

  const [paddingTop, paddingRight, paddingBottom, paddingLeft] = isBlankPdf(basePdf)
    ? basePdf.padding
    : [0, 0, 0, 0];

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

  const typeOptions: Array<{ label: string; value: string | undefined }> = [];
  pluginsRegistry.entries().forEach(([label, plugin]) => {
    typeOptions.push({ label, value: plugin.propPanel.defaultSchema?.type ?? undefined });
  });

  const emptySchema: Record<string, unknown> = {};
  const defaultSchema: Record<string, unknown> = activePlugin?.propPanel?.defaultSchema
    ? (() => {
        const result: Record<string, unknown> = {};
        for (const key in activePlugin.propPanel.defaultSchema) {
          if (Object.prototype.hasOwnProperty.call(activePlugin.propPanel.defaultSchema, key)) {
            result[key] = (activePlugin.propPanel.defaultSchema as Record<string, unknown>)[key];
          }
        }
        return result;
      })()
    : emptySchema;

  const pluginProps =
    typeof activePlugin.propPanel.schema === 'function'
      ? (() => {
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
          const functionResult = activePlugin.propPanel.schema({
            ...propPanelProps,
            options,
            theme: token,
            i18n: typedI18n,
          });
          return functionResult && typeof functionResult === 'object' ? functionResult : {};
        })()
      : activePlugin.propPanel.schema && typeof activePlugin.propPanel.schema === 'object'
        ? activePlugin.propPanel.schema
        : {};

  const maxWidth = pageSize.width - paddingLeft - paddingRight;
  const maxHeight = pageSize.height - paddingTop - paddingBottom;
  const sectionSchemas = buildInspectorSchemas({
    typedI18n,
    typeOptions,
    defaultSchema,
    pluginProps: pluginProps as Record<string, Partial<Schema>>,
    pageSize,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    maxWidth,
    maxHeight,
    validateUniqueSchemaName,
    validatePosition,
  });

  return (
    <DetailViewContent
      activeSchema={activeSchema}
      schemaConfig={schemaConfig}
      deselectSchema={deselectSchema}
      form={form}
      sectionSchemas={sectionSchemas as any}
      widgets={widgets}
      watchHandler={handleWatch}
    />
  );
};

const schemaFingerprint = (schema: SchemaForUI) => {
  const coreKeys = new Set([
    'id',
    'name',
    'type',
    'content',
    'width',
    'height',
    'required',
    'readOnly',
    'rotate',
    'opacity',
    'position',
  ]);
  const rawSchema = schema as SchemaForUI & Record<string, unknown>;
  const extraFingerprint = Object.keys(rawSchema)
    .filter((key) => !coreKeys.has(key))
    .sort()
    .map((key) => `${key}:${JSON.stringify(rawSchema[key])}`)
    .join('|');

  return [
    rawSchema.id,
    rawSchema.name,
    rawSchema.type,
    rawSchema.content,
    rawSchema.width,
    rawSchema.height,
    rawSchema.required ? '1' : '0',
    rawSchema.readOnly ? '1' : '0',
    rawSchema.rotate ?? '',
    rawSchema.opacity ?? '',
    rawSchema.position?.x ?? '',
    rawSchema.position?.y ?? '',
    extraFingerprint,
  ].join('|');
};

const propsAreUnchanged = (prevProps: DetailViewProps, nextProps: DetailViewProps) =>
  schemaFingerprint(prevProps.activeSchema) === schemaFingerprint(nextProps.activeSchema);

export default React.memo(DetailView, propsAreUnchanged);
