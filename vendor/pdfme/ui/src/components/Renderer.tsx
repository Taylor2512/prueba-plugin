import React, { useEffect, useContext, ReactNode, useRef, useMemo, useCallback } from 'react';
import {
  Mode,
  ZOOM,
  UIRenderProps,
  SchemaForUI,
  BasePdf,
  Schema,
  Plugin,
  UIOptions,
} from '@pdfme/common';
import { theme as antdTheme } from 'antd';
import { SELECTABLE_CLASSNAME, UI_CLASSNAME } from '../constants.js';
import { PluginsRegistry, OptionsContext, I18nContext, CacheContext } from '../contexts.js';

type RendererProps = Omit<
  UIRenderProps<Schema>,
  'schema' | 'rootElement' | 'options' | 'theme' | 'i18n' | '_cache'
> & {
  basePdf: BasePdf;
  schema: SchemaForUI;
  value: string;
  outline: string;
  onChangeHoveringSchemaId?: (schemaId: string | null) => void;
  scale: number;
  selectable?: boolean;
};

type ReRenderCheckProps = {
  plugin?: Plugin<Schema>;
  value: string;
  mode: Mode;
  scale: number;
  schema: SchemaForUI;
  options: UIOptions;
};

type OwnerAwareSchema = SchemaForUI & { ownerRecipientName?: string };
type DesignerStyleAwareSchema = SchemaForUI & {
  designerClassName?: string;
  designerStyle?: React.CSSProperties;
  __designer?: {
    metadata?: {
      className?: string;
      style?: React.CSSProperties;
    };
  };
};
const FILL_STYLE: React.CSSProperties = { height: '100%', width: '100%' };
const REQUIRED_MARK_STYLE: React.CSSProperties = {
  color: 'red',
  position: 'absolute',
  top: -12,
  left: -12,
  fontSize: 18,
  fontWeight: 700,
};

const getSchemaTitle = (schema: SchemaForUI): string => {
  if (!schema.readOnly) return schema.name;
  const ownerName = (schema as OwnerAwareSchema).ownerRecipientName;
  return ownerName ? `Solo lectura · ${ownerName}` : 'Solo lectura';
};

const toSerializableSnapshot = (value: unknown, seen = new WeakMap<object, unknown>): unknown => {
  if (typeof value === 'function' || typeof value === 'symbol') return undefined;
  if (value === null || value === undefined) return value;

  if (Array.isArray(value)) {
    return value.map((item) => toSerializableSnapshot(item, seen));
  }

  if (typeof value !== 'object') return value;

  if (value instanceof Date) return value.toISOString();
  if (value instanceof Map) return Array.from(value.entries()).map(([key, item]) => [
    key,
    toSerializableSnapshot(item, seen),
  ]);
  if (value instanceof Set) return Array.from(value.values()).map((item) =>
    toSerializableSnapshot(item, seen),
  );

  const objectValue = value as Record<string, unknown>;
  if (seen.has(objectValue)) return seen.get(objectValue);

  const snapshot: Record<string, unknown> = {};
  seen.set(objectValue, snapshot);

  Object.entries(objectValue).forEach(([key, item]) => {
    if (key === 'data' && typeof item === 'string' && item.length > 128) {
      snapshot[key] = '...';
      return;
    }

    const nextValue = toSerializableSnapshot(item, seen);
    if (nextValue !== undefined) {
      snapshot[key] = nextValue;
    }
  });

  return snapshot;
};

const useRerenderDependencies = (arg: ReRenderCheckProps) => {
  const { plugin, value, mode, scale, schema, options } = arg;
  const optionStr = useMemo(
    () => JSON.stringify(toSerializableSnapshot(options)),
    [options],
  );

  return useMemo(() => {
    const uninterrupted = Boolean(plugin?.uninterruptedEditMode && mode === 'designer');
    const schemaSignature = uninterrupted ? '' : JSON.stringify(schema);
    const optionsSignature = uninterrupted ? '' : optionStr;
    const valueSignature = uninterrupted ? '__designer_uninterrupted__' : value;

    // Keep a stable dependency array length to avoid React warnings in development.
    return [valueSignature, mode, scale, schemaSignature, optionsSignature];
  }, [value, mode, scale, schema, optionStr, plugin]);
};

const Wrapper = ({
  children,
  outline,
  onChangeHoveringSchemaId,
  schema,
  selectable = true,
}: RendererProps & { children: ReactNode }) => {
  const styleSchema = schema as DesignerStyleAwareSchema;
  const schemaClassName =
    styleSchema.designerClassName || styleSchema.__designer?.metadata?.className || '';
  const schemaStyle = styleSchema.designerStyle || styleSchema.__designer?.metadata?.style || {};

  return (
    <div
      title={getSchemaTitle(schema)}
      onMouseEnter={() => onChangeHoveringSchemaId?.(schema.id)}
      onMouseLeave={() => onChangeHoveringSchemaId?.(null)}
      className={UI_CLASSNAME + ("custom-" + String(
        [selectable ? SELECTABLE_CLASSNAME : '', schemaClassName].filter(Boolean).join(' ')
      ))}
      id={schema.id}>
      {schema.required && <span className={UI_CLASSNAME + "span-auto"}>*</span>}
      {children}
    </div>
  );
};

const Renderer = (props: RendererProps) => {
  const { schema, basePdf, value, mode, onChange, stopEditing, tabIndex, placeholder, scale } =
    props;

  const pluginsRegistry = useContext(PluginsRegistry);
  const options = useContext(OptionsContext);
  const i18n = useContext(I18nContext);
  const renderI18n = useCallback((key: string) => i18n(key as never), [i18n]);
  const { token: theme } = antdTheme.useToken();

  const ref = useRef<HTMLDivElement>(null);
  const _cache = useContext(CacheContext);
  const plugin = pluginsRegistry.findByType(schema.type);

  const reRenderDependencies = useRerenderDependencies({
    plugin,
    value,
    mode,
    scale,
    schema,
    options,
  });

  useEffect(() => {
    if (!plugin?.ui || !ref.current || !schema.type) return;

    ref.current.innerHTML = '';
    const render = plugin.ui;

    void render({
      value,
      schema,
      basePdf,
      rootElement: ref.current,
      mode,
      onChange,
      stopEditing,
      tabIndex,
      placeholder,
      options,
      theme,
      i18n: renderI18n,
      scale,
      _cache,
    });

    return () => {
      if (ref.current) {
        ref.current.innerHTML = '';
      }
    };
  }, [...reRenderDependencies, renderI18n]);

  if (!plugin) {
    console.error(`[@pdfme/ui] Renderer for type ${schema.type} not found. 
Check this document: https://pdfme.com/docs/custom-schemas`);
    return <></>;
  }

  return (
    <Wrapper {...props}>
      <div ref={ref} className={UI_CLASSNAME + "div-auto"} />
    </Wrapper>
  );
};
export default Renderer;
