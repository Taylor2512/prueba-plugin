/**
 * SisadPdfmeForm — wrapper público del Form runtime.
 *
 * El filtrado por recipient (`options.collaboration.activeRecipientId`, leído
 * por Preview) se deriva del RecipientRegistry compartido: el prop
 * `activeRecipientId` es override puntual; si falta, manda el registry/config.
 */
import { cloneDeep, getInputFromTemplate } from '@sisad-pdfme/common';
import React, { useContext, useMemo, useRef } from 'react';
import { flatSchemaPlugins } from '@sisad-pdfme/schemas';
import Form from '../ui/Form.js';
import Viewer from '../ui/Viewer.js';
import { usePdfmeRuntimeInstance } from '../runtime/usePdfmeRuntimeInstance.js';
import { useSisadPdfmeConfig } from './useSisadPdfmeConfig.js';
import { SisadPdfmeContext } from './SisadPdfmeProvider.js';
import { useRecipientRegistry } from '../recipients/useRecipientRegistry.js';
import type { ResolvedSisadPdfmeConfig, SisadPdfmeGlobalConfig } from '../config/SisadPdfmeConfig.js';

type Props = {
  config?: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig;
  template: unknown;
  values?: unknown[];
  recipients?: unknown[];
  activeRecipientId?: string | null;
  onInputChange?: (payload: { index: number; name: string; value: unknown }) => void;
};

export const SisadPdfmeForm = ({
  config,
  template,
  values = [],
  recipients,
  activeRecipientId,
  onInputChange,
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const resolvedConfig = useSisadPdfmeConfig(config);
  const providerValue = useContext(SisadPdfmeContext);

  const { state: recipientState } = useRecipientRegistry({
    registry: providerValue?.recipientRegistry ?? null,
    recipients,
    adapter: resolvedConfig.adapters.recipients,
    config: resolvedConfig.config.recipients,
    activeRecipientId:
      activeRecipientId !== undefined
        ? activeRecipientId
        : resolvedConfig.config.recipients.activeRecipientId ??
          resolvedConfig.config.collaboration.activeRecipientId ??
          undefined,
  });

  const effectiveActiveRecipientId = recipientState.activeRecipientId;
  const recipientFilterEnabled = resolvedConfig.visibility.runtime?.recipientFilter !== false;
  const isGlobalView = resolvedConfig.config.collaboration.isGlobalView === true;
  const collaborationOptions =
    recipientFilterEnabled && !isGlobalView && effectiveActiveRecipientId
      ? { activeRecipientId: effectiveActiveRecipientId, isGlobalView }
      : { isGlobalView };

  const runtimeConfig = useMemo(() => {
    return {
      containerRef,
      mode: 'form' as const,
      template: template as any,
      inputs: Array.isArray(values) && values.length > 0 ? values : getInputFromTemplate(template as any),
      onTemplateChange: () => undefined,
      onPageChange: () => undefined,
      options: {
        ...resolvedConfig.runtimeOptions,
        designerEngine: resolvedConfig.designerEngine,
        // Preview lee `options.collaboration` para filtrar schemas por recipient.
        collaboration: collaborationOptions,
      },
      plugins: flatSchemaPlugins,
      runtime: { Designer: Form as any, Form: Form as any, Viewer: Viewer as any },
      onInputChange,
    };
  }, [isGlobalView, onInputChange, recipientFilterEnabled, effectiveActiveRecipientId, resolvedConfig, template, values]);
  usePdfmeRuntimeInstance(runtimeConfig as any);
  return <div ref={containerRef} data-sisad-pdfme-root="form" />;
};
