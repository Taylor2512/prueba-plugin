/**
 * Hook that owns the lifecycle of a PDFME runtime instance.
 *
 * Responsibility:
 * - Mount Designer/Form/Viewer into a DOM container.
 * - Remount safely when runtime mode changes.
 * - Sync options/template/inputs without echo loops.
 * - Destroy the underlying instance safely on cleanup.
 *
 * Architectural rule:
 * This hook is a runtime adapter. It should not contain business rules,
 * signature-provider rules, SISAD workflow decisions, or visual hacks.
 */
import { useEffect, useRef } from 'react';
import { cloneDeep } from '@sisad-pdfme/common';

/**
 * Stable JSON signature of the template's meaningful fields.
 *
 * Used to dedupe template updates and avoid echo loops between the Designer
 * and the React host state.
 */
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

/**
 * Destroys a PDFME runtime instance on the next tick.
 *
 * The delayed destroy avoids detached-node races produced by rapid remounts.
 * NotFoundError is swallowed because it can happen when the DOM node was
 * already removed by React or by container.replaceChildren.
 */
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

/** Runtime surfaces owned by this adapter. */
export type PdfmeRuntimeMode = 'designer' | 'form' | 'viewer';

/**
 * Runtime constructors are injected to avoid hard dependency coupling.
 *
 * This also makes the hook testable with lightweight fake classes.
 */
export type PdfmeRuntimeConstructors = {
  Designer: any;
  Form: any;
  Viewer: any;
};

/**
 * Configuration required to mount and synchronize a PDFME runtime instance.
 *
 * The host owns business decisions. This hook only owns runtime lifecycle and
 * data synchronization.
 */
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

/** Public handle returned to the host for advanced imperative access. */
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
  /** Holds the currently mounted Designer/Form/Viewer instance. */
  const instanceRef = useRef<any>(null);
  /**
   * Last values pushed into the runtime instance.
   *
   * These refs prevent unnecessary updateOptions/updateTemplate/setInputs calls
   * and help avoid host ↔ runtime echo loops.
   */
  const lastAppliedTemplateRef = useRef<any>(null);
  const lastAppliedOptionsRef = useRef<any>(null);
  const lastAppliedInputsRef = useRef<any>(null);
  /** Flags used to skip the immediate echo after runtime-originated changes. */
  const templateSyncFromDesignerRef = useRef(false);
  const inputsSyncFromRuntimeRef = useRef(false);
  const lastAppliedTemplateSignatureRef = useRef<string>(getTemplateSignature(config.template));

  /**
   * Keep the latest config readable from the mode-keyed mount effect without
   * making it a dependency. This preserves the original lifecycle behavior:
   * remount on mode changes, but read latest callbacks/options when events fire.
   */
  // Keep the latest config readable from the mode-keyed mount effect without
  // making it a dependency (mirrors the original closure-on-[mode] behavior).
  const latest = useRef(config);
  latest.current = config;

  const { mode, template, options, inputs } = config;

  /** Mounts or remounts the runtime only when mode changes. */
  useEffect(() => {
    const cfg = latest.current;
    const container = cfg.containerRef.current;
    if (!container) return undefined;

    /**
     * Dedicated runtime host. Replacing children ensures the PDFME runtime owns
     * only this inner node, not the whole React container.
     */
    const host = document.createElement('div');
    host.className = 'sisad-pdfme-lab-runtime-host';
    host.dataset.runtimeMode = cfg.mode;
    if (cfg.uxMode) host.dataset.uxMode = cfg.uxMode;
    container.replaceChildren(host);

    /** Common constructor props shared by Designer, Form and Viewer. */
    const commonProps = {
      domContainer: host,
      template: cloneDeep(cfg.template),
      plugins: cfg.plugins,
      options: cfg.options,
    };

    let instance: any = null;
    const { Designer, Form, Viewer } = cfg.runtime;

    /** Designer: emits template/page changes and supports auto-fit. */
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
    /** Form: receives inputs and emits input changes. */
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
    /** Viewer: receives template + inputs but does not emit editing events. */
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

  /** Destroys the active runtime instance when the hook unmounts. */
  useEffect(() => {
    return () => {
      const currentInstance = instanceRef.current;
      instanceRef.current = null;
      scheduleDestroyInstance(currentInstance);
    };
  }, []);

  /** Pushes options changes into the current runtime instance. */
  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    if (lastAppliedOptionsRef.current === options) return;
    lastAppliedOptionsRef.current = options;
    instance.updateOptions(options);
  }, [options]);

  /** Syncs template changes, skipping the echo from Designer-originated updates. */
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

  /** Syncs inputs into Form/Viewer, skipping the echo from runtime input changes. */
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
