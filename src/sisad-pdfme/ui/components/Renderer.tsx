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
} from '@sisad-pdfme/common';
import { theme as antdTheme } from 'antd';
import { SELECTABLE_CLASSNAME, UI_CLASSNAME } from '../constants.js';
import { PluginsRegistry, OptionsContext, I18nContext, CacheContext } from '../contexts.js';
import { resolveSchemaTone } from './Designer/shared/schemaTone.js';

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
  isActive?: boolean;
  isHovering?: boolean;
  isEditing?: boolean;
  onDoubleClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
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
const BLOCKED_DESIGNER_STYLE_KEYS = new Set([
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'transform',
  'transformOrigin',
  'translate',
  'rotate',
  'scale',
  'opacity',
  'zIndex',
  'pointerEvents',
]);

const getSchemaTitle = (schema: SchemaForUI): string => {
  if (!schema.readOnly) return schema.name;
  const ownerName = (schema as OwnerAwareSchema).ownerRecipientName;
  return ownerName ? `Solo lectura · ${ownerName}` : 'Solo lectura';
};

const toCanvasPx = (value: unknown): number => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue * ZOOM : 0;
};

const sanitizeDesignerStyle = (
  value: React.CSSProperties | undefined,
): React.CSSProperties => {
  if (!value || typeof value !== 'object') return {};
  return Object.entries(value).reduce((acc, [key, styleValue]) => {
    if (BLOCKED_DESIGNER_STYLE_KEYS.has(key)) return acc;
    (acc as Record<string, unknown>)[key] = styleValue;
    return acc;
  }, {} as React.CSSProperties);
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
  isActive = false,
  isHovering = false,
  isEditing = false,
  onDoubleClick,
}: RendererProps & { children: ReactNode }) => {
  const styleSchema = schema as DesignerStyleAwareSchema;
  const schemaClassName =
    styleSchema.designerClassName || styleSchema.__designer?.metadata?.className || '';
  const schemaStyle = sanitizeDesignerStyle(
    styleSchema.designerStyle || styleSchema.__designer?.metadata?.style,
  );
  const schemaName = typeof schema.name === 'string' && schema.name.trim() ? schema.name.trim() : 'Campo';
  const schemaType = typeof schema.type === 'string' && schema.type.trim() ? schema.type.trim() : 'schema';
  const schemaTitle = getSchemaTitle(schema);
  const schemaTone = resolveSchemaTone(schema, selectable ? '#38a0ff' : '#94a3b8');
  const schemaHidden = (schema as SchemaForUI & { hidden?: boolean }).hidden === true;
  const schemaCaption = `${schemaName} · ${schemaType}`;
  const schemaBadge = schemaHidden
    ? 'oculto'
    : schema.readOnly
    ? 'solo lectura'
    : schema.required
      ? 'requerido'
      : schemaType;
  const schemaState = isEditing ? 'editing' : isActive ? 'active' : isHovering ? 'hover' : 'idle';
  const showQuickActions = isHovering || isActive || isEditing;
  const rotation = Number(schema.rotate);
  const wrapperGeometryStyle: React.CSSProperties = {
    position: 'absolute',
    top: toCanvasPx(schema.position?.y),
    left: toCanvasPx(schema.position?.x),
    width: Math.max(1, toCanvasPx(schema.width)),
    height: Math.max(1, toCanvasPx(schema.height)),
    opacity: typeof schema.opacity === 'number' ? schema.opacity : undefined,
    transform: Number.isFinite(rotation) && rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
    transformOrigin: 'center center',
    boxSizing: 'border-box',
  };
  const wrapperStyle = {
    ...wrapperGeometryStyle,
    ...schemaStyle,
    '--schema-tone': schemaTone,
    '--schema-outline': outline || `1px solid ${schemaTone}`,
  } as React.CSSProperties;
  const wrapperClassName = [
    UI_CLASSNAME + 'custom-selectable',
    selectable ? SELECTABLE_CLASSNAME : '',
    schemaClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      title={schemaTitle}
      onMouseEnter={() => onChangeHoveringSchemaId?.(schema.id)}
      onMouseLeave={() => onChangeHoveringSchemaId?.(null)}
      className={wrapperClassName}
      id={schema.id}
      style={wrapperStyle}
      data-schema-id={schema.id}
      data-schema-name={schemaName}
      data-schema-type={schemaType}
      data-schema-caption={schemaCaption}
      data-schema-badge={schemaBadge}
      data-schema-state={schemaState}
      data-schema-active={isActive ? 'true' : 'false'}
      data-schema-hovering={isHovering ? 'true' : 'false'}
      data-schema-editing={isEditing ? 'true' : 'false'}
      data-schema-hidden={schemaHidden ? 'true' : 'false'}
      data-schema-readonly={schema.readOnly ? 'true' : 'false'}
      data-schema-required={schema.required ? 'true' : 'false'}
      data-schema-selectable={selectable ? 'true' : 'false'}
      onDoubleClick={(event) => {
        if (!selectable) return;
        event.preventDefault();
        event.stopPropagation();
        onDoubleClick?.(event);
      }}>
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
    console.error(`[@sisad-pdfme/ui] Renderer for type ${schema.type} not found. 
Check this document: https://sisad-pdfme.com/docs/custom-schemas`);
    return <></>;
  }

  return (
    <Wrapper {...props}>
      <div ref={ref} style={FILL_STYLE} />
    </Wrapper>
  );
};
export default Renderer;
