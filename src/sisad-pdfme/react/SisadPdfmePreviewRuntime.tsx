import { getInputFromTemplate, cloneDeep } from '@sisad-pdfme/common';
import type { Template, Plugins } from '@sisad-pdfme/common/types';
import { flatSchemaPlugins } from '@sisad-pdfme/schemas';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import type {
  ResolvedSisadPdfmeConfig,
  SisadPdfmeController,
  SisadPdfmeGlobalConfig,
} from '@sisad-pdfme/config/SisadPdfmeConfig';
import { useSisadPdfmeController } from '@sisad-pdfme/react/useSisadPdfmeController';
import { usePdfmeRuntimeInstance } from '@sisad-pdfme/runtime/usePdfmeRuntimeInstance';
import type {
  RuntimeConstructorProps,
  RuntimeInstanceLike,
  UsePdfmeRuntimeInstanceConfig,
} from '@sisad-pdfme/runtime/usePdfmeRuntimeInstance';
import { checkTemplate } from '@sisad-pdfme/common/helper';
import Form from '@sisad-pdfme/ui/Form';
import Viewer from '@sisad-pdfme/ui/Viewer';
import Designer from '@sisad-pdfme/ui/Designer';
import { useSisadPdfmeRecipientRuntime } from '@sisad-pdfme/react/useSisadPdfmeRecipientRuntime';
import { mergeHostSurfaceClassName } from '@sisad-pdfme/react/hostSurface';
import { mergeSignatureProviders } from '@sisad-pdfme/react/signatureProviderMerge';
import { generatePdf } from '@sisad-pdfme/generator';
import { createObjectUrl, revokeObjectUrls } from '@sisad-pdfme/browser/objectUrls';
import { downloadUrl } from '@sisad-pdfme/browser/downloads';

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
  plugins?: Plugins | null;
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

/**
 * Use the UI runtime constructors directly. Their public constructors already
 * match the `UsePdfmeRuntimeInstanceConfig` contract (domContainer, template,
 * plugins, options, inputs) and expose the lifecycle methods required by the
 * runtime adapter. Avoid reflection-based adapters and prefer structural
 * typing — this enforces PRT-010 and removes unsafe `any`/unknown hacks.
 */
class DesignerRuntimeAdapter extends Designer implements RuntimeInstanceLike {
  constructor(props: RuntimeConstructorProps) {
    super(props);
  }
}

class FormRuntimeAdapter extends Form implements RuntimeInstanceLike {
  constructor(props: RuntimeConstructorProps) {
    super({ ...props, inputs: props.inputs ?? [] });
  }
}

class ViewerRuntimeAdapter extends Viewer implements RuntimeInstanceLike {
  constructor(props: RuntimeConstructorProps) {
    super({ ...props, inputs: props.inputs ?? [] });
  }
}

const runtimeByMode: UsePdfmeRuntimeInstanceConfig['runtime'] = {
  Designer: DesignerRuntimeAdapter,
  Form: FormRuntimeAdapter,
  Viewer: ViewerRuntimeAdapter,
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
  // Fail-closed: invalid templates must surface explicit runtime errors.
  // Do not silently fall back to defaults (PRT-020).
  const safeTemplate = useMemo<Template>(() => {
    if (!template || typeof template !== 'object') {
      throw new Error('Invalid template: expected object');
    }
    const cloned = cloneDeep(template) as Template;
    if (!cloned.schemas || !Array.isArray(cloned.schemas) || cloned.schemas.length === 0) {
      throw new Error('Invalid template: missing schemas');
    }
    // Validate the canonical template and propagate the error to the host.
    checkTemplate(cloned);
    return cloned as Template;
  }, [template]);

  const runtimeInputs = useMemo(() => {
    if (Array.isArray(inputs)) return inputs;
    // safeTemplate is already validated (fail-closed). Extract inputs deterministically.
    return getInputFromTemplate(safeTemplate);
  }, [inputs, safeTemplate]);

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

  const exportBusyRef = useRef(false);
  const exportUrlRef = useRef('');
  const handleExport = useCallback(async (context: Parameters<NonNullable<import('@sisad-pdfme/common').PreviewProps['onExport']>>[0]) => {
    if (exportBusyRef.current) return;
    exportBusyRef.current = true;
    try {
      const bytes = await generatePdf({
        template: context.template,
        inputs: context.inputs,
        options: context.options,
        plugins: context.plugins,
      });
      if (exportUrlRef.current) revokeObjectUrls([exportUrlRef.current]);
      const url = createObjectUrl(bytes, 'application/pdf');
      if (!url) return;
      exportUrlRef.current = url;
      const baseName = String((context.template as { basePdf?: unknown }).basePdf || 'document')
        .replace(/[\\/:*?"<>|]+/g, '_')
        .trim() || 'document';
      downloadUrl(url, `${baseName.endsWith('.pdf') ? baseName : `${baseName}.pdf`}`);
    } finally {
      exportBusyRef.current = false;
    }
  }, []);

  useEffect(() => () => {
    if (exportUrlRef.current) revokeObjectUrls([exportUrlRef.current]);
  }, []);

  const runtimeConfig = useMemo<UsePdfmeRuntimeInstanceConfig>(
    () => ({
      containerRef,
      mode,
      isolationKey,
      template: safeTemplate,
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
      plugins: ({
        ...flatSchemaPlugins,
        ...(plugins || {}),
      } as unknown) as Plugins,
      onExport: mode === 'form' ? handleExport : undefined,
      // runtimeByMode contains UI classes that accept `PreviewProps`.
      // The hook expects constructors matching `RuntimeConstructorLike`.
      runtime: runtimeByMode,
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
      safeTemplate,
      handleExport,
    ],
  );

  const { instanceRef } = usePdfmeRuntimeInstance(runtimeConfig);
  const controller = useSisadPdfmeController(instanceRef);

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
