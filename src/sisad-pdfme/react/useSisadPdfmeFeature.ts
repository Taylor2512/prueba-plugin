import { useSyncExternalStore } from 'react';
import type { FeatureContext, FeatureId, SisadPdfmeFeatureState } from '../config/featureRegistry.js';
import { useSisadPdfmeConfigService } from './useSisadPdfmeConfigService.js';

export const useSisadPdfmeFeature = (
  featureId: FeatureId,
  context: FeatureContext = {},
): SisadPdfmeFeatureState => {
  const service = useSisadPdfmeConfigService();
  return useSyncExternalStore(
    (listener) => service.subscribe(listener),
    () => service.selectFeatureState(featureId, context),
    () => service.selectFeatureState(featureId, context),
  );
};
