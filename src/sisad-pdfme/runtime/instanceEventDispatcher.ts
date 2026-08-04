/**
 * Dispatcher único de eventos de una instancia SISAD PDFME.
 *
 * Antes había tres caminos que no se tocaban: el hub de runtime (que emitía al
 * vacío), `config.events` y los props del wrapper. Este dispatcher es el único
 * punto por el que pasa un evento y desde el que se reparte:
 *
 *   emit(name, payload)
 *     → listeners suscritos          (canal interno, siempre)
 *     → adapter host `onX`           (config.events + props del host)
 *
 * Reglas que implementa:
 *
 * - cada listener recibe el evento **una sola vez** por emisión;
 * - `config.events.onX === false` apaga el callback del host pero **no** el
 *   evento interno: los listeners lo siguen recibiendo;
 * - un listener que lanza no bloquea a los demás; el fallo se reporta como
 *   diagnóstico, nunca se traga en silencio;
 * - los handlers se leen en el momento de emitir, no se capturan al crear el
 *   dispatcher, para evitar closures obsoletos.
 *
 * No es un segundo bus: `createDesignerRuntimeEventHub` sigue siendo el
 * transporte interno y este dispatcher se apoya en él.
 */
import {
  createSisadPdfmeEvent,
  type SisadPdfmeAnyEvent,
  type SisadPdfmeEvent,
  type SisadPdfmeEventName,
  type SisadPdfmeEventPayloads,
} from '../contracts/events.js';
import type { SisadPdfmeEventHandlers, SisadPdfmeEventName as HostCallbackName } from '../config/SisadPdfmeConfig.js';

export type SisadPdfmeEventListener = (event: SisadPdfmeAnyEvent) => void;

export type SisadPdfmeDispatcherDiagnostic = {
  code: 'listener-failed' | 'host-callback-failed';
  eventName: string;
  error: unknown;
};

/**
 * Mapa de evento de dominio → callback del host.
 *
 * Es intencionadamente parcial: solo los eventos con contrato público
 * histórico tienen `onX`. El resto vive únicamente en el canal interno.
 * `designer.error` y `save.failed` comparten `onError` a propósito.
 */
export const EVENT_TO_HOST_CALLBACK: Partial<
  Record<SisadPdfmeEventName, HostCallbackName>
> = {
  'designer.ready': 'onReady',
  'designer.error': 'onError',
  'save.failed': 'onError',
  'template.changed': 'onChange',
  'save.succeeded': 'onSave',
  'selection.changed': 'onSelectionChange',
  'recipient.registry.changed': 'onRecipientsChange',
  'recipient.active.changed': 'onActiveRecipientChange',
  'assignment.changed': 'onAssignmentChange',
  'document.changed': 'onDocumentChange',
  'signature.requested': 'onSignatureRequest',
};

/** @deprecated Use EVENT_TO_HOST_CALLBACK. */
export const _TO__CALLBACK = EVENT_TO_HOST_CALLBACK;

/** Callbacks que el host entrega como props del wrapper. */
export type SisadPdfmeHostCallbacks = Partial<
  Record<HostCallbackName, (payload: Record<string, unknown>) => void>
>;

export type InstanceEventDispatcherOptions = {
  instanceId: string;
  /** Se lee en cada emisión: `config.events` puede cambiar en caliente. */
  getConfigEvents?: () => SisadPdfmeEventHandlers | undefined;
  /** Se lee en cada emisión: los props del host cambian en cada render. */
  getHostCallbacks?: () => SisadPdfmeHostCallbacks | undefined;
  onDiagnostic?: (diagnostic: SisadPdfmeDispatcherDiagnostic) => void;
};

/** Contexto opcional de una emisión. */
export type EmitContext = {
  correlationId?: string;
  source?: string;
  /** Datos ricos solo para el adapter `onX` del host; no viajan en el evento. */
  hostCallbackPayload?: Record<string, unknown>;
  /** @deprecated Use hostCallbackPayload. */
  Payload?: Record<string, unknown>;
};

export type InstanceEventDispatcher = {
  emit<TName extends SisadPdfmeEventName>(
    name: TName,
    payload: SisadPdfmeEventPayloads[TName],
    context?: EmitContext,
  ): SisadPdfmeEvent<TName>;
  /** Reemite un evento ya construido (p. ej. traducido desde el hub interno). */
  dispatch(event: SisadPdfmeAnyEvent, hostCallbackPayload?: Record<string, unknown>): SisadPdfmeAnyEvent;
  subscribe(listener: SisadPdfmeEventListener): () => void;
  listenerCount(): number;
  clear(): void;
};

const reportDiagnostic = (
  onDiagnostic: InstanceEventDispatcherOptions['onDiagnostic'],
  diagnostic: SisadPdfmeDispatcherDiagnostic,
) => {
  if (onDiagnostic) {
    onDiagnostic(diagnostic);
    return;
  }
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[sisad-pdfme] ${diagnostic.code} en ${diagnostic.eventName}`, diagnostic.error);
  }
};

export const createInstanceEventDispatcher = (
  options: InstanceEventDispatcherOptions,
): InstanceEventDispatcher => {
  const { instanceId, getConfigEvents, getHostCallbacks, onDiagnostic } = options;
  const listeners = new Set<SisadPdfmeEventListener>();

  /**
   * Reparte a los listeners internos.
   *
   * Se itera sobre una copia: un listener que se desuscribe a sí mismo durante
   * la emisión no debe alterar el recorrido ni saltarse a otro.
   */
  const notifyListeners = (event: SisadPdfmeAnyEvent) => {
    [...listeners].forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        reportDiagnostic(onDiagnostic, { code: 'listener-failed', eventName: event.name, error });
      }
    });
  };

  /**
   * Adapter host: traduce el evento de dominio al callback `onX`.
   *
   * Precedencia: `config.events[onX]` manda. Si es `false`, no hay callback.
   * Si es función, se invoca. Si es `'host'` o no está declarado, se usa el
   * prop del wrapper.
   */
  const notifyHostCallback = (
    event: SisadPdfmeAnyEvent,
    hostCallbackPayload?: Record<string, unknown>,
  ) => {
    const eventName = event.name as SisadPdfmeEventName;
    const hostCallbackName = EVENT_TO_HOST_CALLBACK[eventName];
    if (!hostCallbackName) return;

    const configured = getConfigEvents?.()?.[hostCallbackName];
    if (configured === false) return;

    // El payload canónico es serializable por contrato, pero los callbacks
    // `onX` histórricos reciben objetos ricos del runtime (recipients
    // completos, etc.). `hostCallbackPayload` preserva ese contrato sin ensuciar el
    // evento canónico.
    const payload = { ...(event.payload as Record<string, unknown>), ...hostCallbackPayload, event };

    try {
      if (typeof configured === 'function') {
        configured(payload);
        return;
      }
      getHostCallbacks?.()?.[hostCallbackName]?.(payload);
    } catch (error) {
      reportDiagnostic(onDiagnostic, {
        code: 'host-callback-failed',
        eventName: event.name,
        error,
      });
    }
  };

  const dispatch = (event: SisadPdfmeAnyEvent, hostCallbackPayload?: Record<string, unknown>) => {
    notifyListeners(event);
    notifyHostCallback(event, hostCallbackPayload);
    return event;
  };

  return {
    emit(name, payload, context) {
      const event = createSisadPdfmeEvent(name, payload, { instanceId, ...context });
      dispatch(event as SisadPdfmeAnyEvent, context?.hostCallbackPayload ?? context?.Payload);
      return event;
    },
    dispatch,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    listenerCount: () => listeners.size,
    clear: () => listeners.clear(),
  };
};
