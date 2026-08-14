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
export type RuntimeTemplateLike = {
  basePdf?: unknown;
  schemas?: unknown[];
};

type RuntimeOptionsLike = Record<string, unknown>;
type RuntimeInputsLike = unknown;
type RuntimePluginsLike = Record<string, unknown>;

/** Procedencia de un cambio de input emitido por el runtime Form. */
export type RuntimeInputOrigin = 'user' | 'host';

export type RuntimeInputChange = {
  index: number;
  name: string;
  value: unknown;
  origin?: RuntimeInputOrigin;
  transactionId?: string;
  phase?: 'draft' | 'commit';
  revision?: number;
};

/** Espejo local de los inputs que el runtime tiene ahora mismo. */
type RuntimeInputsMirror = Record<string, unknown>[] | null;

/**
 * Compara por contenido los inputs del host contra el espejo del runtime.
 *
 * Se usa en lugar de una bandera de un solo uso porque una bandera no distingue
 * el eco de una edición del usuario de una escritura legítima del host que
 * llega inmediatamente después: consumirla en el momento equivocado descarta
 * el update del host en silencio.
 *
 * Ante cualquier forma que no sepa comparar devuelve `false`, de modo que el
 * fallo empuje de más y nunca de menos.
 */
export const inputsMatchRuntimeMirror = (
  inputs: RuntimeInputsLike,
  mirror: RuntimeInputsMirror,
): boolean => {
  if (inputs === mirror) return true;
  if (!Array.isArray(inputs) || !Array.isArray(mirror)) return false;
  if (inputs.length !== mirror.length) return false;

  return inputs.every((row, index) => {
    const mirrorRow = mirror[index];
    if (row === mirrorRow) return true;
    if (!row || !mirrorRow || typeof row !== 'object' || typeof mirrorRow !== 'object') return false;

    const rowKeys = Object.keys(row as Record<string, unknown>);
    const mirrorKeys = Object.keys(mirrorRow as Record<string, unknown>);
    if (rowKeys.length !== mirrorKeys.length) return false;

    return rowKeys.every(
      (key) => (row as Record<string, unknown>)[key] === (mirrorRow as Record<string, unknown>)[key],
    );
  });
};

/** Copia superficial por fila de los inputs, o `null` si la forma es desconocida. */
const cloneMirror = (inputs: RuntimeInputsLike): RuntimeInputsMirror => {
  if (!Array.isArray(inputs)) return null;
  return inputs.map((row) =>
    row && typeof row === 'object' ? { ...(row as Record<string, unknown>) } : ({} as Record<string, unknown>),
  );
};

/**
 * Refleja en el espejo un cambio que nació dentro del runtime.
 *
 * Si la fila no existe se invalida el espejo: es preferible empujar de más en
 * el siguiente update del host que dar por aplicado algo que no lo está.
 */
const applyChangeToMirror = (
  mirrorRef: { current: RuntimeInputsMirror },
  change: RuntimeInputChange,
): void => {
  const mirror = mirrorRef.current;
  const row = mirror?.[change.index];
  if (!row) {
    mirrorRef.current = null;
    return;
  }
  row[change.name] = change.value;
};

export type RuntimeInstanceLike = {
  destroy: () => void;
  updateOptions: (options: RuntimeOptionsLike) => void;
  updateTemplate: (template: RuntimeTemplateLike) => void;
  setInputs: (inputs: RuntimeInputsLike) => void;
  fitToWidth?: () => void;
  fitToPage?: () => void;
  onChangeTemplate?: (handler: (template: RuntimeTemplateLike) => void) => void;
  onChangeInput?: (handler: (payload: RuntimeInputChange) => void) => void;
  onPageChange?: (handler: (pageInfo: unknown) => void) => void;
};

type RuntimeConstructorLike = new (props: {
  domContainer: HTMLElement;
  template: RuntimeTemplateLike;
  plugins: RuntimePluginsLike;
  options: RuntimeOptionsLike;
  inputs?: RuntimeInputsLike;
}) => RuntimeInstanceLike;

export const getTemplateSignature = (template: RuntimeTemplateLike | null | undefined): string => {
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
export const scheduleDestroyInstance = (instance: RuntimeInstanceLike | null | undefined): void => {
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
  Designer: RuntimeConstructorLike;
  Form: RuntimeConstructorLike;
  Viewer: RuntimeConstructorLike;
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
  /**
   * Identidad del contexto de ejecución (p. ej. `recipient::document`).
   *
   * Cuando cambia, la instancia se destruye y se vuelve a montar. Sin esto, un
   * cambio de destinatario o de documento reutiliza la instancia viva y arrastra
   * estado del contexto anterior, que es justo lo que el aislamiento por
   * recipient × documento debe impedir.
   *
   * Si el host no lo entrega el valor es estable y el ciclo de vida no cambia.
   */
  isolationKey?: string | null;
  template: RuntimeTemplateLike;
  inputs: RuntimeInputsLike;
  /** Monotonic host revision for controlled input reconciliation. */
  inputsRevision?: number;
  options: RuntimeOptionsLike;
  plugins: RuntimePluginsLike;
  /** Designer/Form/Viewer classes (injected to avoid a hard dependency + ease testing). */
  runtime: PdfmeRuntimeConstructors;
  /** Transforms a designer-emitted template before propagating (e.g. collaboration decoration). */
  decorateTemplate?: (template: RuntimeTemplateLike) => RuntimeTemplateLike;
  /** Called with the (decorated) template when the designer edits it. */
  onTemplateChange: (template: RuntimeTemplateLike) => void;
  /**
   * Called with `{ index, name, value }` when the *user* changes a form input.
   *
   * Los ecos de un `setInputs` originado en el host no llegan aquí: el host ya
   * conoce ese valor y volver a notificárselo lo haría indistinguible de una
   * edición real.
   */
  onInputChange?: (payload: RuntimeInputChange) => void;
  /** Called with page info on designer page change. */
  onPageChange?: (pageInfo: unknown) => void;
  /** Auto-fit the designer on mount. Default 'page'. */
  autoFit?: 'page' | 'width' | 'none';
};

/** Public handle returned to the host for advanced imperative access. */
export type PdfmeRuntimeInstanceHandle = {
  instanceRef: React.MutableRefObject<RuntimeInstanceLike | null>;
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
  const instanceRef = useRef<RuntimeInstanceLike | null>(null);
  /**
   * Last values pushed into the runtime instance.
   *
   * These refs prevent unnecessary updateOptions/updateTemplate/setInputs calls
   * and help avoid host ↔ runtime echo loops.
   */
  const lastAppliedTemplateRef = useRef<RuntimeTemplateLike | null>(null);
  const lastAppliedOptionsRef = useRef<RuntimeOptionsLike | null>(null);
  /**
   * Contenido que el runtime tiene actualmente.
   *
   * Se actualiza tanto cuando empujamos inputs como cuando el usuario edita
   * dentro del runtime. Comparar contra este espejo permite decidir si un
   * cambio de identidad del host es un eco (ya aplicado) o un update real.
   */
  const runtimeInputsMirrorRef = useRef<RuntimeInputsMirror>(null);
  const localInputsRevisionRef = useRef<number>(config.inputsRevision ?? 0);
  /** Flag used to skip the immediate echo after designer-originated changes. */
  const templateSyncFromDesignerRef = useRef(false);
  const lastAppliedTemplateSignatureRef = useRef<string>(getTemplateSignature(config.template));

  /**
   * Keep the latest config readable from the mode-keyed mount effect without
   * making it a dependency. This preserves the original lifecycle behavior:
   * remount on mode changes, but read latest callbacks/options when events fire.
   */
  // Keep the latest config readable from the mode-keyed mount effect without
  // making it a dependency (mirrors the original closure-on-[mode] behavior).
  const latest = useRef(config);
  useEffect(() => {
    latest.current = config;
  }, [config]);

  const { mode, template, options, inputs, inputsRevision, isolationKey } = config;

  /** Mounts or remounts the runtime when the mode or the execution context changes. */
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

    let instance: RuntimeInstanceLike | null = null;
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
      designer.onChangeTemplate((nextTemplate: RuntimeTemplateLike) => {
        const decorate = latest.current.decorateTemplate ?? ((t: RuntimeTemplateLike) => t);
        const decoratedTemplate = decorate(nextTemplate);
        const nextSignature = getTemplateSignature(decoratedTemplate);
        if (lastAppliedTemplateSignatureRef.current === nextSignature) return;
        lastAppliedTemplateSignatureRef.current = nextSignature;
        templateSyncFromDesignerRef.current = true;
        latest.current.onTemplateChange(decoratedTemplate);
      });
      designer.onPageChange((pageInfo: unknown) => {
        latest.current.onPageChange?.(pageInfo);
      });
      instance = designer;
    /** Form: receives inputs and emits input changes. */
    } else if (cfg.mode === 'form') {
      const form = new Form({ ...commonProps, inputs: cloneDeep(cfg.inputs) });
      lastAppliedTemplateRef.current = cfg.template;
      lastAppliedOptionsRef.current = cfg.options;
      runtimeInputsMirrorRef.current = cloneMirror(cfg.inputs);
      localInputsRevisionRef.current = cfg.inputsRevision ?? 0;
      form.onChangeInput((payload: RuntimeInputChange) => {
        // Eco de nuestro propio `setInputs`: el espejo ya lo refleja y el host
        // ya conoce el valor. Reenviarlo lo marcaría como edición del usuario.
        if (payload.origin === 'host') return;
        if (typeof payload.revision === 'number') {
          localInputsRevisionRef.current = Math.max(localInputsRevisionRef.current, payload.revision);
        } else {
          localInputsRevisionRef.current += 1;
        }
        applyChangeToMirror(runtimeInputsMirrorRef, payload);
        latest.current.onInputChange?.(payload);
      });
      instance = form;
    /** Viewer: receives template + inputs but does not emit editing events. */
    } else if (cfg.mode === 'viewer') {
      const viewer = new Viewer({ ...commonProps, inputs: cloneDeep(cfg.inputs) });
      lastAppliedTemplateRef.current = cfg.template;
      lastAppliedOptionsRef.current = cfg.options;
      runtimeInputsMirrorRef.current = cloneMirror(cfg.inputs);
      instance = viewer;
    }

    instanceRef.current = instance;

    return () => {
      if (instanceRef.current === instance) instanceRef.current = null;
      scheduleDestroyInstance(instance);
      if (host.parentNode === container) host.remove();
    };
     
  }, [mode, isolationKey]);

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
        // Excepción a no-console: la traza ya está tras `import.meta.env.DEV`,
        // así que no llega al bundle de producción.
        
        console.debug('[usePdfmeRuntimeInstance] template sync', {
          mode,
          previousSignature: lastAppliedTemplateSignatureRef.current,
          nextSignature,
        });
      } catch {
        // swallow logging errors
      }
    }
    lastAppliedTemplateRef.current = template;
    lastAppliedTemplateSignatureRef.current = nextSignature;
    instance.updateTemplate(cloneDeep(template));
  }, [mode, template]);

  /**
   * Syncs inputs into Form/Viewer.
   *
   * Se compara contra el espejo del runtime en lugar de contra la identidad del
   * último valor empujado: así el eco de una edición del usuario no provoca un
   * `setInputs` redundante (que reventaría caret/IME) y, a la vez, ningún update
   * real del host se pierde por haber llegado detrás de una pulsación.
   */
  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance || mode === 'designer') return;
    if (
      typeof inputsRevision === 'number' &&
      inputsRevision < localInputsRevisionRef.current
    ) {
      return;
    }
    if (typeof inputsRevision === 'number') {
      localInputsRevisionRef.current = inputsRevision;
    }
    if (inputsMatchRuntimeMirror(inputs, runtimeInputsMirrorRef.current)) return;
    runtimeInputsMirrorRef.current = cloneMirror(inputs);
    instance.setInputs(cloneDeep(inputs));
  }, [inputs, inputsRevision, mode]);

  return { instanceRef };
}
