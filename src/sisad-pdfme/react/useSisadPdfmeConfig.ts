import { useSyncExternalStore } from 'react';
import type { ResolvedSisadPdfmeConfig } from '@sisad-pdfme/config/SisadPdfmeConfig';
import { useSisadPdfmeConfigService, type SisadPdfmeConfigInput } from '@sisad-pdfme/react/useSisadPdfmeConfigService';

export const useSisadPdfmeConfig = (config?: SisadPdfmeConfigInput): ResolvedSisadPdfmeConfig => {
  const service = useSisadPdfmeConfigService(config);
  return useSyncExternalStore(
    (listener) => service.subscribe(listener),
    () => service.getResolvedConfig(),
    () => service.getResolvedConfig(),
  );
};
