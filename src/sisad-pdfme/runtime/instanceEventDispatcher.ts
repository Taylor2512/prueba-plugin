/**
 * Dispatcher único de eventos de una instancia SISAD PDFME.
 *
 * Antes había tres caminos que no se tocaban: el hub de runtime (que emitía al
 * vacío), `config.events` y los props del wrapper. Este dispatcher es el único
 * punto por el que pasa un evento y desde el que se reparte:
 *
 *   emit(name, payload)
 *     → listeners suscritos          (canal interno, siempre)
 *     → adapter legacy `onX`         (config.events + props del host)
 *
 * Reglas que implementa:
 *
 * - cada listener recibe el evento **una sola vez** por emisión;
 * - `config.events.onX === false` apaga el callback legacy pero **no** el
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
import type { SisadPdfmeEventHandlers, SisadPdfmeEventName as LegacyCallbackName } from '../config/SisadPdfmeConfig.js';

export type SisadPdfmeEventListener = (event: SisadPdfmeAnyEvent) => void;

export type SisadPdfmeDispatcherDiagnostic = {
  code: 'listener-failed' | 'legacy-callback-failed';
  eventName: string;
  error: unknown;
};

/**
 * Mapa canónico → callback legacy del host.
 *
 * Es intencionadamente parcial: solo los eventos con contrato público
 * histórico tienen `onX`. El resto vive únicamente en el canal interno.
 * `designer.error` y `save.failed` comparten `onError` a propósito.
 */
export const CANONICAL_TO_LEGACY_CALLBACK: Partial<
  Record<SisadPdfmeEventName, LegacyCallbackName>
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

/** Callbacks que el host entrega como props del wrapper. */
export type SisadPdfmeHostCallbacks = Partial<
  Record<LegacyCallbackName, (payload: Record<string, unknown>) => void>
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
  /** Datos ricos solo para el adapter legacy `onX`; no viajan en el evento. */
  legacyPayload?: Record<string, unknown>;
};

export type InstanceEventDispatcher = {
  emit<TName extends SisadPdfmeEventName>(
    name: TName,
    payload: SisadPdfmeEventPayloads[TName],
    context?: EmitContext,
  ): SisadPdfmeEvent<TName>;
  /** Reemite un evento ya construido (p. ej. traducido desde el hub interno). */
  dispatch(event: SisadPdfmeAnyEvent, legacyPayload?: Record<string, unknown>): SisadPdfmeAnyEvent;
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
   * Adapter legacy: traduce el evento canónico al callback `onX`.
   *
   * Precedencia: `config.events[onX]` manda. Si es `false`, no hay callback.
   * Si es función, se invoca. Si es `'host'` o no está declarado, se usa el
   * prop del wrapper.
   */
  const notifyLegacy = (
    event: SisadPdfmeAnyEvent,
    legacyPayload?: Record<string, unknown>,
  ) => {
    const canonicalName = event.name as SisadPdfmeEventName;
    const legacyName = CANONICAL_TO_LEGACY_CALLBACK[canonicalName];
    if (!legacyName) return;

    const configured = getConfigEvents?.()?.[legacyName];
    if (configured === false) return;

    // El payload canónico es serializable por contrato, pero los callbacks
    // `onX` histórricos reciben objetos ricos del runtime (recipients
    // completos, etc.). `legacyPayload` preserva ese contrato sin ensuciar el
    // evento canónico.
    const payload = { ...(event.payload as Record<string, unknown>), ...legacyPayload, event };

    try {
      if (typeof configured === 'function') {
        configured(payload);
        return;
      }
      getHostCallbacks?.()?.[legacyName]?.(payload);
    } catch (error) {
      reportDiagnostic(onDiagnostic, {
        code: 'legacy-callback-failed',
        eventName: event.name,
        error,
      });
    }
  };

  const dispatch = (event: SisadPdfmeAnyEvent, legacyPayload?: Record<string, unknown>) => {
    notifyListeners(event);
    notifyLegacy(event, legacyPayload);
    return event;
  };

  return {
    emit(name, payload, context) {
      const event = createSisadPdfmeEvent(name, payload, { instanceId, ...context });
      dispatch(event, context?.legacyPayload);
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
