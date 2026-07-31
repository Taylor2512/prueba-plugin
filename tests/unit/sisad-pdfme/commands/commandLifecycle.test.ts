/**
 * COREUX-012 — CommandBus, eventos e historial.
 *
 * Criterios: undo/redo reflejan el historial real, un comando rechazado no
 * emite mutación, y los eventos llevan el estado que la toolbar necesita.
 */
import { describe, expect, it, vi } from 'vitest';
import { createCommandBus, buildCommandMeta } from '@/sisad-pdfme/ui/commands/commandBus';

const makeCommand = (
  id: string,
  overrides: { undoable?: boolean; onExecute?: () => void; onUndo?: () => void } = {},
) => {
  const { undoable = true, onExecute, onUndo } = overrides;
  return {
    id,
    label: `Comando ${id}`,
    meta: buildCommandMeta({ commandId: id, source: 'system', undoable }),
    execute: vi.fn(async () => onExecute?.()),
    undo: vi.fn(async () => onUndo?.()),
  } as never;
};

describe('historial real', () => {
  it('apila los comandos undoable', async () => {
    const bus = createCommandBus();

    await bus.execute(makeCommand('a'));
    await bus.execute(makeCommand('b'));

    expect(bus.historyState()).toMatchObject({ canUndo: true, canRedo: false, undoDepth: 2 });
  });

  it('los comandos NO undoable no entran al historial', async () => {
    const bus = createCommandBus();

    await bus.execute(makeCommand('zoom', { undoable: false }));

    expect(bus.canUndo()).toBe(false);
    expect(bus.historyState().undoDepth).toBe(0);
  });

  it('un comando de vista no puede deshacer una mutación anterior', async () => {
    const bus = createCommandBus();
    const mutationUndo = vi.fn();

    await bus.execute(makeCommand('delete', { onUndo: mutationUndo }));
    await bus.execute(makeCommand('zoom', { undoable: false }));
    await bus.undo();

    // El undo debe alcanzar la mutación, no el cambio de vista.
    expect(mutationUndo).toHaveBeenCalledTimes(1);
  });

  it('undo mueve al stack de redo y redo lo devuelve', async () => {
    const bus = createCommandBus();

    await bus.execute(makeCommand('a'));
    await bus.undo();
    expect(bus.historyState()).toMatchObject({ canUndo: false, canRedo: true });

    await bus.redo();
    expect(bus.historyState()).toMatchObject({ canUndo: true, canRedo: false });
  });

  it('ejecutar algo nuevo invalida el redo', async () => {
    const bus = createCommandBus();

    await bus.execute(makeCommand('a'));
    await bus.undo();
    await bus.execute(makeCommand('b'));

    expect(bus.canRedo()).toBe(false);
  });
});

describe('comando rechazado', () => {
  it('no ejecuta, no muta y no toca el historial', async () => {
    const bus = createCommandBus();
    bus.addGuard(() => false);
    const command = makeCommand('delete');

    await bus.execute(command);

    expect(command.execute).not.toHaveBeenCalled();
    expect(bus.canUndo()).toBe(false);
    expect(bus.historyState().undoDepth).toBe(0);
  });

  it('emite el motivo del rechazo', async () => {
    const bus = createCommandBus();
    const events: unknown[] = [];
    bus.subscribeLifecycle((event) => events.push(event));
    bus.addGuard(() => false);

    await bus.execute(makeCommand('delete'));

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      phase: 'rejected',
      commandId: 'delete',
      reason: 'blocked-by-guard',
    });
  });

  it('rechaza comandos sin id o label con motivo propio', async () => {
    const bus = createCommandBus();
    const events: Array<{ reason?: string }> = [];
    bus.subscribeLifecycle((event) => events.push(event));

    await bus.execute({ id: '', label: '', execute: vi.fn(), undo: vi.fn() } as never);

    expect(events[0]?.reason).toBe('invalid-command');
  });
});

describe('eventos sincronizados con la toolbar', () => {
  it('cada fase informa el estado del historial', async () => {
    const bus = createCommandBus();
    const events: Array<{ phase: string; history: { canUndo: boolean; canRedo: boolean } }> = [];
    bus.subscribeLifecycle((event) => events.push(event));

    await bus.execute(makeCommand('a'));
    await bus.undo();
    await bus.redo();

    expect(events.map((event) => event.phase)).toEqual(['executed', 'undone', 'redone']);
    expect(events[0].history).toMatchObject({ canUndo: true, canRedo: false });
    expect(events[1].history).toMatchObject({ canUndo: false, canRedo: true });
    expect(events[2].history).toMatchObject({ canUndo: true, canRedo: false });
  });

  it('el evento llega después de ejecutar, no antes', async () => {
    const bus = createCommandBus();
    const order: string[] = [];
    bus.subscribeLifecycle(() => order.push('event'));

    await bus.execute(makeCommand('a', { onExecute: () => order.push('execute') }));

    expect(order).toEqual(['execute', 'event']);
  });

  it('un observador que lanza no rompe la ejecución', async () => {
    const bus = createCommandBus();
    const healthy = vi.fn();
    bus.subscribeLifecycle(() => {
      throw new Error('observador roto');
    });
    bus.subscribeLifecycle(healthy);
    const command = makeCommand('a');

    await expect(bus.execute(command)).resolves.toBeUndefined();
    expect(command.execute).toHaveBeenCalledTimes(1);
    expect(healthy).toHaveBeenCalledTimes(1);
  });

  it('cancelar la suscripción detiene los eventos', async () => {
    const bus = createCommandBus();
    const listener = vi.fn();
    const unsubscribe = bus.subscribeLifecycle(listener);

    unsubscribe();
    await bus.execute(makeCommand('a'));

    expect(listener).not.toHaveBeenCalled();
  });

  it('undo/redo sin historial no emiten nada', async () => {
    const bus = createCommandBus();
    const listener = vi.fn();
    bus.subscribeLifecycle(listener);

    await bus.undo();
    await bus.redo();

    expect(listener).not.toHaveBeenCalled();
  });
});
