import type { AppCommand, CommandMeta } from '../../../src/sisad-pdfme/ui/commands/commandBus.js';
import type {
  AssignRecipientPayload,
  CommandPayloadMap,
  CommandType,
  CommentPayload,
  CopyPayload,
  DeletePayload,
  DuplicatePayload,
  EditPayload,
  GroupPayload,
  LockPayload,
  MovePayload,
  PastePayload,
  ResizePayload,
  RotatePayload,
  UnlockPayload,
  UngroupPayload,
  ZOrderPayload,
} from '../../../src/sisad-pdfme/shared/commandTypes.js';
import { fixedMs, stableId } from './_shared.js';

export interface CommandMetaOptions extends Partial<Omit<CommandMeta, 'timestamp'>> {
  timestamp?: number;
}

export function makeCommandMeta(options: CommandMetaOptions = {}): CommandMeta {
  return {
    commandId: options.commandId ?? 'schema.move',
    source: options.source ?? 'canvas-toolbar',
    actorId: options.actorId ?? 'user-1',
    documentId: options.documentId ?? 'doc-1',
    pageIndex: options.pageIndex ?? 0,
    schemaUids: options.schemaUids ?? ['uid-text-1'],
    groupUid: options.groupUid,
    timestamp: options.timestamp ?? fixedMs(),
    undoable: options.undoable ?? true,
    analytics: options.analytics ?? { feature: 'designer', caseId: 'qa-1' },
  };
}

export function makeAppCommand<TPayload>(payload: TPayload, meta: CommandMetaOptions = {}): AppCommand<TPayload> {
  return {
    meta: makeCommandMeta(meta),
    payload,
  };
}

export function makeMovePayload(overrides: Partial<MovePayload> = {}): MovePayload {
  return { x: 10, y: 20, ...overrides };
}

export function makeResizePayload(overrides: Partial<ResizePayload> = {}): ResizePayload {
  return { width: 100, height: 20, ...overrides };
}

export function makeRotatePayload(overrides: Partial<RotatePayload> = {}): RotatePayload {
  return { rotate: 0, ...overrides };
}

export function makeEditPayload(overrides: Partial<EditPayload> = {}): EditPayload {
  return { field: 'name', value: 'Nuevo valor', ...overrides };
}

export function makeDeletePayload(overrides: Partial<DeletePayload> = {}): DeletePayload {
  return { _brand: 'delete', ...overrides };
}

export function makeDuplicatePayload(overrides: Partial<DuplicatePayload> = {}): DuplicatePayload {
  return { offsetX: 10, offsetY: 10, ...overrides };
}

export function makeCopyPayload(overrides: Partial<CopyPayload> = {}): CopyPayload {
  return { _brand: 'copy', ...overrides };
}

export function makePastePayload(overrides: Partial<PastePayload> = {}): PastePayload {
  return { targetPageNumber: 1, targetDocumentId: 'doc-1', ...overrides };
}

export function makeZOrderPayload(overrides: Partial<ZOrderPayload> = {}): ZOrderPayload {
  return { _brand: 'zorder', ...overrides };
}

export function makeAssignRecipientPayload(overrides: Partial<AssignRecipientPayload> = {}): AssignRecipientPayload {
  return {
    recipientId: 'rec-1',
    recipientName: 'Cliente',
    recipientColor: '#3B82F6',
    scope: 'recipient',
    ...overrides,
  };
}

export function makeLockPayload(overrides: Partial<LockPayload> = {}): LockPayload {
  return { reason: 'locked for review', ...overrides };
}

export function makeUnlockPayload(overrides: Partial<UnlockPayload> = {}): UnlockPayload {
  return { _brand: 'unlock', ...overrides };
}

export function makeCommentPayload(overrides: Partial<CommentPayload> = {}): CommentPayload {
  return { text: 'Comentario de prueba', ...overrides };
}

export function makeGroupPayload(overrides: Partial<GroupPayload> = {}): GroupPayload {
  return { _brand: 'group', ...overrides };
}

export function makeUngroupPayload(overrides: Partial<UngroupPayload> = {}): UngroupPayload {
  return { _brand: 'ungroup', ...overrides };
}

export function makeCommandPayload<T extends CommandType>(type: T): CommandPayloadMap[T] {
  const payloads: { [K in CommandType]: CommandPayloadMap[K] } = {
    'schema.move': makeMovePayload(),
    'schema.resize': makeResizePayload(),
    'schema.rotate': makeRotatePayload(),
    'schema.edit': makeEditPayload(),
    'schema.delete': makeDeletePayload(),
    'schema.duplicate': makeDuplicatePayload(),
    'schema.copy': makeCopyPayload(),
    'schema.paste': makePastePayload(),
    'schema.group': makeGroupPayload(),
    'schema.ungroup': makeUngroupPayload(),
    'schema.bring_forward': makeZOrderPayload(),
    'schema.send_backward': makeZOrderPayload(),
    'schema.bring_to_front': makeZOrderPayload(),
    'schema.send_to_back': makeZOrderPayload(),
    'schema.assign_recipient': makeAssignRecipientPayload(),
    'schema.lock': makeLockPayload(),
    'schema.unlock': makeUnlockPayload(),
    'schema.comment': makeCommentPayload(),
    'page.change': { pageNumber: 1 },
    'document.change': { documentId: 'doc-1' },
    'template.import': { snapshot: {} },
    'template.export': { format: 'json' },
  };

  return payloads[type];
}

export function makeCommandId(type: CommandType, variant?: string): string {
  return stableId('command', type, variant);
}
