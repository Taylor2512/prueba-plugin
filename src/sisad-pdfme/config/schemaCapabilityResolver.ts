import type { SchemaConfigurationProfile } from '@sisad-pdfme/config/schemaConfigurationProfile';
import type { SisadPdfmeFeatureState } from '@sisad-pdfme/config/featureRegistry';
import { normalizeLooseText } from '@sisad-pdfme/shared/text';

export type SchemaCapabilityContext = {
  catalogEnabledTypes?: ReadonlyArray<string>;
  runtimeEnabledTypes?: ReadonlyArray<string>;
  inspectorVisible?: boolean;
  canvasVisible?: boolean;
  configurationVisible?: boolean;
};

export type SchemaCapabilityState = SisadPdfmeFeatureState;

export type SchemaCapabilitySnapshot = {
  catalog: SchemaCapabilityState;
  canvas: SchemaCapabilityState;
  inspector: SchemaCapabilityState;
  runtime: SchemaCapabilityState;
  configuration: SchemaCapabilityState;
};

export type SchemaCapabilityResolver = {
  profile: SchemaConfigurationProfile;
  resolveCatalog(context?: SchemaCapabilityContext): SchemaCapabilityState;
  resolveCanvas(context?: SchemaCapabilityContext): SchemaCapabilityState;
  resolveInspector(context?: SchemaCapabilityContext): SchemaCapabilityState;
  resolveRuntime(context?: SchemaCapabilityContext): SchemaCapabilityState;
  resolveConfiguration(context?: SchemaCapabilityContext): SchemaCapabilityState;
  resolveAll(context?: SchemaCapabilityContext): SchemaCapabilitySnapshot;
};

const normalizeTypeSet = (values?: ReadonlyArray<string>) =>
  new Set((values || []).map((value) => normalizeLooseText(value).toLowerCase()).filter(Boolean));

const createState = (
  id: string,
  partial: Partial<SchemaCapabilityState>,
  sources: string[],
): SchemaCapabilityState => ({
  id,
  registered: true,
  supported: true,
  enabled: true,
  visible: true,
  permitted: true,
  available: true,
  active: false,
  executable: true,
  reason: undefined,
  sources,
  ...partial,
});

const resolveCatalogEnabled = (profile: SchemaConfigurationProfile, context?: SchemaCapabilityContext) => {
  const enabledTypes = normalizeTypeSet(context?.catalogEnabledTypes);
  if (!enabledTypes.size) return true;
  return enabledTypes.has(profile.schemaType);
};

const resolveRuntimeEnabled = (profile: SchemaConfigurationProfile, context?: SchemaCapabilityContext) => {
  const enabledTypes = normalizeTypeSet(context?.runtimeEnabledTypes);
  if (!enabledTypes.size) return true;
  return enabledTypes.has(profile.schemaType);
};

export const createSchemaCapabilityResolver = (
  profile: SchemaConfigurationProfile,
): SchemaCapabilityResolver => {
  const resolveCatalog = (context: SchemaCapabilityContext = {}) => {
    const enabled = resolveCatalogEnabled(profile, context);
    const visible = enabled;
    return createState('catalog', {
      enabled,
      visible,
      available: enabled,
      active: visible,
      executable: visible,
      reason: enabled ? undefined : 'catalog-disabled',
    }, ['catalog.enabledTypes']);
  };

  const resolveCanvas = (context: SchemaCapabilityContext = {}) => {
    const enabled =
      profile.canvas.canDrag ||
      profile.canvas.canResize ||
      profile.canvas.canRotate ||
      profile.canvas.canInlineEdit ||
      profile.canvas.hasGroupFloatingAction;
    const visible = context.canvasVisible !== false;
    return createState('canvas', {
      enabled,
      visible,
      active: enabled && visible,
      executable: enabled && visible,
      reason: enabled ? undefined : 'canvas-unsupported',
    }, ['canvas.visible']);
  };

  const resolveInspector = (context: SchemaCapabilityContext = {}) => {
    const enabled = profile.inspector.visibleSections.length > 0;
    const visible = context.inspectorVisible !== false;
    return createState('inspector', {
      enabled,
      visible,
      active: enabled && visible,
      executable: enabled && visible,
      reason: enabled ? undefined : 'inspector-empty',
    }, ['inspector.visible']);
  };

  const resolveRuntime = (context: SchemaCapabilityContext = {}) => {
    const enabled = resolveRuntimeEnabled(profile, context);
    return createState('runtime', {
      enabled,
      visible: true,
      active: enabled,
      executable: enabled,
      reason: enabled ? undefined : 'runtime-disabled',
    }, ['runtime.enabledTypes']);
  };

  const resolveConfiguration = (context: SchemaCapabilityContext = {}) => {
    const visible = context.configurationVisible !== false;
    return createState('configuration', {
      enabled: true,
      visible,
      active: visible,
      executable: visible,
      reason: undefined,
    }, ['configuration.visible']);
  };

  return {
    profile,
    resolveCatalog,
    resolveCanvas,
    resolveInspector,
    resolveRuntime,
    resolveConfiguration,
    resolveAll(context = {}) {
      return {
        catalog: resolveCatalog(context),
        canvas: resolveCanvas(context),
        inspector: resolveInspector(context),
        runtime: resolveRuntime(context),
        configuration: resolveConfiguration(context),
      };
    },
  };
};
