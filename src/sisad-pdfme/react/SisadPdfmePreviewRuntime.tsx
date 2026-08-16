import { getInputFromTemplate, cloneDeep } from '@sisad-pdfme/common';
import type { Template } from '@sisad-pdfme/common/types';
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
import { migrateTemplate, checkTemplate } from '@sisad-pdfme/common/helper';
import { createDefaultTemplate } from '@sisad-pdfme/templates/createDefaultTemplate';
import Form from '@sisad-pdfme/ui/Form';
import Viewer from '@sisad-pdfme/ui/Viewer';
import Designer from '@sisad-pdfme/ui/Designer';
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

/**
 * Thin constructor adapters: adapt existing UI classes that accept `PreviewProps`
 * to the `RuntimeConstructorLike` expected by `usePdfmeRuntimeInstance`.
 *
 * Reuse existing classes (`Designer`, `Form`, `Viewer`) rather than
 * duplicating logic. The adapters translate the common props object into
 * `PreviewProps` and return an instance compatible with `RuntimeInstanceLike`.
 */
const adapterFor = (UIClass: new (props: unknown) => unknown) =>
  class Adapter {
    private inner: unknown;
    constructor(props: unknown) {
      // The UI classes expect `PreviewProps`/`DesignerProps` with domContainer
      // renamed to `domContainer` in schema; the hook provides `domContainer`.
      this.inner = new UIClass({ ...(props as Record<string, unknown>) });
    }
    destroy() {
      const inner = this.inner as Record<string, unknown> | null;
      const fn = inner?.destroy;
      if (typeof fn === 'function') return (fn as (...args: unknown[]) => unknown).call(inner);
      return undefined;
    }
    updateOptions(options: unknown) {
      const inner = this.inner as Record<string, unknown> | null;
      if (!inner) return undefined;
      const getOptions = inner.getOptions;
      const setOptions = inner.setOptions;
      const update = inner.updateOptions;
      if (typeof getOptions === 'function') {
        if (typeof setOptions === 'function') return (setOptions as (...args: unknown[]) => unknown).call(inner, options);
      }
      if (typeof update === 'function') return (update as (...args: unknown[]) => unknown).call(inner, options);
      return undefined;
    }
    updateTemplate(template: unknown) {
      const inner = this.inner as Record<string, unknown> | null;
      const fn = inner?.updateTemplate;
      if (typeof fn === 'function') return (fn as (...args: unknown[]) => unknown).call(inner, template);
      return undefined;
    }
    setInputs(inputs: unknown) {
      const inner = this.inner as Record<string, unknown> | null;
      const fn = inner?.setInputs;
      if (typeof fn === 'function') return (fn as (...args: unknown[]) => unknown).call(inner, inputs);
      return undefined;
    }
    fitToWidth() {
      const inner = this.inner as Record<string, unknown> | null;
      const fn = inner?.fitToWidth;
      return typeof fn === 'function' ? (fn as () => unknown).call(inner) : undefined;
    }
    fitToPage() {
      const inner = this.inner as Record<string, unknown> | null;
      const fn = inner?.fitToPage;
      return typeof fn === 'function' ? (fn as () => unknown).call(inner) : undefined;
    }
    onChangeTemplate(cb: (t: unknown) => void) {
      const inner = this.inner as Record<string, unknown> | null;
      const fn = inner?.onChangeTemplate;
      if (typeof fn === 'function') return (fn as (h: (t: unknown) => unknown) => unknown).call(inner, cb);
      return undefined;
    }
    onChangeInput(cb: (p: unknown) => void) {
      const inner = this.inner as Record<string, unknown> | null;
      const fn = inner?.onChangeInput;
      if (typeof fn === 'function') return (fn as (h: (p: unknown) => unknown) => unknown).call(inner, cb);
      return undefined;
    }
    onPageChange(cb: (p: unknown) => void) {
      const inner = this.inner as Record<string, unknown> | null;
      const fn = inner?.onPageChange;
      if (typeof fn === 'function') return (fn as (h: (p: unknown) => unknown) => unknown).call(inner, cb);
      return undefined;
    }
  } as unknown as UsePdfmeRuntimeInstanceConfig['runtime']['Designer'];

const runtimeByMode = {
  form: { Designer: adapterFor(Designer), Form: adapterFor(Form), Viewer: adapterFor(Viewer) },
  viewer: { Designer: adapterFor(Designer), Form: adapterFor(Form), Viewer: adapterFor(Viewer) },
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
  const safeTemplate = useMemo<Template>(() => {
    try {
      if (!template || typeof template !== 'object') return createDefaultTemplate();
      const cloned = cloneDeep(template) as Template;
      try {
        migrateTemplate(cloned as Template);
      } catch {
        // swallow migration errors — we'll fall back to defaults below
      }
      if (!cloned.schemas || !Array.isArray(cloned.schemas) || cloned.schemas.length === 0) {
        const def = createDefaultTemplate();
        cloned.schemas = def.schemas as Template['schemas'];
        cloned.basePdf = cloned.basePdf ?? def.basePdf;
      }
      return cloned as Template;
    } catch {
      return createDefaultTemplate();
    }
  }, [template]);

  const runtimeInputs = useMemo(() => {
    if (Array.isArray(inputs)) return inputs;
    // Ensure safeTemplate conforms to Template before passing to helper
    try {
      // checkTemplate will migrate and throw on invalid shape; fall back to defaults on error
      checkTemplate(safeTemplate);
      return getInputFromTemplate(safeTemplate);
    } catch {
      return getInputFromTemplate(createDefaultTemplate());
    }
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
      plugins: {
        ...flatSchemaPlugins,
        ...(plugins || {}),
      },
      // runtimeByMode contains UI classes that accept `PreviewProps`.
      // The hook expects constructors matching `RuntimeConstructorLike`.
      runtime: runtimeByMode[mode] as UsePdfmeRuntimeInstanceConfig['runtime'],
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
