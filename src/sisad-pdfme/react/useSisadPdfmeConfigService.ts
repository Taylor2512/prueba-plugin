import { useContext, useMemo } from 'react';
import { createSisadPdfmeConfigService, type SisadPdfmeConfigService } from '../config/SisadPdfmeConfigService.js';
import type { ResolvedSisadPdfmeConfig, SisadPdfmeGlobalConfig } from '../config/SisadPdfmeConfig.js';
import { SisadPdfmeContext } from './SisadPdfmeProvider.js';

export type SisadPdfmeConfigInput = SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig;

const isResolvedSisadPdfmeConfig = (value: unknown): value is ResolvedSisadPdfmeConfig =>
  Boolean(value && typeof value === 'object' && 'config' in value && 'runtimeOptions' in value && 'designerEngine' in value);

/**
 * Hook de acceso al servicio canónico de configuración.
 *
 * Si hay Provider, reutiliza su instancia; fuera de Provider crea una instancia
 * local memoizada para mantener compatibilidad con usos directos del wrapper.
 */
export const useSisadPdfmeConfigService = (
  config?: SisadPdfmeConfigInput,
): SisadPdfmeConfigService => {
  const context = useContext(SisadPdfmeContext);
  return useMemo(() => {
    if (context?.configService) return context.configService;
    if (isResolvedSisadPdfmeConfig(config)) {
      return createSisadPdfmeConfigService(config);
    }
    return createSisadPdfmeConfigService(config ?? {});
  }, [config, context]);
};
