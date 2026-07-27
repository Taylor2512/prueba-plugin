import { useSyncExternalStore } from 'react';
import type { ActionContext, ActionId, SisadPdfmeActionState } from '../config/actionConfigRegistry.js';
import { useSisadPdfmeConfigService } from './useSisadPdfmeConfigService.js';

export const useSisadPdfmeAction = (
  actionId: ActionId,
  context: ActionContext = {},
): SisadPdfmeActionState => {
  const service = useSisadPdfmeConfigService();
  return useSyncExternalStore(
    (listener) => service.subscribe(listener),
    () => service.selectActionState(actionId, context),
    () => service.selectActionState(actionId, context),
  );
};
