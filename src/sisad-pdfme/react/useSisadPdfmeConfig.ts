import { useSyncExternalStore } from 'react';
import type { ResolvedSisadPdfmeConfig } from '../config/SisadPdfmeConfig.js';
import { useSisadPdfmeConfigService, type SisadPdfmeConfigInput } from './useSisadPdfmeConfigService.js';

export const useSisadPdfmeConfig = (config?: SisadPdfmeConfigInput): ResolvedSisadPdfmeConfig => {
  const service = useSisadPdfmeConfigService(config);
  return useSyncExternalStore(
    (listener) => service.subscribe(listener),
    () => service.getResolvedConfig(),
    () => service.getResolvedConfig(),
  );
};
