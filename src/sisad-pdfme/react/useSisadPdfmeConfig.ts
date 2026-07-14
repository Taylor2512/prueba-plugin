import { useContext, useMemo } from 'react';
import { SisadPdfmeContext } from './SisadPdfmeProvider.js';
import { createSisadPdfmeConfig } from '../config/createSisadPdfmeConfig.js';
import type { ResolvedSisadPdfmeConfig, SisadPdfmeGlobalConfig } from '../config/SisadPdfmeConfig.js';

export type SisadPdfmeConfigInput = SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig;

const isResolvedConfig = (value: unknown): value is ResolvedSisadPdfmeConfig =>
  Boolean(value && typeof value === 'object' && 'config' in value && 'runtimeOptions' in value && 'designerEngine' in value);

export const useSisadPdfmeConfig = (config?: SisadPdfmeConfigInput): ResolvedSisadPdfmeConfig => {
  const context = useContext(SisadPdfmeContext);
  return useMemo(() => {
    if (isResolvedConfig(config)) return config;
    if (config) return createSisadPdfmeConfig(config);
    if (context) return context.config;
    return createSisadPdfmeConfig();
  }, [config, context]);
};
