import { getInputFromTemplate } from '@sisad-pdfme/common';
import { flatSchemaPlugins } from '@sisad-pdfme/schemas';
import React, { useEffect, useMemo, useRef } from 'react';
import type {
  ResolvedSisadPdfmeConfig,
  SisadPdfmeController,
  SisadPdfmeGlobalConfig,
} from '@sisad-pdfme/config/SisadPdfmeConfig';
import { useSisadPdfmeController } from '@sisad-pdfme/react/useSisadPdfmeController';
import { usePdfmeRuntimeInstance } from '@sisad-pdfme/runtime/usePdfmeRuntimeInstance';
import type { UsePdfmeRuntimeInstanceConfig } from '@sisad-pdfme/runtime/usePdfmeRuntimeInstance';
import Form from '@sisad-pdfme/ui/Form';
import Viewer from '@sisad-pdfme/ui/Viewer';
import { useSisadPdfmeRecipientRuntime } from '@sisad-pdfme/react/useSisadPdfmeRecipientRuntime';
import { mergeHostSurfaceClassName } from '@sisad-pdfme/react/hostSurface';
import { mergeSignatureProviders } from '@sisad-pdfme/react/signatureProviderMerge';

type PreviewMode = 'form' | 'viewer';

export type SisadPdfmePreviewRuntimeProps = {
  mode: PreviewMode;
  config?: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig;
  template: unknown;
  inputs?: unknown[];
  recipients?: unknown[];
  activeRecipientId?: string | null;
  /**
   * Documento activo dentro de la ejecución.
   *
   * Junto a `activeRecipientId` define la identidad del contexto: al cambiar
   * cualquiera de los dos el runtime se remonta, de modo que el estado del
   * contexto anterior no sobrevive al cambio.
   */
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
  /**
   * API imperativa de la superficie montada.
   *
   * El Designer ya la entregaba; Form y Viewer no, así que un host que montara
   * un Form no tenía forma de leer template, snapshot ni estado de interacción.
   * La paridad es lo que permite aseverar `touched`/`dirty`/`valid`/`completed`
   * contra el modelo en lugar de deducirlos del DOM.
   */
  onControllerReady?: (controller: SisadPdfmeController) => void;
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
  activeDocumentId,
  signatureSigner,
  signatureSessionKey,
  signatureProviders,
  plugins,
  onInputChange,
  onControllerReady,
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

  /**
   * Identidad del contexto de ejecución recipient × documento.
   *
   * Si el host no entrega ninguno de los dos el valor es constante y el ciclo
   * de vida del runtime queda igual que antes.
   */
  const isolationKey = `${activeRecipientId ?? ''}::${activeDocumentId ?? ''}`;

  /**
   * El motor efectivo incorpora los providers de firma del host.
   *
   * `resolveSignatureProviderSource` los descubre por
   * `options.designerEngine.signature.providers`, así que es ahí donde deben
   * quedar para que el modo formulario ofrezca las mismas opciones de firma
   * que el Designer.
   */
  const effectiveDesignerEngine = useMemo(
    () => ({
      ...resolvedConfig.designerEngine,
      signature: {
        ...(resolvedConfig.designerEngine.signature || {}),
        providers: mergeSignatureProviders(
          resolvedConfig.designerEngine.signature?.providers,
          signatureProviders,
        ),
      },
    }),
    [resolvedConfig.designerEngine, signatureProviders],
  );

  const runtimeConfig = useMemo<UsePdfmeRuntimeInstanceConfig>(
    () => ({
      containerRef,
      mode,
      isolationKey,
      template: template as UsePdfmeRuntimeInstanceConfig['template'],
      inputs: runtimeInputs,
      onTemplateChange: () => undefined,
      onPageChange: () => undefined,
      options: {
        ...resolvedConfig.runtimeOptions,
        designerEngine: effectiveDesignerEngine,
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
      effectiveDesignerEngine,
      isolationKey,
      plugins,
      mode,
      onInputChange,
      resolvedConfig.runtimeOptions,
      runtimeInputs,
      signatureSessionKey,
      signatureSigner,
      template,
    ],
  );

  const { instanceRef } = usePdfmeRuntimeInstance(runtimeConfig);
  const controller = useSisadPdfmeController(
    instanceRef as React.MutableRefObject<Record<string, unknown> | null>,
  );

  useEffect(() => {
    onControllerReady?.(controller);
    // El remontaje por cambio de contexto sustituye la instancia bajo el mismo
    // controller, así que el host debe volver a leerla tras cada isolationKey.
  }, [controller, isolationKey, onControllerReady]);

  return (
    <div
      ref={containerRef}
      data-sisad-pdfme-root={mode}
      className={mergeHostSurfaceClassName(className)}
      style={style}
    />
  );
};
