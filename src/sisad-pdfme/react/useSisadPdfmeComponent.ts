import { useSyncExternalStore } from 'react';
import type { ComponentContext, ComponentId, SisadPdfmeComponentState } from '../config/componentRegistry.js';
import { useSisadPdfmeConfigService } from './useSisadPdfmeConfigService.js';

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
