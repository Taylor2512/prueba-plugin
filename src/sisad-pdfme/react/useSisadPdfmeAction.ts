import { useSyncExternalStore } from 'react';
import type { ActionContext, ActionId, SisadPdfmeActionState } from '@sisad-pdfme/config/actionConfigRegistry';
import { useSisadPdfmeConfigService } from '@sisad-pdfme/react/useSisadPdfmeConfigService';

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
