export type RecipientToneResolver = (recipient?: { color?: string | null } | null) => string | null;

export type DesignerRuntimeEventSource = 'designer' | 'sidebar' | 'canvas' | 'form' | 'viewer' | 'toolbar' | 'comment' | 'runtime';

export type DesignerRuntimeEvent = {
  type: string;
  source?: DesignerRuntimeEventSource | string;
  component?: string;
  action?: string;
  schemaId?: string | null;
  schemaIds?: string[];
  pageIndex?: number;
  unitIndex?: number;
  value?: unknown;
  values?: Record<string, unknown>;
  patch?: Record<string, unknown>;
  details?: Record<string, unknown>;
  timestamp: number;
};

export type DesignerRuntimeEventListener = (event: DesignerRuntimeEvent) => void;

export type DesignerRuntimeEventHub = {
  emit: (event: Omit<DesignerRuntimeEvent, 'timestamp'> & { timestamp?: number }) => DesignerRuntimeEvent;
  subscribe: (listener: DesignerRuntimeEventListener) => () => void;
  clear: () => void;
};

export const createDesignerRuntimeEventHub = (seedListeners: DesignerRuntimeEventListener[] = []): DesignerRuntimeEventHub => {
  const listeners = new Set<DesignerRuntimeEventListener>(seedListeners);

  return {
    emit: (event) => {
      const normalizedEvent: DesignerRuntimeEvent = {
        ...event,
        timestamp: event.timestamp ?? Date.now(),
      };

      listeners.forEach((listener) => {
        try {
          listener(normalizedEvent);
        } catch {
          // Keep the hub resilient to observer failures.
        }
      });

      return normalizedEvent;
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    clear: () => {
      listeners.clear();
    },
  };
};

export const emitDesignerRuntimeEvent = (
  hub: DesignerRuntimeEventHub | null | undefined,
  event: Omit<DesignerRuntimeEvent, 'timestamp'> & { timestamp?: number },
) => hub?.emit(event);

export type AutoPlaceDescriptor = {
  enabled: true;
  keyword: string;
  scope: string;
  matchMode: string;
  fieldType?: string | null;
  schemaUid?: string | null;
  schemaName?: string | null;
  documentId?: string | null;
  pageIndex?: number;
};

export type AutoPlaceResolverOptions = {
  keyword?: string;
  scope?: string;
  matchMode?: string;
  fieldType?: string;
  schemaUid?: string;
  schemaName?: string;
  documentId?: string;
  pageIndex?: number;
};

export type AutoPlaceResolver = (
  schema?: Record<string, unknown> | null,
  options?: AutoPlaceResolverOptions,
) => AutoPlaceDescriptor | null;

export type DesignerRuntimeExtensions = {
  events?: DesignerRuntimeEventHub;
  resolveRecipientColor?: RecipientToneResolver;
  resolveSchemaAutoPlaceDescriptor?: AutoPlaceResolver;
};
