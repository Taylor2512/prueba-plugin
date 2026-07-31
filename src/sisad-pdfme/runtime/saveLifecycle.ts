/**
 * Ciclo de vida de guardado.
 *
 * `controller.save()` era fire-and-forget: llamaba a `saveTemplate()` y volvía
 * de inmediato, así que la UI podía marcar «guardado» antes de que el adapter
 * del host hubiera resuelto —o incluso cuando había fallado.
 *
 * Este controlador cierra el ciclo:
 *
 *   idle → saving → saved
 *                 ↘ error → (retry) → saving → …
 *
 * Reglas:
 *
 * - el estado **nunca** pasa a `saved` antes de que la promesa del adapter
 *   resuelva;
 * - un fallo conserva el snapshot pendiente, de modo que `retry()` reintenta
 *   exactamente lo mismo que falló;
 * - guardar mientras se guarda no lanza una segunda escritura en paralelo: se
 *   encola el último snapshot y se escribe al terminar, que es lo que espera
 *   un autosave;
 * - no usa `setTimeout` para el ciclo de vida.
 */
import type { InstanceEventDispatcher } from './instanceEventDispatcher.js';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export type SaveState = {
  status: SaveStatus;
  /** Revisión aplicada; sube en cada guardado con éxito. */
  revision: number;
  /** Mensaje del último fallo; `null` si el último intento fue bien. */
  error: string | null;
  /** Hay cambios sin persistir (fallo previo o encolado durante un guardado). */
  dirty: boolean;
};

export type SaveResult =
  | { ok: true; revision: number }
  | { ok: false; error: string };

export type SaveLifecycleOptions<TSnapshot> = {
  /** Escritura real. Debe rechazar si el guardado falla. */
  persist: (snapshot: TSnapshot) => Promise<unknown>;
  /** Emisor canónico opcional: `save.requested/started/succeeded/failed`. */
  dispatcher?: InstanceEventDispatcher;
  onStateChange?: (state: SaveState) => void;
  getErrorMessage?: (error: unknown) => string;
};

export type SaveLifecycle<TSnapshot> = {
  save(snapshot: TSnapshot): Promise<SaveResult>;
  /** Reintenta el último snapshot que no llegó a persistirse. */
  retry(): Promise<SaveResult>;
  getState(): SaveState;
  canRetry(): boolean;
};

const defaultGetErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Error al guardar';

let correlationSequence = 0;

export const createSaveLifecycle = <TSnapshot>(
  options: SaveLifecycleOptions<TSnapshot>,
): SaveLifecycle<TSnapshot> => {
  const { persist, dispatcher, onStateChange, getErrorMessage = defaultGetErrorMessage } = options;

  let state: SaveState = { status: 'idle', revision: 0, error: null, dirty: false };
  let inFlight: Promise<SaveResult> | null = null;
  /** Snapshot pendiente: el que falló o el que llegó mientras se guardaba. */
  let pending: { snapshot: TSnapshot } | null = null;

  const setState = (patch: Partial<SaveState>) => {
    state = { ...state, ...patch };
    onStateChange?.(state);
  };

  const run = async (snapshot: TSnapshot): Promise<SaveResult> => {
    const correlationId = `save-${(correlationSequence += 1)}`;
    dispatcher?.emit('save.requested', { revision: state.revision }, { correlationId });
    setState({ status: 'saving', error: null });
    dispatcher?.emit('save.started', {}, { correlationId });

    try {
      await persist(snapshot);
    } catch (error) {
      const message = getErrorMessage(error);
      // El snapshot sigue pendiente: es lo que hace posible el reintento.
      pending = { snapshot };
      setState({ status: 'error', error: message, dirty: true });
      dispatcher?.emit(
        'save.failed',
        { error: { code: 'save-failed', message, recoverable: true } },
        { correlationId },
      );
      return { ok: false, error: message };
    }

    const revision = state.revision + 1;
    // Solo se limpia lo pendiente si es EXACTAMENTE lo que se acaba de
    // escribir: si llegó un snapshot nuevo mientras guardábamos, sigue
    // pendiente y debe escribirse después.
    const stillPending = pending !== null && pending.snapshot !== snapshot;
    if (!stillPending) pending = null;
    setState({ status: 'saved', revision, error: null, dirty: stillPending });
    dispatcher?.emit('save.succeeded', { revision }, { correlationId });
    return { ok: true, revision };
  };

  /** Encadena la escritura pendiente al terminar la que está en curso. */
  const enqueue = async (snapshot: TSnapshot): Promise<SaveResult> => {
    pending = { snapshot };
    setState({ dirty: true });
    await inFlight;
    const next = pending;
    if (!next) return { ok: true, revision: state.revision };
    pending = null;
    return start(next.snapshot);
  };

  const start = (snapshot: TSnapshot): Promise<SaveResult> => {
    const promise = run(snapshot).finally(() => {
      if (inFlight === promise) inFlight = null;
    });
    inFlight = promise;
    return promise;
  };

  return {
    save(snapshot) {
      if (inFlight) return enqueue(snapshot);
      return start(snapshot);
    },

    retry() {
      if (!pending) return Promise.resolve({ ok: true, revision: state.revision } as SaveResult);
      const { snapshot } = pending;
      pending = null;
      if (inFlight) return enqueue(snapshot);
      return start(snapshot);
    },

    getState: () => state,
    canRetry: () => pending !== null,
  };
};
