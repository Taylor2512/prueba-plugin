import { createDesignerRuntimeEventHub } from '@sisad-pdfme/ui/components/Designer/shared/designerExtensions';
import { DesignerEngineBuilder } from '@sisad-pdfme/ui/designerEngine';
import { buildRuntimeOptions } from '@sisad-pdfme/runtime/options';
// Adapters compartidos: fuente única (TASK-LAB-026/TASK-ARCH-004). El resolver
// tenía copias locales divergentes; la de documentos perdía `template` y
// dejaba el canvas en `empty_page` con multi-documento.
import { createRecipientsAdapter } from '@sisad-pdfme/adapters/recipientsAdapter';
import { createDocumentsAdapter } from '@sisad-pdfme/adapters/documentsAdapter';
import { createPersistenceAdapter } from '@sisad-pdfme/adapters/persistenceAdapter';
import { createSignatureProviderAdapter } from '@sisad-pdfme/adapters/signatureProviderAdapter';
import { normalizeSisadPdfmeConfig } from '@sisad-pdfme/config/configNormalizer';
import { defaultSisadPdfmeConfig, defaultSisadPdfmeVisibilityConfig } from '@sisad-pdfme/config/defaultSisadPdfmeConfig';
import type {
  ResolvedSisadPdfmeConfig,
  SisadPdfmeGlobalConfig,
  SisadPdfmeUiConfig,
  SisadPdfmeUiClassNamesConfig,
  SisadPdfmeSignatureProvider,
} from '@sisad-pdfme/config/SisadPdfmeConfig';

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
  config: ResolvedSisadPdfmeConfig['config'],
) => {
  const isThreePanel = ui.layoutPreset === 'three-panel';
  const sidebarOpen = config.sidebars?.right?.defaultOpen ?? true;
  const leftSidebarVisible = config.sidebars?.left?.defaultOpen ?? true;

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
      !config.sidebars?.right?.defaultPanel || config.sidebars.right.defaultPanel === 'fields'
        ? 'auto'
        : config.sidebars.right.defaultPanel === 'documents'
          ? 'docs'
          : config.sidebars.right.defaultPanel,
    // El preset define el estado INICIAL del sidebar; no lo controla. Un estado
    // controlado sin re-control del host congela el toggle de colapso.
    sidebarOpenControlled: false,
    sidebarOpen,
    catalogLayout: config.sidebars?.left?.catalogLayout || 'list',
    layoutPreset: ui.layoutPreset,
    density: config.theme.density,
    gap: ui.gap,
    padding: ui.padding,
    baseWidth: ui.baseWidth,
    baseHeight: ui.baseHeight,
  };
};

export const resolveSisadPdfmeConfig = (
  input: SisadPdfmeGlobalConfig = {},
): ResolvedSisadPdfmeConfig => {
  const normalizedInput = normalizeSisadPdfmeConfig(input).config;
  const baseConfig = deepMerge(defaultSisadPdfmeConfig as unknown as Record<string, unknown>, normalizedInput as Record<string, unknown>) as ResolvedSisadPdfmeConfig['config'];
  const ui = normalizeUiConfig(input.ui);
  /**
   * el normalizador ya resuelve la precedencia de `ui.visibility`
   * dentro de `visibility` dando prioridad a la ruta canónica, así que
   * `normalizedInput.visibility` es la autoridad completa.
   *
   * Antes se volvía a mezclar `ui.visibility` NORMALIZADA encima —es decir,
   * rellenada con TODOS los defaults—, de modo que cualquier `visibility`
   * canónica del host quedaba pisada por el default. Sólo pasaba inadvertido
   * mientras default y valor coincidían (RTP-440).
   */
  const mergedVisibility = deepMerge(
    defaultSisadPdfmeVisibilityConfig as unknown as Record<string, unknown>,
    normalizedInput.visibility as Record<string, unknown> | undefined,
  ) as ResolvedSisadPdfmeConfig['visibility'];
  const layoutOptions = resolveLayoutPresetOptions(ui, baseConfig);
  const hiddenCatalogTypes = Object.entries(mergedVisibility.schemas.catalog || {})
    .filter(([, isVisible]) => isVisible === false)
    .map(([schemaType]) => schemaType);
  const designerEngineBuilder = new DesignerEngineBuilder()
    // Las ocho capabilities de vista viajan completas. Antes sólo llegaban
    // cuatro, así que `grid` y `rulers` eran siempre `undefined` dentro del
    // canvas y su configuración no tenía ningún efecto (RTP-455).
    .withCanvasFeatureToggles({
      selecto: baseConfig.canvas.selecto,
      moveable: baseConfig.canvas.moveable,
      snapLines: baseConfig.canvas.snapLines,
      guides: baseConfig.canvas.guides,
      grid: baseConfig.canvas.grid,
      rulers: baseConfig.canvas.rulers,
      snapToGrid: baseConfig.canvas.snapToGrid,
      objectSnap: baseConfig.canvas.objectSnap,
      guideCreation: baseConfig.canvas.guideCreation,
      guideSnap: baseConfig.canvas.guideSnap,
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
      activeRecipientId: baseConfig.recipients.activeRecipientId ?? null,
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

  /**
   * Conecta el hub de runtime con el punto donde el Designer lo busca.
   *
   * `Designer/index.tsx` lee `designerEngine.extensions?.events`, y
   * `emitDesignerRuntimeEvent` es `hub?.emit(...)`: sin esto el hub quedaba
   * huérfano y toda emisión interna era un no-op silencioso (COREUX-003).
   *
   * Fue posible al dejar de pasar `options` como configuración
   * (`configFromRuntimeOptions`): antes, colgar una función de `designerEngine`
   * hacía fallar el `structuredClone` del ConfigService.
   */
  const eventHub = createDesignerRuntimeEventHub();
  designerEngine.extensions = {
    ...(designerEngine.extensions || {}),
    events: designerEngine.extensions?.events ?? eventHub,
  };

  const resolvedSidebars = {
    ...baseConfig.sidebars,
    left: {
      ...(baseConfig.sidebars?.left || {}),
      defaultOpen: baseConfig.sidebars?.left?.defaultOpen,
      catalogLayout: baseConfig.sidebars?.left?.catalogLayout,
    },
    right: {
      ...(baseConfig.sidebars?.right || {}),
      defaultOpen: baseConfig.sidebars?.right?.defaultOpen,
      defaultPanel: baseConfig.sidebars?.right?.defaultPanel,
    },
  };
  const resolvedThemeDensity = baseConfig.theme.density;
  const resolvedUi = {
    ...ui,
    visibility: mergedVisibility,
    classNames: ui.classNames,
    density: resolvedThemeDensity,
    sidebars: {
      ...ui.sidebars,
      left: {
        ...(ui.sidebars?.left || {}),
        defaultOpen: resolvedSidebars.left.defaultOpen,
        catalogLayout: resolvedSidebars.left.catalogLayout,
      },
      right: {
        ...(ui.sidebars?.right || {}),
        defaultOpen: resolvedSidebars.right.defaultOpen,
        defaultPanel: resolvedSidebars.right.defaultPanel,
      },
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
    // Misma instancia que `designerEngine.extensions.events`: un hub por config.
    eventHub: designerEngine.extensions?.events ?? eventHub,
  };
};
