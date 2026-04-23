import { describe, expect, it } from 'vitest';
import type { CommandObserverPayload } from '@sisad-pdfme/common';
import { CommandBus } from '../../src/sisad-pdfme/ui/commands/commandBus.js';

/**
 * These tests verify that schema.locked / schema.unlocked events flow through
 * the CommandBus, matching the integration in Designer/index.tsx where lock
 * commands are enqueued via commandBusRef.current.execute().
 */
describe('schema lock events via CommandBus', () => {
  it('emits schema.locked event when a lock command is executed', async () => {
    const bus = new CommandBus();
    const events: CommandObserverPayload[] = [];
    bus.subscribe((e) => events.push(e));

    await bus.execute({
      id: 'schema.locked:field-1',
      label: 'Lock field',
      execute: ({ emit }) => {
        emit({ type: 'schema.locked', schemaId: 'field-1', pageIndex: 0 });
      },
      undo: ({ emit }) => {
        emit({ type: 'schema.unlocked', schemaId: 'field-1', pageIndex: 0 });
      },
    });

    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('schema.locked');
    expect(events[0].schemaId).toBe('field-1');
  });

  it('emits schema.unlocked event when a lock command is undone', async () => {
    const bus = new CommandBus();
    const events: CommandObserverPayload[] = [];
    bus.subscribe((e) => events.push(e));

    await bus.execute({
      id: 'schema.locked:field-1',
      label: 'Lock field',
      execute: ({ emit }) => {
        emit({ type: 'schema.locked', schemaId: 'field-1', pageIndex: 0 });
      },
      undo: ({ emit }) => {
        emit({ type: 'schema.unlocked', schemaId: 'field-1', pageIndex: 0 });
      },
    });
    await bus.undo();

    expect(events).toHaveLength(2);
    expect(events[1].type).toBe('schema.unlocked');
  });

  it('emits schema.unlocked event when an unlock command is executed', async () => {
    const bus = new CommandBus();
    const events: CommandObserverPayload[] = [];
    bus.subscribe((e) => events.push(e));

    await bus.execute({
      id: 'schema.unlocked:field-2',
      label: 'Unlock field',
      execute: ({ emit }) => {
        emit({ type: 'schema.unlocked', schemaId: 'field-2', pageIndex: 0 });
      },
      undo: ({ emit }) => {
        emit({ type: 'schema.locked', schemaId: 'field-2', pageIndex: 0 });
      },
    });

    expect(events[0].type).toBe('schema.unlocked');
    expect(events[0].schemaId).toBe('field-2');
  });

  it('allows multiple independent field locks in the same session', async () => {
    const bus = new CommandBus();
    const events: CommandObserverPayload[] = [];
    bus.subscribe((e) => events.push(e));

    for (const id of ['field-a', 'field-b', 'field-c']) {
      await bus.execute({
        id: `schema.locked:${id}`,
        label: 'Lock field',
        execute: ({ emit }) => {
          emit({ type: 'schema.locked', schemaId: id });
        },
        undo: ({ emit }) => {
          emit({ type: 'schema.unlocked', schemaId: id });
        },
      });
    }

    const lockedIds = events
      .filter((e) => e.type === 'schema.locked')
      .map((e) => e.schemaId);
    expect(lockedIds).toEqual(['field-a', 'field-b', 'field-c']);
    expect(bus.canUndo()).toBe(true);
  });
});
