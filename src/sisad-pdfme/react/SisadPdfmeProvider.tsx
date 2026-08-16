import { useMemo } from 'react';
import { createSisadPdfmeConfigService } from '@sisad-pdfme/config/SisadPdfmeConfigService';
import { createSisadPdfmeConfig } from '@sisad-pdfme/config/createSisadPdfmeConfig';
import { createRecipientRegistry } from '@sisad-pdfme/recipients/recipientRegistry';
import type { ResolvedSisadPdfmeConfig, SisadPdfmeProviderProps, SisadPdfmeProviderValue } from '@sisad-pdfme/config/SisadPdfmeConfig';
import { SisadPdfmeContext } from '@sisad-pdfme/react/SisadPdfmeContext';


const isResolvedSisadPdfmeProviderConfig = (value: unknown): value is ResolvedSisadPdfmeConfig =>
  Boolean(value && typeof value === 'object' && 'config' in value && 'runtimeOptions' in value && 'designerEngine' in value);

export const SisadPdfmeProvider = ({ children, config }: SisadPdfmeProviderProps) => {
  const value = useMemo<SisadPdfmeProviderValue>(() => {
    const resolved: ResolvedSisadPdfmeConfig = isResolvedSisadPdfmeProviderConfig(config)
      ? config
      : createSisadPdfmeConfig(config);
    const configService = createSisadPdfmeConfigService(resolved);
    // Registry único por provider: los wrappers hijos (Designer/Form/Viewer)
    // lo reutilizan en lugar de crear copias locales de recipients.
    const recipientRegistry = createRecipientRegistry({
      config: resolved.config.recipients,
      activeRecipientId:
        resolved.config.recipients.activeRecipientId ?? null,
    });
    return { config: resolved, configService, recipientRegistry };
  }, [config]);

  return <SisadPdfmeContext.Provider value={value}>{children}</SisadPdfmeContext.Provider>;
};
