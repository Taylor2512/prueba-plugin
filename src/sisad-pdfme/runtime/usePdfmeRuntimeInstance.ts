import { useEffect, useRef } from 'react';
import { cloneDeep } from '@sisad-pdfme/common';

/** Stable JSON signature of the template's meaningful fields (for dedupe). */
export const getTemplateSignature = (template: any): string => {
  try {
    // Exclude `inputs` from the signature — inputs are synced separately
    // and must not trigger template dedupe/echo logic.
    return JSON.stringify({
      basePdf: template?.basePdf || null,
      schemas: template?.schemas || [],
    });
  } catch {
    return 'template-signature-unavailable';
  }
};

/** Destroys an instance on the next tick, swallowing detached-node races. */
export const scheduleDestroyInstance = (instance: any): void => {
  if (!instance) return;
  globalThis.setTimeout(() => {
    try {
      instance.destroy();
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'NotFoundError')) {
        throw error;
      }
    }
  }, 0);
};

export type PdfmeRuntimeMode = 'designer' | 'form' | 'viewer';

export type PdfmeRuntimeConstructors = {
  Designer: any;
  Form: any;
  Viewer: any;
};

export type UsePdfmeRuntimeInstanceConfig = {
  containerRef: React.MutableRefObject<HTMLElement | null>;
  mode: PdfmeRuntimeMode;
  uxMode?: string;
  template: any;
  inputs: any;
  options: any;
  plugins: Record<string, any>;
  /** Designer/Form/Viewer classes (injected to avoid a hard dependency + ease testing). */
  runtime: PdfmeRuntimeConstructors;
  /** Transforms a designer-emitted template before propagating (e.g. collaboration decoration). */
  decorateTemplate?: (template: any) => any;
  /** Called with the (decorated) template when the designer edits it. */
  onTemplateChange: (template: any) => void;
  /** Called with `{ index, name, value }` when a form input changes. */
  onInputChange?: (payload: { index: number; name: string; value: unknown }) => void;
  /** Called with page info on designer page change. */
  onPageChange?: (pageInfo: any) => void;
  /** Auto-fit the designer on mount. Default 'page'. */
  autoFit?: 'page' | 'width' | 'none';
};

export type PdfmeRuntimeInstanceHandle = {
  instanceRef: React.MutableRefObject<any>;
};

/**
 * Owns the Designer/Form/Viewer lifecycle: mounts the instance into a host
 * element (re-mounting on `mode` change), keeps options/template/inputs in
 * sync, and tears the instance down safely. This is a faithful extraction of
 * the lab page's runtime effects, made reusable across hosts.
 */
export function usePdfmeRuntimeInstance(
  config: UsePdfmeRuntimeInstanceConfig,
): PdfmeRuntimeInstanceHandle {
  const instanceRef = useRef<any>(null);
  const lastAppliedTemplateRef = useRef<any>(null);
  const lastAppliedOptionsRef = useRef<any>(null);
  const lastAppliedInputsRef = useRef<any>(null);
  const templateSyncFromDesignerRef = useRef(false);
  const inputsSyncFromRuntimeRef = useRef(false);
  const lastAppliedTemplateSignatureRef = useRef<string>(getTemplateSignature(config.template));

  // Keep the latest config readable from the mode-keyed mount effect without
  // making it a dependency (mirrors the original closure-on-[mode] behavior).
  const latest = useRef(config);
  latest.current = config;

  const { mode, template, options, inputs } = config;

  // Mount / re-mount on mode change.
  useEffect(() => {
    const cfg = latest.current;
    const container = cfg.containerRef.current;
    if (!container) return undefined;

    const host = document.createElement('div');
    host.className = 'sisad-pdfme-lab-runtime-host';
    host.dataset.runtimeMode = cfg.mode;
    if (cfg.uxMode) host.dataset.uxMode = cfg.uxMode;
    container.replaceChildren(host);

    const commonProps = {
      domContainer: host,
      template: cloneDeep(cfg.template),
      plugins: cfg.plugins,
      options: cfg.options,
    };

    let instance: any = null;
    const { Designer, Form, Viewer } = cfg.runtime;

    if (cfg.mode === 'designer') {
      const designer = new Designer(commonProps);
      lastAppliedTemplateRef.current = cfg.template;
      lastAppliedOptionsRef.current = cfg.options;
      if ((cfg.autoFit ?? 'page') !== 'none') {
        globalThis.requestAnimationFrame(() => {
          const fit = cfg.autoFit === 'width' ? designer.fitToWidth : designer.fitToPage;
          if (typeof fit === 'function') fit.call(designer);
        });
      }
      designer.onChangeTemplate((nextTemplate: any) => {
        const decorate = latest.current.decorateTemplate ?? ((t: any) => t);
        const decoratedTemplate = decorate(nextTemplate);
        const nextSignature = getTemplateSignature(decoratedTemplate);
        if (lastAppliedTemplateSignatureRef.current === nextSignature) return;
        lastAppliedTemplateSignatureRef.current = nextSignature;
        templateSyncFromDesignerRef.current = true;
        latest.current.onTemplateChange(decoratedTemplate);
      });
      designer.onPageChange((pageInfo: any) => {
        latest.current.onPageChange?.(pageInfo);
      });
      instance = designer;
    } else if (cfg.mode === 'form') {
      const form = new Form({ ...commonProps, inputs: cloneDeep(cfg.inputs) });
      lastAppliedTemplateRef.current = cfg.template;
      lastAppliedOptionsRef.current = cfg.options;
      lastAppliedInputsRef.current = cfg.inputs;
      form.onChangeInput((payload: { index: number; name: string; value: unknown }) => {
        inputsSyncFromRuntimeRef.current = true;
        latest.current.onInputChange?.(payload);
      });
      instance = form;
    } else if (cfg.mode === 'viewer') {
      const viewer = new Viewer({ ...commonProps, inputs: cloneDeep(cfg.inputs) });
      lastAppliedTemplateRef.current = cfg.template;
      lastAppliedOptionsRef.current = cfg.options;
      lastAppliedInputsRef.current = cfg.inputs;
      instance = viewer;
    }

    instanceRef.current = instance;

    return () => {
      if (instanceRef.current === instance) instanceRef.current = null;
      scheduleDestroyInstance(instance);
      if (host.parentNode === container) host.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Destroy on unmount.
  useEffect(() => {
    return () => {
      const currentInstance = instanceRef.current;
      instanceRef.current = null;
      scheduleDestroyInstance(currentInstance);
    };
  }, []);

  // Options sync.
  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    if (lastAppliedOptionsRef.current === options) return;
    lastAppliedOptionsRef.current = options;
    instance.updateOptions(options);
  }, [options]);

  // Template sync (skips the echo of a designer-originated change).
  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    if (templateSyncFromDesignerRef.current) {
      templateSyncFromDesignerRef.current = false;
      lastAppliedTemplateRef.current = template;
      lastAppliedTemplateSignatureRef.current = getTemplateSignature(template);
      return;
    }
    if (lastAppliedTemplateRef.current === template) return;
    const nextSignature = getTemplateSignature(template);
    if (import.meta.env?.DEV) {
      try {
        // Lightweight diagnostic to help detect unexpected signature churns
        // during development without interfering in production.
        // eslint-disable-next-line no-console
        console.debug('[usePdfmeRuntimeInstance] template sync', {
          mode,
          previousSignature: lastAppliedTemplateSignatureRef.current,
          nextSignature,
        });
      } catch (err) {
        // swallow logging errors
      }
    }
    lastAppliedTemplateRef.current = template;
    lastAppliedTemplateSignatureRef.current = nextSignature;
    instance.updateTemplate(cloneDeep(template));
  }, [mode, template]);

  // Input sync for form/viewer (skips the echo of a runtime-originated change).
  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance || mode === 'designer') return;
    if (inputsSyncFromRuntimeRef.current) {
      inputsSyncFromRuntimeRef.current = false;
      lastAppliedInputsRef.current = inputs;
      return;
    }
    if (lastAppliedInputsRef.current === inputs) return;
    lastAppliedInputsRef.current = inputs;
    instance.setInputs(cloneDeep(inputs));
  }, [inputs, mode]);

  return { instanceRef };
}
