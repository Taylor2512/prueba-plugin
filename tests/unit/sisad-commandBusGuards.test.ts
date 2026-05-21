/**
 * Tests for CommandBus guard system.
 *
 * Covers:
 *  - Guard blocks command execution
 *  - Multiple guards: first false stops execution
 *  - Guard unsubscribe restores execution
 *  - Blocked commands don't enter undo stack
 *  - Guards don't affect undo/redo
 */

import { describe, expect, it, vi } from 'vitest';
import { CommandBus, type CommandGuard } from '../../src/sisad-pdfme/ui/commands/commandBus.js';

const makeCommand = (id: string, executeFn = vi.fn(), undoFn = vi.fn()) => ({
  id,
  label: id,
  execute: executeFn,
  undo: undoFn,
});

describe('CommandBus.addGuard', () => {
  it('allows commands when no guards are registered', async () => {
    const bus = new CommandBus();
    const exec = vi.fn();
    await bus.execute(makeCommand('test', exec));
    expect(exec).toHaveBeenCalledOnce();
  });

  it('allows commands when guard returns true', async () => {
    const bus = new CommandBus();
    bus.addGuard(() => true);
    const exec = vi.fn();
    await bus.execute(makeCommand('test', exec));
    expect(exec).toHaveBeenCalledOnce();
  });

  it('blocks commands when guard returns false', async () => {
    const bus = new CommandBus();
    bus.addGuard(() => false);
    const exec = vi.fn();
    await bus.execute(makeCommand('test', exec));
    expect(exec).not.toHaveBeenCalled();
  });

  it('blocked command does not enter undo stack', async () => {
    const bus = new CommandBus();
    bus.addGuard(() => false);
    await bus.execute(makeCommand('blocked'));
    expect(bus.canUndo()).toBe(false);
  });

  it('blocked command does not clear redo stack', async () => {
    const bus = new CommandBus();
    // Execute and undo a command to populate redo stack
    const exec = vi.fn();
    const undo = vi.fn();
    await bus.execute(makeCommand('first', exec, undo));
    await bus.undo();
    expect(bus.canRedo()).toBe(true);

    // Now add a guard that blocks, and try to execute
    bus.addGuard(() => false);
    await bus.execute(makeCommand('blocked'));
    // Redo stack should still be intact since blocked command was never executed
    expect(bus.canRedo()).toBe(true);
  });

  it('guard receives the command being executed', async () => {
    const bus = new CommandBus();
    const guardFn = vi.fn(() => true);
    bus.addGuard(guardFn);
    const cmd = makeCommand('inspectable');
    await bus.execute(cmd);
    expect(guardFn).toHaveBeenCalledWith(cmd);
  });

  it('multiple guards: all must return true', async () => {
    const bus = new CommandBus();
    bus.addGuard(() => true);
    bus.addGuard(() => true);
    const exec = vi.fn();
    await bus.execute(makeCommand('test', exec));
    expect(exec).toHaveBeenCalledOnce();
  });

  it('multiple guards: first false blocks execution', async () => {
    const bus = new CommandBus();
    bus.addGuard(() => false);
    const secondGuard = vi.fn(() => true);
    bus.addGuard(secondGuard);
    const exec = vi.fn();
    await bus.execute(makeCommand('test', exec));
    expect(exec).not.toHaveBeenCalled();
  });

  it('unsubscribe removes the guard', async () => {
    const bus = new CommandBus();
    const unsubscribe = bus.addGuard(() => false);
    const exec = vi.fn();
    await bus.execute(makeCommand('blocked', exec));
    expect(exec).not.toHaveBeenCalled();

    unsubscribe();
    await bus.execute(makeCommand('allowed', exec));
    expect(exec).toHaveBeenCalledOnce();
  });

  it('guard does not affect undo operations', async () => {
    const bus = new CommandBus();
    const undo = vi.fn();
    await bus.execute(makeCommand('test', vi.fn(), undo));
    // Add blocking guard AFTER execute
    bus.addGuard(() => false);
    await bus.undo();
    // Undo should still work — guards only apply to execute
    expect(undo).toHaveBeenCalledOnce();
  });

  it('guard does not affect redo operations', async () => {
    const bus = new CommandBus();
    const exec = vi.fn();
    await bus.execute(makeCommand('test', exec));
    await bus.undo();
    bus.addGuard(() => false);
    await bus.redo();
    // Redo should still work
    expect(exec).toHaveBeenCalledTimes(2); // once for execute, once for redo
  });

  it('selective guard: blocks specific command IDs', async () => {
    const bus = new CommandBus();
    const lockedIds = new Set(['deleteField']);
    const guard: CommandGuard = (cmd) => !lockedIds.has(cmd.id);
    bus.addGuard(guard);

    const deleteExec = vi.fn();
    const moveExec = vi.fn();
    await bus.execute(makeCommand('deleteField', deleteExec));
    await bus.execute(makeCommand('moveField', moveExec));

    expect(deleteExec).not.toHaveBeenCalled();
    expect(moveExec).toHaveBeenCalledOnce();
  });
});
