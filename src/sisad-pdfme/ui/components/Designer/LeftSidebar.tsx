import React, { useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Schema, Plugin, BasePdf, getFallbackFontName, cloneDeep } from '@sisad-pdfme/common';
import { Button } from 'antd';
import { useDraggable } from '@dnd-kit/core';
import { DESIGNER_CLASSNAME } from '../../constants.js';
import { setFontNameRecursively } from '../../helper.js';
import { OptionsContext, PluginsRegistry } from '../../contexts.js';
import PluginIcon from './PluginIcon.js';
import { SidebarFrame } from './RightSidebar/layout.js';
import type { DesignerComponentBridge, DesignerSidebarPresentation } from '../../types.js';
import LeftSidebarTabs, { type LeftSidebarTab, type SidebarTabOption } from './LeftSidebarTabs.js';
import LeftSidebarSearch from './LeftSidebarSearch.js';
import LeftSidebarCustomPanel, { type RuntimeCustomSchemaDefinition } from './LeftSidebarCustomPanel.js';
import { LeftSidebarGroup, LeftSidebarEmptyState } from './LeftSidebarGroup.js';
import LeftSidebarCustomFieldModal, {
  type CustomFieldDef,
} from './LeftSidebarCustomFieldModal.js';
import { mergeClassNames } from './shared/className.js';
import type { DesignerRuntimeExtensions } from './shared/designerExtensions.js';
import { builtInSchemaDefinitions, flatSchemaPlugins } from '@sisad-pdfme/schemas';
import type { SchemaDefinition } from '@sisad-pdfme/schemas';
import {
  upsertCustomSchemaDefinition,
  createCustomSchemaFromDefinition,
} from './schemaRegistry.js';
import useLeftSidebarCatalogState from './useLeftSidebarCatalogState.js';
import { normalizeHexColor } from './shared/recipientColor.js';
import { buildAutoPlaceDescriptor } from './shared/schemaAutoPlace.js';
import { useResponsiveDensity } from './shared/useResponsiveDensity.js';
import { SidebarRail } from './shared/SidebarRail.js';
import { CatalogLayoutToggle, type CatalogLayout } from './shared/CatalogLayoutToggle.js';
import { getCatalogLabel } from './shared/designerLabels.js';
import { lockDesignerSidebarScroll, unlockDesignerSidebarScroll } from './shared/interactionGuards.js';
import SidebarCollapseHandle from './shared/SidebarCollapseHandle.js';

const schemaTypeCategoryMap: Record<string, string> = {
  text: 'Texto',
  number: 'Texto',
  multivariabletext: 'Texto',
  image: 'Imagen y medios',
  svg: 'Imagen y medios',
  signature: 'Firmas',
  line: 'Estructura',
  table: 'Estructura',
  rectangle: 'Estructura',
  ellipse: 'Estructura',
  checkbox: 'Selecciones',
  checkboxgroup: 'Selecciones',
  radiogroup: 'Selecciones',
  select: 'Selecciones',
  dropdown: 'Selecciones',
  date: 'Fecha y Hora',
  datetime: 'Fecha y Hora',
  time: 'Fecha y Hora',
  qrcode: 'QR y Códigos',
  ean13: 'QR y Códigos',
  ean8: 'QR y Códigos',
  code39: 'QR y Códigos',
  code128: 'QR y Códigos',
  itf14: 'QR y Códigos',
  upca: 'QR y Códigos',
  upce: 'QR y Códigos',
  gs1datamatrix: 'QR y Códigos',
  pdf417: 'QR y Códigos',
  japanpost: 'QR y Códigos',
  nw7: 'QR y Códigos',
};

const categoryAliases: Record<string, string> = {
  texto: 'Texto',
  text: 'Texto',
  imagen: 'Imagen y medios',
  imagenes: 'Imagen y medios',
  imágenes: 'Imagen y medios',
  image: 'Imagen y medios',
  media: 'Imagen y medios',
  medios: 'Imagen y medios',
  estructura: 'Estructura',
  selection: 'Selecciones',
  seleccion: 'Selecciones',
  'selección': 'Selecciones',
  opciones: 'Selecciones',
  fecha: 'Fecha y Hora',
  fechas: 'Fecha y Hora',
  datetime: 'Fecha y Hora',
  'fecha y hora': 'Fecha y Hora',
  codigos: 'QR y Códigos',
  'códigos': 'QR y Códigos',
  barcode: 'QR y Códigos',
  barcodes: 'QR y Códigos',
  qr: 'QR y Códigos',
  firma: 'Firmas',
  signatures: 'Firmas',
  general: 'General',
};

const categoryOrder = [
  'Firmas',
  'Texto',
  'Imagen y medios',
  'Selecciones',
  'Fecha y Hora',
  'QR y Códigos',
  'Estructura',
  'General',
];

const normalizeCatalogCategory = (value: string): string => {
  const normalized = String(value || '').trim();
  if (!normalized) return '';
  const key = normalized.toLowerCase();
  return categoryAliases[key] || normalized;
};

const resolveCatalogCategory = (schemaType: string, schemaCategory?: string, customCategory?: string): string => {
  const custom = normalizeCatalogCategory(String(customCategory || ''));
  if (custom) return custom;
  const typeMapped = schemaTypeCategoryMap[String(schemaType || '').toLowerCase()] || 'General';
  const declared = normalizeCatalogCategory(String(schemaCategory || ''));
  if (typeMapped !== 'General') return typeMapped;
  if (!declared) return 'General';
  return declared;
};
const PREFILL_SCHEMA_TYPES = new Set([
  'text',
  'multivariabletext',
  'date',
  'datetime',
  'time',
  'number',
  'select',
  'dropdown',
]);

const PREFILL_LABEL_TOKENS = [
  'nombre',
  'correo',
  'email',
  'empresa',
  'cargo',
  'telefono',
  'teléfono',
  'celular',
  'direccion',
  'dirección',
  'ciudad',
  'pais',
  'país',
  'identificacion',
  'identificación',
  'ruc',
];

const CUSTOM_LABEL_TOKENS = ['personalizado', 'custom', 'variable', 'autorrellenable', 'prerrellenable'];

type ActiveRecipientOption = {
  id: string;
  name?: string;
  tag?: string;
  color?: string | null;
  responsibility?: string;
  routingOrder?: number;
  isMassive?: boolean;
  massiveId?: string | null;
};

export type CatalogLayout = 'list' | 'tiles' | 'icons';
export type SidebarDensity = 'comfortable' | 'compact' | 'narrow';
export type CatalogQuickFilter = 'all' | 'favorites' | 'recent';
export type CatalogCapability = 'designer' | 'content' | 'layout' | 'selection' | 'prefill' | 'dynamic';
const SHOW_ADVANCED_CATALOG_CONTROLS = false;

const resolveCatalogViewTestMode = (layout: CatalogLayout): 'rich' | 'compact' | 'mini' => {
  if (layout === 'list') return 'rich';
  if (layout === 'tiles') return 'compact';
  return 'mini';
};

const resolveCatalogDensityButtonSkin = (layout: CatalogLayout, density: SidebarDensity): string => {
  if (density !== 'minimal') return '';
  if (layout === 'tiles') {
    return 'min-h-[3rem] gap-[0.18rem] p-[0.28rem_0.3rem]';
  }
  if (layout === 'icons') {
    return 'min-h-[2.55rem] gap-[0.22rem] p-[0.22rem_0.3rem]';
  }
  return '';
};

const resolveCatalogDensityIconSize = (layout: CatalogLayout, density: SidebarDensity): number | undefined => {
  if (layout === 'tiles' && density === 'minimal') return 24;
  return undefined;
};

const resolveCatalogDensityTitleClass = (layout: CatalogLayout, density: SidebarDensity): string => {
  if (layout !== 'tiles' || density !== 'minimal') return '';
  return 'text-[0.54rem] [display:-webkit-box] [line-clamp:1] [-webkit-line-clamp:1] [-webkit-box-orient:vertical]';
};


type CatalogSchemaItem = {
  key: string;
  label: string;
  pluginType: string;
  category: string;
  plugin: Plugin<Schema>;
  schemaFactory?: () => Schema | null;
  source: 'builtin' | 'custom';
  tags: string[];
  capabilities: string[];
  description: string;
  score?: number;
  definitionId?: string;
};

const HIDDEN_CATALOG_TYPE_SYNONYMS: Record<string, string[]> = {
  qrcode: [
    'barcode',
    'barcodes',
    'qrcode',
    'qr',
    'ean13',
    'ean8',
    'code39',
    'code128',
    'itf14',
    'upca',
    'upce',
    'gs1datamatrix',
    'pdf417',
    'japanpost',
    'nw7',
  ],
};

const normalizeCatalogType = (value: unknown): string =>
  String(value || '')
    .trim()
    .toLowerCase();

const buildHiddenCatalogTypeSet = (values: unknown): Set<string> => {
  const entries = Array.isArray(values) ? values : [];
  const normalized = new Set<string>();

  entries.forEach((value) => {
    const type = normalizeCatalogType(value);
    if (!type) return;
    normalized.add(type);
    (HIDDEN_CATALOG_TYPE_SYNONYMS[type] || []).forEach((synonym) => normalized.add(synonym));
  });

  return normalized;
};

type SidebarButtonsProps = {
  activeTab: LeftSidebarTab;
  variant: 'compact' | 'panel';
  sidebarDensityMode: 'comfortable' | 'compact' | 'minimal';
  groupedPlugins: Array<{ category: string; items: CatalogSchemaItem[] }>;
  recentCatalogItems: CatalogSchemaItem[];
  collapsedCategories: Record<string, boolean>;
  quickFilter: CatalogQuickFilter;
  normalizedSearch: string;
  resolvedLayout: CatalogLayout;
  hasPlugins: boolean;
  filteredCustomDefinitions: RuntimeCustomSchemaDefinition[];
  renderPluginButton: (item: CatalogSchemaItem) => React.ReactNode;
  renderCustomFieldItem: (definition: RuntimeCustomSchemaDefinition, plugin: Plugin<Schema>) => React.ReactNode;
  resolvePlugin: (pluginType: string) => Plugin<Schema> | null | undefined;
  onOpenCreate: () => void;
  onToggleCategory: (category: string) => void;
};

const SidebarButtons = ({
  activeTab,
  variant,
  sidebarDensityMode,
  groupedPlugins,
  recentCatalogItems,
  collapsedCategories,
  quickFilter,
  normalizedSearch,
  resolvedLayout,
  hasPlugins,
  filteredCustomDefinitions,
  renderPluginButton,
  renderCustomFieldItem,
  resolvePlugin,
  onOpenCreate,
  onToggleCategory,
}: SidebarButtonsProps) => (
  <>
    {activeTab !== 'custom' && quickFilter === 'all' && !normalizedSearch && recentCatalogItems.length > 0 ? (
      <LeftSidebarGroup
        key="__recent"
        category="Recientes"
        count={recentCatalogItems.length}
        layout={resolvedLayout}
        density={sidebarDensityMode}
        collapsed={Boolean(collapsedCategories['__recent'])}
        collapsible
        onToggle={() => onToggleCategory('__recent')}
        items={collapsedCategories['__recent'] ? [] : recentCatalogItems.map(renderPluginButton)}
      />
    ) : null}
    {activeTab !== 'custom'
      ? groupedPlugins.map(({ category, items }) => (
        <LeftSidebarGroup
          key={category}
          category={category}
          count={items.length}
          layout={resolvedLayout}
          density={sidebarDensityMode}
          collapsed={Boolean(collapsedCategories[category])}
          collapsible
          onToggle={() => onToggleCategory(category)}
          items={collapsedCategories[category] ? [] : items.map(renderPluginButton)}
        />
      ))
      : null}
    {activeTab !== 'custom' && groupedPlugins.length === 0 ? (
      <LeftSidebarEmptyState density={sidebarDensityMode} />
    ) : null}
    {activeTab === 'custom' ? (
      <LeftSidebarCustomPanel
        definitions={filteredCustomDefinitions}
        variant={variant}
        density={sidebarDensityMode}
        renderItem={renderCustomFieldItem}
        resolvePlugin={resolvePlugin}
        onOpenCreate={onOpenCreate}
      />
    ) : null}
  </>
);

const SUPPORTED_CAPABILITIES: CatalogCapability[] = [
  'designer',
  'content',
  'layout',
  'selection',
  'prefill',
  'dynamic',
];

const tokenize = (value: string) =>
  String(value || '')
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.trim())
    .filter((part): part is string => Boolean(part));

const parseSearchQuery = (query: string) => {
  const rawTokens = tokenize(query);
  const capabilities = new Set<string>();
  const categories = new Set<string>();
  const types = new Set<string>();
  const tags = new Set<string>();
  const freeTerms: string[] = [];

  rawTokens.forEach((token) => {
    if (token.startsWith('cap:')) {
      const value = token.slice(4).trim();
      if (value) capabilities.add(value);
      return;
    }
    if (token.startsWith('cat:')) {
      const value = token.slice(4).trim();
      if (value) categories.add(value);
      return;
    }
    if (token.startsWith('type:')) {
      const value = token.slice(5).trim();
      if (value) types.add(value);
      return;
    }
    if (token.startsWith('tag:')) {
      const value = token.slice(4).trim();
      if (value) tags.add(value);
      return;
    }
    freeTerms.push(token);
  });

  return {
    freeTerms,
    capabilities,
    categories,
    types,
    tags,
  };
};

const subsequenceMatch = (text: string, pattern: string) => {
  let ti = 0;
  let pi = 0;
  while (ti < text.length && pi < pattern.length) {
    if (text[ti] === pattern[pi]) pi += 1;
    ti += 1;
  }
  return pi === pattern.length;
};

const scoreToken = (haystack: string, token: string): number => {
  if (!token) return 0;
  if (haystack === token) return 120;
  if (haystack.startsWith(token)) return 90;
  if (haystack.includes(token)) return 60;
  if (subsequenceMatch(haystack, token)) return 35;
  return 0;
};

const buildFallbackPluginEntries = (): [string, Plugin<Schema>][] => {
  const labelsByType = new Map<string, string>(
    (builtInSchemaDefinitions || []).map((definition) => [
      String(definition?.type || '').toLowerCase(),
      String(definition?.label || '').trim(),
    ]),
  );

  const entries = Object.entries((flatSchemaPlugins || {}) as Record<string, Plugin<Schema>>)
    .filter(([, plugin]) => Boolean(plugin?.propPanel?.defaultSchema))
    .map(([key, plugin]) => {
      const pluginType = String(plugin?.propPanel?.defaultSchema?.type || key || '')
        .trim()
        .toLowerCase();
      const label = labelsByType.get(pluginType) || String(key || pluginType || 'Campo');
      return [label, plugin] as [string, Plugin<Schema>];
    });

  const deduped = new Map<string, [string, Plugin<Schema>]>();
  entries.forEach(([label, plugin]) => {
    const pluginType = String(plugin?.propPanel?.defaultSchema?.type || '').trim().toLowerCase();
    if (!pluginType) return;
    const existing = deduped.get(pluginType);
    if (!existing) {
      deduped.set(pluginType, [label, plugin]);
      return;
    }
    const [existingLabel, existingPlugin] = existing;
    const existingIsBuiltIn = Boolean(existingPlugin?.propPanel?.defaultSchema);
    const nextIsBuiltIn = Boolean(plugin?.propPanel?.defaultSchema);
    if (nextIsBuiltIn && !existingIsBuiltIn) {
      deduped.set(pluginType, [label, plugin]);
      return;
    }
    if (nextIsBuiltIn === existingIsBuiltIn && label.length < existingLabel.length) {
      deduped.set(pluginType, [label, plugin]);
    }
  });

  return Array.from(deduped.values());
};

const highlightTerm = (value: string, terms: string[]) => {
  if (!value || !terms.length) return value;
  const escaped = terms
    .filter((term): term is string => Boolean(term))
    .sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!escaped.length) return value;
  const matcher = new RegExp(`(${escaped.join('|')})`, 'ig');
  const parts = value.split(matcher);
  let cursor = 0;
  return (
    <>
      {parts.map((part) => {
        const start = cursor;
        cursor += part.length;
        const isMatch = terms.some((term) => term && part.toLowerCase() === term.toLowerCase());
        return isMatch ? (
          <mark key={`${part}-${start}`} className={DESIGNER_CLASSNAME + 'left-sidebar-highlight'}>
            {part}
          </mark>
        ) : (
          <React.Fragment key={`${part}-${start}`}>{part}</React.Fragment>
        );
      })}
    </>
  );
};

const Draggable = (props: {
  draggableId: string;
  plugin: Plugin<Schema>;
  scale: number;
  basePdf: BasePdf;
  schema?: Schema;
  schemaFactory?: () => Schema | null;
  onDragStateChange?: (isDragging: boolean) => void;
  children: (drag: {
    listeners: ReturnType<typeof useDraggable>['listeners'];
    attributes: ReturnType<typeof useDraggable>['attributes'];
    isDragging: boolean;
  }) => React.ReactNode;
}) => {
  const { plugin, onDragStateChange } = props;
  const options = useContext(OptionsContext);
  const baseSchema = cloneDeep(props.schemaFactory?.() || props.schema || plugin.propPanel.defaultSchema);
  if (options.font) {
    const fontName = getFallbackFontName(options.font);
    setFontNameRecursively(baseSchema, fontName);
  }
  const draggable = useDraggable({
    id: props.draggableId,
    data: {
      schema: cloneDeep(baseSchema),
      type: baseSchema.type,
    },
  });
  const { listeners, setNodeRef, attributes, isDragging } = draggable;

  useEffect(() => {
    onDragStateChange?.(isDragging);
  }, [isDragging, onDragStateChange]);

  return (
    <div ref={setNodeRef}>
      <div
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'left-sidebar-draggable-shell',
          '[opacity:var(--sisad-pdfme-left-sidebar-draggable-opacity,_1)] [transform:scale(var(--sisad-pdfme-left-sidebar-draggable-scale,_1))] [transition:opacity_120ms_ease,_transform_120ms_ease]',
          isDragging ? '[opacity:0.36] [transform:scale(0.96)] saturate-[1.06]' : '',
        )}
        data-dragging={isDragging ? 'true' : 'false'}
        data-drag-source={isDragging ? 'true' : 'false'}
        data-dragging-schema-type={String(baseSchema.type || '')}
        onPointerDownCapture={() => {
          onDragStateChange?.(true);
        }}
        onPointerUpCapture={() => {
          onDragStateChange?.(false);
        }}>
        {props.children({ listeners, attributes, isDragging })}
      </div>
    </div>
  );
};

const SidebarShell = ({
  tabs,
  activeTab,
  onChangeTab,
  renderTabIcon,
  searchNode,
  activeRecipientLabel,
  activeRecipientColor,
  style,
  density = 'comfortable',
  children,
}: {
  tabs: SidebarTabOption[];
  activeTab: LeftSidebarTab;
  onChangeTab: (tab: LeftSidebarTab) => void;
  renderTabIcon: (tab: LeftSidebarTab) => React.ReactNode;
  searchNode: React.ReactNode;
  activeRecipientLabel?: string | null;
  activeRecipientColor?: string | null;
  style?: React.CSSProperties;
  density?: 'comfortable' | 'compact' | 'minimal';
  children: React.ReactNode;
}) => (
    <div
      className={mergeClassNames(
        `${DESIGNER_CLASSNAME}left-sidebar-shell`,
        `${DESIGNER_CLASSNAME}sidebar-surface`,
        'flex h-full min-h-0 flex-col overflow-hidden rounded-[0.95rem] border border-slate-200/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-[14px]',
        density === 'compact' ? 'rounded-[0.72rem] p-[0.12rem_0.12rem_0.12rem]' : density === 'minimal' ? 'p-[0.08rem_0.08rem_0.08rem]' : 'p-[0.2rem_0.16rem_0.16rem]',
      )}
      style={style}
      data-density={density}
    >
      <div className={mergeClassNames(
        `${DESIGNER_CLASSNAME}left-sidebar-dock-header`, 
        'flex shrink-0 flex-col items-start gap-0.5 border-b border-slate-200/70 px-2 py-1.5',
        density === 'minimal' ? 'hidden' : ''
      )}>
        {density !== 'compact' && (
          <span className={mergeClassNames(`${DESIGNER_CLASSNAME}left-sidebar-dock-kicker`, 'text-[0.48rem] font-semibold uppercase tracking-[0.12em] text-slate-350')}>
            Campos
          </span>
        )}
          <span className={mergeClassNames(`${DESIGNER_CLASSNAME}left-sidebar-dock-title`, 'flex min-w-0 flex-wrap items-center gap-1.5 text-[0.7rem] font-bold text-slate-900')}>
            {activeRecipientLabel && density === 'comfortable' ? (
            <span className={mergeClassNames(`${DESIGNER_CLASSNAME}left-sidebar-dock-recipient`, 'inline-flex max-w-full items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-sky-50 px-1.5 py-0.5 text-[0.55rem] font-semibold text-sky-700')}>
              {activeRecipientLabel}
            </span>
          ) : null}
          </span>
      </div>
      <div className={mergeClassNames(
        `${DESIGNER_CLASSNAME}left-sidebar-control-band`,
        'shrink-0 border-b border-slate-200/70 bg-transparent',
        density === 'minimal' ? 'px-1 py-0.5 space-y-0.5' : density === 'compact' ? 'px-1.5 py-1 space-y-0.5' : 'px-2 py-1 space-y-1',
      )}>
        <LeftSidebarTabs
          tabs={tabs}
          activeTab={activeTab}
          onChangeTab={onChangeTab}
          renderTabIcon={renderTabIcon}
          density={density}
        />
        {searchNode ? (
          <div className={density === 'minimal' ? 'py-0.5' : 'py-0.5'}>{searchNode}</div>
        ) : null}
      </div>
      <div
        className={mergeClassNames(
          `${DESIGNER_CLASSNAME}left-sidebar-main`,
          'min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain bg-[linear-gradient(180deg,rgba(255,255,255,0.38),rgba(248,250,252,0.8))]',
          density === 'compact' ? 'pr-[0.125rem]' : '',
          density === 'minimal' ? 'px-0.5 py-0.5 space-y-0.5' : density === 'compact' ? 'px-1 py-1 space-y-0.5' : 'px-1.5 py-1.5 space-y-1'
        )}
        data-left-sidebar-scroll="true"
        data-sidebar-scroll-container="true"
      >
        {children}
      </div>
  </div>
);

export type LeftSidebarProps = {
  scale: number;
  basePdf: BasePdf;
  activeRecipientColor?: string | null;
  variant?: 'compact' | 'panel';
  useLayoutFrame?: boolean;
  showSearch?: boolean;
  showItemMeta?: boolean;
  showItemDescription?: boolean;
  showTechnicalLabels?: boolean;
  showCatalogViewSwitcher?: boolean;
  detached?: boolean;
  presentation?: DesignerSidebarPresentation;
  responsiveBreakpoint?: number;
  viewportWidth?: number;
  className?: string;
  useDefaultStyles?: boolean;
  classNames?: {
    container?: string;
    content?: string;
    searchInput?: string;
  };
  styleOverrides?: {
    container?: React.CSSProperties;
    content?: React.CSSProperties;
    searchInput?: React.CSSProperties;
  };
  onSchemaClick?: (schema: Schema, schemaType: string) => void;
  bridge?: DesignerComponentBridge;
  extensions?: DesignerRuntimeExtensions;
  catalogLayout?: CatalogLayout;
  onCatalogLayoutChange?: (layout: CatalogLayout) => void;
};

const LeftSidebar = ({
  scale,
  basePdf,
  variant = 'compact',
  useLayoutFrame = false,
  activeRecipientColor: activeRecipientColorOverride = null,
  showSearch,
  detached = false,
  presentation = 'auto',
  responsiveBreakpoint = 1080,
  viewportWidth,
  className = '',
  useDefaultStyles = true,
  classNames,
  styleOverrides: _styleOverrides,
  onSchemaClick,
  catalogLayout,
  onCatalogLayoutChange,
  showCatalogViewSwitcher = true,
  extensions,
}: LeftSidebarProps) => {
  const pluginsRegistry = useContext(PluginsRegistry);
  const options = useContext(OptionsContext) as Record<string, unknown>;
  const resolvedContextRecipientColor =
    typeof options.activeRecipientColor === 'string' && String(options.activeRecipientColor || '').trim()
      ? String(options.activeRecipientColor).trim()
      : typeof options.activeRecipient === 'object' && options.activeRecipient
        ? String((options.activeRecipient as ActiveRecipientOption).color || '').trim() || null
        : null;
  const activeRecipientLabel =
    typeof options.activeRecipient === 'object' && options.activeRecipient
      ? String((options.activeRecipient as ActiveRecipientOption).name || (options.activeRecipient as ActiveRecipientOption).tag || '')
      : '';
  const activeRecipientColor = normalizeHexColor(
    extensions?.resolveRecipientColor?.(
      typeof options.activeRecipient === 'object' && options.activeRecipient
        ? (options.activeRecipient as ActiveRecipientOption)
        : null,
    ) ||
      activeRecipientColorOverride ||
      resolvedContextRecipientColor,
  );
  const activeRecipientTone = activeRecipientColor;
  const activeRecipientStyles = activeRecipientTone
    ? ({
        '--schema-owner-color': activeRecipientTone,
        '--schema-owner-surface': `color-mix(in srgb, ${activeRecipientTone} 24%, var(--color-white))`,
        '--schema-owner-surface-strong': `color-mix(in srgb, ${activeRecipientTone} 38%, var(--color-white))`,
      } as React.CSSProperties)
    : undefined;
  const {
    search,
    setSearch,
    activeTab,
    setActiveTab,
    customModalOpen,
    setCustomModalOpen,
    customDraft,
    setCustomDraft,
    runtimeCustomDefinitions,
    favoritePlugins,
    setFavoritePlugins,
    recentPlugins,
    quickFilter,
    setQuickFilter,
    activeCapabilities,
    setActiveCapabilities,
    resolvedLayout,
    setUserLayout,
    collapsedCategories,
    setCollapsedCategories,
    markRecent,
    isDragging,
    setIsDragging,
  } = useLeftSidebarCatalogState({ catalogLayout });
  const hiddenCatalogTypes = useMemo(
    () => buildHiddenCatalogTypeSet(options.hiddenCatalogTypes),
    [options.hiddenCatalogTypes],
  );

  const clickCooldownRef = useRef(0);

  /**
   * Ejecuta la acción de clic en un schema con cooldown para evitar
   * duplicaciones por doble clic accidental.
   */
  const handleSchemaClick = useCallback(
    (schema: Schema, schemaType: string) => {
      const now = Date.now();
      if (now - clickCooldownRef.current < 450) {
        return;
      }
      clickCooldownRef.current = now;

      if (typeof onSchemaClick === 'function') {
        onSchemaClick(schema, schemaType);
        markRecent(schemaType);
      }
    },
    [onSchemaClick, markRecent],
  );

  const normalizedSearch = search.trim().toLowerCase();
  const parsedQuery = useMemo(() => parseSearchQuery(normalizedSearch), [normalizedSearch]);
  const searchTerms = parsedQuery.freeTerms;
  const builtInDefinitionsByType = useMemo(() => {
    return new Map<string, SchemaDefinition>(
      builtInSchemaDefinitions.map((definition) => [String(definition.type || '').toLowerCase(), definition]),
    );
  }, []);

  const plugins = useMemo(() => {
    const registryEntries = pluginsRegistry
      .entries()
      .filter(([, plugin]) => Boolean(plugin?.propPanel?.defaultSchema));
    if (registryEntries.length > 0) return registryEntries;
    return buildFallbackPluginEntries();
  }, [pluginsRegistry]);

  const filteredCustomDefinitions = useMemo(
    () =>
      runtimeCustomDefinitions.filter((definition: RuntimeCustomSchemaDefinition) => {
        if (!normalizedSearch) return true;
        const target = [
          definition.label,
          definition.category,
          definition.pluginType,
          definition.autoFillSource ? 'autofill' : '',
          definition.defaultValue ? 'default' : '',
        ]
          .filter((part): part is string => Boolean(part))
          .join(' ')
          .toLowerCase();
        return target.includes(normalizedSearch);
      }),
    [normalizedSearch, runtimeCustomDefinitions],
  );

  const groupedPlugins = useMemo(() => {
    const grouped = new Map<string, CatalogSchemaItem[]>();
    const customCategoryByLabel = new Map(
      runtimeCustomDefinitions.map((definition: RuntimeCustomSchemaDefinition) => [
        String(definition.label || '').trim(),
        String(definition.category || '').trim(),
      ]),
    );
    plugins
      .filter(([label, plugin]) => {
        const schemaType = String(plugin?.propPanel?.defaultSchema?.type || '').toLowerCase();
        if (hiddenCatalogTypes.has(schemaType)) return false;
        const normalizedLabel = String(label || '').toLowerCase();
        const isPrefillByLabel = PREFILL_LABEL_TOKENS.some((token) => normalizedLabel.includes(token));
        const isPrefill = isPrefillByLabel && PREFILL_SCHEMA_TYPES.has(schemaType);
        const isCustom = CUSTOM_LABEL_TOKENS.some((token) => normalizedLabel.includes(token));

        if (activeTab === 'prefill') return isPrefill;
        if (activeTab === 'custom') return isCustom;
        return !isPrefill && !isCustom;
      })
      .forEach(([label, plugin]) => {
        const type = String(plugin?.propPanel?.defaultSchema?.type || '');
        const normalizedType = type.toLowerCase();
        const builtInDefinition = builtInDefinitionsByType.get(normalizedType);
        const customCategory = customCategoryByLabel.get(String(label || '').trim());
        const category = resolveCatalogCategory(type, String(builtInDefinition?.category || ''), customCategory);
        const tags = (builtInDefinition?.tags || []).map((tag) => String(tag));
        const capabilities = (builtInDefinition?.capabilities || []).map((capability) => String(capability));
        const builtInDescription = String(
          (builtInDefinition as (SchemaDefinition & { description?: string }) | undefined)?.description || '',
        ).trim();
        const description = builtInDescription || `${label} • ${type}`;
        const isFavorite = favoritePlugins.has(type);
        const isRecent = recentPlugins.includes(type);
        const passesQuickFilter =
          quickFilter === 'all' ||
          (quickFilter === 'favorites' && isFavorite) ||
          (quickFilter === 'recent' && isRecent);

        if (!passesQuickFilter) return;

        const activeCapabilityFilter = new Set<string>([
          ...Array.from(activeCapabilities).map((capability) => String(capability).toLowerCase()),
          ...Array.from(parsedQuery.capabilities).map((capability) => String(capability).toLowerCase()),
        ]);
        if (activeCapabilityFilter.size > 0) {
          const capabilitySet = new Set(capabilities.map((capability) => capability.toLowerCase()));
          const matchesCapabilities = Array.from(activeCapabilityFilter).every((capability) =>
            capabilitySet.has(String(capability).toLowerCase()),
          );
          if (!matchesCapabilities) return;
        }

        if (parsedQuery.categories.size > 0) {
          const normalizedCategory = category.toLowerCase();
          const matchesCategory = Array.from(parsedQuery.categories).some((facetCategory) =>
            normalizedCategory.includes(String(facetCategory).toLowerCase()),
          );
          if (!matchesCategory) return;
        }

        if (parsedQuery.types.size > 0) {
          const normalizedTypeFacet = type.toLowerCase();
          const matchesType = Array.from(parsedQuery.types).some((facetType) =>
            normalizedTypeFacet.includes(String(facetType).toLowerCase()),
          );
          if (!matchesType) return;
        }

        if (parsedQuery.tags.size > 0) {
          const normalizedTags = tags.map((tag) => String(tag).toLowerCase());
          const matchesTag = Array.from(parsedQuery.tags).some((facetTag) =>
            normalizedTags.some((tag) => tag.includes(String(facetTag).toLowerCase())),
          );
          if (!matchesTag) return;
        }

        const searchCorpus = [
          String(label || ''),
          type,
          category,
          description,
          tags.join(' '),
          capabilities.join(' '),
        ]
          .join(' ')
          .toLowerCase();
        const tokenScores = searchTerms.map((term) => scoreToken(searchCorpus, term));
        if (searchTerms.length > 0 && tokenScores.some((score) => score <= 0)) return;
        const score = tokenScores.reduce<number>((acc, scoreValue) => acc + scoreValue, 0);

        if (!grouped.has(category)) grouped.set(category, []);
        const existingItems = grouped.get(category) || [];
        const existingIndex = existingItems.findIndex((item) => item.pluginType === type);
        if (existingIndex >= 0) {
          const existing = existingItems[existingIndex];
          const existingScore = existing.score || 0;
          const preferNewItem =
            (builtInDefinition && existing.source !== 'builtin') ||
            (builtInDefinition && existing.label !== String(builtInDefinition.label || label || type)) ||
            score > existingScore;
          if (!preferNewItem) return;
          grouped.set(
            category,
            existingItems.filter((item) => item.pluginType !== type),
          );
        }

        grouped.get(category)?.push({
          key: `${String(label || type)}::${type}`,
          label: String(label || type),
          pluginType: type,
          category,
          plugin,
          source: builtInDefinition ? 'builtin' : 'custom',
          tags,
          capabilities,
          description,
          score,
        });
      });

    const sortItems = (items: CatalogSchemaItem[]) =>
      items.slice().sort((a, b) => {
        if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);
        const aFav = favoritePlugins.has(a.pluginType) ? 1 : 0;
        const bFav = favoritePlugins.has(b.pluginType) ? 1 : 0;
        if (aFav !== bFav) return bFav - aFav;

        const aRecentIndex = recentPlugins.indexOf(a.pluginType);
        const bRecentIndex = recentPlugins.indexOf(b.pluginType);
        const aRecentScore = aRecentIndex >= 0 ? 100 - aRecentIndex : 0;
        const bRecentScore = bRecentIndex >= 0 ? 100 - bRecentIndex : 0;
        if (aRecentScore !== bRecentScore) return bRecentScore - aRecentScore;

        return a.label.localeCompare(b.label, 'es');
      });

    const groupedList = categoryOrder
      .filter((category) => grouped.has(category))
      .map((category) => ({ category, items: sortItems(grouped.get(category) || []) }));

    const extraCategories = Array.from(grouped.keys()).filter((category) => !categoryOrder.includes(category));
    extraCategories.sort((a, b) => a.localeCompare(b, 'es'));
    extraCategories.forEach((category) => {
      groupedList.push({ category, items: sortItems(grouped.get(category) || []) });
    });
    return groupedList;
  }, [
    plugins,
    activeTab,
    runtimeCustomDefinitions,
    builtInDefinitionsByType,
    favoritePlugins,
    recentPlugins,
    quickFilter,
    activeCapabilities,
    parsedQuery,
    searchTerms,
    hiddenCatalogTypes,
  ]);

  const recentCatalogItems = useMemo(() => {
    if (activeTab === 'custom') return [] as CatalogSchemaItem[];
    const byType = new Map<string, CatalogSchemaItem>();
    groupedPlugins.forEach(({ items }) => {
      items.forEach((item) => {
        if (!byType.has(item.pluginType)) byType.set(item.pluginType, item);
      });
    });
    return recentPlugins
      .flatMap((pluginType) => {
        const item = byType.get(pluginType);
        return item ? [item] : [];
      })
      .slice(0, 6) as CatalogSchemaItem[];
  }, [activeTab, groupedPlugins, recentPlugins]);

  useEffect(() => {
    if (activeTab === 'custom') return;
    setCollapsedCategories((prev) => {
      const next: Record<string, boolean> = { ...prev };
      let changed = false;
      const categoryKeys = groupedPlugins.map(({ category }) => category);

      if (normalizedSearch) {
        categoryKeys.forEach((category) => {
          if (next[category] !== false) {
            next[category] = false;
            changed = true;
          }
        });
        return changed ? next : prev;
      }

      categoryKeys.forEach((category) => {
        if (next[category] === undefined) {
          next[category] = false;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [activeTab, groupedPlugins, normalizedSearch, quickFilter, setCollapsedCategories]);

  const updateCustomDraft = <K extends keyof CustomFieldDef>(key: K, value: CustomFieldDef[K]) => {
    setCustomDraft((prev) => ({ ...prev, [key]: value }));
  };

  const createSchemaFromCustomField = (customField: CustomFieldDef): Schema => {
    const mappedType = customField.type === 'email' || customField.type === 'name' ? 'text' : customField.type;
    const parsedWidth = Number(customField.width);
    const parsedHeight = Number(customField.height);
    const autoPlaceDescriptor =
      extensions?.resolveSchemaAutoPlaceDescriptor?.(
        {
          name: customField.name,
          type: mappedType,
          autoPlaceText: customField.autoPlaceText,
        },
        {
          keyword: customField.autoPlaceText,
          fieldType: mappedType,
          schemaName: customField.name,
        },
      ) ||
      buildAutoPlaceDescriptor(customField.autoPlaceText, {
        fieldType: mappedType,
        schemaName: customField.name,
      });
    const schema: Schema = {
      name: customField.name || 'Campo personalizado',
      type: mappedType,
      position: { x: 0, y: 0 },
      width: Number.isFinite(parsedWidth) && parsedWidth > 0 ? parsedWidth : 120,
      height: Number.isFinite(parsedHeight) && parsedHeight > 0 ? parsedHeight : 18,
      required: customField.required,
      readOnly: customField.readOnly,
      shared: customField.shared,
      content: customField.initialValue || '',
      autoPlaceText: customField.autoPlaceText || undefined,
      __designer: autoPlaceDescriptor
        ? {
            autoPlace: autoPlaceDescriptor,
          }
        : undefined,
    } as Schema;

    if (customField.type === 'select' || customField.type === 'radioGroup') {
      const options = (customField.options || '')
        .split(/,|\n/)
        .map((opt) => opt.trim())
        .filter(Boolean);
      if (options.length > 0) {
        (schema as Schema & { options?: string[] }).options = options;
      }
    }

    return schema;
  };

  const handleSaveCustomField = () => {
    const normalizedName = customDraft.name.trim();
    if (!normalizedName) return;
    const nextField = { ...customDraft, id: `custom-${Date.now()}`, name: normalizedName };
    const mappedType = nextField.type === 'email' || nextField.type === 'name' ? 'text' : nextField.type;
    const normalizedCategory = resolveCatalogCategory(mappedType, '');
    const autoFillSource =
      nextField.type === 'email'
        ? 'recipient.email'
        : nextField.type === 'name'
          ? 'recipient.name'
          : '';

    upsertCustomSchemaDefinition({
      id: nextField.id,
      label: nextField.name,
      category: normalizedCategory,
      pluginType: mappedType,
      autoFillSource,
      autoPlaceText: nextField.autoPlaceText || '',
      defaultValue: nextField.initialValue || '',
      defaultSchema: {
        ...createSchemaFromCustomField(nextField),
        type: mappedType,
        name: nextField.name,
        defaultValue: nextField.initialValue || '',
      },
    });
    setCustomModalOpen(false);
    setCustomDraft({
      id: `custom-${Date.now()}`,
      name: '',
      type: 'text',
      initialValue: '',
      required: false,
      readOnly: false,
      shared: false,
      collaborative: false,
      font: '__DEFAULT__',
      fontColor: '__DEFAULT__',
      fontSize: '__DEFAULT__',
      bold: false,
      italic: false,
      underline: false,
      fixedWidth: false,
      maskAsterisks: false,
      width: '',
      height: '',
      maxChars: '',
      validation: 'None',
      helpText: '',
      autoPlaceText: '',
      options: '',
    });
  };

  const isPanel = variant === 'panel';
  const resolvedViewportWidth =
    viewportWidth && Number.isFinite(viewportWidth)
      ? viewportWidth
      : typeof window !== 'undefined'
        ? window.innerWidth
        : 1280;
  const resolvedPresentation =
    presentation === 'auto' ? (resolvedViewportWidth <= responsiveBreakpoint ? 'overlay' : 'docked') : presentation;
  const [sidebarExpanded, setSidebarExpanded] = useState(() => resolvedPresentation === 'docked');
  const showSearchInput = showSearch ?? isPanel;
  const sidebarRootRef = useRef<HTMLDivElement | null>(null);
  const sidebarScrollLockRef = useRef<ReturnType<typeof lockDesignerSidebarScroll> | null>(null);
  const { mode: sidebarDensityMode, width: sidebarLiveWidth } = useResponsiveDensity(sidebarRootRef, {
    comfortable: 232,
    compact: 200,
    minimal: 164,
  });

  useEffect(() => {
    if (resolvedPresentation === 'overlay') {
      setSidebarExpanded(false);
    }
  }, [resolvedPresentation]);

  useEffect(() => {
    const root = sidebarRootRef.current;
    if (!root) return;

    if (isDragging) {
      if (!sidebarScrollLockRef.current) {
        sidebarScrollLockRef.current = lockDesignerSidebarScroll(root);
      }
      return;
    }

    unlockDesignerSidebarScroll(sidebarScrollLockRef.current);
    sidebarScrollLockRef.current = null;
  }, [isDragging]);

  useEffect(
    () => () => {
      unlockDesignerSidebarScroll(sidebarScrollLockRef.current);
      sidebarScrollLockRef.current = null;
    },
    [],
  );
  const sidebarClass = mergeClassNames(
    `${DESIGNER_CLASSNAME}left-sidebar`,
    `${DESIGNER_CLASSNAME}left-sidebar-${variant}`,
    'relative flex h-full min-h-0 w-[var(--sisad-pdfme-ls-width)] max-w-[var(--sisad-pdfme-ls-width)] shrink-0 flex-col bg-[var(--color-bg-elevated)] border-r border-slate-200/70',
    'max-[48rem]:absolute max-[48rem]:left-0 max-[48rem]:top-0 max-[48rem]:bottom-0 max-[48rem]:z-[20] max-[48rem]:w-0 max-[48rem]:overflow-hidden max-[48rem]:[transition:width_0.22s_var(--wix-ease-out)]',
    variant === 'compact'
      ? mergeClassNames(
          `${DESIGNER_CLASSNAME}left-sidebar-compact`,
          '!min-w-[var(--sisad-pdfme-ls-rail-width)]',
          sidebarExpanded
            ? resolvedPresentation === 'overlay'
              ? '!w-[13.75rem] !max-w-[13.75rem] max-[48rem]:!w-[13.75rem] max-[48rem]:!max-w-[13.75rem] max-[48rem]:overflow-visible'
              : '!w-[13.75rem] !max-w-[13.75rem] max-[48rem]:!w-[13.75rem] max-[48rem]:!max-w-[13.75rem] max-[48rem]:overflow-visible'
            : '!w-[var(--sisad-pdfme-ls-rail-width)] !min-w-[var(--sisad-pdfme-ls-rail-width)] !max-w-[var(--sisad-pdfme-ls-rail-width)] overflow-hidden',
        )
      : '',
    detached ? `${DESIGNER_CLASSNAME}left-sidebar-detached` : '',
    classNames?.container,
    className,
  );

  const renderPluginButton = (item: CatalogSchemaItem) => {
    const { label, plugin, pluginType, category } = item;
    const draggableId = item.key;
    const recipientToneKey = activeRecipientTone || 'no-tone';
    const displayLabel = getCatalogLabel(label, pluginType, item.source);
    const isSelectionCategory = category === 'Selecciones';
    const isCustom = item.source === 'custom';
    const baseButtonClass = mergeClassNames(
      `${DESIGNER_CLASSNAME}plugin-${pluginType}`,
      `${DESIGNER_CLASSNAME}plugin-btn`,
      `${DESIGNER_CLASSNAME}plugin-btn-${variant}`,
      `${DESIGNER_CLASSNAME}plugin-btn-${resolvedLayout}`,
      'cursor-grab active:cursor-grabbing',
    );
    const layoutButtonClass = resolvedLayout === 'list'
      ? mergeClassNames(
          'h-[44px] w-full justify-start gap-2 rounded-lg border border-slate-200 px-2.5 py-0 text-slate-800',
          'bg-white shadow-none',
          'transition-[border-color,background,box-shadow,color] hover:border-slate-300 hover:bg-slate-50 focus-visible:border-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 motion-reduce:hover:translate-y-0',
        )
      : resolvedLayout === 'icons'
        ? mergeClassNames(
          'h-[44px] w-full min-h-0 items-center justify-center rounded-lg border border-slate-200 p-1 text-slate-800',
            'bg-white shadow-none overflow-hidden text-center',
            'transition-[border-color,background,box-shadow,color] hover:border-slate-300 hover:bg-slate-50 focus-visible:border-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 motion-reduce:hover:translate-y-0',
          )
        : mergeClassNames(
            'h-[44px] w-full flex flex-col items-center justify-center gap-0.5 rounded-lg border border-slate-200 p-1 text-slate-800',
            'bg-white shadow-none overflow-hidden text-center',
            'transition-[border-color,background,box-shadow,color] hover:border-slate-300 hover:bg-slate-50 focus-visible:border-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 motion-reduce:hover:translate-y-0',
          );
    const stateButtonClass = isCustom ? 'border-dashed' : '';
    const labelClass = mergeClassNames(
      `${DESIGNER_CLASSNAME}plugin-btn-label`,
      resolvedLayout === 'list'
        ? 'min-w-0 flex-1 items-start justify-start'
        : 'flex flex-col items-center justify-center gap-[1px] min-w-0 w-full',
      resolvedLayout === 'icons' ? 'hidden' : '',
    );
    const titleClass = mergeClassNames(
      `${DESIGNER_CLASSNAME}plugin-btn-label-title`,
      resolvedLayout === 'list'
        ? 'block truncate text-left text-[0.75rem] font-semibold text-slate-800 whitespace-nowrap [word-break:normal]'
        : 'block min-w-0 w-full overflow-hidden [display:-webkit-box] [line-clamp:2] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] [text-overflow:ellipsis] [white-space:normal] text-[0.575rem] font-semibold text-[var(--color-gray-700)] capitalize text-center leading-[1.3] break-words',
      resolveCatalogDensityTitleClass(resolvedLayout, sidebarDensityMode),
      sidebarDensityMode === 'minimal'
        ? 'text-[9px]'
        : sidebarDensityMode === 'compact'
          ? resolvedLayout === 'list'
            ? 'text-[0.68rem]'
            : 'text-[0.56rem]'
          : resolvedLayout === 'list'
            ? 'text-[0.72rem]'
            : 'text-[0.575rem]',
      isSelectionCategory ? 'font-bold tracking-[0.01em]' : '',
    );
    const isFavorite = favoritePlugins.has(pluginType);
    const saveFavorites = (next: Set<string>) => {
      setFavoritePlugins(new Set(next));
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('sisad-pdfme:fav-plugins', JSON.stringify(Array.from(next)));
      }
    };
    const toggleFavorite = (type: string) => {
      const next = new Set(favoritePlugins);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      saveFavorites(next);
    };
    const pluginTone = activeRecipientTone || null;
    const pluginToneSurface = pluginTone ? `${pluginTone}18` : undefined;
    const densitySkinClass = resolveCatalogDensityButtonSkin(resolvedLayout, sidebarDensityMode);
    const densityGapClass = densitySkinClass
      ? ''
      : sidebarDensityMode === 'minimal'
        ? 'gap-1'
        : sidebarDensityMode === 'compact'
          ? 'gap-1.5'
          : resolvedLayout === 'list'
            ? 'gap-2'
            : 'gap-2';
    const densityPaddingClass = densitySkinClass
      ? ''
      : resolvedLayout === 'list'
        ? (sidebarDensityMode === 'minimal' ? 'px-1 py-1' : sidebarDensityMode === 'compact' ? 'px-1.5 py-1' : 'px-2 py-1.5')
        : '';

    return (
      <Draggable
        key={`${draggableId}::${recipientToneKey}`}
        draggableId={draggableId}
        scale={scale}
        basePdf={basePdf}
        plugin={plugin}
        onDragStateChange={setIsDragging}
      >
        {({ listeners, attributes, isDragging: draggableActive }) => (
          <div
            className={mergeClassNames(
              DESIGNER_CLASSNAME + 'left-sidebar-plugin-wrap',
              'group relative rounded-[0.5rem] p-[0.0625rem] bg-transparent',
            )}
            style={activeRecipientStyles}
          >
            <Button
              className={mergeClassNames(
                baseButtonClass,
                layoutButtonClass,
                stateButtonClass,
                densityGapClass,
                densityPaddingClass,
                densitySkinClass,
                draggableActive || isDragging
                  ? 'border-blue-400 bg-blue-50 shadow-sm opacity-90'
                  : '',
                draggableActive ? 'opacity-50' : '',
              )}
              data-testid="left-sidebar-schema-tile"
              data-schema-type={pluginType}
              data-schema-category={category}
              data-schema-kind={item.source}
              data-schema-label={displayLabel}
              data-catalog-layout={resolvedLayout}
              data-view-mode={resolveCatalogViewTestMode(resolvedLayout)}
              data-density={sidebarDensityMode}
              data-dragging={draggableActive ? 'true' : 'false'}
              data-is-panel={isPanel ? 'true' : 'false'}
              onMouseDownCapture={() => {
                setIsDragging(true);
              }}
              onMouseUpCapture={() => {
                setIsDragging(false);
              }}
              {...listeners}
              {...attributes}
              onClick={() => {
                if (draggableActive) return;
                handleSchemaClick(cloneDeep(plugin.propPanel.defaultSchema), pluginType);
              }}
            >
              <PluginIcon
                plugin={plugin}
                label={displayLabel}
                testId="left-sidebar-schema-icon"
                activeRecipientColor={pluginTone ?? null}
                density={sidebarDensityMode}
                size={resolveCatalogDensityIconSize(resolvedLayout, sidebarDensityMode)}
                styles={
                  pluginTone
                    ? {
                        backgroundColor: pluginToneSurface,
                        borderColor: pluginTone,
                        color: pluginTone,
                      }
                    : undefined
                }
              />
              <span className={labelClass}>
                <span className={titleClass}>
                  {highlightTerm(displayLabel, searchTerms)}
                </span>
                  </span>
            </Button>
            <button
              type="button"
              aria-label={isFavorite ? 'Eliminar de favoritos' : 'Marcar como favorito'}
              aria-pressed={isFavorite}
              className={mergeClassNames(
                DESIGNER_CLASSNAME + 'plugin-favorite-toggle',
                resolvedLayout === 'icons' ? 'absolute right-0.5 top-0.5' : 'absolute right-0.5 top-1/2 -translate-y-1/2',
                'inline-flex h-[26px] w-[26px] items-center justify-center rounded-md border border-transparent bg-transparent text-[12px] transition-[opacity,background-color,border-color,color] text-slate-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-slate-50',
                isFavorite ? 'text-amber-500 opacity-100' : '',
                draggableActive || isDragging ? 'opacity-0 pointer-events-none' : '',
              )}
              data-active={isFavorite ? 'true' : 'false'}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(pluginType);
              }}
            >
              ★
            </button>
          </div>
        )}
      </Draggable>
    );
  };

  const renderCustomFieldItem = (definition: RuntimeCustomSchemaDefinition, plugin: Plugin<Schema>) => {
    const activeRecipient =
      options.activeRecipient && typeof options.activeRecipient === 'object'
        ? (options.activeRecipient as ActiveRecipientOption)
        : null;
    const createSchemaInstance = () =>
      createCustomSchemaFromDefinition({
        definitionId: definition.id,
        recipient: activeRecipient ? { ...activeRecipient } : null,
        overrides: {
          resolveBaseSchema: () => plugin.propPanel.defaultSchema,
          resolveAutoPlaceDescriptor: extensions?.resolveSchemaAutoPlaceDescriptor,
        },
      }) as Schema | null;

    if (!createSchemaInstance()) return null;
    const draggableId = `custom::${definition.id}::${definition.pluginType}`;

    const recipientToneKey = activeRecipientTone || 'no-tone';
    const densitySkinClass = resolveCatalogDensityButtonSkin(resolvedLayout, sidebarDensityMode);
    const densityGapClass = densitySkinClass
      ? ''
      : sidebarDensityMode === 'minimal'
        ? 'gap-1'
        : sidebarDensityMode === 'compact'
          ? 'gap-1.5'
          : resolvedLayout === 'list'
            ? 'gap-2'
            : 'gap-2';
    const densityPaddingClass = densitySkinClass
      ? ''
      : resolvedLayout === 'list'
        ? (sidebarDensityMode === 'minimal' ? 'px-1 py-1' : sidebarDensityMode === 'compact' ? 'px-1.5 py-1' : 'px-2 py-1.5')
        : '';

    return (
      <Draggable
        key={`${definition.id}::${recipientToneKey}`}
        draggableId={draggableId}
        scale={scale}
        basePdf={basePdf}
        plugin={plugin}
        schemaFactory={createSchemaInstance}
        onDragStateChange={setIsDragging}
      >
        {({ listeners, attributes, isDragging: draggableActive }) => (
          <div
            className={mergeClassNames(
              DESIGNER_CLASSNAME + 'left-sidebar-plugin-wrap',
              'relative rounded-[0.5rem] p-[0.0625rem] bg-transparent transition',
            )}
            style={activeRecipientStyles}
          >
            <Button
              className={mergeClassNames(
                `${DESIGNER_CLASSNAME}left-sidebar-custom-item`,
                `${DESIGNER_CLASSNAME}plugin-${definition.pluginType}`,
                `${DESIGNER_CLASSNAME}plugin-btn`,
                `${DESIGNER_CLASSNAME}plugin-btn-${variant}`,
                `${DESIGNER_CLASSNAME}plugin-btn-${resolvedLayout}`,
                'cursor-grab active:cursor-grabbing',
                densityGapClass,
                densityPaddingClass,
                densitySkinClass,
                draggableActive || isDragging
                  ? 'border-blue-400 bg-blue-50 shadow-sm opacity-90'
                  : '',
                resolvedLayout === 'list'
                  ? 'flex w-full items-center gap-[0.5rem] min-h-[2.875rem] p-[0.375rem_0.5625rem] justify-center rounded-[0.5625rem] border border-[color:var(--color-border-20)] bg-[linear-gradient(180deg,_var(--color-white),_var(--color-gray-50))] shadow-[inset_0_1px_0_var(--color-white-80),_0_1px_2px_var(--color-gray-900-04)] transition-[border-color,background,box-shadow] hover:border-[color:var(--color-primary-30)] hover:bg-[linear-gradient(180deg,_var(--color-white),_var(--color-primary-100-90))] hover:shadow-[0_2px_0.375rem_var(--color-primary-08)]'
                  : resolvedLayout === 'icons'
                    ? 'flex w-full aspect-square min-h-0 items-center justify-center p-[0.25rem] rounded-[0.5rem] border border-[color:var(--color-border-18)] bg-[linear-gradient(180deg,_var(--color-white),_var(--color-gray-50))] shadow-[inset_0_1px_0_var(--color-white-80),_0_1px_2px_var(--color-gray-900-04)] overflow-hidden text-center transition-[border-color,background,box-shadow] hover:border-[var(--schema-owner-color,_var(--color-primary-30))] hover:shadow-[0_2px_0.375rem_var(--color-primary-08)]'
                    : 'flex w-full flex-col items-center justify-center gap-[0.15rem] min-h-[2.25rem] p-[0.2rem_0.2rem_0.2rem] rounded-[0.375rem] border border-[color:var(--color-border-18)] bg-[linear-gradient(180deg,_var(--color-white),_var(--color-gray-50))] shadow-[inset_0_1px_0_var(--color-white-80),_0_1px_3px_var(--color-gray-900-04)] overflow-hidden text-center transition-[border-color,background,box-shadow,transform] hover:border-[var(--schema-owner-color,_var(--color-primary-30))] hover:bg-[linear-gradient(180deg,_var(--color-white),_color-mix(in_srgb,_var(--schema-owner-color,_var(--color-primary))_8%,_var(--color-white)))] hover:shadow-[0_3px_8px_color-mix(in_srgb,_var(--schema-owner-color,_var(--color-primary))_12%,_transparent)] hover:-translate-y-px hover:border-l-[3px] hover:border-l-[var(--schema-owner-color,_var(--color-primary))]',
              )}
              data-testid="left-sidebar-schema-tile"
              data-schema-type={definition.pluginType}
              data-schema-category={definition.category}
              data-schema-kind="custom"
              data-schema-label={definition.label}
              data-catalog-layout={resolvedLayout}
              data-view-mode={resolveCatalogViewTestMode(resolvedLayout)}
              onMouseDownCapture={() => {
                setIsDragging(true);
              }}
              onMouseUpCapture={() => {
                setIsDragging(false);
              }}
              {...listeners}
              {...attributes}
              onClick={() => {
                if (draggableActive) return;
                const schema = createSchemaInstance();
                if (!schema) return;
                handleSchemaClick(cloneDeep(schema), definition.pluginType);
              }}
              >
                <span className={mergeClassNames(
                  `${DESIGNER_CLASSNAME}left-sidebar-custom-item-icon`,
                  resolvedLayout === 'list'
                    ? 'flex h-[2rem] w-[2rem] items-center justify-center rounded-[0.5rem]'
                    : 'inline-flex items-center justify-center',
                )}>
                  <PluginIcon
                    plugin={plugin}
                    label={definition.label}
                    testId="left-sidebar-schema-icon"
                    activeRecipientColor={activeRecipientTone ?? null}
                    density={sidebarDensityMode}
                    styles={
                      activeRecipientTone
                        ? {
                          backgroundColor: `color-mix(in srgb, ${activeRecipientTone} 22%, var(--color-white))`,
                          borderColor: activeRecipientTone,
                          color: activeRecipientTone,
                        }
                      : undefined
                  }
                />
              </span>
              <span className={mergeClassNames(
                  `${DESIGNER_CLASSNAME}left-sidebar-custom-item-copy`,
                  resolvedLayout === 'list' ? 'min-w-0 flex-1 text-left' : 'min-w-0 w-full text-center',
                  resolvedLayout === 'icons' ? 'hidden' : '',
                )}>
                <span className={mergeClassNames(
                  `${DESIGNER_CLASSNAME}left-sidebar-custom-item-label`,
                  resolvedLayout === 'list'
                    ? 'block truncate text-[0.75rem] font-semibold text-[var(--color-gray-900)] whitespace-nowrap [word-break:normal]'
                    : 'min-w-0 w-full overflow-hidden [display:-webkit-box] [line-clamp:2] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] [text-overflow:ellipsis] [white-space:normal] text-[0.575rem] font-semibold text-[var(--color-gray-700)] capitalize text-center leading-[1.3] break-words',
                  sidebarDensityMode === 'minimal'
                    ? 'text-[9px]'
                    : sidebarDensityMode === 'compact'
                      ? resolvedLayout === 'list'
                        ? 'text-[0.68rem]'
                        : 'text-[0.56rem]'
                      : resolvedLayout === 'list'
                        ? 'text-[0.72rem]'
                        : 'text-[0.575rem]',
                )}>
                  {definition.label}
                </span>
              </span>
            </Button>
          </div>
        )}
      </Draggable>
    );
  };

  const toggleCategory = useCallback(
    (category: string) => {
      setCollapsedCategories((prev) => {
        const next: Record<string, boolean> = { ...prev };
        next[category] = !Boolean(prev[category]);
        return next;
      });
    },
    [setCollapsedCategories],
  );

  const renderTabIcon = (tab: LeftSidebarTab) => {
    if (tab === 'custom') {
      return (
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
          <path d="m.55 16 6.407-6.407a4.001 4.001 0 0 1 5.426-4.72L9.407 7.85l2.12 2.121 2.977-2.976a4.001 4.001 0 0 1-4.719 5.426L6.206 16z" fill="currentColor" />
          <path d="M0 9.008V1.992C0 .9.893 0 1.994 0h12.012C15.106 0 16 .894 16 1.998V6l-2-2V2H2v7h3l-2 2h-.999A2 2 0 0 1 0 9.008" fill="currentColor" />
        </svg>
      );
    }
    if (tab === 'prefill') {
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
          <path d="m15.02 7.42 1.56 1.56L6.46 19.1H5v-1.66zm0-2.68L3 16.76V21h4.24L19.26 8.98zM22 6.24 17.76 2 16 3.76 20.24 8z" fill="currentColor" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
        <path d="M18 7c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2zm0-2H6C3.79 5 2 6.79 2 9v6c0 2.21 1.79 4 4 4h12c2.21 0 4-1.79 4-4V9c0-2.21-1.79-4-4-4M9 9H7v6h2z" fill="currentColor" />
      </svg>
    );
  };

  const tabCounts = useMemo(() => {
    const counts = { standard: 0, custom: filteredCustomDefinitions.length, prefill: 0 };
    
    plugins.forEach(([label, plugin]) => {
      const type = String(plugin?.propPanel?.defaultSchema?.type || '').toLowerCase();
      const normalizedLabel = String(label || '').toLowerCase();
      const isPrefillByLabel = PREFILL_LABEL_TOKENS.some((token) => normalizedLabel.includes(token));
      const isPrefill = isPrefillByLabel && PREFILL_SCHEMA_TYPES.has(type);
      const isCustom = CUSTOM_LABEL_TOKENS.some((token) => normalizedLabel.includes(token));

      if (isPrefill) {
        counts.prefill++;
      } else if (!isCustom) {
        counts.standard++;
      }
    });

    return counts;
  }, [plugins, filteredCustomDefinitions.length]);

  const sidebarTabs: SidebarTabOption[] = showCatalogViewSwitcher
    ? [
        { id: 'standard', label: 'Estándar', badge: tabCounts.standard },
        { id: 'custom', label: 'Personalizados', badge: tabCounts.custom },
        { id: 'prefill', label: 'Prerrellenado', badge: tabCounts.prefill },
      ]
    : [];

  const searchNode = showSearchInput ? (
    <div className={mergeClassNames(
      'flex flex-col',
      sidebarDensityMode === 'minimal' ? 'gap-1' : 'gap-2',
    )}>
      <LeftSidebarSearch
        value={search}
        onChange={setSearch}
        className={classNames?.searchInput}
        useDefaultStyles={useDefaultStyles}
        density={sidebarDensityMode}
      />
      {SHOW_ADVANCED_CATALOG_CONTROLS &&
        (parsedQuery.capabilities.size > 0 ||
          parsedQuery.categories.size > 0 ||
          parsedQuery.types.size > 0 ||
          parsedQuery.tags.size > 0) ? (
        <div className={mergeClassNames(
          DESIGNER_CLASSNAME + 'left-sidebar-chip-row',
          'flex flex-wrap items-center gap-1.5 rounded-full border border-slate-200/70 bg-slate-50/50 px-1.5 py-1 shadow-sm',
          sidebarDensityMode === 'minimal' ? 'gap-1 px-1 py-0.5' : '',
        )}>
          {Array.from(parsedQuery.capabilities).map((cap) => (
            <Button key={`facet-cap-${cap}`} size="small" type="text" className="rounded-full border border-slate-200/70 bg-white/90 px-2 text-[10px] text-slate-600 shadow-none hover:border-sky-200 hover:bg-white">
              cap:{cap}
            </Button>
          ))}
          {Array.from(parsedQuery.categories).map((cat) => (
            <Button key={`facet-cat-${cat}`} size="small" type="text" className="rounded-full border border-slate-200/70 bg-white/90 px-2 text-[10px] text-slate-600 shadow-none hover:border-sky-200 hover:bg-white">
              cat:{cat}
            </Button>
          ))}
          {Array.from(parsedQuery.types).map((typeFacet) => (
            <Button key={`facet-type-${typeFacet}`} size="small" type="text" className="rounded-full border border-slate-200/70 bg-white/90 px-2 text-[10px] text-slate-600 shadow-none hover:border-sky-200 hover:bg-white">
              type:{typeFacet}
            </Button>
          ))}
          {Array.from(parsedQuery.tags).map((tag) => (
            <Button key={`facet-tag-${tag}`} size="small" type="text" className="rounded-full border border-slate-200/70 bg-white/90 px-2 text-[10px] text-slate-600 shadow-none hover:border-sky-200 hover:bg-white">
              tag:{tag}
            </Button>
          ))}
          <Button size="small" onClick={() => setSearch('')} className="rounded-full border border-slate-200/70 bg-white/90 px-2 text-[10px] text-slate-600 shadow-none hover:border-sky-200 hover:bg-white">
            Limpiar
          </Button>
        </div>
      ) : null}
      <div className={mergeClassNames(
        DESIGNER_CLASSNAME + 'left-sidebar-chip-row',
        'flex flex-wrap items-center gap-1.5 rounded-full border border-slate-200/70 bg-white/85 px-1.5 py-1 shadow-sm',
        sidebarDensityMode === 'minimal' ? 'gap-1 px-1 py-0.5' : ''
      )}>
        <Button
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'left-sidebar-filter-btn',
            'rounded-full border border-slate-200/70 bg-white px-2 text-[10px] font-medium text-slate-600 shadow-none hover:border-sky-200 hover:bg-slate-50',
            quickFilter === 'all' ? 'border-sky-200 bg-sky-50 text-sky-700' : '',
          )}
          size={sidebarDensityMode === 'minimal' ? 'small' : 'small'}
          style={sidebarDensityMode === 'minimal' ? { fontSize: '9px', padding: '0 4px', height: '20px' } : {}}
          data-testid="left-sidebar-filter-all"
          type={quickFilter === 'all' ? 'primary' : 'default'}
          onClick={() => setQuickFilter('all')}
        >
          {sidebarDensityMode === 'minimal' ? 'Todo' : 'Todos'}
        </Button>
        <Button
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'left-sidebar-filter-btn',
            'rounded-full border border-slate-200/70 bg-white px-2 text-[10px] font-medium text-slate-600 shadow-none hover:border-sky-200 hover:bg-slate-50',
            quickFilter === 'favorites' ? 'border-sky-200 bg-sky-50 text-sky-700' : '',
          )}
          size={sidebarDensityMode === 'minimal' ? 'small' : 'small'}
          style={sidebarDensityMode === 'minimal' ? { fontSize: '9px', padding: '0 4px', height: '20px' } : {}}
          data-testid="left-sidebar-filter-favorites"
          type={quickFilter === 'favorites' ? 'primary' : 'default'}
          onClick={() => setQuickFilter('favorites')}
        >
          {sidebarDensityMode === 'minimal' ? `★ ${favoritePlugins.size}` : `Favoritos (${favoritePlugins.size})`}
        </Button>
        <Button
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'left-sidebar-filter-btn',
            'rounded-full border border-slate-200/70 bg-white px-2 text-[10px] font-medium text-slate-600 shadow-none hover:border-sky-200 hover:bg-slate-50',
            quickFilter === 'recent' ? 'border-sky-200 bg-sky-50 text-sky-700' : '',
          )}
          size={sidebarDensityMode === 'minimal' ? 'small' : 'small'}
          style={sidebarDensityMode === 'minimal' ? { fontSize: '9px', padding: '0 4px', height: '20px' } : {}}
          data-testid="left-sidebar-filter-recent"
          type={quickFilter === 'recent' ? 'primary' : 'default'}
          onClick={() => setQuickFilter('recent')}
        >
          {sidebarDensityMode === 'minimal' ? `⟳ ${recentPlugins.length}` : `Recientes (${recentPlugins.length})`}
        </Button>
        {showCatalogViewSwitcher && (
          <CatalogLayoutToggle
            layout={resolvedLayout}
            density={sidebarDensityMode}
            showLabels={sidebarDensityMode === 'comfortable' && sidebarLiveWidth >= 280}
            onChange={(layout) => {
              setUserLayout(layout);
              onCatalogLayoutChange?.(layout);
            }}
            className={`${DESIGNER_CLASSNAME}left-sidebar-view-toggle`}
          />
        )}
      </div>
      {SHOW_ADVANCED_CATALOG_CONTROLS ? (
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'left-sidebar-chip-row', 'flex flex-wrap gap-1.5')}>
          {SUPPORTED_CAPABILITIES.map((capability) => {
            const isActive = activeCapabilities.has(capability);
            return (
              <Button
                key={`cap-${capability}`}
                size="small"
                type={isActive ? 'primary' : 'default'}
                onClick={() =>
                  setActiveCapabilities((prev) => {
                    const next = new Set(prev);
                    if (next.has(capability)) {
                      next.delete(capability);
                    } else {
                      next.add(capability);
                    }
                    return next;
                  })
                }
              >
                cap:{capability}
              </Button>
            );
          })}
        </div>
      ) : null}
      {SHOW_ADVANCED_CATALOG_CONTROLS && groupedPlugins.length > 0 ? (
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'left-sidebar-chip-row', 'flex flex-wrap gap-1.5')}>
          {groupedPlugins.slice(0, 8).map(({ category, items }) => (
            <Button
              key={`cat-${category}`}
              size="small"
              type={collapsedCategories[category] ? 'default' : 'text'}
              onClick={() =>
                setCollapsedCategories((prev) => ({
                  ...prev,
                  [category]: !prev[category],
                }))
              }
            >
              {collapsedCategories[category] ? '▸' : '▾'} {category} ({items.length})
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  ) : null;

  const isDiscoveryMode = activeTab !== 'custom' && !normalizedSearch && quickFilter === 'all';

  return (
    <div
      ref={sidebarRootRef}
      className={sidebarClass}
      data-testid="left-sidebar"
      data-sidebar-variant={variant}
      data-catalog-layout={resolvedLayout}
      data-sidebar-detached={detached ? 'true' : 'false'}
      data-sidebar-collapsed={sidebarExpanded ? 'false' : 'true'}
      data-left-sidebar-mode={resolvedPresentation}
      data-left-sidebar-expanded={sidebarExpanded ? 'true' : 'false'}
      data-sidebar-presentation={resolvedPresentation}
      data-active-tab={activeTab}
      data-has-search={normalizedSearch ? 'true' : 'false'}
      data-discovery-mode={isDiscoveryMode ? 'true' : 'false'}
      data-expanded={sidebarExpanded ? 'true' : 'false'}
      data-left-sidebar-density={sidebarDensityMode}
      data-sidebar-scroll-locked={isDragging ? 'true' : 'false'}
      style={{
        '--left-sidebar-live-width': `${sidebarLiveWidth}px`,
        transition: 'width 220ms var(--wix-ease-out), max-width 220ms var(--wix-ease-out), opacity 150ms ease, transform 220ms var(--wix-ease-out)',
      } as React.CSSProperties}>
      <SidebarCollapseHandle
        side="left"
        expanded={sidebarExpanded}
        presentation={resolvedPresentation}
        density={sidebarDensityMode}
        labelExpanded="Cerrar catálogo de campos"
        labelCollapsed="Abrir catálogo de campos"
        onToggle={() => setSidebarExpanded((prev) => !prev)}
        className={mergeClassNames(
          'absolute z-[90] [transition:right_220ms_var(--wix-ease-out),_top_220ms_var(--wix-ease-out),_border-color_var(--transition-fast),_color_var(--transition-fast),_opacity_150ms_ease,_transform_220ms_var(--wix-ease-out)]',
          sidebarExpanded ? 'right-[0.5rem] top-[0.875rem]' : 'right-[0.125rem] top-[0.5rem]',
          'hover:bg-slate-50 hover:text-slate-700',
          sidebarExpanded ? '' : 'shadow-sm',
        )}
      />

      {!sidebarExpanded && (
        <SidebarRail
          side="left"
          items={sidebarTabs.map((tab) => ({
            key: tab.id,
            icon: renderTabIcon(tab.id),
            label: tab.label,
            ariaLabel: `Abrir ${tab.label}`,
            active: activeTab === tab.id,
            onClick: () => {
              setActiveTab(tab.id);
              setSidebarExpanded(true);
            },
          }))}
          density={sidebarDensityMode}
          className={`${DESIGNER_CLASSNAME}left-sidebar-collapsed-rail`}
        />
      )}
      {useLayoutFrame ? (
        <SidebarFrame className={mergeClassNames(`${DESIGNER_CLASSNAME}left-sidebar-frame`, 'flex h-full min-h-0 flex-col', sidebarExpanded ? '' : 'opacity-0 pointer-events-none [visibility:hidden] [transform:translateX(-0.5rem)]')}>
          <SidebarShell
            tabs={sidebarTabs}
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            renderTabIcon={renderTabIcon}
            searchNode={searchNode}
            activeRecipientLabel={activeRecipientLabel}
            activeRecipientColor={activeRecipientColor}
            density={sidebarDensityMode}
            style={activeRecipientStyles}
          >
            <SidebarButtons
              activeTab={activeTab}
              variant={variant}
              sidebarDensityMode={sidebarDensityMode}
              groupedPlugins={groupedPlugins}
              recentCatalogItems={recentCatalogItems}
              collapsedCategories={collapsedCategories}
              quickFilter={quickFilter}
              normalizedSearch={normalizedSearch}
              resolvedLayout={resolvedLayout}
              hasPlugins={plugins.length > 0}
              filteredCustomDefinitions={filteredCustomDefinitions}
              renderPluginButton={renderPluginButton}
              renderCustomFieldItem={renderCustomFieldItem}
              resolvePlugin={(pluginType) => pluginsRegistry.findByType(pluginType)}
              onOpenCreate={() => setCustomModalOpen(true)}
              onToggleCategory={toggleCategory}
            />
          </SidebarShell>
        </SidebarFrame>
      ) : (
        <div
          className={mergeClassNames(`${DESIGNER_CLASSNAME}left-sidebar-content`, 'flex flex-col min-h-0 w-full', sidebarExpanded ? '' : 'opacity-0 pointer-events-none [visibility:hidden] [transform:translateX(-0.5rem)]', classNames?.content)}>
          <SidebarShell
            tabs={sidebarTabs}
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            renderTabIcon={renderTabIcon}
            searchNode={searchNode}
            activeRecipientLabel={activeRecipientLabel}
            activeRecipientColor={activeRecipientColor}
            density={sidebarDensityMode}
            style={activeRecipientStyles}
          >
            <SidebarButtons
              activeTab={activeTab}
              variant={variant}
              sidebarDensityMode={sidebarDensityMode}
              groupedPlugins={groupedPlugins}
              recentCatalogItems={recentCatalogItems}
              collapsedCategories={collapsedCategories}
              quickFilter={quickFilter}
              normalizedSearch={normalizedSearch}
              resolvedLayout={resolvedLayout}
              hasPlugins={plugins.length > 0}
              filteredCustomDefinitions={filteredCustomDefinitions}
              renderPluginButton={renderPluginButton}
              renderCustomFieldItem={renderCustomFieldItem}
              resolvePlugin={(pluginType) => pluginsRegistry.findByType(pluginType)}
              onOpenCreate={() => setCustomModalOpen(true)}
              onToggleCategory={toggleCategory}
            />
          </SidebarShell>
        </div>
      )}
      {customModalOpen ? (
        <LeftSidebarCustomFieldModal
          open={customModalOpen}
          draft={customDraft}
          onCancel={() => setCustomModalOpen(false)}
          onSave={handleSaveCustomField}
          onChange={updateCustomDraft}
        />
      ) : null}
    </div>
  );
};

export default LeftSidebar;
