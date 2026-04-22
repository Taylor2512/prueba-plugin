import type { Command, CommandExecutionContext, CommandObserverPayload } from '@sisad-pdfme/common';

type CommandListener = (_event: CommandObserverPayload) => void;

const createExecutionContext = (listeners: Set<CommandListener>): CommandExecutionContext => ({
  emit(event) {
    listeners.forEach((listener) => listener(event));
  },
});

export class CommandBus {
  private undoStack: Command[] = [];

  private redoStack: Command[] = [];

  private listeners = new Set<CommandListener>();

  async execute(command: Command) {
    const context = createExecutionContext(this.listeners);
    await command.execute(context);
    this.undoStack.push(command);
    this.redoStack = [];
  }

  async undo() {
    const command = this.undoStack.pop();
    if (!command) return;
    const context = createExecutionContext(this.listeners);
    await command.undo(context);
    this.redoStack.push(command);
  }

  async redo() {
    const command = this.redoStack.pop();
    if (!command) return;
    const context = createExecutionContext(this.listeners);
    if (typeof command.redo === 'function') {
      await command.redo(context);
    } else {
      await command.execute(context);
    }
    this.undoStack.push(command);
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }

  subscribe(listener: CommandListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
