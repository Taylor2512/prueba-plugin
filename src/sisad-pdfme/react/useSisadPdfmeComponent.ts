import { useSyncExternalStore } from 'react';
import type { ComponentContext, ComponentId, SisadPdfmeComponentState } from '@sisad-pdfme/config/componentRegistry';
import { useSisadPdfmeConfigService } from '@sisad-pdfme/react/useSisadPdfmeConfigService';

export const useSisadPdfmeComponent = (
  componentId: ComponentId,
  context: ComponentContext = {},
): SisadPdfmeComponentState => {
  const service = useSisadPdfmeConfigService();
  return useSyncExternalStore(
    (listener) => service.subscribe(listener),
    () => service.selectComponentState(componentId, context),
    () => service.selectComponentState(componentId, context),
  );
};
