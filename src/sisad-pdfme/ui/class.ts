import { createRoot, Root } from 'react-dom/client';
import { DESTROYED_ERR_MSG, DEFAULT_LANG } from './constants.js';
import { debounce } from './helper.js';
import {
  cloneDeep,
  Template,
  Size,
  Lang,
  Font,
  UIProps,
  UIOptions,
  PluginRegistry,
  PreviewProps,
  getDefaultFont,
  checkUIProps,
  checkTemplate,
  checkInputs,
  checkUIOptions,
  checkPreviewProps,
  pluginRegistry,
} from '@sisad-pdfme/common';

const PDFME_ROOT_KEY = '__pdfmeReactRoot__';
type ContainerWithPdfmeRoot = HTMLElement & { [PDFME_ROOT_KEY]?: Root };

export abstract class BaseUIClass {
  protected domContainer!: HTMLElement | null;
  protected reactRoot: Root | null = null;

  protected template!: Template;

  protected size!: Size;

  private lang: Lang = DEFAULT_LANG;

  private font: Font = getDefaultFont();

  // Keep default registry empty so host apps can provide only the plugins they need.
  private pluginsRegistry: PluginRegistry = pluginRegistry({});

  private options: UIOptions = {};

  private lastMeasuredSize: Size | null = null;

  private resizeRaf: number | null = null;

  private getVisibleContainerSize() {
    if (!this.domContainer) {
      return {
        height: window.innerHeight,
        width: window.innerWidth,
      };
    }

    const rect = this.domContainer.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const visibleWidth = Math.max(0, Math.min(rect.right, vw) - Math.max(rect.left, 0));
    const visibleHeight = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
    const rectWidth = Number.isFinite(rect.width) ? rect.width : 0;
    const rectHeight = Number.isFinite(rect.height) ? rect.height : 0;

    return {
      // Prefer the real box size to avoid collapsing when the host is inside
      // clipped/scrollable shells where the visible intersection can be tiny.
      height: rectHeight || this.domContainer.clientHeight || visibleHeight || window.innerHeight,
      width: rectWidth || this.domContainer.clientWidth || visibleWidth || window.innerWidth,
    };
  }

  private readonly setSize = debounce(() => {
    if (!this.domContainer) {
      return;
    }
    if (!this.domContainer.isConnected) {
      return;
    }

    if (this.resizeRaf != null) {
      return;
    }

    this.resizeRaf = globalThis.requestAnimationFrame(() => {
      this.resizeRaf = null;
      if (!this.domContainer || !this.domContainer.isConnected) {
        return;
      }

      const nextSize = this.getVisibleContainerSize();
      const previousSize = this.lastMeasuredSize;
      const hasMeaningfulChange =
        !previousSize ||
        Math.abs(previousSize.width - nextSize.width) > 1 ||
        Math.abs(previousSize.height - nextSize.height) > 1;

      if (!hasMeaningfulChange) {
        return;
      }

      this.lastMeasuredSize = nextSize;
      this.size = nextSize;
      this.render();
    });
  }, 100);

  resizeObserver = new ResizeObserver(this.setSize);

  constructor(props: UIProps) {
    checkUIProps(props);

    const { domContainer, template, options = {}, plugins = {} } = props;
    this.domContainer = domContainer;
    this.template = cloneDeep(template);
    this.options = options;
    this.size = this.getVisibleContainerSize();
    this.lastMeasuredSize = this.size;
    this.resizeObserver.observe(this.domContainer);
    const scheduleInitialRender = () => {
      if (!this.domContainer || !this.domContainer.isConnected) {
        return;
      }
      this.render();
    };
    if (typeof globalThis.queueMicrotask === 'function') {
      globalThis.queueMicrotask(scheduleInitialRender);
    } else {
      globalThis.setTimeout(scheduleInitialRender, 0);
    }

    const { lang, font } = options;
    if (lang) {
      this.lang = lang;
    }
    if (font) {
      this.font = font;
    }

    if (Object.values(plugins).length > 0) {
      this.pluginsRegistry = pluginRegistry(plugins);
    }
  }

  protected getLang() {
    return this.lang;
  }

  protected getFont() {
    return this.font;
  }

  protected getPluginsRegistry() {
    return this.pluginsRegistry;
  }

  public getOptions() {
    return this.options;
  }

  public getTemplate() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);

    return this.template;
  }

  public updateTemplate(template: Template) {
    checkTemplate(template);
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    if (!this.domContainer.isConnected) return;

    this.template = cloneDeep(template);
    this.render();
  }

  public updateOptions(options: UIOptions) {
    checkUIOptions(options);
    const { lang, font } = options || {};

    if (lang) {
      this.lang = lang;
    }
    if (font) {
      this.font = font;
    }
    // Spread into a new object so OptionsContext.Provider receives a new reference
    // and React re-renders all context consumers (LeftSidebar, PluginIcon, etc.)
    this.options = { ...this.options, ...options };
    if (!this.domContainer || !this.domContainer.isConnected) return;
    this.render();
  }

  public destroy() {
    if (!this.domContainer) return;

    const container = this.domContainer as ContainerWithPdfmeRoot;
    const rootToUnmount = this.reactRoot;

    // Mark as destroyed early to prevent re-entrancy/update races.
    this.domContainer = null;
    this.reactRoot = null;

    if (this.resizeRaf != null) {
      globalThis.cancelAnimationFrame(this.resizeRaf);
      this.resizeRaf = null;
    }

    this.lastMeasuredSize = null;

    try {
      this.resizeObserver.disconnect();
    } catch {
      // noop
    }

    if (container[PDFME_ROOT_KEY] === rootToUnmount) {
      delete container[PDFME_ROOT_KEY];
    }

    const unmountRoot = () => {
      if (!rootToUnmount) return;
      try {
        rootToUnmount.unmount();
      } catch (err) {
        // React may throw DOM NotFoundError if the host DOM was replaced/removed externally.
        if (!(err instanceof DOMException && err.name === 'NotFoundError')) {
          throw err;
        }
      }
    };

    if (typeof globalThis.queueMicrotask === 'function') {
      globalThis.queueMicrotask(unmountRoot);
      return;
    }

    globalThis.setTimeout(unmountRoot, 0);
  }

  protected getOrCreateRoot() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    if (!this.reactRoot) {
      const container = this.domContainer as ContainerWithPdfmeRoot;
      const existingRoot = container[PDFME_ROOT_KEY];
      this.reactRoot = existingRoot || createRoot(container);
      container[PDFME_ROOT_KEY] = this.reactRoot;
    }
    return this.reactRoot;
  }

  protected abstract render(): void;
}
export abstract class PreviewUI extends BaseUIClass {
  protected inputs!: { [key: string]: string }[];

  constructor(props: PreviewProps) {
    super(props);
    checkPreviewProps(props);
    this.inputs = convertToStingObjectArray(cloneDeep(props.inputs));
  }

  public getInputs() {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);

    return this.inputs;
  }

  public setInputs(inputs: { [key: string]: string }[]) {
    if (!this.domContainer) throw Error(DESTROYED_ERR_MSG);
    checkInputs(inputs);

    this.inputs = convertToStingObjectArray(inputs);
    this.render();
  }

  protected abstract render(): void;
}

type DataItem = {
  [key: string]: string | string[][];
};

type StringifiedDataItem = {
  [key: string]: string;
};

function convertToStingObjectArray(data: DataItem[]): StringifiedDataItem[] {
  return data.map((item) => {
    const stringifiedItem: StringifiedDataItem = {};
    Object.keys(item).forEach((key) => {
      const value = item[key];
      if (Array.isArray(value)) {
        stringifiedItem[key] = JSON.stringify(value);
      } else {
        stringifiedItem[key] = value;
      }
    });
    return stringifiedItem;
  });
}
