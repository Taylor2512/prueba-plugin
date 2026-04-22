import { describe, expect, it, vi } from 'vitest';
import type { CommandObserverPayload } from '@sisad-pdfme/common';
import { CommandBus } from '../../src/sisad-pdfme/ui/commands/commandBus.js';

describe('CommandBus', () => {
  it('executes, undoes and redoes commands while notifying observers', async () => {
    const bus = new CommandBus();
    const state = { value: 0 };
    const events: CommandObserverPayload[] = [];
    const unsubscribe = bus.subscribe((event) => events.push(event));

    await bus.execute({
      id: 'increment',
      label: 'increment',
      execute: ({ emit }) => {
        state.value = 1;
        emit({ type: 'schema.updated', payload: { value: state.value } });
      },
      undo: ({ emit }) => {
        state.value = 0;
        emit({ type: 'schema.updated', payload: { value: state.value, direction: 'undo' } });
      },
      redo: ({ emit }) => {
        state.value = 1;
        emit({ type: 'schema.updated', payload: { value: state.value, direction: 'redo' } });
      },
    });

    expect(state.value).toBe(1);
    expect(bus.canUndo()).toBe(true);
    expect(bus.canRedo()).toBe(false);

    await bus.undo();
    expect(state.value).toBe(0);
    expect(bus.canRedo()).toBe(true);

    await bus.redo();
    expect(state.value).toBe(1);

    unsubscribe();
    expect(events.map((event) => event.payload)).toEqual([
      { value: 1 },
      { value: 0, direction: 'undo' },
      { value: 1, direction: 'redo' },
    ]);
  });

  it('clears history stacks', async () => {
    const bus = new CommandBus();
    const execute = vi.fn();
    const undo = vi.fn();

    await bus.execute({
      id: 'noop',
      label: 'noop',
      execute,
      undo,
    });

    expect(bus.canUndo()).toBe(true);
    bus.clear();
    expect(bus.canUndo()).toBe(false);
    expect(bus.canRedo()).toBe(false);
  });
});
