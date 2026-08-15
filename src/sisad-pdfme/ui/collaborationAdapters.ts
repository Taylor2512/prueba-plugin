import { ensureAnchorId, ensureComment } from '@sisad-pdfme/common/collaboration';
import type {
  SchemaComment,
  SchemaCommentAnchor,
  SchemaCommentReply,
} from '@sisad-pdfme/ui/designerEngine';

const genId = (prefix = 'anchor') =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const toSchemaCommentAnchor = (
  anchor: unknown,
  fallbackId?: string,
): SchemaCommentAnchor => {
  // Use adapters to reduce `any`/`unknown` surface — normalize via ensureAnchorId
  const aRaw = ensureAnchorId(anchor as unknown);
  const a = (aRaw ?? {}) as Partial<SchemaCommentAnchor>;
  const id = String(a.id || fallbackId || genId());
  return {
    ...a,
    id,
    resolved: Boolean(a.resolved),
    pageNumber: typeof a.pageNumber === 'number' ? (a.pageNumber as number) : 0,
  };
};

// Replies carry the same required `id`/`text` contract as comments, so they need
// the same normalization instead of being passed through as `unknown[]`.
export const toSchemaCommentReply = (reply: unknown): SchemaCommentReply => {
  const r = (reply ?? {}) as Partial<SchemaCommentReply>;
  return {
    ...r,
    id: String(r.id || genId('reply')),
    text: typeof r.text === 'string' ? r.text : '',
    resolved: Boolean(r.resolved),
  };
};

export const toSchemaComment = (comment: unknown): SchemaComment => {
  const cRaw = ensureComment(comment as unknown);
  const c = (cRaw ?? {}) as Partial<SchemaComment>;
  const id = String(c.id || genId('comment'));
  const anchor = c.anchor ? toSchemaCommentAnchor(c.anchor, id) : undefined;
  return {
    ...c,
    id,
    anchor,
    text: typeof c.text === 'string' ? c.text : '',
    replies: Array.isArray(c.replies) ? c.replies.map((r) => toSchemaCommentReply(r)) : [],
    resolved: Boolean(c.resolved),
  };
};

export default {
  toSchemaCommentAnchor,
  toSchemaComment,
  toSchemaCommentReply,
};

export const toSchemaCommentsArray = (comments?: unknown[]): SchemaComment[] =>
  Array.isArray(comments) ? (comments as unknown[]).map((c) => toSchemaComment(c)) : [];

export const toSchemaAnchorsArray = (anchors?: unknown[]): SchemaCommentAnchor[] =>
  Array.isArray(anchors) ? (anchors as unknown[]).map((a) => toSchemaCommentAnchor(a)) : [];
