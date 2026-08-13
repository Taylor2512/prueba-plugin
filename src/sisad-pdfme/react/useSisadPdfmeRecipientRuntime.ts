import { useContext, useMemo } from 'react';
import { useRecipientRegistry } from '../recipients/useRecipientRegistry.js';
import type {
  ResolvedSisadPdfmeConfig,
  SisadPdfmeGlobalConfig,
} from '../config/SisadPdfmeConfig.js';
import { SisadPdfmeContext } from './SisadPdfmeContext.js';
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
  const isGlobalView = resolvedConfig.config.collaboration.isGlobalView === true;
  const recipientRegistryConfig = isGlobalView
    ? {
        ...resolvedConfig.config.recipients,
        defaultOwnerStrategy: 'none' as const,
      }
    : resolvedConfig.config.recipients;
  const recipientRegistry = useRecipientRegistry({
    registry: providerValue?.recipientRegistry ?? null,
    recipients,
    adapter: resolvedConfig.adapters.recipients,
    config: recipientRegistryConfig,
    activeRecipientId: isGlobalView
      ? null
      : activeRecipientId !== undefined
        ? activeRecipientId
        : resolvedConfig.config.recipients.activeRecipientId ?? undefined,
  });

  const effectiveActiveRecipientId = recipientRegistry.state.activeRecipientId;
  const recipientFilterEnabled =
    resolvedConfig.visibility.runtime?.recipientFilter !== false;
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
