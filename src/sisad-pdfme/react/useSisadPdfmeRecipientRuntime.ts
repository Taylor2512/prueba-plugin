import { useContext, useMemo } from 'react';
import { useRecipientRegistry } from '../recipients/useRecipientRegistry.js';
import type {
  ResolvedSisadPdfmeConfig,
  SisadPdfmeGlobalConfig,
} from '../config/SisadPdfmeConfig.js';
import { SisadPdfmeContext } from './SisadPdfmeProvider.js';
import { useSisadPdfmeConfig } from './useSisadPdfmeConfig.js';

type RecipientRuntimeOptions = {
  config?: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig;
  recipients?: unknown[];
  activeRecipientId?: string | null;
};

export const useSisadPdfmeRecipientRuntime = ({
  config,
  recipients,
  activeRecipientId,
}: RecipientRuntimeOptions) => {
  const resolvedConfig = useSisadPdfmeConfig(config);
  const providerValue = useContext(SisadPdfmeContext);
  const recipientRegistry = useRecipientRegistry({
    registry: providerValue?.recipientRegistry ?? null,
    recipients,
    adapter: resolvedConfig.adapters.recipients,
    config: resolvedConfig.config.recipients,
    activeRecipientId:
      activeRecipientId !== undefined
        ? activeRecipientId
        : resolvedConfig.config.recipients.activeRecipientId ?? undefined,
  });

  const effectiveActiveRecipientId = recipientRegistry.state.activeRecipientId;
  const recipientFilterEnabled =
    resolvedConfig.visibility.runtime?.recipientFilter !== false;
  const isGlobalView =
    resolvedConfig.config.collaboration.isGlobalView === true;
  const collaborationOptions = useMemo(
    () =>
      recipientFilterEnabled && !isGlobalView && effectiveActiveRecipientId
        ? { activeRecipientId: effectiveActiveRecipientId, isGlobalView }
        : { isGlobalView },
    [effectiveActiveRecipientId, isGlobalView, recipientFilterEnabled],
  );

  return {
    resolvedConfig,
    recipientRegistry,
    collaborationOptions,
  };
};
