/**
 * COREUX-006 — Dispatcher único y adapter legacy `onX`.
 *
 * Cubre los tres criterios de aceptación de la task-card:
 *   1. cada evento llega una vez;
 *   2. `config.events.onX = false` apaga el callback legacy, no el evento interno;
 *   3. un listener fallido no bloquea a los demás.
 */
import { describe, expect, it, vi } from 'vitest';
import {
  CANONICAL_TO_LEGACY_CALLBACK,
  createInstanceEventDispatcher,
} from '@/sisad-pdfme/runtime/instanceEventDispatcher';

const baseOptions = { instanceId: 'inst-test' };

describe('entrega única', () => {
  it('llama a cada listener exactamente una vez por emisión', () => {
    const first = vi.fn();
    const second = vi.fn();
    const dispatcher = createInstanceEventDispatcher(baseOptions);
    dispatcher.subscribe(first);
    dispatcher.subscribe(second);

    dispatcher.emit('page.changed', { previous: 1, current: 2, total: 5 });

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    expect(first.mock.calls[0][0].name).toBe('page.changed');
  });

  it('no duplica cuando el mismo listener se registra dos veces', () => {
    const listener = vi.fn();
    const dispatcher = createInstanceEventDispatcher(baseOptions);
    dispatcher.subscribe(listener);
    dispatcher.subscribe(listener);

    dispatcher.emit('save.started', {});

    expect(listener).toHaveBeenCalledTimes(1);
    expect(dispatcher.listenerCount()).toBe(1);
  });

  it('deja de notificar tras desuscribir', () => {
    const listener = vi.fn();
    const dispatcher = createInstanceEventDispatcher(baseOptions);
    const unsubscribe = dispatcher.subscribe(listener);

    unsubscribe();
    dispatcher.emit('save.started', {});

    expect(listener).not.toHaveBeenCalled();
  });

  it('tolera que un listener se desuscriba durante la emisión', () => {
    const dispatcher = createInstanceEventDispatcher(baseOptions);
    const second = vi.fn();
    const unsubscribe = dispatcher.subscribe(() => unsubscribe());
    dispatcher.subscribe(second);

    expect(() => dispatcher.emit('save.started', {})).not.toThrow();
    expect(second).toHaveBeenCalledTimes(1);
  });
});

describe('adapter legacy onX', () => {
  it('mapea el evento canónico al callback del host', () => {
    const onSelectionChange = vi.fn();
    const dispatcher = createInstanceEventDispatcher({
      ...baseOptions,
      getHostCallbacks: () => ({ onSelectionChange }),
    });

    dispatcher.emit('selection.changed', { ids: ['a'], mode: 'replace' });

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(onSelectionChange.mock.calls[0][0]).toMatchObject({ ids: ['a'], mode: 'replace' });
  });

  it('config.events = false apaga el callback legacy pero NO el evento interno', () => {
    const listener = vi.fn();
    const onSelectionChange = vi.fn();
    const dispatcher = createInstanceEventDispatcher({
      ...baseOptions,
      getConfigEvents: () => ({ onSelectionChange: false }),
      getHostCallbacks: () => ({ onSelectionChange }),
    });
    dispatcher.subscribe(listener);

    dispatcher.emit('selection.changed', { ids: [], mode: 'clear' });

    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('una función en config.events tiene precedencia sobre el prop del host', () => {
    const configured = vi.fn();
    const hostProp = vi.fn();
    const dispatcher = createInstanceEventDispatcher({
      ...baseOptions,
      getConfigEvents: () => ({ onSave: configured }),
      getHostCallbacks: () => ({ onSave: hostProp }),
    });

    dispatcher.emit('save.succeeded', { revision: 2 });

    expect(configured).toHaveBeenCalledTimes(1);
    expect(hostProp).not.toHaveBeenCalled();
  });

  it("'host' delega en el prop del wrapper", () => {
    const hostProp = vi.fn();
    const dispatcher = createInstanceEventDispatcher({
      ...baseOptions,
      getConfigEvents: () => ({ onSave: 'host' }),
      getHostCallbacks: () => ({ onSave: hostProp }),
    });

    dispatcher.emit('save.succeeded', { revision: 2 });

    expect(hostProp).toHaveBeenCalledTimes(1);
  });

  it('no inventa callbacks para eventos sin contrato legacy', () => {
    const hostCallbacks = { onChange: vi.fn(), onSave: vi.fn() };
    const dispatcher = createInstanceEventDispatcher({
      ...baseOptions,
      getHostCallbacks: () => hostCallbacks,
    });

    dispatcher.emit('view-feature.changed', { feature: 'grid', enabled: true });

    expect(hostCallbacks.onChange).not.toHaveBeenCalled();
    expect(hostCallbacks.onSave).not.toHaveBeenCalled();
    expect(CANONICAL_TO_LEGACY_CALLBACK['view-feature.changed']).toBeUndefined();
  });

  it('legacyPayload preserva el contrato rico sin ensuciar el evento canónico', () => {
    const onRecipientsChange = vi.fn();
    const listener = vi.fn();
    const richRecipients = [{ id: 'a', name: 'Alice', color: '#fff', extra: () => null }];
    const dispatcher = createInstanceEventDispatcher({
      ...baseOptions,
      getHostCallbacks: () => ({ onRecipientsChange }),
    });
    dispatcher.subscribe(listener);

    dispatcher.emit(
      'recipient.registry.changed',
      { revision: 1, recipients: [{ id: 'a', name: 'Alice' }] },
      { legacyPayload: { recipients: richRecipients } },
    );

    // El host recibe los objetos completos…
    expect(onRecipientsChange.mock.calls[0][0].recipients).toBe(richRecipients);
    // …y el evento canónico sigue siendo serializable.
    const event = listener.mock.calls[0][0];
    expect(event.payload.recipients).toEqual([{ id: 'a', name: 'Alice' }]);
    expect(() => structuredClone(event)).not.toThrow();
  });

  it('lee handlers en el momento de emitir, sin closures obsoletos', () => {
    const first = vi.fn();
    const second = vi.fn();
    let current = { onSave: first };
    const dispatcher = createInstanceEventDispatcher({
      ...baseOptions,
      getHostCallbacks: () => current,
    });

    dispatcher.emit('save.succeeded', { revision: 1 });
    current = { onSave: second };
    dispatcher.emit('save.succeeded', { revision: 2 });

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });
});

describe('aislamiento de fallos', () => {
  it('un listener que lanza no bloquea a los demás ni al callback legacy', () => {
    const diagnostics: unknown[] = [];
    const healthy = vi.fn();
    const onSave = vi.fn();
    const dispatcher = createInstanceEventDispatcher({
      ...baseOptions,
      getHostCallbacks: () => ({ onSave }),
      onDiagnostic: (diagnostic) => diagnostics.push(diagnostic),
    });

    dispatcher.subscribe(() => {
      throw new Error('listener roto');
    });
    dispatcher.subscribe(healthy);

    expect(() => dispatcher.emit('save.succeeded', { revision: 1 })).not.toThrow();
    expect(healthy).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(diagnostics).toHaveLength(1);
    expect(diagnostics[0]).toMatchObject({ code: 'listener-failed', eventName: 'save.succeeded' });
  });

  it('un callback legacy que lanza se reporta como diagnóstico', () => {
    const diagnostics: unknown[] = [];
    const dispatcher = createInstanceEventDispatcher({
      ...baseOptions,
      getHostCallbacks: () => ({
        onSave: () => {
          throw new Error('host roto');
        },
      }),
      onDiagnostic: (diagnostic) => diagnostics.push(diagnostic),
    });

    expect(() => dispatcher.emit('save.succeeded', { revision: 1 })).not.toThrow();
    expect(diagnostics[0]).toMatchObject({ code: 'legacy-callback-failed' });
  });
});
