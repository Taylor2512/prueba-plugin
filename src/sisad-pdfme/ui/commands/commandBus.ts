import type { Command, CommandExecutionContext, CommandObserverPayload } from '@sisad-pdfme/common';

// ── Enriched command metadata ─────────────────────────────────────────────────

/** Identifies where a command was triggered from — used for analytics and audit. */
export type CommandSource = 'keyboard' | 'canvas-toolbar' | 'inspector' | 'context-menu' | 'system';

/**
 * Metadata attached to every enriched command.
 * Enables audit trails, analytics, and multi-user reconciliation.
 */
export type CommandMeta = {
  /** Stable ID matching the command type (e.g. 'group', 'delete', 'move'). */
  commandId: string;
  /** Where the command was triggered from. */
  source: CommandSource;
  /** User/actor who triggered the command — omitted for system commands. */
  actorId?: string;
  /** Document context. */
  documentId?: string;
  /** Human/business file/document id (if available). */
  fileId?: string;
  /** Zero-indexed page where the command applies. */
  pageIndex?: number;
  /** 1-indexed page number where the command applies. */
  pageNumber?: number;
  /** Recipient context where the command was emitted. */
  recipientId?: string;
  /** UIDs of schemas affected by the command. */
  schemaUids?: string[];
  /** Single schema uid for command that targets one schema. */
  schemaUid?: string;
  /** User id for audit timelines (alias of actorId for compatibility). */
  userId?: string;
  /** Version of the template when command was generated. */
  templateVersion?: string;
  /** Group UID if the command targets a group. */
  groupUid?: string;
  /** Unix epoch timestamp (ms) at command creation. */
  timestamp: number;
  /** Whether this command is undoable. Non-undoable commands (e.g. view changes) skip the undo stack. */
  undoable: boolean;
  /** Optional analytics hints — not used by the command bus itself. */
  analytics?: {
    feature: string;
    caseId?: string;
  };
};

/**
 * Enriched command wrapper that pairs a payload with full metadata.
 * Use this when you need audit trails or multi-user reconciliation.
 * The raw `Command` interface from @sisad-pdfme/common is still accepted by `CommandBus.execute`.
 */
export type AppCommand<TPayload = unknown> = {
  meta: CommandMeta;
  payload: TPayload;
};

/** Helper to build a CommandMeta with sensible defaults. */
export const buildCommandMeta = (
  overrides: Omit<CommandMeta, 'timestamp'> & { timestamp?: number },
): CommandMeta => ({
  timestamp: Date.now(),
  ...overrides,
});

type CommandListener = (_event: CommandObserverPayload) => void;

/**
 * Optional pre-execution guard.
 * Return `true` to allow the command, `false` to block it.
 * The guard receives the command about to run — it can inspect `id`, `label`,
 * or any other field to decide. Use this to enforce lock checks, readonly
 * validation, or permission gating without coupling the bus to specific modules.
 */
export type CommandGuard = (_command: Command) => boolean;

const hasRequiredBaseCommandFields = (command: Command) =>
  Boolean(String(command.id || '').trim()) && Boolean(String(command.label || '').trim());

const createExecutionContext = (listeners: Set<CommandListener>): CommandExecutionContext => ({
  emit(event) {
    listeners.forEach((listener) => listener(event));
  },
});

export class CommandBus {
  private undoStack: Command[] = [];

  private redoStack: Command[] = [];

  private listeners = new Set<CommandListener>();

  private guards: CommandGuard[] = [];

  /**
   * Register a pre-execution guard. Returns an unsubscribe function.
   * Guards are checked in order; the first `false` blocks execution.
   */
  addGuard(guard: CommandGuard) {
    this.guards.push(guard);
    return () => {
      this.guards = this.guards.filter((g) => g !== guard);
    };
  }

  /** Returns true if all guards allow the command. */
  private checkGuards(command: Command): boolean {
    if (!hasRequiredBaseCommandFields(command)) return false;
    return this.guards.every((guard) => guard(command));
  }

  async execute(command: Command) {
    if (!this.checkGuards(command)) return;
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

export const createCommandBus = () => new CommandBus();
