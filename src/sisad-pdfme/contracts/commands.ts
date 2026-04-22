export type CommandObserverEvent =
  | 'schema.created'
  | 'schema.updated'
  | 'schema.deleted'
  | 'schema.locked'
  | 'schema.unlocked'
  | 'comment.created'
  | 'comment.updated'
  | 'comment.deleted'
  | 'presence.updated';

export type CommandObserverPayload = {
  type: CommandObserverEvent;
  schemaId?: string;
  pageIndex?: number;
  fileId?: string | null;
  commentId?: string;
  payload?: Record<string, unknown>;
};

export type CommandExecutionContext = {
  emit: (event: CommandObserverPayload) => void;
};

export type Command = {
  id: string;
  label: string;
  execute: (context: CommandExecutionContext) => void | Promise<void>;
  undo: (context: CommandExecutionContext) => void | Promise<void>;
  redo?: (context: CommandExecutionContext) => void | Promise<void>;
};

export type SchemaDesignerConfig = Record<string, unknown>;
