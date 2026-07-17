import { createDesignerRuntimeEventHub } from '../ui/components/Designer/shared/designerExtensions.js';
import { DesignerEngineBuilder } from '../ui/designerEngine.js';
import { buildRuntimeOptions } from '../runtime/options.js';
// Adapters compartidos: fuente única (TASK-LAB-026/TASK-ARCH-004). El resolver
// tenía copias locales divergentes; la de documentos perdía `template` y
// dejaba el canvas en `empty_page` con multi-documento.
import { createRecipientsAdapter } from '../adapters/recipientsAdapter.js';
import { createDocumentsAdapter } from '../adapters/documentsAdapter.js';
import { createPersistenceAdapter } from '../adapters/persistenceAdapter.js';
import { createSignatureProviderAdapter } from '../adapters/signatureProviderAdapter.js';
import { defaultSisadPdfmeConfig, defaultSisadPdfmeVisibilityConfig } from './defaultSisadPdfmeConfig.js';
import type {
  ResolvedSisadPdfmeConfig,
  SisadPdfmeGlobalConfig,
  SisadPdfmeUiConfig,
  SisadPdfmeUiClassNamesConfig,
  SisadPdfmeSignatureProvider,
} from './SisadPdfmeConfig.js';

const isObject = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const deepMerge = <T extends Record<string, unknown>>(base: T, patch?: Record<string, unknown>): T => {
  if (!isObject(patch)) return { ...base };
  const next = { ...base } as Record<string, unknown>;
  Object.entries(patch).forEach(([key, value]) => {
    const current = next[key];
    if (isObject(current) && isObject(value)) {
      next[key] = deepMerge(current, value);
      return;
    }
    if (Array.isArray(value)) {
      next[key] = value.slice();
      return;
    }
    next[key] = value;
  });
  return next as T;
};

const defaultUiConfig = defaultSisadPdfmeConfig.ui as Required<SisadPdfmeUiConfig> & {
  visibility: Required<typeof defaultSisadPdfmeVisibilityConfig>;
  classNames: Required<SisadPdfmeUiClassNamesConfig>;
};

const normalizeUiConfig = (
  input?: SisadPdfmeGlobalConfig['ui'],
): Required<SisadPdfmeUiConfig> & {
  visibility: Required<typeof defaultSisadPdfmeVisibilityConfig>;
  classNames: Required<SisadPdfmeUiClassNamesConfig>;
} => {
  const merged = deepMerge(
    defaultUiConfig as unknown as Record<string, unknown>,
    input as Record<string, unknown> | undefined,
  ) as Required<SisadPdfmeUiConfig> & {
    visibility: Required<typeof defaultSisadPdfmeVisibilityConfig>;
    classNames: Required<SisadPdfmeUiClassNamesConfig>;
  };
  merged.visibility = deepMerge(
    defaultSisadPdfmeVisibilityConfig as unknown as Record<string, unknown>,
    input?.visibility as Record<string, unknown> | undefined,
  ) as Required<typeof defaultSisadPdfmeVisibilityConfig>;
  merged.classNames = deepMerge(
    defaultUiConfig.classNames as unknown as Record<string, unknown>,
    input?.classNames as Record<string, unknown> | undefined,
  ) as Required<SisadPdfmeUiClassNamesConfig>;
  return merged;
};

const resolveLayoutPresetOptions = (
  ui: Required<SisadPdfmeUiConfig> & {
    visibility: Required<typeof defaultSisadPdfmeVisibilityConfig>;
    classNames: Required<SisadPdfmeUiClassNamesConfig>;
  },
) => {
  const isThreePanel = ui.layoutPreset === 'three-panel';
  const sidebarOpen = ui.sidebars?.right?.defaultOpen ?? true;
  const leftSidebarVisible = ui.sidebars?.left?.defaultOpen ?? true;

  return {
    themePreset: ui.visualPreset === 'classic-designer' ? 'sisad' : ui.visualPreset || 'sisad',
    leftSidebarVariant: isThreePanel ? 'panel' : 'compact',
    leftSidebarVisible,
    leftSidebarReserveSpace: isThreePanel,
    leftSidebarUseLayout: false,
    leftSidebarSearchable: true,
    leftSidebarShowCatalogViewSwitcher: true,
    leftSidebarShowItemMeta: true,
    leftSidebarShowItemDescription: true,
    leftSidebarShowTechnicalLabels: true,
    rightSidebarReserveSpace: isThreePanel,
    rightSidebarPresentation: isThreePanel ? 'docked' : 'auto',
    // 'fields' es el panel histórico por defecto y se expresa como 'auto' para
    // conservar el auto-switch a Detalle al seleccionar un schema; un panel
    // explícito distinto sí se respeta literal.
    rightSidebarViewMode:
      !ui.sidebars?.right?.defaultPanel || ui.sidebars.right.defaultPanel === 'fields'
        ? 'auto'
        : ui.sidebars.right.defaultPanel === 'documents'
          ? 'docs'
          : ui.sidebars.right.defaultPanel,
    // El preset define el estado INICIAL del sidebar; no lo controla. Un estado
    // controlado sin re-control del host congela el toggle de colapso.
    sidebarOpenControlled: false,
    sidebarOpen,
    catalogLayout: ui.sidebars?.left?.catalogLayout || 'list',
    layoutPreset: ui.layoutPreset,
    density: ui.density,
    gap: ui.gap,
    padding: ui.padding,
    baseWidth: ui.baseWidth,
    baseHeight: ui.baseHeight,
  };
};

export const resolveSisadPdfmeConfig = (
  input: SisadPdfmeGlobalConfig = {},
): ResolvedSisadPdfmeConfig => {
  const baseConfig = deepMerge(defaultSisadPdfmeConfig as unknown as Record<string, unknown>, input as Record<string, unknown>) as ResolvedSisadPdfmeConfig['config'];
  const ui = normalizeUiConfig(input.ui);
  const visibility = deepMerge(
    defaultSisadPdfmeVisibilityConfig as unknown as Record<string, unknown>,
    input.visibility as Record<string, unknown> | undefined,
  ) as ResolvedSisadPdfmeConfig['visibility'];
  const mergedVisibility = deepMerge(
    visibility as unknown as Record<string, unknown>,
    ui.visibility as Record<string, unknown> | undefined,
  ) as ResolvedSisadPdfmeConfig['visibility'];
  const layoutOptions = resolveLayoutPresetOptions(ui);
  const hiddenCatalogTypes = Object.entries(mergedVisibility.schemas.catalog || {})
    .filter(([, isVisible]) => isVisible === false)
    .map(([schemaType]) => schemaType);
  const designerEngineBuilder = new DesignerEngineBuilder()
    .withCanvasFeatureToggles({
      selecto: baseConfig.canvas.selecto,
      moveable: baseConfig.canvas.moveable,
      snapLines: baseConfig.canvas.snapLines,
      guides: baseConfig.canvas.guides,
    })
    .withCanvasUseDefaultStyles(true)
    .withAutoAttachIdentity(baseConfig.schemas.autoAttachIdentity)
    .withSignatureProviders((baseConfig.signatures.providers || []).map((provider: SisadPdfmeSignatureProvider) => ({
      key: provider.key,
      label: provider.label,
      description: provider.description,
      internal: false,
      capabilities: {
        supportsVisibleSignature: true,
        supportsWebhook: false,
        supportsPolling: false,
        supportsCertificateMetadata: false,
        supportsReason: false,
        supportsLocation: false,
        supportsOtp: false,
        supportsBiometric: false,
      },
    })))
    .withSignatureDefaultProviderKey(baseConfig.signatures.defaultMode === 'provider' ? baseConfig.signatures.providers?.[0]?.key || null : null)
    .withCollaboration({
      enabled: Boolean(baseConfig.collaboration.enabled),
      // `recipients.activeRecipientId` es la fuente preferida; `collaboration`
      // se mantiene como compatibilidad para configs previas al registry.
      activeRecipientId:
        baseConfig.recipients.activeRecipientId ?? baseConfig.collaboration.activeRecipientId ?? null,
      isGlobalView: baseConfig.collaboration.isGlobalView === true,
      canEditStructure: baseConfig.collaboration.canEditStructure,
    })
    .withLeftSidebarProps({
      variant: layoutOptions.leftSidebarVariant as 'compact' | 'panel',
      useLayoutFrame: layoutOptions.leftSidebarUseLayout,
      showSearch: layoutOptions.leftSidebarSearchable,
      showItemMeta: layoutOptions.leftSidebarShowItemMeta,
      showItemDescription: layoutOptions.leftSidebarShowItemDescription,
      showTechnicalLabels: layoutOptions.leftSidebarShowTechnicalLabels,
      showCatalogViewSwitcher: layoutOptions.leftSidebarShowCatalogViewSwitcher,
      presentation: layoutOptions.leftSidebarVisible ? 'docked' : 'overlay',
      classNames: {
        container: ui.classNames.leftSidebar?.container,
        content: ui.classNames.leftSidebar?.content,
        searchInput: ui.classNames.leftSidebar?.searchInput,
      },
    })
    .withRightSidebarProps({
      presentation: layoutOptions.rightSidebarPresentation as 'auto' | 'docked' | 'overlay',
      classNames: {
        root: ui.classNames.rightSidebar?.root,
        content: ui.classNames.rightSidebar?.content,
        listView: ui.classNames.rightSidebar?.listView,
        detailView: ui.classNames.rightSidebar?.detailView,
      },
    });

  const designerEngine = designerEngineBuilder.build();

  const resolvedUi = {
    ...ui,
    visibility: mergedVisibility,
    classNames: ui.classNames,
  };
  const resolvedThemeDensity = resolvedUi.density || baseConfig.theme.density;
  const resolvedSidebars = {
    ...baseConfig.sidebars,
    left: {
      ...(baseConfig.sidebars?.left || {}),
      defaultOpen: resolvedUi.sidebars?.left?.defaultOpen ?? baseConfig.sidebars?.left?.defaultOpen,
      catalogLayout: resolvedUi.sidebars?.left?.catalogLayout ?? baseConfig.sidebars?.left?.catalogLayout,
    },
    right: {
      ...(baseConfig.sidebars?.right || {}),
      defaultPanel: resolvedUi.sidebars?.right?.defaultPanel ?? baseConfig.sidebars?.right?.defaultPanel,
    },
  };
  const resolvedConfig = {
    ...baseConfig,
    theme: {
      ...baseConfig.theme,
      density: resolvedThemeDensity,
    },
    sidebars: resolvedSidebars,
    visibility: mergedVisibility,
    ui: resolvedUi,
  } as ResolvedSisadPdfmeConfig['config'];

  return {
    raw: input,
    config: resolvedConfig,
    visibility: mergedVisibility,
    runtimeOptions: buildRuntimeOptions({
      lang: resolvedConfig.app.locale || 'es',
      runtimeOptions: {
        ...layoutOptions,
        themePreset: layoutOptions.themePreset,
        readonly: resolvedConfig.runtime.readonly,
        isolateDomEvents: resolvedConfig.runtime.isolateDomEvents,
        preserveSelectionOnModalClose: resolvedConfig.runtime.preserveSelectionOnModalClose,
        runtimeMode: resolvedConfig.runtime.mode,
        app: resolvedConfig.app,
        runtime: resolvedConfig.runtime,
        theme: {
          ...resolvedConfig.theme,
          density: resolvedThemeDensity,
        },
        canvas: resolvedConfig.canvas,
        sidebars: resolvedSidebars,
        schemas: resolvedConfig.schemas,
        recipients: resolvedConfig.recipients,
        collaboration: resolvedConfig.collaboration,
        assignment: resolvedConfig.assignment,
        documents: resolvedConfig.documents,
        signatures: resolvedConfig.signatures,
        persistence: resolvedConfig.persistence,
        debug: resolvedConfig.debug,
        visibility: mergedVisibility,
        hiddenCatalogTypes,
      },
      themeToken: resolvedConfig.theme.tokens as never,
    }),
    designerEngine,
    adapters: {
      recipients: createRecipientsAdapter(),
      documents: createDocumentsAdapter(),
      persistence: createPersistenceAdapter(),
      signatures: createSignatureProviderAdapter(),
    },
    eventHub: createDesignerRuntimeEventHub(),
  };
};
