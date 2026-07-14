/**
 * SisadPdfmeViewer — wrapper público del Viewer runtime.
 *
 * Igual que el Form: el filtrado por recipient (`options.collaboration`) se
 * deriva del RecipientRegistry compartido, no de props sueltos.
 */
import React, { useContext, useMemo, useRef } from 'react';
import Viewer from '../ui/Viewer.js';
import Form from '../ui/Form.js';
import { usePdfmeRuntimeInstance } from '../runtime/usePdfmeRuntimeInstance.js';
import { useSisadPdfmeConfig } from './useSisadPdfmeConfig.js';
import { SisadPdfmeContext } from './SisadPdfmeProvider.js';
import { useRecipientRegistry } from '../recipients/useRecipientRegistry.js';
import type { ResolvedSisadPdfmeConfig, SisadPdfmeGlobalConfig } from '../config/SisadPdfmeConfig.js';

type Props = {
  config?: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig;
  template: unknown;
  recipients?: unknown[];
  activeRecipientId?: string | null;
};

export const SisadPdfmeViewer = ({ config, template, recipients, activeRecipientId }: Props) => {
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

  const runtimeConfig = useMemo(() => ({
    containerRef,
    mode: 'viewer' as const,
    template: template as any,
    inputs: [],
    onTemplateChange: () => undefined,
    onPageChange: () => undefined,
    options: {
      ...resolvedConfig.runtimeOptions,
      designerEngine: resolvedConfig.designerEngine,
      ...(recipientFilterEnabled && effectiveActiveRecipientId
        ? { collaboration: { activeRecipientId: effectiveActiveRecipientId, isGlobalView: false } }
        : {}),
    },
    plugins: {},
    runtime: { Designer: Viewer as any, Form: Form as any, Viewer: Viewer as any },
  }), [resolvedConfig, template, effectiveActiveRecipientId, recipientFilterEnabled]);
  usePdfmeRuntimeInstance(runtimeConfig as any);
  return <div ref={containerRef} data-sisad-pdfme-root="viewer" />;
};
