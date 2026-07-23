import { getInputFromTemplate } from '@sisad-pdfme/common';
import { flatSchemaPlugins } from '@sisad-pdfme/schemas';
import React, { useMemo, useRef } from 'react';
import type {
  ResolvedSisadPdfmeConfig,
  SisadPdfmeGlobalConfig,
} from '../config/SisadPdfmeConfig.js';
import { usePdfmeRuntimeInstance } from '../runtime/usePdfmeRuntimeInstance.js';
import type { UsePdfmeRuntimeInstanceConfig } from '../runtime/usePdfmeRuntimeInstance.js';
import Form from '../ui/Form.js';
import Viewer from '../ui/Viewer.js';
import { useSisadPdfmeRecipientRuntime } from './useSisadPdfmeRecipientRuntime.js';

type PreviewMode = 'form' | 'viewer';

export type SisadPdfmePreviewRuntimeProps = {
  mode: PreviewMode;
  config?: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig;
  template: unknown;
  inputs?: unknown[];
  recipients?: unknown[];
  activeRecipientId?: string | null;
  onInputChange?: (payload: {
    index: number;
    name: string;
    value: unknown;
  }) => void;
};

const runtimeByMode = {
  form: { Designer: Form, Form, Viewer },
  viewer: { Designer: Viewer, Form, Viewer },
};

export const SisadPdfmePreviewRuntime = ({
  mode,
  config,
  template,
  inputs,
  recipients,
  activeRecipientId,
  onInputChange,
}: SisadPdfmePreviewRuntimeProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { resolvedConfig, collaborationOptions } =
    useSisadPdfmeRecipientRuntime({
      config,
      recipients,
      activeRecipientId,
    });
  const runtimeInputs = useMemo(
    () =>
      Array.isArray(inputs) && inputs.length > 0
        ? inputs
        : getInputFromTemplate(
            template as UsePdfmeRuntimeInstanceConfig['template'],
          ),
    [inputs, template],
  );

  const runtimeConfig = useMemo<UsePdfmeRuntimeInstanceConfig>(
    () => ({
      containerRef,
      mode,
      template: template as UsePdfmeRuntimeInstanceConfig['template'],
      inputs: runtimeInputs,
      onTemplateChange: () => undefined,
      onPageChange: () => undefined,
      options: {
        ...resolvedConfig.runtimeOptions,
        designerEngine: resolvedConfig.designerEngine,
        collaboration: collaborationOptions,
      },
      plugins: flatSchemaPlugins,
      runtime: runtimeByMode[mode],
      ...(mode === 'form' ? { onInputChange } : {}),
    }),
    [
      collaborationOptions,
      mode,
      onInputChange,
      resolvedConfig.designerEngine,
      resolvedConfig.runtimeOptions,
      runtimeInputs,
      template,
    ],
  );

  usePdfmeRuntimeInstance(runtimeConfig);

  return <div ref={containerRef} data-sisad-pdfme-root={mode} />;
};
