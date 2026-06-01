import { describe, expect, test, vi } from 'vitest';
import { CommandBus } from '../../src/sisad-pdfme/ui/commands/commandBus.js';
import type { Command } from '../../src/sisad-pdfme/common/index.js';

describe('CommandBus', () => {
  test('executes, undoes and redoes commands', async () => {
    const bus = new CommandBus();
    const execute = vi.fn(async () => undefined);
    const undo = vi.fn(async () => undefined);
    const redo = vi.fn(async () => undefined);

    const command: Command = {
      id: 'cmd.move',
      label: 'Mover',
      execute,
      undo,
      redo,
    };
    await bus.execute(command);
    expect(execute).toHaveBeenCalledTimes(1);
    expect(bus.canUndo()).toBe(true);

    await bus.undo();
    expect(undo).toHaveBeenCalledTimes(1);
    expect(bus.canRedo()).toBe(true);

    await bus.redo();
    expect(redo).toHaveBeenCalledTimes(1);
  });

  test('blocks command when guard denies', async () => {
    const bus = new CommandBus();
    const execute = vi.fn(async () => undefined);

    bus.addGuard(() => false);
    const blockedCommand: Command = {
      id: 'cmd.blocked',
      label: 'Bloqueado',
      execute,
      undo: async () => undefined,
    };
    await bus.execute(blockedCommand);

    expect(execute).not.toHaveBeenCalled();
    expect(bus.canUndo()).toBe(false);
  });
});
