/**
 * Renderer es el puente entre schemas SISAD PDFME y plugins visuales.
 *
 * Crea un wrapper posicionable/seleccionable con metadata de canvas y monta la
 * UI imperativa del plugin dentro de un rootElement aislado. Esta frontera evita
 * que los plugins manipulen directamente la geometría del contenedor.
 */
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
import { resolveSchemaVisualTone, resolveSchemaOwnerColorValue } from '../../schemas/shared/fieldChrome.js';
import { buildPageMetadataAttrs } from './shared/pageMetadata.js';
import type { EffectiveCollaborationContext } from '../collaborationContext.js';
import { resolveSchemaCollaborationState } from '../collaborationContext.js';

/**
 * Props externas del Renderer.
 *
 * Extienden las props de UI de plugins con información de wrapper, selección,
 * página, documento, hover, edición y geometría runtime.
 */
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
  collaborationContext?: Pick<
    EffectiveCollaborationContext,
    'recipientColorMap' | 'recipientNameMap' | 'activeRecipientId' | 'isGlobalView' | 'actorColor'
  >;
};

/**
 * Schema enriquecido con datos de propietario usados para labels accesibles.
 */
type OwnerAwareSchema = SchemaForUI & { ownerRecipientName?: string };
/**
 * Schema con metadata visual de diseñador.
 *
 * Solo se aceptan estilos seguros; la geometría real del wrapper se controla
 * desde position/width/height/rotate del schema.
 */
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
/**
 * Estilo fijo para que el root imperativo del plugin ocupe todo el wrapper.
 */
const FILL_STYLE: React.CSSProperties = { height: '100%', width: '100%' };

const getSchemaRenderSignature = (schema: SchemaForUI, mode: UIRenderProps<Schema>['mode']) => {
  if (mode !== 'form') return JSON.stringify(schema);

  // Form values are supplied through `value`. Ignore the duplicated schema
  // content so access-policy clones do not remount the imperative editor.
  const { content: _content, ...renderSchema } = schema as SchemaForUI & { content?: unknown };
  return JSON.stringify(renderSchema);
};

const hasFocusedPluginEditor = (rootElement: HTMLDivElement): boolean => {
  if (typeof document === 'undefined') return false;
  const activeElement = document.activeElement;
  if (!activeElement || !rootElement.contains(activeElement)) return false;
  if (activeElement instanceof HTMLElement && activeElement.isContentEditable) return true;
  if (activeElement instanceof HTMLTextAreaElement) return true;
  if (activeElement instanceof HTMLInputElement) {
    return !['checkbox', 'radio', 'button', 'submit', 'reset'].includes(activeElement.type);
  }
  return false;
};
/**
 * Propiedades CSS bloqueadas en designerStyle.
 *
 * Evita que metadata visual sobrescriba la geometría, transformaciones o
 * comportamiento de puntero controlado por el canvas.
 */
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

/**
 * Resuelve el title accesible del schema según estado readOnly/propietario.
 */
const getSchemaTitle = (schema: SchemaForUI): string => {
  if (!schema.readOnly) return schema.name;
  const ownerName = (schema as OwnerAwareSchema).ownerRecipientName;
  return ownerName ? `Solo lectura · ${ownerName}` : 'Solo lectura';
};

/**
 * Convierte una medida en mm del schema a px de canvas usando ZOOM base.
 */
const toCanvasPx = (value: unknown): number => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue * ZOOM : 0;
};

/**
 * Filtra estilos visuales del diseñador para permitir solo decoración segura.
 */
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

/**
 * Wrapper posicionable y seleccionable alrededor de la UI del plugin.
 *
 * Expone dataset estable para Selecto, Moveable, overlays, comentarios, pruebas
 * E2E y colaboración. La UI del plugin vive dentro como contenido aislado.
 */
const Wrapper = ({
  children,
  outline,
  onChangeHoveringSchemaId,
  schema,
  collaborationContext,
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
  const options = useContext(OptionsContext) as { debug?: { showSchemaTechnicalLabels?: boolean } } | null;
  const showSchemaTechnicalLabels = options?.debug?.showSchemaTechnicalLabels === true;
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
  // Ownership accent comes from the single shared resolver (fieldChrome) so the
  // canvas wrapper, inner field chrome and sidebars all agree on the color.
  const resolvedCollaborativeOwnerColor = collaborationContext
    ? resolveSchemaCollaborationState(schema, collaborationContext).ownerColor
    : null;
  const schemaOwnerColor =
    resolvedCollaborativeOwnerColor ||
    resolveSchemaOwnerColorValue(schema) ||
    undefined;
  const schemaTitle = getSchemaTitle(schema);
  // Choice-family schemas draw their own marker chrome, so the field wrapper must
  // stay transparent (no surface tint / border) — otherwise the indicator looks
  // like a box inside a box. Includes the standalone checkbox.
  const isCompactChoiceSchema =
    schemaType === 'radioGroup' || schemaType === 'checkboxGroup' || schemaType === 'checkbox';
  const schemaVisualTone = resolveSchemaVisualTone(schema, {
    fallbackColor: selectable ? '#38a0ff' : '#94a3b8',
  });
  const schemaTone = schemaOwnerColor || schemaVisualTone.ownerColor;
  const schemaSurfaceTone = isCompactChoiceSchema ? 'transparent' : schemaVisualTone.ownerBackground;
  const schemaBorderTone = isCompactChoiceSchema ? 'transparent' : schemaVisualTone.ownerBorder;
  const schemaHidden = (schema as SchemaForUI & { hidden?: boolean }).hidden === true;

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
  const schemaCaptionNode = schemaCaption ? (
    <span
      className="pointer-events-none absolute bottom-[-1px] left-0 max-w-[160px] translate-y-full overflow-hidden text-ellipsis whitespace-nowrap rounded-sm bg-blue-600 px-1 py-px text-[9px] font-medium leading-[1.2] text-white"
      aria-hidden="true"
    >
      {schemaCaption}
    </span>
  ) : null;
  const schemaBadgeNode = schemaBadge ? (
    <span
      className="pointer-events-none absolute right-0 top-0 max-w-[160px] translate-x-[30%] -translate-y-[30%] overflow-hidden text-ellipsis whitespace-nowrap rounded-sm bg-blue-600 px-1 py-px text-center text-[9px] font-medium leading-[1.2] text-white"
      aria-hidden="true"
    >
      {schemaBadge}
    </span>
  ) : null;
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
  const wrapperStateStyle: React.CSSProperties = {
    cursor: selectable ? 'pointer' : 'default',
    transition:
      'box-shadow var(--transition-fast), outline-color var(--transition-fast), background-color var(--transition-fast)',
    zIndex: isEditing ? 12 : isActive ? 10 : 1,
  };
  if (schemaHidden) {
    wrapperStateStyle.opacity = 0.38;
    wrapperStateStyle.filter = 'saturate(0.6)';
  }
  if (!selectable) {
    wrapperStateStyle.cursor = 'default';
  }
  if (schema.readOnly && (isActive || isEditing)) {
    wrapperStateStyle.outline = '1.5px dashed var(--color-gray-300)';
    wrapperStateStyle.outlineOffset = '1px';
  } else if (isEditing) {
    wrapperStateStyle.outline = '1.5px solid color-mix(in srgb, var(--schema-tone) 70%, var(--color-primary-light))';
    wrapperStateStyle.outlineOffset = '1px';
    wrapperStateStyle.boxShadow = 'none';
  } else if (isActive) {
    wrapperStateStyle.outline = '1.5px solid var(--schema-tone)';
    wrapperStateStyle.outlineOffset = '1px';
    wrapperStateStyle.boxShadow = 'none';
  } else if (isHovering) {
    wrapperStateStyle.outline = '1px solid color-mix(in srgb, var(--schema-tone) 45%, transparent)';
    wrapperStateStyle.outlineOffset = '1px';
    wrapperStateStyle.boxShadow = 'none';
  }
  const wrapperStyle = {
    ...wrapperGeometryStyle,
    ...schemaStyle,
    ...wrapperStateStyle,
    backgroundColor: isCompactChoiceSchema ? 'transparent' : schemaSurfaceTone,
    border: isCompactChoiceSchema ? '1px solid transparent' : outline || `1px solid ${schemaBorderTone}`,
    '--schema-tone': schemaTone,
    // Owner color must reflect the assigned recipient; the semantic type tone is
    // only a fallback so unowned schemas keep a sensible accent.
    '--schema-owner-color': schemaOwnerColor || schemaTone,
    '--schema-surface-tone': isCompactChoiceSchema ? 'transparent' : schemaSurfaceTone,
    '--schema-border-tone': schemaBorderTone,
    '--schema-outline': isCompactChoiceSchema ? '1px solid transparent' : outline || `1px solid ${schemaBorderTone}`,
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
      data-owner-color={schemaOwnerColor || undefined}
      data-color-policy={schemaVisualTone.policy}
      {...buildPageMetadataAttrs({ documentId, pageIndex, pageNumber })}
      onDoubleClick={(event) => {
        if (!selectable) return;
        event.preventDefault();
        event.stopPropagation();
        onDoubleClick?.(event);
      }}>
      {children}
      {showSchemaTechnicalLabels ? schemaCaptionNode : null}
      {showSchemaTechnicalLabels ? schemaBadgeNode : null}
    </div>
  );
};

/**
 * Monta el plugin correspondiente al tipo de schema.
 *
 * Limpia el rootElement antes/después de renderizar para que plugins imperativos
 * no acumulen DOM entre renders.
 */
const Renderer = (props: RendererProps) => {
  const { schema, basePdf, value, mode, onChange, stopEditing, tabIndex, placeholder, scale } =
    props;

  const pluginsRegistry = useContext(PluginsRegistry);
  const options = useContext(OptionsContext);
  const i18n = useContext(I18nContext);
  const renderI18n = useCallback((key: string) => i18n(key as never), [i18n]);
  const { token: theme } = antdTheme.useToken();

  const ref = useRef<HTMLDivElement>(null);
  const schemaRef = useRef(schema);
  schemaRef.current = schema;
  const volatileRenderPropsRef = useRef({
    value,
    onChange,
    stopEditing,
    tabIndex,
    placeholder,
  });
  volatileRenderPropsRef.current = {
    value,
    onChange,
    stopEditing,
    tabIndex,
    placeholder,
  };
  const _cache = useContext(CacheContext);
  const plugin = pluginsRegistry.findByType(schema.type) || getBuiltInSchemaPluginByType(schema.type);
  const schemaRenderSignature = getSchemaRenderSignature(schema, mode);

  const renderPlugin = useCallback(() => {
    const rootElement = ref.current;
    const currentSchema = schemaRef.current;
    if (!plugin?.ui || !rootElement || !currentSchema.type) return undefined;

    // Imperative Form editors must not be replaced while typing. React may
    // re-run this effect because the host publishes a new input snapshot.
    if (mode === 'form' && hasFocusedPluginEditor(rootElement)) return undefined;

    const currentProps = volatileRenderPropsRef.current;

    rootElement.innerHTML = '';

    void plugin.ui({
      value: currentProps.value,
      schema: currentSchema,
      basePdf,
      rootElement,
      mode,
      onChange: currentProps.onChange,
      stopEditing: currentProps.stopEditing,
      tabIndex: currentProps.tabIndex,
      placeholder: currentProps.placeholder,
      options,
      theme,
      i18n: renderI18n,
      scale,
      _cache,
    });

    return () => {
      if (mode !== 'form' || !hasFocusedPluginEditor(rootElement)) {
        rootElement.innerHTML = '';
      }
    };
  }, [
    _cache,
    basePdf,
    mode,
    options,
    plugin,
    renderI18n,
    scale,
    schemaRenderSignature,
    theme,
  ]);

  useEffect(() => renderPlugin(), [renderPlugin]);

  const previousValueRef = useRef(value);
  useEffect(() => {
    if (previousValueRef.current === value) return undefined;
    previousValueRef.current = value;

    const rootElement = ref.current;
    const activeElement = typeof document === 'undefined' ? null : document.activeElement;

    // Form plugins own their editor DOM. Re-rendering while an editor is focused
    // replaces the node, which loses focus and reduces sequential typing to one
    // character per render. Keep the local draft; external updates sync on blur.
    if (rootElement && activeElement && rootElement.contains(activeElement)) {
      return undefined;
    }

    return renderPlugin();
  }, [renderPlugin, value]);

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

/**
 * Comparador memoizado enfocado en cambios que afectan visualmente el renderer.
 */
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
