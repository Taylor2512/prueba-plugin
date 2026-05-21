/**
 * FASE 2 — Tipos centrales del Command Bus
 *
 * CommandType y ActionSource son los dos ejes de toda mutación en el designer.
 * - CommandType: qué operación se ejecuta
 * - ActionSource: desde dónde fue iniciada
 *
 * La combinación de los dos determina qué reglas aplican en los guards.
 */

/** Todas las operaciones posibles sobre schemas y documentos */
export type CommandType =
  // Schema — geométricas
  | 'schema.move'
  | 'schema.resize'
  | 'schema.rotate'
  // Schema — contenido
  | 'schema.edit'
  | 'schema.delete'
  | 'schema.duplicate'
  | 'schema.copy'
  | 'schema.paste'
  | 'schema.group'
  | 'schema.ungroup'
  // Schema — z-order
  | 'schema.bring_forward'
  | 'schema.send_backward'
  | 'schema.bring_to_front'
  | 'schema.send_to_back'
  // Schema — colaboración
  | 'schema.assign_recipient'
  | 'schema.lock'
  | 'schema.unlock'
  | 'schema.comment'
  // Documento / template
  | 'page.change'
  | 'document.change'
  | 'template.import'
  | 'template.export';

/** Origen de la acción — determina reglas especiales en guards */
export type ActionSource =
  | 'canvas_drag'
  | 'canvas_resize'
  | 'canvas_rotate'
  | 'inline_edit'
  | 'right_inspector'
  | 'context_menu'
  | 'keyboard_shortcut'
  | 'toolbar_action'
  /** Actualizaciones remotas de Yjs — bypassean locks locales, respetan readonly */
  | 'collaboration_remote'
  | 'import'
  | 'undo_redo';

/** Acciones que requieren exclusividad (no se pueden aplicar sobre schema bloqueado) */
export const MUTATING_ACTIONS = new Set<CommandType>([
  'schema.move',
  'schema.resize',
  'schema.rotate',
  'schema.edit',
  'schema.delete',
  'schema.duplicate',
  'schema.paste',
  'schema.group',
  'schema.ungroup',
  'schema.bring_forward',
  'schema.send_backward',
  'schema.bring_to_front',
  'schema.send_to_back',
  'schema.assign_recipient',
  'schema.lock',
  'schema.unlock',
]);

/** Acciones de solo lectura permitidas incluso en schemas readonly */
export const READ_ONLY_SAFE_ACTIONS = new Set<CommandType>([
  'schema.copy',
  'schema.comment',
  'template.export',
]);

/** Payloads tipados por CommandType */
export interface MovePayload { x: number; y: number; }
export interface ResizePayload { width: number; height: number; x?: number; y?: number; }
export interface RotatePayload { rotate: number; }
export interface EditPayload { field: string; value: unknown; }
export interface DeletePayload { _brand: 'delete'; }
export interface DuplicatePayload { offsetX?: number; offsetY?: number; }
export interface CopyPayload { _brand: 'copy'; }
export interface PastePayload { targetPageNumber?: number; targetDocumentId?: string; }
export interface ZOrderPayload { _brand: 'zorder'; }
export interface AssignRecipientPayload {
  recipientId: string;
  recipientName: string;
  recipientColor: string;
  scope: 'recipient' | 'group' | 'global';
}
export interface LockPayload { reason?: string; }
export interface UnlockPayload { _brand: 'unlock'; }
export interface CommentPayload { text: string; }
export interface GroupPayload { _brand: 'group'; }
export interface UngroupPayload { _brand: 'ungroup'; }

/** Mapa de CommandType → Payload correspondiente */
export type CommandPayloadMap = {
  'schema.move': MovePayload;
  'schema.resize': ResizePayload;
  'schema.rotate': RotatePayload;
  'schema.edit': EditPayload;
  'schema.delete': DeletePayload;
  'schema.duplicate': DuplicatePayload;
  'schema.copy': CopyPayload;
  'schema.paste': PastePayload;
  'schema.group': GroupPayload;
  'schema.ungroup': UngroupPayload;
  'schema.bring_forward': ZOrderPayload;
  'schema.send_backward': ZOrderPayload;
  'schema.bring_to_front': ZOrderPayload;
  'schema.send_to_back': ZOrderPayload;
  'schema.assign_recipient': AssignRecipientPayload;
  'schema.lock': LockPayload;
  'schema.unlock': UnlockPayload;
  'schema.comment': CommentPayload;
  'page.change': { pageNumber: number };
  'document.change': { documentId: string };
  'template.import': { snapshot: unknown };
  'template.export': { format?: 'json' | 'portable' };
};
