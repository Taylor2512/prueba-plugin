import React, { useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Schema, Plugin, BasePdf, getFallbackFontName, cloneDeep } from '@sisad-pdfme/common';
import { Button } from 'antd';
import { useDraggable } from '@dnd-kit/core';
import { LayoutGrid, List, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
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
import { getCatalogLabel } from './shared/designerLabels.js';

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

export type CatalogViewMode = 'compact' | 'rich';
export type CatalogQuickFilter = 'all' | 'favorites' | 'recent';
export type CatalogCapability = 'designer' | 'content' | 'layout' | 'selection' | 'prefill' | 'dynamic';
const SHOW_ADVANCED_CATALOG_CONTROLS = false;

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

type SidebarButtonsProps = {
  activeTab: LeftSidebarTab;
  variant: 'compact' | 'panel';
  groupedPlugins: Array<{ category: string; items: CatalogSchemaItem[] }>;
  recentCatalogItems: CatalogSchemaItem[];
  collapsedCategories: Record<string, boolean>;
  quickFilter: CatalogQuickFilter;
  normalizedSearch: string;
  resolvedViewMode: CatalogViewMode;
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
  groupedPlugins,
  recentCatalogItems,
  collapsedCategories,
  quickFilter,
  normalizedSearch,
  resolvedViewMode,
  hasPlugins,
  filteredCustomDefinitions,
  renderPluginButton,
  renderCustomFieldItem,
  resolvePlugin,
  onOpenCreate,
  onToggleCategory,
}: SidebarButtonsProps) => (
  <>
    {activeTab === 'custom' ? (
      <LeftSidebarCustomPanel
        definitions={filteredCustomDefinitions}
        variant={variant}
        onOpenCreate={onOpenCreate}
        resolvePlugin={resolvePlugin}
        renderDraggableItem={renderCustomFieldItem}
      />
    ) : !hasPlugins ? (
      <LeftSidebarEmptyState description="Sin resultados" />
    ) : null}
    {activeTab !== 'custom' && quickFilter === 'all' && !normalizedSearch && recentCatalogItems.length > 0 ? (
      <LeftSidebarGroup
        key="__recent"
        category="Recientes"
        count={recentCatalogItems.length}
        viewMode={resolvedViewMode}
        items={recentCatalogItems.map(renderPluginButton)}
      />
    ) : null}
    {activeTab !== 'custom'
      ? groupedPlugins.map(({ category, items }) => (
        <LeftSidebarGroup
          key={category}
          category={category}
          count={items.length}
          viewMode={resolvedViewMode}
          collapsed={Boolean(collapsedCategories[category])}
          collapsible
          onToggle={() => onToggleCategory(category)}
          items={collapsedCategories[category] ? [] : items.map(renderPluginButton)}
        />
      ))
      : null}
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
  children: (drag: {
    listeners: ReturnType<typeof useDraggable>['listeners'];
    attributes: ReturnType<typeof useDraggable>['attributes'];
    isDragging: boolean;
  }) => React.ReactNode;
}) => {
  const { plugin } = props;
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

  return (
    <div ref={setNodeRef}>
      <div
        className={DESIGNER_CLASSNAME + 'left-sidebar-draggable-shell'}
        data-dragging={isDragging ? 'true' : 'false'}
        data-drag-source={isDragging ? 'true' : 'false'}
        data-dragging-schema-type={String(baseSchema.type || '')}>
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
  children: React.ReactNode;
}) => (
    <div
      className={mergeClassNames(
        `${DESIGNER_CLASSNAME}left-sidebar-shell`,
        `${DESIGNER_CLASSNAME}sidebar-surface`,
        'flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 shadow-sm',
      )}
      style={style}
    >
      <div className={mergeClassNames(`${DESIGNER_CLASSNAME}left-sidebar-dock-header`, 'flex shrink-0 items-start justify-between gap-2 border-b border-slate-200/70 px-2.5 py-2')}>
        <span className={mergeClassNames(`${DESIGNER_CLASSNAME}left-sidebar-dock-kicker`, 'text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500')}>
          Diseñador
        </span>
        <span className={mergeClassNames(`${DESIGNER_CLASSNAME}left-sidebar-dock-title`, 'flex min-w-0 flex-wrap items-center gap-1.5 text-[0.78rem] font-semibold text-slate-900')}>
          <span>Campos</span>
          {activeRecipientLabel ? (
            <span className={mergeClassNames(`${DESIGNER_CLASSNAME}left-sidebar-dock-recipient`, 'inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] text-slate-600')}>
              {activeRecipientLabel}
            </span>
          ) : null}
          {activeRecipientColor ? (
            <span
              aria-label={`Color del destinatario activo ${activeRecipientColor}`}
              title={`Color del destinatario activo: ${activeRecipientColor}`}
              className={`${DESIGNER_CLASSNAME}left-sidebar-active-recipient-dot`}
              style={{ '--active-recipient-color': activeRecipientColor } as React.CSSProperties}
            />
          ) : null}
        </span>
      </div>
      <div className={mergeClassNames(`${DESIGNER_CLASSNAME}left-sidebar-control-band`, 'shrink-0 space-y-1.5 border-b border-slate-200/70 px-2.5 py-2')}>
        <LeftSidebarTabs
          tabs={tabs}
          activeTab={activeTab}
          onChangeTab={onChangeTab}
          renderTabIcon={renderTabIcon}
        />
        {searchNode ? (
          <div className={mergeClassNames(`${DESIGNER_CLASSNAME}left-sidebar-search-wrap`, 'space-y-2')}>{searchNode}</div>
        ) : null}
      </div>
      <div
        className={mergeClassNames(`${DESIGNER_CLASSNAME}left-sidebar-main`, 'min-h-0 flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden overscroll-contain px-2 py-2')}
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
  catalogViewMode?: CatalogViewMode;
  onCatalogViewModeChange?: (mode: CatalogViewMode) => void;
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
  catalogViewMode,
  onCatalogViewModeChange,
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
  const activeRecipientWrapStyle = activeRecipientTone
    ? ({
        backgroundColor: `${activeRecipientTone}10`,
        borderColor: `${activeRecipientTone}22`,
      } as React.CSSProperties)
    : undefined;
  const activeRecipientButtonStyle = activeRecipientTone
    ? ({
        backgroundColor: `${activeRecipientTone}2A`,
        borderColor: activeRecipientTone,
        boxShadow: `0 0 0 1px ${activeRecipientTone}22 inset, 0 1px 3px rgba(15, 23, 42, 0.06)`,
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
    resolvedViewMode,
    setInternalViewMode,
    setUserViewMode,
    collapsedCategories,
    setCollapsedCategories,
    hasManualViewMode,
    markRecent,
  } = useLeftSidebarCatalogState({ catalogViewMode });

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
  const { mode: sidebarDensityMode, width: sidebarLiveWidth } = useResponsiveDensity(sidebarRootRef, {
    comfortable: 430,
    compact: 330,
    mini: 254,
  });

  useEffect(() => {
    if (catalogViewMode !== undefined || hasManualViewMode) return;
    const targetViewMode: CatalogViewMode =
      sidebarDensityMode === 'compact' || sidebarDensityMode === 'mini' ? 'compact' : 'rich';
    if (targetViewMode === resolvedViewMode) return;
    setInternalViewMode(targetViewMode);
    onCatalogViewModeChange?.(targetViewMode);
  }, [
    catalogViewMode,
    hasManualViewMode,
    onCatalogViewModeChange,
    resolvedViewMode,
    setInternalViewMode,
    sidebarDensityMode,
  ]);

  useEffect(() => {
    if (resolvedPresentation === 'overlay') {
      setSidebarExpanded(false);
    }
  }, [resolvedPresentation]);
  const sidebarClass = mergeClassNames(
    `${DESIGNER_CLASSNAME}left-sidebar`,
    `${DESIGNER_CLASSNAME}left-sidebar-${variant}`,
    variant === 'compact' ? `${DESIGNER_CLASSNAME}left-sidebar-compact` : '',
    detached ? `${DESIGNER_CLASSNAME}left-sidebar-detached` : '',
    classNames?.container,
    className,
  );

  const renderPluginButton = (item: CatalogSchemaItem) => {
    const { label, plugin, pluginType, category } = item;
    const draggableId = item.key;
    const recipientToneKey = activeRecipientTone || 'no-tone';
    const displayLabel = getCatalogLabel(label, pluginType, item.source);
    const buttonClass = mergeClassNames(
      `${DESIGNER_CLASSNAME}plugin-${pluginType}`,
      `${DESIGNER_CLASSNAME}plugin-btn`,
      `${DESIGNER_CLASSNAME}plugin-btn-${variant}`,
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
    const tooltipText = displayLabel;

    return (
      <Draggable
        key={`${draggableId}::${recipientToneKey}`}
        draggableId={draggableId}
        scale={scale}
        basePdf={basePdf}
        plugin={plugin}
      >
        {({ listeners, attributes, isDragging: draggableActive }) => (
          <div
            className={mergeClassNames(
              DESIGNER_CLASSNAME + 'left-sidebar-plugin-wrap',
              'relative rounded-xl border border-slate-200/70 bg-white/90 p-1 shadow-none transition',
            )}
            style={activeRecipientWrapStyle || activeRecipientStyles}
          >
            <Button
              className={buttonClass}
              data-schema-type={pluginType}
              data-schema-category={category}
              data-schema-kind={item.source}
              data-schema-label={displayLabel}
              data-dragging={draggableActive ? 'true' : 'false'}
              data-view-mode={resolvedViewMode}
              data-is-panel={isPanel ? 'true' : 'false'}
              style={activeRecipientButtonStyle}
              title={tooltipText}
              {...listeners}
              {...attributes}
              onClick={() => {
                if (draggableActive) return;
                if (typeof onSchemaClick === 'function') {
                  onSchemaClick(cloneDeep(plugin.propPanel.defaultSchema), pluginType);
                  markRecent(pluginType);
                }
              }}
              onDoubleClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (draggableActive) return;
                if (typeof onSchemaClick === 'function') {
                  onSchemaClick(cloneDeep(plugin.propPanel.defaultSchema), pluginType);
                  markRecent(pluginType);
                }
              }}
            >
              <PluginIcon
                plugin={plugin}
                label={displayLabel}
                activeRecipientColor={pluginTone ?? null}
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
              <span className={mergeClassNames(`${DESIGNER_CLASSNAME}plugin-btn-label`, 'min-w-0 flex-1 text-left')}>
                <span className={mergeClassNames(DESIGNER_CLASSNAME + 'plugin-btn-label-title', 'block truncate text-[0.72rem] font-medium text-slate-800')}>
                  {highlightTerm(displayLabel, searchTerms)}
                </span>
              </span>
              {isFavorite ? (
                <span className={mergeClassNames(DESIGNER_CLASSNAME + 'plugin-favorite-indicator', 'ml-2 text-amber-500')}>
                  ★
                </span>
              ) : null}
            </Button>
            <button
              type="button"
              aria-label="Marcar favorito"
              className={mergeClassNames(
                DESIGNER_CLASSNAME + 'plugin-favorite-toggle',
                'absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] text-slate-400 shadow-sm transition',
              )}
              data-active={isFavorite ? 'true' : 'false'}
              onClick={(e) => {
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

    return (
      <Draggable
        key={`${definition.id}::${recipientToneKey}`}
        draggableId={draggableId}
        scale={scale}
        basePdf={basePdf}
        plugin={plugin}
        schemaFactory={createSchemaInstance}
      >
        {({ listeners, attributes, isDragging: draggableActive }) => (
          <div
            className={mergeClassNames(
              DESIGNER_CLASSNAME + 'left-sidebar-plugin-wrap',
              'relative rounded-xl border border-slate-200/70 bg-white/90 p-1 shadow-none transition',
            )}
            style={activeRecipientWrapStyle || activeRecipientStyles}
          >
            <Button
              className={mergeClassNames(
                `${DESIGNER_CLASSNAME}left-sidebar-custom-item`,
                `${DESIGNER_CLASSNAME}plugin-${definition.pluginType}`,
                `${DESIGNER_CLASSNAME}plugin-btn`,
                `${DESIGNER_CLASSNAME}plugin-btn-${variant}`,
              )}
              data-schema-type={definition.pluginType}
              data-schema-category={definition.category}
              data-schema-kind="custom"
              data-schema-label={definition.label}
              title={[
                definition.label,
                getCatalogLabel(definition.label, definition.pluginType, 'custom'),
              ]
                .filter(Boolean)
                .join(' • ')}
              {...listeners}
              {...attributes}
              onClick={() => {
                if (draggableActive) return;
                if (typeof onSchemaClick === 'function') {
                  const schema = createSchemaInstance();
                  if (!schema) return;
                  onSchemaClick(cloneDeep(schema), definition.pluginType);
                  markRecent(definition.pluginType);
                }
              }}
              onDoubleClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (draggableActive) return;
                if (typeof onSchemaClick === 'function') {
                  const schema = createSchemaInstance();
                  if (!schema) return;
                  onSchemaClick(cloneDeep(schema), definition.pluginType);
                  markRecent(definition.pluginType);
                }
              }}
              data-view-mode={resolvedViewMode}
              style={activeRecipientButtonStyle}
              >
                <span className={`${DESIGNER_CLASSNAME}left-sidebar-custom-item-icon`}>
                  <PluginIcon
                    plugin={plugin}
                    label={definition.label}
                    activeRecipientColor={activeRecipientTone ?? null}
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
              <span className={mergeClassNames(`${DESIGNER_CLASSNAME}left-sidebar-custom-item-copy`, 'min-w-0 flex-1 text-left')}>
                <span className={mergeClassNames(`${DESIGNER_CLASSNAME}left-sidebar-custom-item-label`, 'block truncate text-[0.72rem] font-medium text-slate-800')}>
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

  const sidebarTabs: SidebarTabOption[] = showCatalogViewSwitcher
    ? [
        { id: 'standard', label: 'Campos estándar' },
        { id: 'custom', label: 'Campos personalizados' },
        { id: 'prefill', label: 'Herramientas de prerrellenado' },
      ]
    : [];

  const searchNode = showSearchInput ? (
    <div className={mergeClassNames(DESIGNER_CLASSNAME + 'left-sidebar-search-stack', 'space-y-2')}>
      <LeftSidebarSearch
        value={search}
        onChange={setSearch}
        className={classNames?.searchInput}
        useDefaultStyles={useDefaultStyles}
      />
      {SHOW_ADVANCED_CATALOG_CONTROLS &&
        (parsedQuery.capabilities.size > 0 ||
          parsedQuery.categories.size > 0 ||
          parsedQuery.types.size > 0 ||
          parsedQuery.tags.size > 0) ? (
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'left-sidebar-chip-row', 'flex flex-wrap gap-1.5')}>
          {Array.from(parsedQuery.capabilities).map((cap) => (
            <Button key={`facet-cap-${cap}`} size="small" type="text">
              cap:{cap}
            </Button>
          ))}
          {Array.from(parsedQuery.categories).map((cat) => (
            <Button key={`facet-cat-${cat}`} size="small" type="text">
              cat:{cat}
            </Button>
          ))}
          {Array.from(parsedQuery.types).map((typeFacet) => (
            <Button key={`facet-type-${typeFacet}`} size="small" type="text">
              type:{typeFacet}
            </Button>
          ))}
          {Array.from(parsedQuery.tags).map((tag) => (
            <Button key={`facet-tag-${tag}`} size="small" type="text">
              tag:{tag}
            </Button>
          ))}
          <Button size="small" onClick={() => setSearch('')}>
            Limpiar
          </Button>
        </div>
      ) : null}
      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'left-sidebar-chip-row', 'flex flex-wrap gap-1.5')}>
        <Button
          className={DESIGNER_CLASSNAME + 'left-sidebar-filter-btn'}
          size="small"
          type={quickFilter === 'all' ? 'primary' : 'default'}
          onClick={() => setQuickFilter('all')}
        >
          Todos
        </Button>
        <Button
          className={DESIGNER_CLASSNAME + 'left-sidebar-filter-btn'}
          size="small"
          type={quickFilter === 'favorites' ? 'primary' : 'default'}
          onClick={() => setQuickFilter('favorites')}
        >
          Favoritos ({favoritePlugins.size})
        </Button>
        <Button
          className={DESIGNER_CLASSNAME + 'left-sidebar-filter-btn'}
          size="small"
          type={quickFilter === 'recent' ? 'primary' : 'default'}
          onClick={() => setQuickFilter('recent')}
        >
          Recientes ({recentPlugins.length})
        </Button>
        {showCatalogViewSwitcher ? (
          <Button
            className={DESIGNER_CLASSNAME + 'left-sidebar-view-toggle-btn'}
            size="small"
            icon={resolvedViewMode === 'compact' ? <List size={14} /> : <LayoutGrid size={14} />}
            title={resolvedViewMode === 'compact' ? 'Vista detalle (lista)' : 'Vista compacta (grid)'}
            aria-label={resolvedViewMode === 'compact' ? 'Vista detalle (lista)' : 'Vista compacta (grid)'}
            onClick={() => {
              const nextMode: CatalogViewMode = resolvedViewMode === 'compact' ? 'rich' : 'compact';
              setUserViewMode(nextMode);
              onCatalogViewModeChange?.(nextMode);
            }}
          />
        ) : null}
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
      data-sidebar-variant={variant}
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
      style={{ '--left-sidebar-live-width': `${sidebarLiveWidth}px` } as React.CSSProperties}>
      <button
        type="button"
        className={mergeClassNames(
          `${DESIGNER_CLASSNAME}sidebar-toggle-btn`,
          `${DESIGNER_CLASSNAME}left-sidebar-toggle-btn`,
        )}
        aria-label={sidebarExpanded ? 'Cerrar catálogo de campos' : 'Abrir catálogo de campos'}
        title={sidebarExpanded ? 'Cerrar catálogo de campos' : 'Abrir catálogo de campos'}
        aria-expanded={sidebarExpanded}
        onClick={() => setSidebarExpanded(prev => !prev)}
      >
        {sidebarExpanded ? <PanelLeftClose size={16} strokeWidth={2.2} /> : <PanelLeftOpen size={16} strokeWidth={2.2} />}
      </button>
      {useLayoutFrame ? (
        <SidebarFrame className={`${DESIGNER_CLASSNAME}left-sidebar-frame`}>
          <SidebarShell
            tabs={sidebarTabs}
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            renderTabIcon={renderTabIcon}
            searchNode={searchNode}
            activeRecipientLabel={activeRecipientLabel}
            activeRecipientColor={activeRecipientColor}
            style={activeRecipientStyles}
          >
            <SidebarButtons
              activeTab={activeTab}
              variant={variant}
              groupedPlugins={groupedPlugins}
              recentCatalogItems={recentCatalogItems}
              collapsedCategories={collapsedCategories}
              quickFilter={quickFilter}
              normalizedSearch={normalizedSearch}
              resolvedViewMode={resolvedViewMode}
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
          className={mergeClassNames(`${DESIGNER_CLASSNAME}left-sidebar-content`, classNames?.content)}>
          <SidebarShell
            tabs={sidebarTabs}
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            renderTabIcon={renderTabIcon}
            searchNode={searchNode}
            activeRecipientLabel={activeRecipientLabel}
            activeRecipientColor={activeRecipientColor}
            style={activeRecipientStyles}
          >
            <SidebarButtons
              activeTab={activeTab}
              variant={variant}
              groupedPlugins={groupedPlugins}
              recentCatalogItems={recentCatalogItems}
              collapsedCategories={collapsedCategories}
              quickFilter={quickFilter}
              normalizedSearch={normalizedSearch}
              resolvedViewMode={resolvedViewMode}
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
