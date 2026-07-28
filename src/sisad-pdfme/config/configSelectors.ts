import type { ResolvedSisadPdfmeConfig } from './SisadPdfmeConfig.js';
import { featureDependencies } from './featureDependencies.js';
import { featureRegistry, type FeatureContext, type FeatureId, type SisadPdfmeFeatureState } from './featureRegistry.js';
import { actionConfigRegistry, type ActionContext, type ActionId, type SisadPdfmeActionState } from './actionConfigRegistry.js';
import { componentRegistry, type ComponentContext, type ComponentId, type SisadPdfmeComponentState } from './componentRegistry.js';

export type SisadPdfmeConfigSnapshot = Pick<ResolvedSisadPdfmeConfig, 'config' | 'visibility'>;
export type SisadPdfmeConfigSource = SisadPdfmeConfigSnapshot | ResolvedSisadPdfmeConfig;

export type SisadPdfmeConfigSelectors = {
  selectVisibilityConfig(): SisadPdfmeConfigSnapshot['visibility'];
  selectFeatureState(featureId: FeatureId, context?: FeatureContext): SisadPdfmeFeatureState;
  selectActionState(actionId: ActionId, context?: ActionContext): SisadPdfmeActionState;
  selectComponentState(componentId: ComponentId, context?: ComponentContext): SisadPdfmeComponentState;
};

const isResolvedConfigSnapshot = (value: unknown): value is ResolvedSisadPdfmeConfig =>
  Boolean(value && typeof value === 'object' && 'config' in value && 'visibility' in value);

const resolveConfigSnapshot = (input: SisadPdfmeConfigSource): SisadPdfmeConfigSnapshot =>
  isResolvedConfigSnapshot(input) ? { config: input.config, visibility: input.visibility } : input;

const createUnknownState = (
  id: string,
  sources: string[],
  reason = 'unknown-id',
): SisadPdfmeFeatureState => ({
  id,
  registered: false,
  supported: false,
  enabled: false,
  visible: false,
  permitted: false,
  available: false,
  active: false,
  executable: false,
  reason,
  sources,
});

const dedupeSources = (sources: string[]) => Array.from(new Set(sources.filter(Boolean)));

export const selectFeatureState = (
  input: SisadPdfmeConfigSource,
  featureId: FeatureId,
  context: FeatureContext = {},
  stack: FeatureId[] = [],
): SisadPdfmeFeatureState => {
  if (stack.includes(featureId)) {
    return createUnknownState(featureId, [`cycle:${stack.join('>')}`], 'feature-cycle');
  }
  const snapshot = resolveConfigSnapshot(input);
  const definition = featureRegistry[featureId];
  if (!definition) {
    return createUnknownState(featureId, [featureId]);
  }
  const dependencyIds = featureDependencies[featureId] || [];
  const dependencyStates = dependencyIds.map((dependencyId) =>
    selectFeatureState(snapshot, dependencyId, context, [...stack, featureId]),
  );
  const dependencyBlocked = dependencyStates.some((state) => state.executable === false);
  const base = definition.resolve(snapshot, context);
  return {
    ...base,
    supported: base.supported && !dependencyBlocked,
    available: base.available && !dependencyBlocked,
    executable: base.executable && !dependencyBlocked,
    reason: base.reason || (dependencyBlocked ? 'dependency-unavailable' : undefined),
    sources: dedupeSources([...(base.sources || []), ...dependencyStates.flatMap((state) => state.sources || [])]),
  };
};

export const selectActionState = (
  input: SisadPdfmeConfigSource,
  actionId: ActionId,
  context: ActionContext = {},
): SisadPdfmeActionState => {
  const snapshot = resolveConfigSnapshot(input);
  const definition = actionConfigRegistry[actionId];
  if (!definition) {
    return {
      ...createUnknownState(actionId, [actionId]),
      commandId: undefined,
    };
  }
  const base = definition.resolve(snapshot, context);
  return {
    ...base,
    sources: dedupeSources([...(base.sources || []), ...definition.sources]),
  };
};

export const selectComponentState = (
  input: SisadPdfmeConfigSource,
  componentId: ComponentId,
  context: ComponentContext = {},
): SisadPdfmeComponentState => {
  const snapshot = resolveConfigSnapshot(input);
  const definition = componentRegistry[componentId];
  if (!definition) {
    return {
      ...createUnknownState(componentId, [componentId]),
      componentId,
    };
  }
  const base = definition.resolve(snapshot, context);
  return {
    ...base,
    sources: dedupeSources([...(base.sources || []), ...definition.sources]),
  };
};

export const createSisadPdfmeConfigSelectors = (
  input: SisadPdfmeConfigSource,
): SisadPdfmeConfigSelectors => ({
  selectVisibilityConfig: () => resolveConfigSnapshot(input).visibility,
  selectFeatureState: (featureId, context) => selectFeatureState(input, featureId, context),
  selectActionState: (actionId, context) => selectActionState(input, actionId, context),
  selectComponentState: (componentId, context) => selectComponentState(input, componentId, context),
});
