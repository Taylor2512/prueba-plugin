import React, { useEffect, useContext, ReactNode, useRef, useCallback } from 'react';
import {
  ZOOM,
  UIRenderProps,
  SchemaForUI,
  BasePdf,
  Schema,
} from '@sisad-pdfme/common';
import { theme as antdTheme } from 'antd';
import { getSchemaPluginByType as getBuiltInSchemaPluginByType } from '@sisad-pdfme/schemas';
import { SELECTABLE_CLASSNAME, UI_CLASSNAME } from '../constants.js';
import { PluginsRegistry, OptionsContext, I18nContext, CacheContext } from '../contexts.js';
import { resolveSchemaTone, resolveSchemaToneSurface } from './Designer/shared/schemaTone.js';
import { buildPageMetadataAttrs } from './shared/pageMetadata.js';

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
  documentId?: string | null;
  pageIndex?: number;
  pageNumber?: number;
  selectable?: boolean;
  isActive?: boolean;
  isHovering?: boolean;
  isEditing?: boolean;
  onDoubleClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseDownCapture?: (event: React.MouseEvent<HTMLDivElement>) => void;
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
    recipientId?: string;
    recipientColor?: string;
    collaboration?: {
      recipientId?: string;
      recipientColor?: string;
    };
  };
  ownerColor?: string;
  userColor?: string;
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

const Wrapper = ({
  children,
  outline,
  onChangeHoveringSchemaId,
  schema,
  selectable = true,
  isActive = false,
  isHovering = false,
  isEditing = false,
  documentId,
  pageIndex,
  pageNumber,
  onDoubleClick,
  onMouseDownCapture,
}: RendererProps & { children: ReactNode }) => {
  const styleSchema = schema as DesignerStyleAwareSchema;
  const schemaClassName =
    styleSchema.designerClassName || styleSchema.__designer?.metadata?.className || '';
  const schemaStyle = sanitizeDesignerStyle(
    styleSchema.designerStyle || styleSchema.__designer?.metadata?.style,
  );
  const schemaName = typeof schema.name === 'string' && schema.name.trim() ? schema.name.trim() : 'Campo';
  const schemaType = typeof schema.type === 'string' && schema.type.trim() ? schema.type.trim() : 'schema';
  const schemaUid = typeof (schema as Record<string, unknown>).schemaUid === 'string'
    ? (schema as Record<string, unknown>).schemaUid as string
    : schema.id;
  const designerStyleSchema = schema as DesignerStyleAwareSchema;
  const schemaOwnerId =
    designerStyleSchema.__designer?.collaboration?.recipientId ||
    designerStyleSchema.__designer?.recipientId ||
    undefined;
  const schemaOwnerColor =
    designerStyleSchema.__designer?.collaboration?.recipientColor ||
    designerStyleSchema.__designer?.recipientColor ||
    designerStyleSchema.ownerColor ||
    designerStyleSchema.userColor ||
    undefined;
  const schemaTitle = getSchemaTitle(schema);
  const schemaTone = resolveSchemaTone(schema, selectable ? '#38a0ff' : '#94a3b8');
  const schemaSurfaceTone = resolveSchemaToneSurface(schema, '#ffffff', schema.readOnly ? 0.08 : 0.12);
  const schemaHidden = (schema as SchemaForUI & { hidden?: boolean }).hidden === true;
  const isCompactChoiceSchema = schemaType === 'radioGroup';

  const schemaCaption = isCompactChoiceSchema
    ? undefined
    : `${schemaName} · ${schemaType}`;

  const schemaBadge = schemaHidden
    ? 'oculto'
    : schema.readOnly
    ? 'solo lectura'
    : schema.required
      ? 'requerido'
      : undefined;
  const schemaState = isEditing ? 'editing' : isActive ? 'active' : isHovering ? 'hover' : 'idle';
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
    outline: 'none',
  };
  const wrapperStyle = {
    ...wrapperGeometryStyle,
    ...schemaStyle,
    backgroundColor: isCompactChoiceSchema ? 'transparent' : schemaSurfaceTone,
    border: isCompactChoiceSchema ? '1px solid transparent' : outline || `1px solid ${schemaTone}`,
    '--schema-tone': schemaTone,
    '--schema-surface-tone': isCompactChoiceSchema ? 'transparent' : schemaSurfaceTone,
    '--schema-outline': isCompactChoiceSchema ? '1px solid transparent' : outline || `1px solid ${schemaTone}`,
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
      tabIndex={-1}
      onMouseEnter={() => onChangeHoveringSchemaId?.(schema.id)}
      onMouseLeave={() => onChangeHoveringSchemaId?.(null)}
      onMouseDownCapture={onMouseDownCapture}
      className={wrapperClassName}
      id={schema.id}
      style={wrapperStyle}
      data-schema-id={schema.id}
      data-schema-uid={schemaUid}
      data-schema-name={schemaName}
      data-schema-type={schemaType}
      data-schema-caption={schemaCaption || undefined}
      data-schema-badge={schemaBadge || undefined}
      data-schema-state={schemaState}
      data-schema-active={isActive ? 'true' : 'false'}
      data-schema-hovering={isHovering ? 'true' : 'false'}
      data-schema-editing={isEditing ? 'true' : 'false'}
      data-schema-hidden={schemaHidden ? 'true' : 'false'}
      data-schema-readonly={schema.readOnly ? 'true' : 'false'}
      data-schema-required={schema.required ? 'true' : 'false'}
      data-schema-selectable={selectable ? 'true' : 'false'}
      data-schema-owner-id={schemaOwnerId || undefined}
      data-schema-owner-color={schemaOwnerColor || undefined}
      {...buildPageMetadataAttrs({ documentId, pageIndex, pageNumber })}
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
  const plugin = pluginsRegistry.findByType(schema.type) || getBuiltInSchemaPluginByType(schema.type);

  const renderPlugin = useCallback(() => {
    const rootElement = ref.current;
    if (!plugin?.ui || !rootElement || !schema.type) return undefined;

    rootElement.innerHTML = '';

    void plugin.ui({
      value,
      schema,
      basePdf,
      rootElement,
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
      rootElement.innerHTML = '';
    };
  }, [
    _cache,
    basePdf,
    mode,
    onChange,
    options,
    placeholder,
    plugin,
    renderI18n,
    scale,
    schema,
    stopEditing,
    tabIndex,
    theme,
    value,
  ]);

  useEffect(() => renderPlugin(), [renderPlugin]);

  if (!plugin) {
    console.error(`[@sisad-pdfme/ui] Renderer for type ${schema.type} not found. 
Check this document: https://sisad-pdfme.com/docs/custom-schemas`);
    return <></>;
  }

  return (
    <Wrapper {...props}>
      <div ref={ref} className="absolute inset-0" style={FILL_STYLE} />
    </Wrapper>
  );
};

const areRendererPropsEqual = (prev: RendererProps, next: RendererProps) => {
  return (
    prev.basePdf === next.basePdf &&
    prev.schema === next.schema &&
    prev.value === next.value &&
    prev.outline === next.outline &&
    prev.scale === next.scale &&
    prev.selectable === next.selectable &&
    prev.isActive === next.isActive &&
    prev.isHovering === next.isHovering &&
    prev.isEditing === next.isEditing &&
    prev.mode === next.mode
  );
};

export default React.memo(Renderer, areRendererPropsEqual);
