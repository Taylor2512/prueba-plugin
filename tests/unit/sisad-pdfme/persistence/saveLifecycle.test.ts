/**
 * COREUX-018 — Lifecycle de guardar y autosave.
 *
 * Criterios: el estado no se marca `saved` antes de que el adapter resuelva, y
 * un error permite reintentar.
 */
import { describe, expect, it, vi } from 'vitest';
import { createSaveLifecycle } from '@/sisad-pdfme/runtime/saveLifecycle';
import { createInstanceEventDispatcher } from '@/sisad-pdfme/runtime/instanceEventDispatcher';

/** Promesa con resolución manual, para observar el estado intermedio. */
const deferred = <T = void>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('no marca saved antes de resolver el adapter', () => {
  it('permanece en saving mientras el adapter no resuelve', async () => {
    const gate = deferred();
    const lifecycle = createSaveLifecycle({ persist: () => gate.promise });

    const saving = lifecycle.save({ id: 1 });
    expect(lifecycle.getState().status).toBe('saving');

    gate.resolve();
    await saving;
    expect(lifecycle.getState().status).toBe('saved');
  });

  it('incrementa la revisión solo al terminar bien', async () => {
    const lifecycle = createSaveLifecycle({ persist: async () => undefined });

    expect(lifecycle.getState().revision).toBe(0);
    await lifecycle.save({ id: 1 });
    expect(lifecycle.getState().revision).toBe(1);
    await lifecycle.save({ id: 2 });
    expect(lifecycle.getState().revision).toBe(2);
  });

  it('un adapter que rechaza deja estado de error, no saved', async () => {
    const lifecycle = createSaveLifecycle({
      persist: async () => {
        throw new Error('disco lleno');
      },
    });

    const result = await lifecycle.save({ id: 1 });

    expect(result).toEqual({ ok: false, error: 'disco lleno' });
    expect(lifecycle.getState()).toMatchObject({ status: 'error', error: 'disco lleno', revision: 0 });
  });

  it('notifica cada transición de estado', async () => {
    const states: string[] = [];
    const lifecycle = createSaveLifecycle({
      persist: async () => undefined,
      onStateChange: (state) => states.push(state.status),
    });

    await lifecycle.save({ id: 1 });

    expect(states).toEqual(['saving', 'saved']);
  });
});

describe('el error permite reintentar', () => {
  it('retry reintenta exactamente el snapshot que falló', async () => {
    const persist = vi
      .fn()
      .mockRejectedValueOnce(new Error('red caída'))
      .mockResolvedValueOnce(undefined);
    const lifecycle = createSaveLifecycle({ persist });

    await lifecycle.save({ id: 'contrato' });
    expect(lifecycle.canRetry()).toBe(true);
    expect(lifecycle.getState().dirty).toBe(true);

    const retry = await lifecycle.retry();

    expect(retry).toEqual({ ok: true, revision: 1 });
    expect(persist).toHaveBeenCalledTimes(2);
    expect(persist.mock.calls[1][0]).toEqual({ id: 'contrato' });
    expect(lifecycle.getState()).toMatchObject({ status: 'saved', dirty: false, error: null });
  });

  it('sin nada pendiente, retry no escribe', async () => {
    const persist = vi.fn().mockResolvedValue(undefined);
    const lifecycle = createSaveLifecycle({ persist });

    await lifecycle.save({ id: 1 });
    const result = await lifecycle.retry();

    expect(persist).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ ok: true, revision: 1 });
  });

  it('un fallo repetido conserva la posibilidad de reintentar', async () => {
    const lifecycle = createSaveLifecycle({
      persist: async () => {
        throw new Error('sigue fallando');
      },
    });

    await lifecycle.save({ id: 1 });
    await lifecycle.retry();

    expect(lifecycle.canRetry()).toBe(true);
    expect(lifecycle.getState().status).toBe('error');
  });
});

describe('guardados concurrentes (autosave)', () => {
  it('no lanza dos escrituras en paralelo', async () => {
    const gate = deferred();
    const persist = vi.fn().mockImplementationOnce(() => gate.promise).mockResolvedValue(undefined);
    const lifecycle = createSaveLifecycle({ persist });

    const first = lifecycle.save({ id: 1 });
    const second = lifecycle.save({ id: 2 });

    expect(persist).toHaveBeenCalledTimes(1);

    gate.resolve();
    await Promise.all([first, second]);

    expect(persist).toHaveBeenCalledTimes(2);
    // La segunda escritura usa el snapshot más reciente.
    expect(persist.mock.calls[1][0]).toEqual({ id: 2 });
  });

  it('encolar marca el estado como dirty', async () => {
    const gate = deferred();
    const lifecycle = createSaveLifecycle({
      persist: vi.fn().mockImplementationOnce(() => gate.promise).mockResolvedValue(undefined),
    });

    const first = lifecycle.save({ id: 1 });
    const second = lifecycle.save({ id: 2 });
    expect(lifecycle.getState().dirty).toBe(true);

    gate.resolve();
    await Promise.all([first, second]);
    expect(lifecycle.getState().dirty).toBe(false);
  });
});

describe('eventos canónicos', () => {
  it('emite requested/started/succeeded con el mismo correlationId', async () => {
    const dispatcher = createInstanceEventDispatcher({ instanceId: 'inst-save' });
    const events: Array<{ name: string; correlationId?: string }> = [];
    dispatcher.subscribe((event) => events.push({ name: event.name, correlationId: event.correlationId }));

    await createSaveLifecycle({ persist: async () => undefined, dispatcher }).save({ id: 1 });

    expect(events.map((event) => event.name)).toEqual([
      'save.requested',
      'save.started',
      'save.succeeded',
    ]);
    expect(new Set(events.map((event) => event.correlationId)).size).toBe(1);
  });

  it('emite save.failed con error recuperable', async () => {
    const dispatcher = createInstanceEventDispatcher({ instanceId: 'inst-save' });
    const failures: unknown[] = [];
    dispatcher.subscribe((event) => {
      if (event.name === 'save.failed') failures.push(event.payload);
    });

    await createSaveLifecycle({
      persist: async () => {
        throw new Error('boom');
      },
      dispatcher,
    }).save({ id: 1 });

    expect(failures).toHaveLength(1);
    expect(failures[0]).toMatchObject({
      error: { code: 'save-failed', message: 'boom', recoverable: true },
    });
  });
});
