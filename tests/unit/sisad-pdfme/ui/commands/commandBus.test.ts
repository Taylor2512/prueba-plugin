import { describe, it, expect, vi } from 'vitest';
import { CommandBus, buildCommandMeta, createCommandBus } from '@/sisad-pdfme/ui/commands/commandBus.js';
import type { Command, CommandExecutionContext } from '@sisad-pdfme/common';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeCommand = (
  overrides: Partial<{
    id: string;
    label: string;
    execute: (_ctx: CommandExecutionContext) => Promise<void>;
    undo: (_ctx: CommandExecutionContext) => Promise<void>;
    redo: (_ctx: CommandExecutionContext) => Promise<void>;
  }> = {},
): Command =>
  ({
    id: 'test-command',
    label: 'Test Command',
    execute: vi.fn().mockResolvedValue(undefined),
    undo: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  } as unknown as Command);

// ─── CommandBus.execute ───────────────────────────────────────────────────────

describe('CommandBus.execute', () => {
  it('calls command.execute', async () => {
    const bus = new CommandBus();
    const cmd = makeCommand();
    await bus.execute(cmd);
    expect(cmd.execute).toHaveBeenCalledOnce();
  });

  it('pushes command to undoStack (canUndo becomes true)', async () => {
    const bus = new CommandBus();
    expect(bus.canUndo()).toBe(false);
    await bus.execute(makeCommand());
    expect(bus.canUndo()).toBe(true);
  });

  it('clears redoStack after execute', async () => {
    const bus = new CommandBus();
    const cmd1 = makeCommand();
    const cmd2 = makeCommand();
    await bus.execute(cmd1);
    await bus.undo();
    expect(bus.canRedo()).toBe(true);
    await bus.execute(cmd2);
    expect(bus.canRedo()).toBe(false);
  });

  it('does NOT execute when guard returns false', async () => {
    const bus = new CommandBus();
    bus.addGuard(() => false);
    const cmd = makeCommand();
    await bus.execute(cmd);
    expect(cmd.execute).not.toHaveBeenCalled();
  });

  it('executes when all guards return true', async () => {
    const bus = new CommandBus();
    bus.addGuard(() => true);
    bus.addGuard(() => true);
    const cmd = makeCommand();
    await bus.execute(cmd);
    expect(cmd.execute).toHaveBeenCalledOnce();
  });

  it('skips execution when command has empty id', async () => {
    const bus = new CommandBus();
    const cmd = makeCommand({ id: '' });
    await bus.execute(cmd);
    expect(cmd.execute).not.toHaveBeenCalled();
  });

  it('skips execution when command has empty label', async () => {
    const bus = new CommandBus();
    const cmd = makeCommand({ label: '' });
    await bus.execute(cmd);
    expect(cmd.execute).not.toHaveBeenCalled();
  });
});

// ─── CommandBus.undo ─────────────────────────────────────────────────────────

describe('CommandBus.undo', () => {
  it('calls command.undo and moves to redoStack', async () => {
    const bus = new CommandBus();
    const cmd = makeCommand();
    await bus.execute(cmd);
    await bus.undo();
    expect(cmd.undo).toHaveBeenCalledOnce();
    expect(bus.canUndo()).toBe(false);
    expect(bus.canRedo()).toBe(true);
  });

  it('does nothing when undoStack is empty', async () => {
    const bus = new CommandBus();
    await expect(bus.undo()).resolves.toBeUndefined();
  });

  it('undoes in LIFO order', async () => {
    const bus = new CommandBus();
    const order: string[] = [];
    const cmd1 = makeCommand({ id: 'a', label: 'A', undo: vi.fn().mockImplementation(async () => { order.push('a'); }) });
    const cmd2 = makeCommand({ id: 'b', label: 'B', undo: vi.fn().mockImplementation(async () => { order.push('b'); }) });
    await bus.execute(cmd1);
    await bus.execute(cmd2);
    await bus.undo();
    await bus.undo();
    expect(order).toEqual(['b', 'a']);
  });
});

// ─── CommandBus.redo ─────────────────────────────────────────────────────────

describe('CommandBus.redo', () => {
  it('calls command.redo when redo is defined', async () => {
    const bus = new CommandBus();
    const redo = vi.fn().mockResolvedValue(undefined);
    const cmd = makeCommand({ redo });
    await bus.execute(cmd);
    await bus.undo();
    await bus.redo();
    expect(redo).toHaveBeenCalledOnce();
    expect(bus.canRedo()).toBe(false);
    expect(bus.canUndo()).toBe(true);
  });

  it('falls back to execute when redo is undefined', async () => {
    const bus = new CommandBus();
    const execute = vi.fn().mockResolvedValue(undefined);
    const cmd = makeCommand({ execute });
    await bus.execute(cmd);
    await bus.undo();
    await bus.redo();
    // execute was called once on initial execute and once on redo fallback
    expect(execute).toHaveBeenCalledTimes(2);
  });

  it('does nothing when redoStack is empty', async () => {
    const bus = new CommandBus();
    await expect(bus.redo()).resolves.toBeUndefined();
  });
});

// ─── CommandBus.subscribe ─────────────────────────────────────────────────────

describe('CommandBus.subscribe', () => {
  it('listener receives events emitted during execute', async () => {
    // The listener is called via context.emit — execute must emit something.
    // The bus itself doesn't emit; the command's execute uses context.emit.
    const bus = new CommandBus();
    const listener = vi.fn();
    bus.subscribe(listener);
    const cmd = makeCommand({
      execute: vi.fn().mockImplementation(async (ctx: CommandExecutionContext) => {
        ctx.emit({ type: 'executed' } as any);
      }),
    });
    await bus.execute(cmd);
    expect(listener).toHaveBeenCalledWith({ type: 'executed' });
  });

  it('returns unsubscribe function that stops delivery', async () => {
    const bus = new CommandBus();
    const listener = vi.fn();
    const unsubscribe = bus.subscribe(listener);
    unsubscribe();
    const cmd = makeCommand({
      execute: vi.fn().mockImplementation(async (ctx: CommandExecutionContext) => {
        ctx.emit({ type: 'after-unsub' } as any);
      }),
    });
    await bus.execute(cmd);
    expect(listener).not.toHaveBeenCalled();
  });
});

// ─── CommandBus.addGuard ──────────────────────────────────────────────────────

describe('CommandBus.addGuard', () => {
  it('returns unsubscribe function that removes the guard', async () => {
    const bus = new CommandBus();
    const removeGuard = bus.addGuard(() => false);
    removeGuard();
    const cmd = makeCommand();
    await bus.execute(cmd);
    expect(cmd.execute).toHaveBeenCalledOnce();
  });

  it('first false guard blocks all subsequent guards', async () => {
    const bus = new CommandBus();
    const guard2 = vi.fn().mockReturnValue(true);
    bus.addGuard(() => false);
    bus.addGuard(guard2);
    await bus.execute(makeCommand());
    expect(guard2).not.toHaveBeenCalled();
  });
});

// ─── CommandBus.clear ────────────────────────────────────────────────────────

describe('CommandBus.clear', () => {
  it('empties undoStack and redoStack', async () => {
    const bus = new CommandBus();
    await bus.execute(makeCommand());
    await bus.undo();
    expect(bus.canUndo()).toBe(false);
    expect(bus.canRedo()).toBe(true);
    bus.clear();
    expect(bus.canUndo()).toBe(false);
    expect(bus.canRedo()).toBe(false);
  });
});

// ─── buildCommandMeta ────────────────────────────────────────────────────────

describe('buildCommandMeta', () => {
  it('produces a meta with a numeric timestamp', () => {
    const meta = buildCommandMeta({ commandId: 'copy', source: 'keyboard', undoable: true });
    expect(typeof meta.timestamp).toBe('number');
    expect(meta.timestamp).toBeGreaterThan(0);
  });

  it('respects commandId and source overrides', () => {
    const meta = buildCommandMeta({ commandId: 'delete', source: 'canvas-toolbar', undoable: true });
    expect(meta.commandId).toBe('delete');
    expect(meta.source).toBe('canvas-toolbar');
  });

  it('allows custom timestamp override', () => {
    const meta = buildCommandMeta({ commandId: 'x', source: 'system', undoable: false, timestamp: 12345 });
    expect(meta.timestamp).toBe(12345);
  });
});

// ─── createCommandBus ────────────────────────────────────────────────────────

describe('createCommandBus', () => {
  it('returns a fresh CommandBus instance', () => {
    const bus = createCommandBus();
    expect(bus).toBeInstanceOf(CommandBus);
    expect(bus.canUndo()).toBe(false);
  });
});
