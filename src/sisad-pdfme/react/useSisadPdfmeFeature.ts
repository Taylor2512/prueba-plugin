import { useSyncExternalStore } from 'react';
import type { FeatureContext, FeatureId, SisadPdfmeFeatureState } from '@sisad-pdfme/config/featureRegistry';
import { useSisadPdfmeConfigService } from '@sisad-pdfme/react/useSisadPdfmeConfigService';

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
