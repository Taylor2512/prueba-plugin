import React, { createContext, useMemo } from 'react';
import { createSisadPdfmeConfig } from '../config/createSisadPdfmeConfig.js';
import { createRecipientRegistry } from '../recipients/recipientRegistry.js';
import type { ResolvedSisadPdfmeConfig, SisadPdfmeProviderProps, SisadPdfmeProviderValue } from '../config/SisadPdfmeConfig.js';

export const SisadPdfmeContext = createContext<SisadPdfmeProviderValue | null>(null);

const isResolvedConfig = (value: unknown): value is ResolvedSisadPdfmeConfig =>
  Boolean(value && typeof value === 'object' && 'config' in value && 'runtimeOptions' in value && 'designerEngine' in value);

export const SisadPdfmeProvider = ({ children, config }: SisadPdfmeProviderProps) => {
  const value = useMemo<SisadPdfmeProviderValue>(() => {
    const resolved: ResolvedSisadPdfmeConfig = isResolvedConfig(config)
      ? config
      : createSisadPdfmeConfig(config);
    // Registry único por provider: los wrappers hijos (Designer/Form/Viewer)
    // lo reutilizan en lugar de crear copias locales de recipients.
    const recipientRegistry = createRecipientRegistry({
      config: resolved.config.recipients,
      activeRecipientId:
        resolved.config.recipients.activeRecipientId ??
        resolved.config.collaboration.activeRecipientId ??
        null,
    });
    return { config: resolved, recipientRegistry };
  }, [config]);

  return <SisadPdfmeContext.Provider value={value}>{children}</SisadPdfmeContext.Provider>;
};
