import { useContext, useMemo } from 'react';
import { useRecipientRegistry } from '@sisad-pdfme/recipients/useRecipientRegistry';
import type {
  ResolvedSisadPdfmeConfig,
  SisadPdfmeGlobalConfig,
} from '@sisad-pdfme/config/SisadPdfmeConfig';
import { SisadPdfmeContext } from '@sisad-pdfme/react/SisadPdfmeContext';
import { useSisadPdfmeConfig } from '@sisad-pdfme/react/useSisadPdfmeConfig';

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

  // The registry applies a controlled id in an effect. Keep the controlled
  // value available during that transition so Preview never evaluates access
  // against the previous user while the registry catches up.
  const effectiveActiveRecipientId =
    recipientRegistry.state.activeRecipientId || activeRecipientId || resolvedConfig.config.recipients.activeRecipientId || null;
  const recipientFilterEnabled =
    resolvedConfig.visibility.runtime?.recipientFilter !== false;
  const collaborationOptions = useMemo(
    () => ({
        ...(recipientFilterEnabled && !isGlobalView && effectiveActiveRecipientId
          ? { activeRecipientId: effectiveActiveRecipientId }
          : {}),
        isGlobalView,
        // Keep Preview on the registry's normalized recipient/user authority.
        // Passing the list also makes access resolution deterministic when the
        // active user changes without reconstructing the template.
        recipientOptions: recipientRegistry.state.recipients,
        users: recipientRegistry.state.recipients,
      }),
    [effectiveActiveRecipientId, isGlobalView, recipientFilterEnabled, recipientRegistry.state.recipients],
  );

  return {
    resolvedConfig,
    recipientRegistry,
    collaborationOptions,
  };
};
