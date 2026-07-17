/**
 * SisadPdfmeViewer — wrapper público del Viewer runtime.
 *
 * Igual que el Form: el filtrado por recipient (`options.collaboration`) se
 * deriva del RecipientRegistry compartido, no de props sueltos.
 */
import React, { useContext, useRef } from 'react';
import { getInputFromTemplate } from '@sisad-pdfme/common';
import { flatSchemaPlugins } from '@sisad-pdfme/schemas';
import Viewer from '../ui/Viewer.js';
import Form from '../ui/Form.js';
import { usePdfmeRuntimeInstance } from '../runtime/usePdfmeRuntimeInstance.js';
import type { UsePdfmeRuntimeInstanceConfig } from '../runtime/usePdfmeRuntimeInstance.js';
import { useSisadPdfmeConfig } from './useSisadPdfmeConfig.js';
import { SisadPdfmeContext } from './SisadPdfmeProvider.js';
import { useRecipientRegistry } from '../recipients/useRecipientRegistry.js';
import type { ResolvedSisadPdfmeConfig, SisadPdfmeGlobalConfig } from '../config/SisadPdfmeConfig.js';

type Props = {
  config?: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig;
  template: unknown;
  inputs?: unknown[];
  recipients?: unknown[];
  activeRecipientId?: string | null;
};

export const SisadPdfmeViewer = ({ config, template, inputs = [], recipients, activeRecipientId }: Props) => {
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

  const runtimeConfig: UsePdfmeRuntimeInstanceConfig = {
    containerRef,
    mode: 'viewer',
    template: template as UsePdfmeRuntimeInstanceConfig['template'],
    inputs:
      Array.isArray(inputs) && inputs.length > 0
        ? inputs
        : getInputFromTemplate(template as UsePdfmeRuntimeInstanceConfig['template']),
    onTemplateChange: () => undefined,
    onPageChange: () => undefined,
    options: {
      ...resolvedConfig.runtimeOptions,
      designerEngine: resolvedConfig.designerEngine,
      ...(recipientFilterEnabled && !isGlobalView && effectiveActiveRecipientId
        ? { collaboration: { activeRecipientId: effectiveActiveRecipientId, isGlobalView } }
        : { collaboration: { isGlobalView } }),
    },
    plugins: flatSchemaPlugins,
    runtime: { Designer: Viewer, Form, Viewer },
  };

  usePdfmeRuntimeInstance(runtimeConfig);
  return <div ref={containerRef} data-sisad-pdfme-root="viewer" />;
};
