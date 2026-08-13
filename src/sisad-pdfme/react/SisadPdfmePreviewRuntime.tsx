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
import { mergeHostSurfaceClassName } from './hostSurface.js';

type PreviewMode = 'form' | 'viewer';

export type SisadPdfmePreviewRuntimeProps = {
  mode: PreviewMode;
  config?: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig;
  template: unknown;
  inputs?: unknown[];
  recipients?: unknown[];
  activeRecipientId?: string | null;
  activeDocumentId?: string | null;
  /**
   * Identidad del firmante autenticado para el flujo de adopción de firma.
   *
   * Viaja como prop y no dentro de `config`: la configuración describe cómo se
   * comporta la superficie, mientras que quién firma es estado de la sesión.
   */
  signatureSigner?: { fullName?: string; initials?: string } | null;
  /** Aísla el perfil de firma adoptado por solicitud + destinatario. */
  signatureSessionKey?: string | null;
  signatureProviders?: unknown[];
  plugins?: Record<string, unknown> | null;
  onInputChange?: (payload: {
    index: number;
    name: string;
    value: unknown;
  }) => void;
  /** Clases adicionales del host. Se suman al contrato base de dimensiones. */
  className?: string;
  /** Estilos inline del host. El host es dueño del viewport. */
  style?: React.CSSProperties;
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
  signatureSigner,
  signatureSessionKey,
  plugins,
  onInputChange,
  className,
  style,
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
      Array.isArray(inputs)
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
        // Sólo el modo formulario adopta firmas; el viewer no captura nada.
        ...(mode === 'form'
          ? {
              signatureModalFlow: true,
              signatureSigner: signatureSigner || {},
              signatureSessionKey: signatureSessionKey || '',
            }
          : {}),
      },
      plugins: {
        ...flatSchemaPlugins,
        ...(plugins || {}),
      },
      runtime: runtimeByMode[mode],
      ...(mode === 'form' ? { onInputChange } : {}),
    }),
    [
      collaborationOptions,
      plugins,
      mode,
      onInputChange,
      resolvedConfig.designerEngine,
      resolvedConfig.runtimeOptions,
      runtimeInputs,
      signatureSessionKey,
      signatureSigner,
      template,
    ],
  );

  usePdfmeRuntimeInstance(runtimeConfig);

  return (
    <div
      ref={containerRef}
      data-sisad-pdfme-root={mode}
      className={mergeHostSurfaceClassName(className)}
      style={style}
    />
  );
};
